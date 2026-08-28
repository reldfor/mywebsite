"use client";

import { useState, type KeyboardEvent } from "react";
import { Check, ListChecks, X } from "lucide-react";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Subtask, Task } from "@/features/todos/types";
import { SectionLabel } from "./shared";

function nextId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function SubtasksSection({
  task,
  onChange,
}: {
  task: Task;
  onChange?: (patch: Partial<Task>) => void;
}) {
  const { addSubtask, toggleSubtask, deleteSubtask } = useTasks();
  const [newSubtask, setNewSubtask] = useState("");

  const doneCount = task.subtasks.filter(
    (subtask) => subtask.completed,
  ).length;
  const progress =
    task.subtasks.length > 0 ? doneCount / task.subtasks.length : 0;

  function handleCreateSubtask(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const title = newSubtask.trim();
    if (!title) return;
    if (onChange) {
      const position =
        task.subtasks.reduce((max, s) => Math.max(max, s.position), 0) + 1;
      const next: Task["subtasks"] = [
        ...task.subtasks,
        { id: nextId(), title, completed: false, position },
      ];
      onChange({ subtasks: next });
    } else {
      addSubtask(task.id, title);
    }
    setNewSubtask("");
  }

  function handleToggle(subtaskId: string) {
    if (onChange) {
      const next = task.subtasks.map((s) =>
        s.id === subtaskId ? { ...s, completed: !s.completed } : s,
      );
      onChange({ subtasks: next });
      return;
    }
    toggleSubtask(task.id, subtaskId);
  }

  function handleDelete(subtaskId: string) {
    if (onChange) {
      const next = task.subtasks.filter((s) => s.id !== subtaskId);
      onChange({ subtasks: next });
      return;
    }
    deleteSubtask(task.id, subtaskId);
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <SectionLabel>Subtasks</SectionLabel>
        {task.subtasks.length > 0 ? (
          <span className="font-mono text-[10px] tabular-nums text-lp-ink-3">
            {doneCount}/{task.subtasks.length} done
          </span>
        ) : null}
      </div>
      {task.subtasks.length > 0 ? (
        <>
          <div
            aria-hidden="true"
            className="mt-2 h-1 overflow-hidden rounded-full bg-lp-paper-4"
          >
            <div
              className="h-full rounded-full bg-lp-accent transition-all duration-300"
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
                  onToggle={() => handleToggle(subtask.id)}
                  onDelete={() => handleDelete(subtask.id)}
                />
              ))}
          </ul>
        </>
      ) : null}
      <div className="mt-2 flex items-center gap-2 border-l border-dashed border-lp-rule-2 pl-2">
        <ListChecks
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-lp-ink-3"
        />
        <input
          type="text"
          value={newSubtask}
          onChange={(event) => setNewSubtask(event.target.value)}
          onKeyDown={handleCreateSubtask}
          placeholder="Add a subtask, Enter to save"
          aria-label="Add a subtask"
          className="h-8 min-w-0 flex-1 rounded-md bg-transparent px-0.5 text-[13px] text-lp-ink outline-none placeholder:text-lp-ink-4"
        />
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
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors hover:bg-[var(--lp-hover-wash)]"
      >
        <span
          aria-hidden="true"
          className={`grid h-4 w-4 place-items-center rounded-full border transition-colors duration-150 ${
            subtask.completed
              ? "border-lp-accent bg-lp-accent"
              : "border-lp-rule bg-[var(--lp-glass)] group-hover:border-lp-accent"
          }`}
        >
          {subtask.completed ? (
            <Check
              aria-hidden="true"
              className="h-2.5 w-2.5 text-lp-paper"
              strokeWidth={3}
            />
          ) : null}
        </span>
      </button>
      <span
        className={`min-w-0 flex-1 truncate text-[13px] ${
          subtask.completed
            ? "text-lp-ink-3 line-through decoration-lp-accent"
            : "text-lp-ink"
        }`}
      >
        {subtask.title}
      </span>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete subtask ${subtask.title}`}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-lp-ink-3 opacity-0 transition-all hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink focus-visible:opacity-100 group-hover:opacity-100"
      >
        <X aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}
