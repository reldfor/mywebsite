import type { Priority, Subtask, TaskStatus } from "@/modules/tasks/domain/types";

export const validStatuses: TaskStatus[] = ["todo", "in_progress", "completed", "archived"];
export const validPriorities: Priority[] = ["none", "low", "medium", "high", "urgent"];

export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MAX_LABEL_IDS = 20;
export const MAX_SUBTASKS = 50;
export const MAX_SUBTASK_TITLE_LENGTH = 200;
export const MAX_CATEGORY_ID_LENGTH = 64;
export const MAX_ID_LENGTH = 64;
export const MAX_POSITION = 1_000_000;
export const MAX_TASKS_QUERY_LIMIT = 1000;
export const MAX_ORDERED_IDS = 500;

export function validateId(id: unknown): string {
  if (typeof id !== "string") throw new Error("Invalid id");
  const trimmed = id.trim();
  if (trimmed.length === 0) throw new Error("Invalid id");
  if (trimmed.length > MAX_ID_LENGTH) throw new Error("Id must be ≤ 64 characters");
  return trimmed;
}

export function validateTitle(title: unknown): string {
  if (typeof title !== "string") throw new Error("Title must be a string");
  const trimmed = title.trim();
  if (trimmed.length === 0) throw new Error("Title is required");
  if (trimmed.length > MAX_TITLE_LENGTH) throw new Error("Title must be ≤ 200 characters");
  return trimmed;
}

export function validateDescription(description: unknown): string {
  if (typeof description !== "string") throw new Error("Invalid description");
  const trimmed = description.trim();
  if (trimmed.length > MAX_DESCRIPTION_LENGTH) throw new Error("Description must be ≤ 2000 characters");
  return trimmed;
}

export function validateStatus(status: unknown): TaskStatus {
  if (typeof status !== "string" || !validStatuses.includes(status as TaskStatus)) {
    throw new Error("Invalid status");
  }
  return status as TaskStatus;
}

export function validatePriority(priority: unknown): Priority {
  if (typeof priority !== "string" || !validPriorities.includes(priority as Priority)) {
    throw new Error("Invalid priority");
  }
  return priority as Priority;
}

export function validateDueAt(dueAt: unknown): string | null {
  if (dueAt === null || dueAt === undefined) return null;
  if (typeof dueAt !== "string") throw new Error("Invalid dueAt");
  const trimmed = dueAt.trim();
  if (trimmed === "") return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) throw new Error("Invalid dueAt format");
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid dueAt");
  return trimmed;
}

export function validateIsoNullable(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") throw new Error("Invalid date");
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date");
  return d.toISOString();
}

export function validateCategoryId(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") throw new Error("Invalid categoryId");
  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (trimmed.length > MAX_CATEGORY_ID_LENGTH) throw new Error("CategoryId must be ≤ 64 characters");
  return trimmed;
}

export function validatePosition(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Invalid position");
  }
  const truncated = Math.trunc(value);
  if (truncated < 1 || truncated > MAX_POSITION) throw new Error("Position out of bounds");
  return truncated;
}

export function validateLabelIds(labelIds: unknown): string[] {
  if (labelIds === undefined) return [];
  if (!Array.isArray(labelIds)) throw new Error("Invalid labelIds");
  if (labelIds.length > MAX_LABEL_IDS) throw new Error("Too many labels");
  const result: string[] = [];
  for (const v of labelIds) {
    if (typeof v !== "string") throw new Error("Invalid labelIds");
    const trimmed = v.trim();
    if (trimmed.length === 0) continue;
    if (trimmed.length > MAX_ID_LENGTH) throw new Error("Label id must be ≤ 64 characters");
    result.push(trimmed);
  }
  if (result.length > MAX_LABEL_IDS) throw new Error("Too many labels");
  return result;
}

export function validateSubtasks(subtasks: unknown): Subtask[] {
  if (subtasks === undefined) return [];
  if (!Array.isArray(subtasks)) throw new Error("Invalid subtasks");
  if (subtasks.length > MAX_SUBTASKS) throw new Error("Too many subtasks");
  return subtasks.map((s, idx) => {
    if (typeof s !== "object" || s === null) throw new Error("Invalid subtask");
    const r = s as Record<string, unknown>;
    if (typeof r.id !== "string" || typeof r.title !== "string") throw new Error("Invalid subtask");
    const id = r.id.trim();
    if (id.length === 0 || id.length > MAX_ID_LENGTH) throw new Error("Invalid subtask id");
    const titleTrimmed = r.title.trim();
    if (titleTrimmed.length === 0) throw new Error("Invalid subtask title");
    if (titleTrimmed.length > MAX_SUBTASK_TITLE_LENGTH) throw new Error("Subtask title must be ≤ 200 characters");
    return {
      id,
      title: titleTrimmed,
      completed: typeof r.completed === "boolean" ? r.completed : false,
      position: typeof r.position === "number" && Number.isFinite(r.position) ? Math.trunc(r.position) : idx + 1,
    };
  });
}
