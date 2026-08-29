"use client";

import { Check } from "lucide-react";
import { Popover } from "@/modules/app-chrome/components/popover";
import { useTasks } from "@/modules/tasks/store/tasks-provider";
import type { Priority, Task } from "@/modules/tasks/domain/types";
import { chipBase, chipGhost, chipSet } from "./shared";

const priorityOptions: Array<{ value: Priority; label: string; dot: string }> = [
  { value: "none", label: "None", dot: "bg-lp-ink-4" },
  { value: "low", label: "Low", dot: "bg-lp-ink-4" },
  { value: "medium", label: "Medium", dot: "bg-[var(--lp-priority-med)]" },
  { value: "high", label: "High", dot: "bg-lp-accent" },
  { value: "urgent", label: "Urgent", dot: "bg-lp-accent" },
];

export function PriorityField({
  task,
  onChange,
}: {
  task: Task;
  onChange?: (patch: Partial<Task>) => void;
}) {
  const { updateTask } = useTasks();
  const current = priorityOptions.find(
    (option) => option.value === task.priority,
  );

  function applyPatch(patch: Partial<Task>) {
    if (onChange) onChange(patch);
    else updateTask(task.id, patch);
  }

  return (
    <Popover
      align="left"
      role="menu"
      label="Priority"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={toggle}
          className={`${chipBase} ${task.priority === "none" ? chipGhost : chipSet}`}
        >
          {task.priority !== "none" && current ? (
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${current.dot}`}
            />
          ) : null}
          {task.priority === "none" ? "Priority" : current?.label}
        </button>
      )}
    >
      {(close) => (
        <div className="w-40 p-1.5">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={task.priority === option.value}
              onClick={() => {
                applyPatch({ priority: option.value });
                close();
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                task.priority === option.value
                  ? "text-lp-ink"
                  : "text-lp-ink-2 hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${option.dot}`}
              />
              {option.label}
              {task.priority === option.value ? (
                <Check
                  aria-hidden="true"
                  className="ml-auto h-3.5 w-3.5 text-lp-accent"
                  strokeWidth={2.5}
                />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}
