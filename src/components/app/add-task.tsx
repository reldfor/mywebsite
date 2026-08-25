"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { CalendarDays, Clock, ListChecks, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CategoryIconComponent,
  categoryColors,
} from "@/components/app/task-colors";
import { ConfirmDialog } from "@/components/app/confirm-dialog";
import { useTasks } from "@/features/todos/tasks-provider";
import { authLinks } from "@/lib/constants";
import { formatDueShort } from "@/lib/date";
import type { Category, Label, Priority } from "@/features/todos/types";
import { LABEL_COLORS, labelDotClasses } from "@/features/todos/label-colors";

const priorityOptions: Array<{ value: Priority; label: string; dot: string }> = [
  { value: "none", label: "None", dot: "bg-lp-ink-4" },
  { value: "low", label: "Low", dot: "bg-lp-ink-4" },
  { value: "medium", label: "Medium", dot: "bg-[var(--lp-priority-med)]" },
  { value: "high", label: "High", dot: "bg-lp-accent" },
  { value: "urgent", label: "Urgent", dot: "bg-lp-accent" },
];

const labelTones = LABEL_COLORS;

const chipBase =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors";
const chipIdle =
  "border border-lp-rule bg-[var(--lp-glass)] text-lp-ink-2 shadow-[var(--lp-shadow-interactive)] hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:text-lp-ink hover:bg-lp-paper";
const chipActive = "border border-lp-ink bg-lp-ink text-lp-paper";
const iconChip =
  "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-lp-rule bg-[var(--lp-glass)] text-lp-ink-3 shadow-[var(--lp-shadow-interactive)] transition-colors hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:text-lp-ink hover:bg-lp-paper";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[9px] font-medium uppercase tracking-[0.06em] text-lp-ink-3">
      {children}
    </p>
  );
}

export function AddTask({ date }: { date?: string | null }) {
  const {
    addTask,
    addTaskInputRef,
    tasks,
    taskLimit,
    showToast,
    categories,
    labels,
    addCategory,
    addLabel,
    deleteLabel,
    deleteCategory,
  } = useTasks();

  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(date ?? "");
  const [dueTime, setDueTime] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority>("none");
  const [labelIds, setLabelIds] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [labelToDelete, setLabelToDelete] = useState<Label | null>(null);

  const tasksByCategory = (id: string | null) =>
    tasks.filter((task) => task.categoryId === id).length;
  const tasksByLabel = (id: string) =>
    tasks.filter((task) => task.labelIds.includes(id)).length;

  const titleRef = useRef<HTMLInputElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (expanded) titleRef.current?.focus();
  }, [expanded]);

  const reset = useCallback(() => {
    setTitle("");
    setDescription("");
    setPriority("none");
    setCategoryId(null);
    setLabelIds([]);
    setSubtasks([]);
    setSubtaskInput("");
    setNewCategory("");
    setNewLabel("");
    setDueTime("");
    setDueDate(date ?? "");
  }, [date]);

  const collapse = useCallback(() => {
    reset();
    setExpanded(false);
  }, [reset]);

  useEffect(() => {
    if (!expanded) return;
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (
        document.querySelector(
          '[role="menu"], [role="dialog"], [role="alertdialog"], [role="listbox"]',
        )
      ) {
        return;
      }
      event.stopPropagation();
      collapse();
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [expanded, collapse]);

  if (tasks.length >= taskLimit) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-lp-rule bg-lp-paper-2 px-5 py-6 text-center shadow-[var(--lp-shadow-card)]">
        <p className="text-[13px] font-medium text-lp-ink">
          You&apos;ve reached the {taskLimit}-task guest limit.
        </p>
        <Button href={authLinks.signUp}>Create an account</Button>
      </div>
    );
  }


  function pickDate() {
    try {
      dateInputRef.current?.showPicker();
    } catch {
      dateInputRef.current?.focus();
    }
  }

  function pickTime() {
    try {
      timeInputRef.current?.showPicker();
    } catch {
      timeInputRef.current?.focus();
    }
  }

  function handleCreateCategory(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    const color = categoryColors[categories.length % categoryColors.length];
    const id = addCategory(name, "list", color);
    setCategoryId(id);
    setNewCategory("");
  }

  function handleCreateLabel(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const name = newLabel.trim();
    if (!name) return;
    const tone = labelTones[labels.length % labelTones.length];
    const id = addLabel(name, tone);
    setLabelIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
    setNewLabel("");
  }

  function handleAddSubtask(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const value = subtaskInput.trim();
    if (!value) return;
    setSubtasks((current) => [...current, value]);
    setSubtaskInput("");
  }

  function toggleLabel(id: string) {
    setLabelIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    const dueAt = dueDate ? (dueTime ? `${dueDate}T${dueTime}` : dueDate) : null;
    addTask({
      title: value,
      dueAt,
      description,
      priority,
      labelIds,
      subtasks,
      categoryId,
    });
    showToast("Task created");
    reset();
    setExpanded(false);
  }

  if (!expanded) {
    return (
      <button
        type="button"
        ref={addTaskInputRef as React.RefObject<HTMLButtonElement>}
        onClick={() => {
          setDueDate(date ?? "");
          setExpanded(true);
        }}
        className="inline-flex h-9 items-center justify-center gap-1 rounded-full border border-lp-ink bg-lp-ink px-4 text-[13px] font-medium tracking-[-0.01em] text-lp-paper transition-colors hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))]"
      >
        <Plus aria-hidden="true" className="h-3 w-3" strokeWidth={2.5} />
        Create a task
      </button>
    );
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-lp-rule bg-lp-paper-2 p-4 shadow-[var(--lp-shadow-card)] animate-slide-down sm:p-5"
    >
      <div className="flex items-center gap-2.5">
        <span aria-hidden="true" className="text-[17px] font-medium leading-none text-lp-accent">
          +
        </span>
        <input
          ref={(node) => {
            titleRef.current = node;
            addTaskInputRef.current = node;
          }}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          aria-label="Task title"
          maxLength={200}
          className="h-9 min-w-0 flex-1 bg-transparent text-[15px] font-medium tracking-[-0.01em] text-lp-ink outline-none placeholder:text-lp-ink-4"
        />
        <button
          type="button"
          onClick={collapse}
          aria-label="Close task composer"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-lp-ink-3 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={pickDate}
          className={`${chipBase} ${dueDate ? chipActive : chipIdle}`}
        >
          <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
          {dueDate ? formatDueShort(dueDate) : "Due date"}
        </button>
        <button
          type="button"
          onClick={pickTime}
          disabled={!dueDate}
          className={`${chipBase} cursor-pointer ${
            dueTime ? chipActive : chipIdle
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <Clock aria-hidden="true" className="h-3.5 w-3.5" />
          {dueTime ? dueTime : "Time"}
        </button>
        {dueDate ? (
          <button
            type="button"
            onClick={() => {
              setDueDate("");
              setDueTime("");
            }}
            aria-label="Clear due date"
            className={iconChip}
          >
            <X aria-hidden="true" className="h-3 w-3" />
          </button>
        ) : null}
        <input
          ref={dateInputRef}
          type="date"
          value={dueDate}
          onChange={(event) => {
            if (!event.target.value) setDueTime("");
            setDueDate(event.target.value);
          }}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
        />
        <input
          ref={timeInputRef}
          type="time"
          value={dueTime}
          onChange={(event) => setDueTime(event.target.value)}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
        />
      </div>


      <div className="mt-5">
        <SectionLabel>Choose category</SectionLabel>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {categories.map((category) => {
            const active = categoryId === category.id;
            return (
              <span
                key={category.id}
                className="group inline-flex items-center gap-0.5"
              >
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategoryId(active ? null : category.id)}
                  className={`${chipBase} ${active ? chipActive : chipIdle}`}
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
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-lp-ink-3 opacity-0 transition-all hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink focus-visible:opacity-100 group-hover:opacity-100"
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
              className="h-7 w-36 rounded-full border border-lp-ink bg-lp-ink px-2.5 text-xs text-lp-paper outline-none placeholder:text-lp-paper/60"
            />
          ) : (
            <button
              type="button"
              onClick={() => setNewCategory(" ")}
              className={`${chipBase} ${chipIdle}`}
            >
              <Plus aria-hidden="true" className="h-3 w-3" />
              New Category
            </button>
          )}
        </div>
      </div>

      <div className="mt-5">
        <SectionLabel>Priority</SectionLabel>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {priorityOptions.map((option) => {
            const active = priority === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => setPriority(option.value)}
                className={`${chipBase} ${active ? chipActive : chipIdle}`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${option.dot}`}
                />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <SectionLabel>Labels</SectionLabel>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {labels.map((label) => {
            const active = labelIds.includes(label.id);
            return (
              <span
                key={label.id}
                className="group inline-flex items-center gap-0.5"
              >
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleLabel(label.id)}
                  className={`${chipBase} ${active ? chipActive : chipIdle}`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${labelDotClasses[label.tone]}`}
                  />
                  {label.name}
                </button>
                <button
                  type="button"
                  onClick={() => setLabelToDelete(label)}
                  aria-label={`Delete label ${label.name}`}
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-lp-ink-3 opacity-0 transition-all hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink focus-visible:opacity-100 group-hover:opacity-100"
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
              className="h-7 w-36 rounded-full border border-lp-ink bg-lp-ink px-2.5 text-xs text-lp-paper outline-none placeholder:text-lp-paper/60"
            />
          ) : (
            <button
              type="button"
              onClick={() => setNewLabel(" ")}
              aria-label="Add a label"
              className={iconChip}
            >
              <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>


      <div className="mt-5">
        <SectionLabel>Subtasks</SectionLabel>
        <div className="mt-1.5">
          {subtasks.map((subtask, index) => (
            <div
              key={`${subtask}-${index}`}
              className="group flex items-center gap-2 py-1"
            >
              <span
                aria-hidden="true"
                className="h-4 w-4 shrink-0 rounded-full border border-lp-rule"
              />
              <span className="min-w-0 flex-1 truncate text-[13px] text-lp-ink">
                {subtask}
              </span>
              <button
                type="button"
                onClick={() =>
                  setSubtasks((current) =>
                    current.filter((_, item) => item !== index),
                  )
                }
                aria-label={`Remove subtask ${subtask}`}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-lp-ink-3 opacity-0 transition-all hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink focus-visible:opacity-100 group-hover:opacity-100"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 py-1">
            <ListChecks
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-lp-ink-3"
            />
            <input
              type="text"
              value={subtaskInput}
              onChange={(event) => setSubtaskInput(event.target.value)}
              onKeyDown={handleAddSubtask}
              placeholder="Add a subtask"
              aria-label="Add a subtask"
              maxLength={500}
              className="h-8 min-w-0 flex-1 bg-transparent px-0.5 text-[13px] text-lp-ink outline-none placeholder:text-lp-ink-4"
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <SectionLabel>Notes</SectionLabel>
        <textarea
          value={description}
          rows={3}
          maxLength={2000}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add a note…"
          aria-label="Task description"
          className="mt-2 w-full resize-none rounded-lg border border-lp-rule bg-lp-paper px-3 py-2.5 text-[13px] leading-relaxed text-lp-ink outline-none placeholder:text-lp-ink-4 focus:border-lp-accent"
        />
      </div>

      <div className="mt-6 flex items-center gap-2">
        <button
          type="button"
          onClick={collapse}
          className="h-9 shrink-0 rounded-full px-3 text-[13px] font-medium text-lp-ink-2 transition-colors hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="h-9 min-w-0 flex-1 rounded-full bg-lp-ink text-[13px] font-medium tracking-[-0.01em] text-lp-paper transition-colors hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add Task
        </button>
      </div>

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
    </form>
  );
}
