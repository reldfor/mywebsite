"use client";

import { CalendarDays, X } from "lucide-react";
import { Popover } from "@/components/app/popover";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Task } from "@/features/todos/types";
import { formatDueShort, timeOf } from "@/lib/date";
import { chipBase, chipGhost, chipSet } from "./shared";

export function DueDateField({ task }: { task: Task }) {
  const { updateTask } = useTasks();
  const dueAt = task.dueAt;

  function setDate(value: string | null) {
    const time = dueAt ? timeOf(dueAt) : null;
    updateTask(task.id, {
      dueAt: value ? (time ? `${value}T${time}` : value) : null,
      startDate: value,
      endDate: value,
    });
  }

  function setTime(time: string) {
    if (!dueAt) return;
    const date = dueAt.slice(0, 10);
    updateTask(task.id, {
      dueAt: time ? `${date}T${time}` : date,
      startDate: date,
      endDate: date,
    });
  }

  function clear() {
    updateTask(task.id, { dueAt: null, startDate: null, endDate: null });
  }

  return (
    <Popover
      align="left"
      label="Due date"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={toggle}
          className={`${chipBase} ${dueAt ? `${chipSet} font-mono tabular-nums` : chipGhost}`}
        >
          <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
          {dueAt
            ? `${formatDueShort(dueAt)}${timeOf(dueAt) ? ` · ${timeOf(dueAt)}` : ""}`
            : "Due date"}
        </button>
      )}
    >
      {() => (
        <div className="w-60 space-y-2 p-3">
          <input
            type="date"
            value={dueAt ? dueAt.slice(0, 10) : ""}
            onChange={(event) => setDate(event.target.value || null)}
            aria-label="Due date"
            className="h-8 w-full rounded-md border border-line bg-paper px-2 font-mono text-xs tabular-nums text-ink outline-none focus:border-ink/20"
          />
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={dueAt ? (timeOf(dueAt) ?? "") : ""}
              onChange={(event) => setTime(event.target.value)}
              disabled={!dueAt}
              aria-label="Due time"
              className="h-8 min-w-0 flex-1 rounded-md border border-line bg-paper px-2 font-mono text-xs tabular-nums text-ink outline-none focus:border-ink/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {dueAt ? (
              <button
                type="button"
                onClick={clear}
                aria-label="Clear due date"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      )}
    </Popover>
  );
}
