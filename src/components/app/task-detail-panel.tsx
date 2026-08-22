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
import { ConfirmDialog } from "@/components/app/confirm-dialog";
import {
  CategoryIconComponent,
  categoryColorClasses,
  categoryColors,
} from "@/components/app/task-colors";
import { useTasks } from "@/features/todos/tasks-provider";
import type {
  Category,
  Label,
  LabelTone,
  Priority,
  Subtask,
} from "@/features/todos/types";
import { formatDateTime, formatDueShort, timeOf } from "@/lib/date";

const priorityOptions: Array<{ value: Priority; label: string; dot: string }> = [
  { value: "none", label: "None", dot: "bg-ink/15" },
  { value: "low", label: "Low", dot: "bg-ink/25" },
  { value: "medium", label: "Medium", dot: "bg-ink/45" },
  { value: "high", label: "High", dot: "bg-ink/70" },
  { value: "urgent", label: "Urgent", dot: "bg-ink" },
];

const toneClasses: Record<LabelTone, string> = {
  pen: "bg-ink text-paper border border-ink",
  marker: "bg-ink text-paper border border-ink",
  gray: "bg-ink text-paper border border-ink",
};

const labelTones: LabelTone[] = ["pen", "marker", "gray"];

const chipBase =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors";
const chipIdle =
  "border-line bg-surface text-ink-soft shadow-[var(--shadow-interactive)] hover:border-ink/15 hover:text-ink dark:shadow-none";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint">
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
    deleteLabel,
    assignLabel,
    unassignLabel,
    addCategory,
    deleteCategory,
    deleteTask,
  } = useTasks();

  const task = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [labelToDelete, setLabelToDelete] = useState<Label | null>(null);

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
  const dueAt = task.dueAt;
  const completed = task.status === "completed";
  const doneCount = task.subtasks.filter((subtask) => subtask.completed).length;
  const progress = task.subtasks.length > 0 ? doneCount / task.subtasks.length : 0;
  const tasksByCategory = (id: string | null) =>
    tasks.filter((task) => task.categoryId === id).length;
  const tasksByLabel = (id: string) =>
    tasks.filter((task) => task.labelIds.includes(id)).length;

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

  function handleCreateCategory(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const name = newCategory.trim();
    if (!name) return;
    const color = categoryColors[categories.length % categoryColors.length];
    const id = addCategory(name, "list", color);
    updateTask(taskId, { categoryId: id });
    setNewCategory("");
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
      className="grid h-8 w-8 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
    >
      <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
    </button>
  );

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      aria-label={`Details for ${task.title}`}
      className="fixed inset-0 z-50 flex flex-col bg-paper outline-none animate-sheet-up lg:static lg:z-auto lg:w-[420px] lg:shrink-0 lg:border-l lg:border-line lg:animate-panel-in"
    >
      <header className="flex h-14 shrink-0 items-center gap-1 border-b border-line px-3 lg:justify-end lg:px-4">
        <button
          type="button"
          onClick={close}
          aria-label="Close task details"
          className="inline-flex h-8 items-center gap-1 rounded-full px-2 text-[13px] font-medium text-ink-soft transition-colors hover:bg-ink/[0.04] hover:text-ink lg:hidden"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Back
        </button>
        <span className="min-w-0 flex-1 truncate px-1 text-[13px] font-medium text-ink-faint lg:hidden">
          Task details
        </span>
        <TaskActionsMenu
          task={task}
          trigger={menuTrigger}
          onDelete={() => setConfirmDelete(true)}
        />
        <button
          type="button"
          onClick={close}
          aria-label="Close task details"
          className="hidden h-8 w-8 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink lg:grid"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        {task.status === "archived" ? (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2.5">
            <span className="rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide tabular-nums text-ink-soft">
              Archived
            </span>
            <button
              type="button"
              onClick={() => updateTask(task.id, { status: "todo" })}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink/40"
            >
              <RotateCcw aria-hidden="true" className="h-3 w-3" />
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
            className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-ink/[0.04]"
          >
            <span
              aria-hidden="true"
              className={`grid h-5 w-5 place-items-center rounded-full border transition-colors duration-150 ${
                completed
                  ? "border-ink bg-ink"
                  : "border-line bg-surface hover:border-ink/20"
              }`}
            >
              {completed ? (
                <svg viewBox="0 0 20 20" className="h-full w-full p-[3px]">
                  <path
                    d="M5 10.5l3.2 3.2L15 6.8"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="task-tick"
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
            className={`min-w-0 flex-1 rounded-md bg-transparent text-[18px] font-semibold tracking-[-0.02em] outline-none placeholder:text-ink-faint ${
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
          className="mt-3 w-full resize-none rounded-md bg-transparent px-0.5 py-1 text-[13px] leading-[1.6] text-ink outline-none placeholder:text-ink-faint"
        />

        <div className="mt-6 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>Due date</SectionLabel>
            <div className="flex items-center gap-1.5">
              {dueAt ? (
                <>
                  <button
                    type="button"
                    onClick={pickDueDate}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-xs tabular-nums text-ink transition-colors hover:border-ink/15"
                  >
                    <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 text-ink-faint" />
                    {formatDueShort(dueAt)}
                    {timeOf(dueAt) ? ` · ${timeOf(dueAt)}` : ""}
                  </button>
                  <input
                    type="time"
                    value={timeOf(dueAt) ?? ""}
                    onChange={(event) => {
                      const time = event.target.value;
                      const date = dueAt.slice(0, 10);
                      updateTask(task.id, {
                        dueAt: time ? `${date}T${time}` : date,
                        startDate: date,
                        endDate: date,
                      });
                    }}
                    aria-label="Due time"
                    className="h-7 rounded-full border border-line bg-surface px-2 font-mono text-xs tabular-nums text-ink outline-none focus:border-ink/20"
                  />
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
                    className="grid h-7 w-7 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
                  >
                    <X aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={pickDueDate}
                  className={`${chipBase} ${chipIdle}`}
                >
                  <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                  Set a due date
                </button>
              )}
              <input
                ref={dateInputRef}
                type="date"
                value={dueAt ? dueAt.slice(0, 10) : ""}
                onChange={(event) => {
                  const value = event.target.value || null;
                  const time = dueAt ? timeOf(dueAt) : null;
                  updateTask(task.id, {
                    dueAt: value ? (time ? `${value}T${time}` : value) : null,
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
                  className={`${chipBase} border ${
                    task.priority === option.value
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-surface text-ink-soft shadow-[var(--shadow-interactive)] hover:border-ink/15 hover:text-ink dark:shadow-none"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${task.priority === option.value ? "bg-paper" : option.dot}`}
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Tags</SectionLabel>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                aria-pressed={task.categoryId === null}
                onClick={() => updateTask(task.id, { categoryId: null })}
                className={`${chipBase} border ${
                  task.categoryId === null ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink-soft shadow-[var(--shadow-interactive)] hover:border-ink/15 hover:text-ink dark:shadow-none"
                }`}
              >
                None
              </button>
              {categories.map((category) => {
                const active = task.categoryId === category.id;
                const colors = categoryColorClasses[category.color];
                return (
                  <span
                    key={category.id}
                    className="group inline-flex items-center gap-0.5"
                  >
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        updateTask(task.id, {
                          categoryId: active ? null : category.id,
                        })
                      }
                      className={`${chipBase} ${active ? colors.pill + " border-ink bg-ink text-paper" : chipIdle} border`}
                    >
                      <CategoryIconComponent
                        icon={category.icon}
                        className="h-3 w-3"
                      />
                      {category.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(category)}
                      aria-label={`Delete category ${category.name}`}
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-ink-faint opacity-0 transition-all hover:bg-ink/[0.06] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <X aria-hidden="true" className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              {newCategory ? (
                <input
                  type="text"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  onKeyDown={handleCreateCategory}
                  onBlur={() => setNewCategory("")}
                  placeholder="Category name, Enter to save"
                  aria-label="New category name"
                  autoFocus
                  className="h-7 w-32 rounded-full border border-ink bg-ink px-2.5 text-xs text-paper outline-none placeholder:text-paper/60"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setNewCategory(" ")}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-[var(--shadow-interactive)] transition-colors hover:border-ink/15 hover:text-ink dark:shadow-none"
                  aria-label="Add a category"
                >
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              )}
              <span
                aria-hidden="true"
                className="mx-0.5 h-4 w-px shrink-0 bg-line"
              />
              {labels.map((label) => {
                const assigned = task.labelIds.includes(label.id);
                return (
                  <span
                    key={label.id}
                    className="group inline-flex items-center gap-0.5"
                  >
                    <button
                      type="button"
                      aria-pressed={assigned}
                      onClick={() =>
                        assigned
                          ? unassignLabel(task.id, label.id)
                          : assignLabel(task.id, label.id)
                      }
                      className={`${chipBase} border ${
                        assigned ? toneClasses[label.tone] : "border-line bg-surface text-ink-soft shadow-[var(--shadow-interactive)] hover:border-ink/15 hover:text-ink dark:shadow-none"
                      }`}
                    >
                      <Tag aria-hidden="true" className="h-3 w-3" />
                      {label.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLabelToDelete(label)}
                      aria-label={`Delete label ${label.name}`}
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-ink-faint opacity-0 transition-all hover:bg-ink/[0.06] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <X aria-hidden="true" className="h-3 w-3" />
                    </button>
                  </span>
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
                  className="h-7 w-32 rounded-full border border-ink bg-ink px-2.5 text-xs text-paper outline-none placeholder:text-paper/60"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setNewLabel(" ")}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-[var(--shadow-interactive)] transition-colors hover:border-ink/15 hover:text-ink dark:shadow-none"
                  aria-label="Add a label"
                >
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <SectionLabel>Subtasks</SectionLabel>
              {task.subtasks.length > 0 ? (
                <span className="font-mono text-[11px] tabular-nums text-ink-faint">
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
                    className="h-full rounded-full bg-ink transition-all duration-300"
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
                className="h-8 min-w-0 flex-1 rounded-md bg-transparent px-0.5 text-[13px] text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-4">
          <p className="font-mono text-[11px] leading-relaxed tabular-nums text-ink-faint">
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

      {confirmDelete ? (
        <ConfirmDialog
          title="Delete this task?"
          message={<>“{task.title}” will be permanently removed from all views.</>}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            setConfirmDelete(false);
            deleteTask(task.id);
          }}
        />
      ) : null}

      {categoryToDelete ? (
        <ConfirmDialog
          title="Delete this category?"
          message={
            <>
              “{categoryToDelete.name}” will be deleted.{" "}
              {tasksByCategory(categoryToDelete.id) > 0
                ? `${tasksByCategory(categoryToDelete.id)} task${
                    tasksByCategory(categoryToDelete.id) === 1 ? "" : "s"
                  } will no longer be categorized.`
                : "No tasks are using it."}
            </>
          }
          onCancel={() => setCategoryToDelete(null)}
          onConfirm={() => {
            deleteCategory(categoryToDelete.id);
            setCategoryToDelete(null);
          }}
        />
      ) : null}

      {labelToDelete ? (
        <ConfirmDialog
          title="Delete this label?"
          message={
            <>
              “{labelToDelete.name}” will be deleted.{" "}
              {tasksByLabel(labelToDelete.id) > 0
                ? `${tasksByLabel(labelToDelete.id)} task${
                    tasksByLabel(labelToDelete.id) === 1 ? "" : "s"
                  } will no longer have this label.`
                : "No tasks are using it."}
            </>
          }
          onCancel={() => setLabelToDelete(null)}
          onConfirm={() => {
            deleteLabel(labelToDelete.id);
            setLabelToDelete(null);
          }}
        />
      ) : null}
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
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors hover:bg-ink/[0.04]"
      >
        <span
          aria-hidden="true"
          className={`grid h-4 w-4 place-items-center rounded-full border transition-colors duration-150 ${
            subtask.completed
              ? "border-ink bg-ink"
              : "border-line bg-surface group-hover:border-ink/20"
          }`}
        >
          {subtask.completed ? (
            <Check aria-hidden="true" className="h-2.5 w-2.5 text-paper" strokeWidth={3} />
          ) : null}
        </span>
      </button>
      <span
        className={`min-w-0 flex-1 truncate text-[13px] ${
          subtask.completed ? "text-ink-faint line-through" : "text-ink"
        }`}
      >
        {subtask.title}
      </span>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete subtask ${subtask.title}`}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint opacity-0 transition-all hover:bg-ink/[0.04] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
      >
        <X aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}
