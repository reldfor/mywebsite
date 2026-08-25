"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  CategoryIconComponent,
  categoryColorClasses,
} from "@/components/app/task-colors";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Priority, Task } from "@/features/todos/types";
import { formatDueShort, isDueToday, isOverdue, timeOf } from "@/lib/date";
import { TaskContextMenu } from "./task-context-menu";

const priorityDot: Record<Priority, string> = {
  none: "",
  low: "bg-lp-ink-4",
  medium: "bg-[var(--lp-priority-med)]",
  high: "bg-lp-accent",
  urgent: "bg-lp-accent",
};

function TaskCheckbox({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: () => void;
}) {
  const completed = task.status === "completed";
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      aria-label={completed ? `Reopen ${task.title}` : `Complete ${task.title}`}
      aria-pressed={completed}
      className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border bg-[var(--lp-glass)] p-0 transition-all duration-150 hover:border-lp-accent mt-[2px]"
      style={
        completed
          ? { background: "var(--lp-ink)", borderColor: "var(--lp-ink)" }
          : undefined
      }
    >
      {completed ? (
        <span
          aria-hidden="true"
          className="block h-[3.5px] w-[7px] translate-y-[-0.5px] rotate-[-45deg] border-b-[1.6px] border-l-[1.6px] border-lp-paper"
        />
      ) : null}
    </button>
  );
}

export function TaskRow({ task }: { task: Task }) {
  const { toggleTask, toggleSubtask, setSelectedTaskId, selectedTaskId, categories, labels } =
    useTasks();
  const [justCompleted, setJustCompleted] = useState(false);
  const [subtasksOpen, setSubtasksOpen] = useState(true);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const timerRef = useRef<number | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (longPressTimer.current !== null) window.clearTimeout(longPressTimer.current);
    };
  }, []);

  const completed = task.status === "completed";
  const selected = selectedTaskId === task.id;
  const doneCount = task.subtasks.filter((subtask) => subtask.completed).length;
  const category = categories.find((cat) => cat.id === task.categoryId);
  const sortedSubtasks = [...task.subtasks].sort((a, b) => a.position - b.position);
  const taskLabels = task.labelIds
    .map((id) => labels.find((label) => label.id === id))
    .filter((label) => label !== undefined);

  function handleToggle() {
    if (!completed) {
      setJustCompleted(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setJustCompleted(false), 600);
    }
    toggleTask(task.id);
  }

  const due = task.dueAt;
  const dueTime = due ? timeOf(due) : null;
  const isToday = due ? isDueToday(due) : false;
  const dueLabel = due ? (isToday ? dueTime : `${formatDueShort(due)}${dueTime ? ` · ${dueTime}` : ""}`) : null;
  const dueClasses = due
    ? completed
      ? "text-lp-ink-3 line-through decoration-lp-accent"
      : isOverdue(due)
        ? "font-medium text-lp-accent"
        : isToday
          ? "font-medium text-lp-ink"
          : "text-lp-ink-3"
    : "";

  const hasSubtasks = sortedSubtasks.length > 0;
  const showPriority = !completed && task.priority !== "none";
  const hasMeta = showPriority || !!category || !!dueLabel || taskLabels.length > 0 || hasSubtasks;

  function openMenuAt(x: number, y: number) {
    setMenuPos({ x, y });
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    openMenuAt(e.clientX, e.clientY);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ContextMenu" || (e.key === "F10" && e.shiftKey)) {
      e.preventDefault();
      const rect = rowRef.current?.getBoundingClientRect();
      const x = rect ? rect.left + rect.width / 2 : 0;
      const y = rect ? rect.top + rect.height / 2 : 0;
      openMenuAt(x, y);
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (longPressTimer.current !== null) window.clearTimeout(longPressTimer.current);
    const touch = e.touches[0];
    if (!touch) return;
    const x = touch.clientX;
    const y = touch.clientY;
    longPressTimer.current = window.setTimeout(() => openMenuAt(x, y), 500);
  }

  function handleTouchMove() {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function handleTouchEnd() {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  return (
    <li
      className={`task-row group ${completed ? "is-completed" : ""} ${
        justCompleted ? "just-completed" : ""
      } ${hasSubtasks && !subtasksOpen ? "is-collapsed" : ""}`}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={rowRef}
        onClick={() => setSelectedTaskId(task.id)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Open details for ${task.title}`}
        className={`-mx-2 flex cursor-pointer items-start gap-[10px] rounded-lg px-2 py-[7px] transition-colors focus-visible:outline-none ${
          selected
            ? "bg-lp-accent-soft shadow-[inset_2px_0_0_var(--lp-accent)]"
            : "hover:bg-[var(--lp-glass)]"
        } ${completed ? "opacity-70" : ""}`}
      >
        <TaskCheckbox task={task} onToggle={handleToggle} />

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="relative inline-block max-w-full truncate align-middle text-[13px] leading-[1.4]">
            {completed ? (
              <span
                aria-hidden="true"
                className="task-strike absolute inset-x-[-2px] top-1/2 h-px -translate-y-1/2 bg-lp-accent/40"
              />
            ) : null}
            <span
              className={`relative ${
                completed
                  ? "text-lp-ink-3 line-through decoration-lp-accent decoration-[1.4px]"
                  : "text-lp-ink"
              }`}
            >
              {task.title}
            </span>
          </p>

          {hasMeta ? (
            <div className="mt-1 flex flex-wrap items-center gap-[6px]">
              {showPriority ? (
                <span
                  aria-hidden="true"
                  className={`h-[6px] w-[6px] shrink-0 rounded-full ${priorityDot[task.priority]}`}
                />
              ) : null}
              {dueLabel ? (
                <span
                  className={`shrink-0 font-mono text-[10.5px] tabular-nums leading-none ${dueClasses} ${
                    due && isOverdue(due) && !completed ? "text-lp-accent" : ""
                  }`}
                >
                  {dueLabel}
                </span>
              ) : null}
              {category ? (
                <span
                  className={`hidden shrink-0 items-center gap-1 rounded-full border border-lp-rule bg-lp-paper-3 px-2 py-0.5 font-mono text-[9.5px] font-medium tracking-[0.02em] text-lp-ink-2 sm:inline-flex ${categoryColorClasses[category.color].pill}`}
                >
                  <CategoryIconComponent icon={category.icon} className="h-3 w-3 text-lp-ink-3" />
                  {category.name}
                </span>
              ) : null}
              {taskLabels.map((label) => (
                <span
                  key={label.id}
                  className="inline-flex shrink-0 items-center gap-[3px] rounded-full bg-lp-paper-3 px-[5px] py-[1px] font-mono text-[9.5px] font-medium tracking-[0.02em] text-lp-ink-2"
                >
                  <span
                    aria-hidden="true"
                    className={`h-[5px] w-[5px] shrink-0 rounded-full ${
                      label.tone === "gray"
                        ? "bg-lp-ink-4"
                        : label.tone === "red"
                          ? "bg-lp-accent"
                          : label.tone === "orange" || label.tone === "yellow"
                            ? "bg-[var(--lp-priority-med)]"
                            : label.tone === "green" || label.tone === "teal"
                              ? "bg-[var(--lp-label-errand)]"
                              : label.tone === "blue" || label.tone === "cyan" || label.tone === "indigo"
                                ? "bg-[var(--lp-label-personal)]"
                                : "bg-[var(--lp-label-side)]"
                    }`}
                  />
                  {label.name}
                </span>
              ))}
              {hasSubtasks ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSubtasksOpen((v) => !v);
                  }}
                  aria-expanded={subtasksOpen}
                  aria-label={subtasksOpen ? "Collapse subtasks" : "Expand subtasks"}
                  className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] tabular-nums leading-none text-lp-ink-3 transition-colors hover:text-lp-ink"
                >
                  <span>
                    {doneCount}/{task.subtasks.length}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-3 w-3 shrink-0 transition-transform ${subtasksOpen ? "" : "-rotate-90"}`}
                  />
                </button>
              ) : null}
            </div>
          ) : null}

          {hasSubtasks ? (
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                subtasksOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mt-[6px] border-l border-dashed border-lp-rule-2 pl-[9px]">
                  {sortedSubtasks.map((subtask) => {
                    const subDone = subtask.completed;
                    return (
                      <div
                        key={subtask.id}
                        className={`flex items-center gap-[7px] py-[2px] text-[11px] ${subDone ? "done" : ""}`}
                      >
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={subDone}
                          aria-label={`${subDone ? "Reopen" : "Complete"} subtask ${subtask.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubtask(task.id, subtask.id);
                          }}
                          className="group/subtask grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors hover:bg-[var(--lp-hover-wash)]"
                        >
                          <span
                            aria-hidden="true"
                            className={`flex h-[10px] w-[10px] items-center justify-center rounded-full border bg-transparent transition-all duration-[120ms] ${
                              subDone
                                ? "border-lp-accent bg-lp-accent"
                                : "border-lp-rule group-hover/subtask:border-lp-accent"
                            }`}
                          >
                            {subDone ? (
                              <span
                                aria-hidden="true"
                                className="block h-[2.5px] w-[5px] translate-y-[-0.5px] rotate-[-45deg] border-b-[1.2px] border-l-[1.2px] border-lp-paper"
                              />
                            ) : null}
                          </span>
                        </button>
                        <span
                          className={`min-w-0 flex-1 truncate leading-[1.4] ${
                            subDone
                              ? "text-lp-ink-3 line-through decoration-lp-accent"
                              : "text-lp-ink-2"
                          }`}
                        >
                          {subtask.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <span
          aria-hidden="true"
          className="hidden h-[18px] w-2 shrink-0 cursor-grab select-none text-center text-[12px] leading-none text-lp-ink-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100 sm:block mt-[2px]"
        >
          ⠿
        </span>
      </div>
      <TaskContextMenu task={task} pos={menuPos} onClose={() => setMenuPos(null)} />
    </li>
  );
}
