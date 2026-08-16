"use client";

import { useEffect, useRef, useState } from "react";
import { RowMenu } from "@/components/app/menus";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Task } from "@/features/todos/types";
import { formatDueShort, isDueToday, isOverdue } from "@/lib/date";

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
      className="-ml-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-pen/10 focus-visible:bg-pen/10"
    >
      <span
        aria-hidden="true"
        className={`grid h-5 w-5 place-items-center rounded-full border-2 transition-colors duration-200 ${
          completed
            ? "border-pen bg-pen-soft"
            : "border-line bg-surface group-hover:border-ink/50"
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
            />
          </svg>
        ) : null}
      </span>
    </button>
  );
}

export function TaskRow({ task }: { task: Task }) {
  const { toggleTask, setSelectedTaskId, selectedTaskId } = useTasks();
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
  const urgent = task.priority === "urgent";
  const high = task.priority === "high";

  function handleToggle() {
    if (!completed) {
      setJustCompleted(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setJustCompleted(false), 650);
    }
    toggleTask(task.id);
  }

  const due = task.dueAt;
  const dueClasses = due
    ? completed
      ? "text-ink-faint line-through"
      : isOverdue(due)
        ? "font-medium text-danger"
        : isDueToday(due)
          ? "font-medium text-warning"
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
        className={`-mx-2 flex cursor-pointer items-center gap-1 rounded-xl px-2 py-2.5 transition-colors ${
          selected ? "bg-surface" : "hover:bg-surface"
        }`}
      >
        <TaskCheckbox task={task} onToggle={handleToggle} />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {!completed && (urgent || high) ? (
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                urgent ? "bg-danger" : "bg-caution"
              }`}
            />
          ) : null}
          <button
            type="button"
            onClick={() => setSelectedTaskId(task.id)}
            className="min-w-0 flex-1 rounded-md text-left outline-none"
          >
            <p className="relative inline-block max-w-full truncate align-middle text-[15px] font-medium">
              {completed ? (
                <span
                  aria-hidden="true"
                  className="task-strike absolute inset-x-[-3px] top-1/2 h-[0.42em] -translate-y-1/2 rounded-[3px] bg-marker/90"
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
        {task.subtasks.length > 0 ? (
          <span className="shrink-0 font-mono text-[11px] text-ink-faint">
            {doneCount}/{task.subtasks.length}
          </span>
        ) : null}
        {due ? (
          <span className={`shrink-0 font-mono text-[11px] ${dueClasses}`}>
            {formatDueShort(due)}
          </span>
        ) : null}
        <RowMenu task={task} />
      </div>
    </li>
  );
}
