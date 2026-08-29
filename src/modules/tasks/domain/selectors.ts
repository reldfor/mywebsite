import type { Filters, Priority, SortKey, Task, View } from "./types";
import { isDueToday, isOverdue, isUpcoming } from "@/modules/tasks/domain/date";

const priorityRank: Record<Priority, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

export function matchesSearch(task: Task, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    task.title.toLowerCase().includes(q) ||
    task.description.toLowerCase().includes(q)
  );
}

export function getViewTasks(tasks: Task[], view: View): Task[] {
  switch (view) {
    case "inbox":
      return tasks.filter(
        (task) => task.status === "todo" || task.status === "in_progress",
      );
    case "today":
      return tasks.filter(
        (task) =>
          (task.status === "todo" || task.status === "in_progress") &&
          task.dueAt !== null &&
          (isDueToday(task.dueAt) || isOverdue(task.dueAt)),
      );
    case "upcoming":
      return tasks.filter(
        (task) =>
          (task.status === "todo" || task.status === "in_progress") &&
          task.dueAt !== null &&
          isUpcoming(task.dueAt),
      );
    case "completed":
      return tasks.filter((task) => task.status === "completed");
  }
}

export function getArchivedTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.status === "archived");
}

export function applyFilters(tasks: Task[], filters: Filters): Task[] {
  return tasks.filter((task) => {
    if (filters.statuses.length > 0) {
      const matchesStatus = filters.statuses.some((status) => {
        if (status === "open") {
          return task.status === "todo" || task.status === "in_progress";
        }
        return task.status === status;
      });
      if (!matchesStatus) return false;
    }
    if (
      filters.priorities.length > 0 &&
      !filters.priorities.includes(task.priority)
    ) {
      return false;
    }
    if (filters.due !== "all") {
      if (filters.due === "none") {
        if (task.dueAt !== null) return false;
      } else {
        if (task.dueAt === null) return false;
        if (filters.due === "today" && !isDueToday(task.dueAt)) return false;
        if (filters.due === "overdue" && !isOverdue(task.dueAt)) return false;
        if (filters.due === "upcoming" && !isUpcoming(task.dueAt)) return false;
      }
    }
    if (
      filters.labelIds.length > 0 &&
      !filters.labelIds.some((id) => task.labelIds.includes(id))
    ) {
      return false;
    }
    return true;
  });
}

export function sortTasks(tasks: Task[], sort: SortKey): Task[] {
  const sorted = [...tasks];
  switch (sort) {
    case "manual":
      return sorted.sort((a, b) => a.position - b.position);
    case "due":
      return sorted.sort((a, b) => {
        if (a.dueAt === null && b.dueAt === null) return a.position - b.position;
        if (a.dueAt === null) return 1;
        if (b.dueAt === null) return -1;
        if (a.dueAt === b.dueAt) return a.position - b.position;
        return a.dueAt < b.dueAt ? -1 : 1;
      });
    case "priority":
      return sorted.sort(
        (a, b) =>
          priorityRank[b.priority] - priorityRank[a.priority] ||
          a.position - b.position,
      );
    case "created":
      return sorted.sort((a, b) => {
        if (a.createdAt === b.createdAt) return a.position - b.position;
        return a.createdAt < b.createdAt ? 1 : -1;
      });
    case "updated":
      return sorted.sort((a, b) => {
        if (a.updatedAt === b.updatedAt) return a.position - b.position;
        return a.updatedAt < b.updatedAt ? 1 : -1;
      });
  }
}

export function activeFilterCount(filters: Filters): number {
  return (
    filters.statuses.length +
    filters.priorities.length +
    (filters.due !== "all" ? 1 : 0) +
    filters.labelIds.length
  );
}

export function countOpenTasks(tasks: Task[]): number {
  return tasks.filter(
    (task) => task.status === "todo" || task.status === "in_progress",
  ).length;
}

export function countDueToday(tasks: Task[]): number {
  return tasks.filter(
    (task) =>
      (task.status === "todo" || task.status === "in_progress") &&
      task.dueAt !== null &&
      (isDueToday(task.dueAt) || isOverdue(task.dueAt)),
  ).length;
}

export function getTasksByLabel(tasks: Task[], labelId: string): Task[] {
  return tasks.filter((task) => task.labelIds.includes(labelId));
}

export function countTasksByLabel(tasks: Task[], labelId: string): number {
  return getTasksByLabel(tasks, labelId).length;
}
