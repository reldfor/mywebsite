"use client";

import { ArrowUpDown, Check, ChevronDown, Filter } from "lucide-react";
import type { ReactNode } from "react";
import { Popover } from "@/components/app/popover";
import { useTasks } from "@/features/todos/tasks-provider";
import type { Priority, SortKey } from "@/features/todos/types";
import { activeFilterCount } from "@/features/todos/selectors";

const priorityDots: Record<Priority, string> = {
  none: "bg-lp-ink-4",
  low: "bg-lp-ink-4",
  medium: "bg-[var(--lp-priority-med)]",
  high: "bg-lp-accent",
  urgent: "bg-lp-accent",
};

const dueOptions = [
  { value: "today", label: "Today" },
  { value: "overdue", label: "Overdue" },
  { value: "upcoming", label: "Upcoming" },
  { value: "none", label: "No date" },
] as const;

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-1 font-mono text-[9px] font-medium uppercase tracking-[0.06em] text-lp-ink-3">
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
          ? "border-lp-ink bg-lp-ink text-lp-paper"
          : "border-lp-rule bg-[var(--lp-glass)] text-lp-ink-2 shadow-[var(--lp-shadow-interactive)] hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:text-lp-ink hover:bg-lp-paper"
      }`}
    >
      {children}
    </button>
  );
}

export function FilterControl() {
  const { filters, setFilters, labels } = useTasks();
  const activeCount = activeFilterCount(filters);
  const filterLabel = activeCount === 0 ? "All" : `${activeCount}`;

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
          aria-label={`Filter tasks, ${filterLabel}`}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-lp-rule bg-[var(--lp-glass)] px-3 text-[13px] font-medium tracking-[-0.01em] text-lp-ink-2 shadow-[var(--lp-shadow-interactive)] transition-colors hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:text-lp-ink hover:bg-lp-paper"
        >
          <Filter aria-hidden="true" className="h-3.5 w-3.5" />
          Filter: {filterLabel}
          <ChevronDown
            aria-hidden="true"
            className={`h-3 w-3 shrink-0 text-lp-ink-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
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
              {labels.map((label) => {
                const toneDot = label.tone === "gray" ? "bg-lp-ink-4" : label.tone === "red" ? "bg-lp-accent" : label.tone === "orange" || label.tone === "yellow" ? "bg-[var(--lp-priority-med)]" : label.tone === "green" || label.tone === "teal" ? "bg-[var(--lp-label-errand)]" : label.tone === "blue" || label.tone === "cyan" || label.tone === "indigo" ? "bg-[var(--lp-label-personal)]" : label.tone === "purple" || label.tone === "pink" ? "bg-[var(--lp-label-side)]" : "bg-lp-ink-4";
                return (
                  <Chip
                    key={label.id}
                    active={filters.labelIds.includes(label.id)}
                    onClick={() => toggleLabel(label.id)}
                  >
                    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${toneDot}`} />
                    {label.name}
                  </Chip>
                );
              })}
            </div>
          </div>

          {activeCount > 0 ? (
            <button
              type="button"
              onClick={() =>
                setFilters({ statuses: [], priorities: [], due: "all", labelIds: [] })
              }
              className="self-start text-xs font-medium text-lp-ink underline decoration-lp-rule underline-offset-4 hover:decoration-lp-ink/40"
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
  const sortLabel = sortOptions.find((o) => o.value === sort)?.label ?? "Manual order";

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
          aria-label={`Sort tasks, ${sortLabel}`}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-lp-rule bg-[var(--lp-glass)] px-3 text-[13px] font-medium tracking-[-0.01em] text-lp-ink-2 shadow-[var(--lp-shadow-interactive)] transition-colors hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:text-lp-ink hover:bg-lp-paper"
        >
          <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5" />
          Sort: {sortLabel}
          <ChevronDown
            aria-hidden="true"
            className={`h-3 w-3 shrink-0 text-lp-ink-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
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
              className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                sort === option.value
                  ? "bg-lp-paper-3 text-lp-ink"
                  : "text-lp-ink-2 hover:bg-[var(--lp-hover-wash)] hover:text-lp-ink"
              }`}
            >
              {option.label}
              {sort === option.value ? (
                <Check aria-hidden="true" className="h-3.5 w-3.5 text-lp-accent" strokeWidth={2.5} />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}
