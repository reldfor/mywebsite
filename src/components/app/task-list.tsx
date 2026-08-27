"use client";

import { useMemo } from "react";
import { AddTask } from "@/components/app/add-task";
import { TaskRow } from "@/components/app/task-row";
import { FilterControl, SortControl } from "@/components/app/filters";
import { CompletedEmptyIllustration } from "@/components/app/empty-states/completed-illustration";
import { FilterEmptyIllustration } from "@/components/app/empty-states/filter-illustration";
import { InboxEmptyIllustration } from "@/components/app/empty-states/inbox-illustration";
import { SearchEmptyIllustration } from "@/components/app/empty-states/search-illustration";
import { TodayEmptyIllustration } from "@/components/app/empty-states/today-illustration";
import { UpcomingEmptyIllustration } from "@/components/app/empty-states/upcoming-illustration";
import { useTasks } from "@/features/todos/tasks-provider";
import {
  activeFilterCount,
  applyFilters,
  getArchivedTasks,
  getViewTasks,
  matchesSearch,
  sortTasks,
} from "@/features/todos/selectors";
import type { Task, View } from "@/features/todos/types";
import { isOverdue } from "@/lib/date";

type Group = {
  label: string | null;
  tasks: Task[];
};

const viewMeta: Record<View, { title: string; meta: string }> = {
  inbox: { title: "Inbox", meta: "Everything open" },
  today: { title: "Today", meta: "Due today or overdue" },
  upcoming: { title: "Upcoming", meta: "With a future due date" },
  completed: { title: "Completed", meta: "Done and archived" },
};

const emptyCopy = {
  inbox: {
    title: "No tasks yet",
    detail: "Create your first task.",
  },
  today: {
    title: "Nothing due today",
    detail: "Tasks due today or overdue will show up here.",
  },
  upcoming: {
    title: "Nothing upcoming",
    detail: "Tasks with a future due date will show up here.",
  },
  completed: {
    title: "Nothing completed yet",
    detail: "Tasks you finish will show up here.",
  },
} as const;

function formatTodaySubtitle(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function TaskList({ view }: { view: View }) {
  const { tasks, searchQuery, filters, sort, setSearchQuery, setFilters } =
    useTasks();

  const searching = searchQuery.trim().length > 0;
  const filtersActive = activeFilterCount(filters) > 0;
  const todaySubtitle = view === "today" ? formatTodaySubtitle(new Date()) : "";

  const groups = useMemo<Group[]>(() => {
    if (searching) {
      const matches = tasks.filter((task) => matchesSearch(task, searchQuery));
      return [
        {
          label: null,
          tasks: sortTasks(applyFilters(matches, filters), sort),
        },
      ];
    }
    if (view === "completed") {
      const done = sortTasks(
        applyFilters(getViewTasks(tasks, "completed"), filters),
        sort === "manual" ? "updated" : sort,
      );
      const archived = sortTasks(
        applyFilters(getArchivedTasks(tasks), filters),
        sort,
      );
      const result: Group[] = [];
      if (done.length > 0) result.push({ label: null, tasks: done });
      if (archived.length > 0)
        result.push({ label: "Archived", tasks: archived });
      return result;
    }
    if (view === "today") {
      const base = applyFilters(getViewTasks(tasks, "today"), filters);
      const overdue = base.filter((task) => task.dueAt && isOverdue(task.dueAt));
      const rest = base.filter((task) => !(task.dueAt && isOverdue(task.dueAt)));
      const result: Group[] = [];
      if (overdue.length > 0)
        result.push({ label: "Overdue", tasks: sortTasks(overdue, sort) });
      if (rest.length > 0) result.push({ label: null, tasks: sortTasks(rest, sort) });
      return result;
    }
    return [
      {
        label: null,
        tasks: sortTasks(applyFilters(getViewTasks(tasks, view), filters), sort),
      },
    ];
  }, [tasks, view, searchQuery, filters, sort, searching]);

  const totalCount = groups.reduce((sum, group) => sum + group.tasks.length, 0);
  const isEmpty = totalCount === 0;
  const meta = searching
    ? `${searchQuery.trim()} · ${totalCount} ${totalCount === 1 ? "match" : "matches"}`
    : `${viewMeta[view].meta} · ${totalCount} ${totalCount === 1 ? "task" : "tasks"}`;

  const empty = emptyCopy[view];

  return (
    <>
      <div className="mt-0 w-full px-6 py-3 sm:mt-[45px] sm:px-6 sm:py-4">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-lp-ink sm:text-[28px] sm:font-medium sm:tracking-[-0.015em]">
              {searching ? "Search" : viewMeta[view].title}
            </h1>
            {searching ? (
              <p className="mt-1.5 truncate font-mono text-sm font-medium leading-5 tracking-wide tabular-nums text-lp-ink-2 sm:mt-1 sm:text-[11px]">
                {meta}
              </p>
            ) : view === "today" ? (
              <p
                suppressHydrationWarning
                className="mt-1.5 truncate font-mono text-sm font-medium leading-5 tracking-wide tabular-nums text-lp-ink-2 sm:mt-1 sm:text-[11px]"
              >
                {todaySubtitle}
              </p>
            ) : (
              <p className="mt-1.5 truncate font-mono text-sm font-medium leading-5 tracking-wide tabular-nums text-lp-ink-2 sm:mt-1 sm:text-[11px]">
                {meta}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-1.5">
            {view !== "today" ? <SortControl /> : null}
            <FilterControl />
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[640px] px-6 pt-4 sm:px-6 sm:pt-6">

      {isEmpty && view === "today" && !searching && !filtersActive ? (
        <div className="flex min-h-[55vh] flex-col items-center justify-center py-12 text-center">
          <TodayEmptyIllustration className="h-[150px] w-[180px] rounded-[20px]" />
          <h2 className="mt-4 text-[14px] font-medium tracking-[-0.01em] text-lp-ink">
            0 tasks remaining.
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-lp-ink-2">
            You&apos;re all caught up.
          </p>
        </div>
      ) : isEmpty ? (
        <div className="flex min-h-[55vh] flex-col items-center justify-center py-12 text-center">
          {searching ? (
            <SearchEmptyIllustration className="h-[150px] w-[180px] rounded-[20px]" />
          ) : filtersActive ? (
            <FilterEmptyIllustration className="h-[150px] w-[180px] rounded-[20px]" />
          ) : view === "completed" ? (
            <CompletedEmptyIllustration className="h-[150px] w-[180px] rounded-[20px]" />
          ) : view === "inbox" ? (
            <InboxEmptyIllustration className="h-[150px] w-[180px] rounded-[20px]" />
          ) : view === "upcoming" ? (
            <UpcomingEmptyIllustration className="h-[150px] w-[180px] rounded-[20px]" />
          ) : (
            <TodayEmptyIllustration className="h-[150px] w-[180px] rounded-[20px]" />
          )}
          <h2 className="mt-4 text-[15px] font-medium tracking-[-0.01em] text-lp-ink">
            {searching ? "No matches" : filtersActive ? "Nothing matches" : empty.title}
          </h2>
          <p className="mt-1.5 max-w-[28ch] text-[13px] leading-6 text-lp-ink-2">
            {searching
              ? `Nothing matches “${searchQuery.trim()}”. Try different words.`
              : filtersActive
                ? "Try clearing the filters to see more tasks."
                : empty.detail}
          </p>
          {searching ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-6 inline-flex h-9 items-center rounded-full bg-lp-ink px-4 text-[13px] font-medium tracking-[-0.01em] text-lp-paper transition-colors hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))]"
            >
              Clear search
            </button>
          ) : filtersActive ? (
            <button
              type="button"
              onClick={() =>
                setFilters({ statuses: [], priorities: [], due: "all", labelIds: [] })
              }
              className="mt-6 text-[13px] font-medium text-lp-ink underline decoration-lp-rule underline-offset-4 hover:decoration-lp-ink/40"
            >
              Clear all filters
            </button>
          ) : (
            <div className="mt-6 flex justify-center">
              <AddTask />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-4">
            {groups.map((group, index) => (
              <div key={group.label ?? `group-${index}`} className={index > 0 ? "mt-6" : ""}>
                {group.label ? (
                  <p
                    className={`flex items-center gap-2 px-2 font-mono text-[9px] font-medium uppercase tracking-[0.06em] ${group.label === "Overdue" ? "text-lp-accent" : "text-lp-ink-3"}`}
                  >
                    {group.label}
                    <span className="h-px flex-1 bg-lp-rule" />
                  </p>
                ) : null}
                <ul className={`${group.label ? "mt-1" : ""}`}>
                  {group.tasks.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <AddTask />
            <div aria-hidden="true" className="h-20 md:hidden" />
          </div>
        </>
      )}
      </div>
    </>
  );
}
