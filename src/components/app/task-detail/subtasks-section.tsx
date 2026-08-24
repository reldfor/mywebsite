"use client";

import { useState, type KeyboardEvent } from "react";
import { Check, ListChecks, X } from "lucide-react";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Subtask, Task } from "@/features/todos/types";
import { SectionLabel } from "./shared";

export function SubtasksSection({ task }: { task: Task }) {
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
    addSubtask(task.id, title);
    setNewSubtask("");
  }

  return (
    <div className="mt-6">
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
        <ListChecks
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-ink-faint"
        />
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
            <Check
              aria-hidden="true"
              className="h-2.5 w-2.5 text-paper"
              strokeWidth={3}
            />
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
