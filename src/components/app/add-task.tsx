"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { useTasks } from "@/features/todos/tasks-provider";

export function AddTask({ date }: { date?: string | null }) {
  const { addTask, addTaskInputRef } = useTasks();
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    addTask(value, date ?? null);
    setTitle("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 transition-colors focus-within:border-pen focus-within:ring-2 focus-within:ring-pen/15"
    >
      <Plus aria-hidden="true" className="h-4.5 w-4.5 shrink-0 text-pen" strokeWidth={3} />
      <input
        ref={addTaskInputRef}
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to be done?"
        aria-label="Add a task"
        maxLength={200}
        className="h-12 min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
      />
      {title.trim() ? (
        <button
          type="submit"
          className="h-8 shrink-0 rounded-full bg-ink px-4 text-sm font-semibold text-paper transition-colors hover:bg-pen"
        >
          Add
        </button>
      ) : null}
    </form>
  );
}
