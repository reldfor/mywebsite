"use client";

import { useEffect, useRef, useState } from "react";
import { RowMenu } from "@/components/app/menus";
import {
  CategoryIconComponent,
  categoryColorClasses,
} from "@/components/app/task-colors";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Priority, Task } from "@/features/todos/types";
import { formatDueShort, isDueToday, isOverdue, timeOf } from "@/lib/date";

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
      aria-label={
        completed ? `Reopen ${task.title}` : `Complete ${task.title}`
      }
      aria-pressed={completed}
      className="-ml-1 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-[var(--lp-hover-wash)]"
    >
      <span
        aria-hidden="true"
        className={`grid h-[18px] w-[18px] place-items-center rounded-full border transition-all duration-150 ${
          completed
            ? "border-lp-ink bg-lp-ink"
            : "border-lp-rule bg-[var(--lp-glass)] group-hover:border-lp-accent"
        }`}
      >
        {completed ? (
          <svg viewBox="0 0 20 20" className="h-full w-full p-[3px]">
            <path
              d="M5 10.5l3.2 3.2L15 6.8"
              fill="none"
              stroke="var(--lp-paper)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="task-tick"
            />
          </svg>
        ) : null}
      </span>
    </button>
  );
}

export function TaskRow({ task }: { task: Task }) {
  const { toggleTask, setSelectedTaskId, selectedTaskId, categories } = useTasks();
  const [justCompleted, setJustCompleted] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const completed = task.status === "completed";
  const selected = selectedTaskId === task.id;
  const doneCount = task.subtasks.filter((subtask) => subtask.completed).length;
  const category = categories.find((cat) => cat.id === task.categoryId);

  function handleToggle() {
    if (!completed) {
      setJustCompleted(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setJustCompleted(false), 600);
    }
    toggleTask(task.id);
  }

  const due = task.dueAt;
  const dueClasses = due
    ? completed
      ? "text-lp-ink-3 line-through decoration-lp-accent"
      : isOverdue(due)
        ? "font-medium text-lp-accent"
        : isDueToday(due)
          ? "font-medium text-lp-ink"
          : "text-lp-ink-3"
    : "";

  return (
    <li
      className={`task-row group ${completed ? "is-completed" : ""} ${
        justCompleted ? "just-completed" : ""
      }`}
    >
      <div
        onClick={() => setSelectedTaskId(task.id)}
        className={`-mx-2 flex cursor-pointer items-center gap-1 rounded-lg px-2 py-2 transition-colors ${
          selected
            ? "bg-lp-accent-soft shadow-[inset_2px_0_0_var(--lp-accent)]"
            : "hover:bg-[var(--lp-glass)]"
        }`}
      >
        <TaskCheckbox task={task} onToggle={handleToggle} />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {!completed && task.priority !== "none" ? (
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${priorityDot[task.priority]}`}
            />
          ) : null}
          <button
            type="button"
            onClick={() => setSelectedTaskId(task.id)}
            className="min-w-0 flex-1 rounded-md text-left outline-none"
          >
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
          </button>
        </div>
        {category ? (
          <span
            className={`hidden shrink-0 items-center gap-1 rounded-full border border-lp-rule bg-lp-paper-3 px-2 py-0.5 font-mono text-[9.5px] font-medium tracking-[0.02em] text-lp-ink-2 sm:inline-flex ${categoryColorClasses[category.color].pill}`}
          >
            <CategoryIconComponent icon={category.icon} className="h-3 w-3 text-lp-ink-3" />
            {category.name}
          </span>
        ) : null}
        {task.subtasks.length > 0 ? (
          <span className="shrink-0 font-mono text-[10px] tabular-nums text-lp-ink-3">
            {doneCount}/{task.subtasks.length}
          </span>
        ) : null}
        {due ? (
          <span className={`shrink-0 font-mono text-[10.5px] tabular-nums ${dueClasses}`}>
            {formatDueShort(due)}
            {timeOf(due) ? ` · ${timeOf(due)}` : ""}
          </span>
        ) : null}
        <RowMenu task={task} />
      </div>
    </li>
  );
}
