"use client";

import { ArrowUpDown, Check, Filter } from "lucide-react";
import type { ReactNode } from "react";
import { Popover } from "@/components/app/popover";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Priority, SortKey } from "@/features/todos/types";
import { activeFilterCount } from "@/features/todos/selectors";

const priorityDots: Record<Priority, string> = {
  none: "bg-line",
  low: "bg-slate-400",
  medium: "bg-warning",
  high: "bg-caution",
  urgent: "bg-danger",
};

const dueOptions = [
  { value: "today", label: "Today" },
  { value: "overdue", label: "Overdue" },
  { value: "upcoming", label: "Upcoming" },
  { value: "none", label: "No date" },
] as const;

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-faint">
      {children}
    </p>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-pen bg-pen-soft text-pen"
          : "border-line bg-surface text-ink-soft hover:border-ink/30 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function FilterControl() {
  const { filters, setFilters, labels } = useTasks();
  const activeCount = activeFilterCount(filters);

  function toggleStatus(status: "open" | "completed" | "archived") {
    setFilters({
      ...filters,
      statuses: filters.statuses.includes(status)
        ? filters.statuses.filter((s) => s !== status)
        : [...filters.statuses, status],
    });
  }

  function togglePriority(priority: Priority) {
    setFilters({
      ...filters,
      priorities: filters.priorities.includes(priority)
        ? filters.priorities.filter((p) => p !== priority)
        : [...filters.priorities, priority],
    });
  }

  function toggleLabel(labelId: string) {
    setFilters({
      ...filters,
      labelIds: filters.labelIds.includes(labelId)
        ? filters.labelIds.filter((id) => id !== labelId)
        : [...filters.labelIds, labelId],
    });
  }

  return (
    <Popover
      label="Filter tasks"
      className="w-64 p-4"
      align="right"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={toggle}
          className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors ${
            activeCount > 0
              ? "border-pen bg-pen-soft text-pen"
              : "border-line bg-surface text-ink-soft hover:border-ink/40 hover:text-ink"
          }`}
        >
          <Filter aria-hidden="true" className="h-3.5 w-3.5" />
          Filter
          {activeCount > 0 ? (
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-pen px-1 font-mono text-[10px] font-semibold text-paper">
              {activeCount}
            </span>
          ) : null}
        </button>
      )}
    >
      {() => (
        <div className="flex flex-col gap-5">
          <div>
            <SectionLabel>Status</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Chip
                active={filters.statuses.includes("open")}
                onClick={() => toggleStatus("open")}
              >
                Open
              </Chip>
              <Chip
                active={filters.statuses.includes("completed")}
                onClick={() => toggleStatus("completed")}
              >
                Completed
              </Chip>
              <Chip
                active={filters.statuses.includes("archived")}
                onClick={() => toggleStatus("archived")}
              >
                Archived
              </Chip>
            </div>
          </div>

          <div>
            <SectionLabel>Priority</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(["none", "low", "medium", "high", "urgent"] as Priority[]).map(
                (priority) => (
                  <Chip
                    key={priority}
                    active={filters.priorities.includes(priority)}
                    onClick={() => togglePriority(priority)}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${priorityDots[priority]}`}
                    />
                    {priority === "none"
                      ? "None"
                      : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Chip>
                ),
              )}
            </div>
          </div>

          <div>
            <SectionLabel>Due date</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {dueOptions.map((option) => (
                <Chip
                  key={option.value}
                  active={filters.due === option.value}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      due: filters.due === option.value ? "all" : option.value,
                    })
                  }
                >
                  {option.label}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Labels</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {labels.map((label) => (
                <Chip
                  key={label.id}
                  active={filters.labelIds.includes(label.id)}
                  onClick={() => toggleLabel(label.id)}
                >
                  {label.name}
                </Chip>
              ))}
            </div>
          </div>

          {activeCount > 0 ? (
            <button
              type="button"
              onClick={() =>
                setFilters({ statuses: [], priorities: [], due: "all", labelIds: [] })
              }
              className="self-start text-xs font-semibold text-pen transition-colors hover:underline"
            >
              Clear all filters
            </button>
          ) : null}
        </div>
      )}
    </Popover>
  );
}

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "manual", label: "Manual order" },
  { value: "due", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "created", label: "Created date" },
  { value: "updated", label: "Updated date" },
];

export function SortControl() {
  const { sort, setSort } = useTasks();

  return (
    <Popover
      role="menu"
      label="Sort tasks"
      className="w-52 p-1.5"
      align="right"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={toggle}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm font-medium text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
        >
          <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5" />
          Sort
        </button>
      )}
    >
      {(close) => (
        <div className="flex flex-col p-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitem"
              onClick={() => {
                setSort(option.value);
                close();
              }}
              className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                sort === option.value
                  ? "text-pen"
                  : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {option.label}
              {sort === option.value ? (
                <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}
