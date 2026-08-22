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
  low: "bg-ink/20",
  medium: "bg-ink/40",
  high: "bg-ink/70",
  urgent: "bg-ink",
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
      className="-ml-1 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-ink/[0.04]"
    >
      <span
        aria-hidden="true"
        className={`grid h-[18px] w-[18px] place-items-center rounded-full border transition-colors duration-150 ${
          completed
            ? "border-ink bg-ink"
            : "border-line bg-surface group-hover:border-ink/20"
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
      ? "text-ink-faint line-through"
      : isOverdue(due)
        ? "font-medium text-ink"
        : isDueToday(due)
          ? "font-medium text-ink"
          : "text-ink-faint"
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
          selected ? "bg-ink/[0.04]" : "hover:bg-ink/[0.03]"
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
            <p className="relative inline-block max-w-full truncate align-middle text-[13px] font-[450] leading-tight">
              {completed ? (
                <span
                  aria-hidden="true"
                  className="task-strike absolute inset-x-[-2px] top-1/2 h-px -translate-y-1/2 bg-ink/15"
                />
              ) : null}
              <span
                className={`relative ${
                  completed ? "text-ink-faint line-through" : "text-ink"
                }`}
              >
                {task.title}
              </span>
            </p>
          </button>
        </div>
        {category ? (
          <span
            className={`hidden shrink-0 items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-medium sm:inline-flex ${categoryColorClasses[category.color].pill}`}
          >
            <CategoryIconComponent icon={category.icon} className="h-3 w-3 text-ink-faint" />
            {category.name}
          </span>
        ) : null}
        {task.subtasks.length > 0 ? (
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-faint">
            {doneCount}/{task.subtasks.length}
          </span>
        ) : null}
        {due ? (
          <span className={`shrink-0 font-mono text-[11px] tabular-nums ${dueClasses}`}>
            {formatDueShort(due)}
            {timeOf(due) ? ` · ${timeOf(due)}` : ""}
          </span>
        ) : null}
        <RowMenu task={task} />
      </div>
    </li>
  );
}
