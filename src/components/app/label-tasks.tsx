"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, Tag } from "lucide-react";
import { AddTask } from "@/components/app/add-task";
import { TaskRow } from "@/components/app/task-row";
import { FilterControl, SortControl } from "@/components/app/filters";
import { useTasks } from "@/features/todos/tasks-provider";
import {
  activeFilterCount,
  applyFilters,
  getTasksByLabel,
  matchesSearch,
  sortTasks,
} from "@/features/todos/selectors";

export function LabelTasks({ labelId }: { labelId: string }) {
  const { tasks, labels, searchQuery, filters, sort, setSearchQuery, setFilters } = useTasks();
  const label = labels.find((l) => l.id === labelId) ?? null;
  const searching = searchQuery.trim().length > 0;
  const filtersActive = activeFilterCount(filters) > 0;

  const visible = useMemo(() => {
    const base = label ? getTasksByLabel(tasks, labelId) : [];
    const searched = searching ? base.filter((t) => matchesSearch(t, searchQuery)) : base;
    const filtered = applyFilters(searched, filters);
    return sortTasks(filtered, sort);
  }, [tasks, labelId, label, searching, searchQuery, filters, sort]);

  if (!label) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/app/labels"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          All labels
        </Link>
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink-faint">
            <Tag aria-hidden="true" className="h-4 w-4" />
          </span>
          <h2 className="mt-3 text-[14px] font-semibold tracking-[-0.01em]">Label not found</h2>
          <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-ink-soft">
            This label doesn&apos;t exist. It may have been deleted.
          </p>
          <Link
            href="/app/labels"
            className="mt-5 inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-paper hover:bg-ink/90"
          >
            Back to labels
          </Link>
        </div>
      </div>
    );
  }

  const total = visible.length;
  const isEmpty = total === 0;

  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/app/labels"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
        All labels
      </Link>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-[22px] font-semibold tracking-[-0.02em]">
            <Tag aria-hidden="true" className="h-5 w-5 shrink-0 text-ink-faint" />
            <span className="truncate">{label.name}</span>
          </h1>
          <p className="mt-1 truncate font-mono text-[11px] tabular-nums text-ink-soft">
            {searching ? `${searchQuery.trim()} · ${total} ${total === 1 ? "match" : "matches"}` : `${total} ${total === 1 ? "task" : "tasks"}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <SortControl />
          <FilterControl />
        </div>
      </div>

      {isEmpty ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink-faint">
            <Tag aria-hidden="true" className="h-4 w-4" />
          </span>
          <h2 className="mt-3 text-[14px] font-semibold tracking-[-0.01em]">
            {searching ? "No matches" : filtersActive ? "Nothing matches" : "No tasks with this label"}
          </h2>
          <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-ink-soft">
            {searching
              ? `Nothing matches “${searchQuery.trim()}”.`
              : filtersActive
                ? "Try clearing the filters to see more tasks."
                : `Tasks tagged “${label.name}” will show up here.`}
          </p>
          {searching ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-5 inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-paper hover:bg-ink/90"
            >
              Clear search
            </button>
          ) : filtersActive ? (
            <button
              type="button"
              onClick={() => setFilters({ statuses: [], priorities: [], due: "all", labelIds: [] })}
              className="mt-5 text-[13px] font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink/40"
            >
              Clear all filters
            </button>
          ) : (
            <div className="mt-5 flex justify-center">
              <AddTask />
            </div>
          )}
        </div>
      ) : (
        <>
          <ul className="mt-6 divide-y divide-line/60">
            {visible.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
          <div className="mt-6">
            <AddTask />
          </div>
        </>
      )}
    </div>
  );
}
