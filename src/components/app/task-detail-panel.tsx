"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ListChecks,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Tag,
  X,
} from "lucide-react";
import { TaskActionsMenu } from "@/components/app/menus";
import {
  CategoryIconComponent,
  categoryColorClasses,
} from "@/components/app/task-colors";
import { useTasks } from "@/features/todos/tasks-provider";
import type { LabelTone, Priority, Subtask } from "@/features/todos/types";
import { formatDateTime, formatDueShort, isOverdue } from "@/lib/date";

const priorityOptions: Array<{ value: Priority; label: string; dot: string }> = [
  { value: "none", label: "None", dot: "bg-line" },
  { value: "low", label: "Low", dot: "bg-slate-400" },
  { value: "medium", label: "Medium", dot: "bg-warning" },
  { value: "high", label: "High", dot: "bg-caution" },
  { value: "urgent", label: "Urgent", dot: "bg-danger" },
];

const toneClasses: Record<LabelTone, string> = {
  pen: "bg-pen-soft text-pen",
  marker: "bg-marker/30 text-ink",
  gray: "bg-ink/5 text-ink-soft",
};

const labelTones: LabelTone[] = ["pen", "marker", "gray"];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-faint">
      {children}
    </p>
  );
}

export function TaskDetailPanel() {
  const {
    tasks,
    labels,
    categories,
    selectedTaskId,
    setSelectedTaskId,
    updateTask,
    toggleTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addLabel,
    assignLabel,
    unassignLabel,
  } = useTasks();

  const task = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    panelRef.current?.focus();
  }, [selectedTaskId]);

  useEffect(() => {
    if (!task) return;
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setSelectedTaskId(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [task, setSelectedTaskId]);

  if (!task) return null;

  const taskId = task.id;
  const completed = task.status === "completed";
  const doneCount = task.subtasks.filter((subtask) => subtask.completed).length;
  const progress = task.subtasks.length > 0 ? doneCount / task.subtasks.length : 0;

  function close() {
    setSelectedTaskId(null);
  }

  function pickDueDate() {
    try {
      dateInputRef.current?.showPicker();
    } catch {
      dateInputRef.current?.focus();
    }
  }

  function handleCreateLabel(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const name = newLabel.trim();
    if (!name) return;
    const tone = labelTones[labels.length % labelTones.length];
    const id = addLabel(name, tone);
    assignLabel(taskId, id);
    setNewLabel("");
  }

  function handleCreateSubtask(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const title = newSubtask.trim();
    if (!title) return;
    addSubtask(taskId, title);
    setNewSubtask("");
  }

  const menuTrigger = ({ open, toggle }: { open: boolean; toggle: () => void }) => (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label="More task actions"
      onClick={toggle}
      className="grid h-9 w-9 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
    >
      <MoreHorizontal aria-hidden="true" className="h-4.5 w-4.5" />
    </button>
  );

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      aria-label={`Details for ${task.title}`}
      className="fixed inset-0 z-50 flex flex-col bg-surface outline-none animate-sheet-up lg:static lg:z-auto lg:w-[400px] lg:shrink-0 lg:border-l lg:border-line lg:animate-panel-in"
    >
      <header className="flex h-14 shrink-0 items-center gap-1 border-b border-line/70 px-3 lg:justify-end lg:px-4">
        <button
          type="button"
          onClick={close}
          aria-label="Close task details"
          className="inline-flex h-9 items-center gap-1 rounded-full px-2 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink lg:hidden"
        >
          <ChevronLeft aria-hidden="true" className="h-4.5 w-4.5" />
          Back
        </button>
        <span className="min-w-0 flex-1 truncate px-1 text-sm font-medium text-ink-faint lg:hidden">
          Task details
        </span>
        <TaskActionsMenu task={task} trigger={menuTrigger} />
        <button
          type="button"
          onClick={close}
          aria-label="Close task details"
          className="hidden h-9 w-9 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink lg:grid"
        >
          <X aria-hidden="true" className="h-4.5 w-4.5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        {task.status === "archived" ? (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-2.5">
            <span className="rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft">
              Archived
            </span>
            <button
              type="button"
              onClick={() => updateTask(task.id, { status: "todo" })}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-pen transition-colors hover:underline"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              Restore
            </button>
          </div>
        ) : null}

        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => toggleTask(task.id)}
            aria-label={completed ? "Reopen task" : "Mark task complete"}
            aria-pressed={completed}
            className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-pen/10"
          >
            <span
              aria-hidden="true"
              className={`grid h-6 w-6 place-items-center rounded-full border-2 transition-colors duration-200 ${
                completed
                  ? "border-pen bg-pen-soft"
                  : "border-line bg-surface hover:border-ink/50"
              }`}
            >
              {completed ? (
                <svg viewBox="0 0 20 20" className="h-full w-full p-[3px]">
                  <path
                    d="M5 10.5l3.2 3.2L15 6.8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="task-tick text-pen"
                    style={{ strokeDashoffset: 0 }}
                  />
                </svg>
              ) : null}
            </span>
          </button>
          <input
            type="text"
            value={task.title}
            maxLength={200}
            onChange={(event) =>
              updateTask(task.id, { title: event.target.value })
            }
            aria-label="Task title"
            className={`min-w-0 flex-1 rounded-md bg-transparent font-display text-xl font-extrabold tracking-tight outline-none placeholder:text-ink-faint ${
              completed ? "text-ink-faint line-through" : "text-ink"
            }`}
          />
        </div>

        <textarea
          value={task.description}
          rows={3}
          maxLength={2000}
          onChange={(event) =>
            updateTask(task.id, { description: event.target.value })
          }
          placeholder="Add a note…"
          aria-label="Task description"
          className="mt-3 w-full resize-none rounded-md bg-transparent px-0.5 py-1 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-faint"
        />

        <div className="mt-7 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>Due date</SectionLabel>
            <div className="flex items-center gap-1.5">
              {task.dueAt ? (
                <>
                  <button
                    type="button"
                    onClick={pickDueDate}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs transition-colors ${
                      task.dueAt && isOverdue(task.dueAt)
                        ? "bg-danger-soft text-danger"
                        : "bg-pen-soft text-pen"
                    }`}
                  >
                    <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                    {formatDueShort(task.dueAt)}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateTask(task.id, {
                        dueAt: null,
                        startDate: null,
                        endDate: null,
                      })
                    }
                    aria-label="Clear due date"
                    className="grid h-7 w-7 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    <X aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={pickDueDate}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
                >
                  <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                  Set a due date
                </button>
              )}
              <input
                ref={dateInputRef}
                type="date"
                value={task.dueAt ?? ""}
                onChange={(event) => {
                  const value = event.target.value || null;
                  updateTask(task.id, {
                    dueAt: value,
                    startDate: value,
                    endDate: value,
                  });
                }}
                aria-hidden="true"
                tabIndex={-1}
                className="sr-only"
              />
            </div>
          </div>

          <div>
            <SectionLabel>Priority</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={task.priority === option.value}
                  onClick={() => updateTask(task.id, { priority: option.value })}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    task.priority === option.value
                      ? "border-pen bg-pen-soft text-pen"
                      : "border-line bg-surface text-ink-soft hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${option.dot}`}
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Labels</SectionLabel>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {labels.map((label) => {
                const assigned = task.labelIds.includes(label.id);
                return (
                  <button
                    key={label.id}
                    type="button"
                    aria-pressed={assigned}
                    onClick={() =>
                      assigned
                        ? unassignLabel(task.id, label.id)
                        : assignLabel(task.id, label.id)
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                      assigned
                        ? toneClasses[label.tone]
                        : "border border-dashed border-line text-ink-faint hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    <Tag aria-hidden="true" className="h-3 w-3" />
                    {label.name}
                  </button>
                );
              })}
              {newLabel ? (
                <input
                  type="text"
                  value={newLabel}
                  onChange={(event) => setNewLabel(event.target.value)}
                  onKeyDown={handleCreateLabel}
                  onBlur={() => setNewLabel("")}
                  placeholder="Label name, Enter to save"
                  aria-label="New label name"
                  autoFocus
                  className="h-7 w-32 rounded-full border border-pen bg-pen-soft/40 px-2.5 text-xs text-ink outline-none placeholder:text-ink-faint"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setNewLabel(" ")}
                  className="grid h-7 w-7 place-items-center rounded-full border border-dashed border-line text-ink-faint transition-colors hover:border-ink/40 hover:text-ink"
                  aria-label="Add a label"
                >
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div>
            <SectionLabel>Category</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                aria-pressed={task.categoryId === null}
                onClick={() => updateTask(task.id, { categoryId: null })}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                  task.categoryId === null
                    ? "border-ink bg-ink text-paper"
                    : "border-dashed border-line text-ink-faint hover:border-ink/40 hover:text-ink"
                }`}
              >
                None
              </button>
              {categories.map((category) => {
                const active = task.categoryId === category.id;
                const colors = categoryColorClasses[category.color];
                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      updateTask(task.id, {
                        categoryId: active ? null : category.id,
                      })
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                      active
                        ? `${colors.pill} border border-transparent`
                        : "border border-dashed border-line text-ink-faint hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    <CategoryIconComponent
                      icon={category.icon}
                      className="h-3 w-3"
                    />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <SectionLabel>Subtasks</SectionLabel>
              {task.subtasks.length > 0 ? (
                <span className="font-mono text-[11px] text-ink-faint">
                  {doneCount}/{task.subtasks.length} done
                </span>
              ) : null}
            </div>
            {task.subtasks.length > 0 ? (
              <>
                <div
                  aria-hidden="true"
                  className="mt-2 h-1 overflow-hidden rounded-full bg-line"
                >
                  <div
                    className="h-full rounded-full bg-pen transition-all duration-300"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <ul className="mt-2">
                  {[...task.subtasks]
                    .sort((a, b) => a.position - b.position)
                    .map((subtask) => (
                      <SubtaskRow
                        key={subtask.id}
                        subtask={subtask}
                        onToggle={() => toggleSubtask(task.id, subtask.id)}
                        onDelete={() => deleteSubtask(task.id, subtask.id)}
                      />
                    ))}
                </ul>
              </>
            ) : null}
            <div className="mt-2 flex items-center gap-2">
              <ListChecks aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
              <input
                type="text"
                value={newSubtask}
                onChange={(event) => setNewSubtask(event.target.value)}
                onKeyDown={handleCreateSubtask}
                placeholder="Add a subtask, Enter to save"
                aria-label="Add a subtask"
                className="h-8 min-w-0 flex-1 rounded-md bg-transparent px-0.5 text-sm text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-line/70 pt-4">
          <p className="font-mono text-[10px] leading-relaxed text-ink-faint">
            Created {formatDateTime(task.createdAt)}
            <br />
            Updated {formatDateTime(task.updatedAt)}
            {task.completedAt ? (
              <>
                <br />
                Completed {formatDateTime(task.completedAt)}
              </>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
}

function SubtaskRow({
  subtask,
  onToggle,
  onDelete,
}: {
  subtask: Subtask;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="group flex items-center gap-2.5 py-1.5">
      <button
        type="button"
        onClick={onToggle}
        aria-label={
          subtask.completed
            ? `Reopen subtask ${subtask.title}`
            : `Complete subtask ${subtask.title}`
        }
        aria-pressed={subtask.completed}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors hover:bg-pen/10"
      >
        <span
          aria-hidden="true"
          className={`grid h-4.5 w-4.5 place-items-center rounded-full border-2 transition-colors duration-200 ${
            subtask.completed
              ? "border-pen bg-pen-soft"
              : "border-line bg-surface group-hover:border-ink/40"
          }`}
        >
          {subtask.completed ? (
            <Check aria-hidden="true" className="h-2.5 w-2.5 text-pen" strokeWidth={3.5} />
          ) : null}
        </span>
      </button>
      <span
        className={`min-w-0 flex-1 truncate text-sm ${
          subtask.completed ? "text-ink-faint line-through" : "text-ink"
        }`}
      >
        {subtask.title}
      </span>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete subtask ${subtask.title}`}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint opacity-0 transition-all hover:bg-ink/5 hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
      >
        <X aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}
