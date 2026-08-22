"use client";

import { useMemo } from "react";
import {
  CalendarClock,
  CheckCheck,
  Inbox,
  Search,
  Sun,
} from "lucide-react";
import { AddTask } from "@/components/app/add-task";
import { TaskRow } from "@/components/app/task-row";
import { FilterControl, SortControl } from "@/components/app/filters";
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
    icon: Inbox,
    title: "No tasks yet",
    detail: "Create your first task.",
  },
  today: {
    icon: Sun,
    title: "Nothing due today",
    detail: "Tasks due today or overdue will show up here.",
  },
  upcoming: {
    icon: CalendarClock,
    title: "Nothing upcoming",
    detail: "Tasks with a future due date will show up here.",
  },
  completed: {
    icon: CheckCheck,
    title: "Nothing completed yet",
    detail: "Tasks you finish will show up here.",
  },
} as const;

export function TaskList({ view }: { view: View }) {
  const { tasks, searchQuery, filters, sort, setSearchQuery, setFilters } =
    useTasks();

  const searching = searchQuery.trim().length > 0;
  const filtersActive = activeFilterCount(filters) > 0;

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
    <div className="mx-auto w-full max-w-[640px] px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">
            {searching ? "Search" : viewMeta[view].title}
          </h1>
          <p className="mt-1 truncate font-mono text-[11px] tabular-nums text-ink-soft">
            {meta}
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
            <Search
              aria-hidden="true"
              className={`h-4 w-4 ${searching ? "" : "hidden"}`}
            />
            <empty.icon
              aria-hidden="true"
              className={`h-4 w-4 ${searching ? "hidden" : ""}`}
            />
          </span>
          <h2 className="mt-3 text-[14px] font-semibold tracking-[-0.01em]">
            {searching ? "No matches" : filtersActive ? "Nothing matches" : empty.title}
          </h2>
          <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-ink-soft">
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
              className="mt-5 inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-paper transition-colors hover:bg-ink/90"
            >
              Clear search
            </button>
          ) : filtersActive ? (
            <button
              type="button"
              onClick={() =>
                setFilters({ statuses: [], priorities: [], due: "all", labelIds: [] })
              }
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
          <div className="mt-4">
            {groups.map((group, index) => (
              <div key={group.label ?? `group-${index}`} className={index > 0 ? "mt-6" : ""}>
                {group.label ? (
                  <p
                    className="px-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint"
                  >
                    {group.label}
                  </p>
                ) : null}
                <ul className={`divide-y divide-line/60 ${group.label ? "mt-1" : ""}`}>
                  {group.tasks.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <AddTask />
          </div>
        </>
      )}
    </div>
  );
}
