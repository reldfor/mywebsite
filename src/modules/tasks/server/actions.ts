"use server";

import "server-only";

import { auth } from "@clerk/nextjs/server";
import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import type { TaskRow } from "@/db/schema";
import type { AddTaskInput, Subtask, Task } from "@/modules/tasks/domain/types";
import { checkRateLimit } from "./rate-limit";
import {
  MAX_LABEL_IDS,
  MAX_ORDERED_IDS,
  MAX_POSITION,
  MAX_SUBTASKS,
  MAX_SUBTASK_TITLE_LENGTH,
  MAX_TASKS_QUERY_LIMIT,
  MAX_TITLE_LENGTH,
  validateCategoryId,
  validateDescription,
  validateDueAt,
  validateId,
  validateIsoNullable,
  validateLabelIds,
  validatePosition,
  validatePriority,
  validateStatus,
  validateSubtasks,
  validateTitle,
} from "./validation";

function requireUserIdSync(userId: string | null): string {
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  return requireUserIdSync(userId);
}

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueAt: row.dueAt ?? null,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    position: row.position,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    labelIds: row.labelIds ?? [],
    subtasks: row.subtasks ?? [],
    categoryId: row.categoryId ?? null,
    startDate: row.startDate ?? null,
    endDate: row.endDate ?? null,
  };
}

function nextId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getTasks(): Promise<Task[]> {
  const userId = await requireUserId();
  const rows = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(asc(tasks.position))
    .limit(MAX_TASKS_QUERY_LIMIT);
  return rows.map(toTask);
}

export async function createTask(input: AddTaskInput): Promise<Task> {
  const userId = await requireUserId();
  checkRateLimit(userId);
  const title = validateTitle(input.title);
  const description = input.description !== undefined ? validateDescription(input.description) : "";
  const priority = input.priority ? validatePriority(input.priority) : "none";
  const dueAt = validateDueAt(input.dueAt ?? null);
  const labelIds = validateLabelIds(input.labelIds);
  const categoryId = validateCategoryId(input.categoryId ?? null);
  const dateOnly = dueAt ? dueAt.slice(0, 10) : null;

  const subtaskTitles = Array.isArray(input.subtasks) ? input.subtasks : [];
  if (subtaskTitles.length > MAX_SUBTASKS) throw new Error("Too many subtasks");
  const subtasks: Subtask[] = subtaskTitles
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter((t) => t.length > 0)
    .map((t) => {
      if (t.length > MAX_SUBTASK_TITLE_LENGTH) throw new Error("Subtask title must be ≤ 200 characters");
      return t;
    })
    .map((title, index) => ({
      id: nextId(),
      title,
      completed: false,
      position: index + 1,
    }));

  const id = nextId();
  const now = new Date();

  const existing = await db.select().from(tasks).where(eq(tasks.userId, userId)).limit(MAX_TASKS_QUERY_LIMIT);
  const position = existing.reduce((max, row) => Math.max(max, row.position), 0) + 1;
  if (position < 1 || position > MAX_POSITION) throw new Error("Position out of bounds");
  const [row] = await db
    .insert(tasks)
    .values({
      id,
      userId,
      title,
      description,
      status: "todo",
      priority,
      dueAt,
      completedAt: null,
      position,
      createdAt: now,
      updatedAt: now,
      labelIds,
      subtasks,
      categoryId,
      startDate: dateOnly,
      endDate: dateOnly,
    })
    .returning();

  return toTask(row);
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<Task> {
  const userId = await requireUserId();
  checkRateLimit(userId);
  const validatedId = validateId(id);

  const updates: Partial<TaskRow> & { updatedAt: Date } = { updatedAt: new Date() } as never;

  if (patch.title !== undefined) updates.title = validateTitle(patch.title);
  if (patch.description !== undefined) {
    updates.description = validateDescription(patch.description);
  }
  if (patch.status !== undefined) updates.status = validateStatus(patch.status);
  if (patch.priority !== undefined) updates.priority = validatePriority(patch.priority);
  if (patch.dueAt !== undefined) {
    updates.dueAt = validateDueAt(patch.dueAt);
    const dateOnly = updates.dueAt ? updates.dueAt.slice(0, 10) : null;
    (updates as Record<string, unknown>).startDate = dateOnly;
    (updates as Record<string, unknown>).endDate = dateOnly;
  }
  if (patch.completedAt !== undefined) {
    const iso = validateIsoNullable(patch.completedAt);
    (updates as Record<string, unknown>).completedAt = iso ? new Date(iso) : null;
  }
  if (patch.position !== undefined) {
    (updates as Record<string, unknown>).position = validatePosition(patch.position);
  }
  if (patch.labelIds !== undefined) updates.labelIds = validateLabelIds(patch.labelIds);
  if (patch.subtasks !== undefined) updates.subtasks = validateSubtasks(patch.subtasks);
  if (patch.categoryId !== undefined) {
    updates.categoryId = validateCategoryId(patch.categoryId);
  }
  if (patch.startDate !== undefined) {
    (updates as Record<string, unknown>).startDate = validateDueAt(patch.startDate);
  }
  if (patch.endDate !== undefined) {
    (updates as Record<string, unknown>).endDate = validateDueAt(patch.endDate);
  }

  const [row] = await db
    .update(tasks)
    .set(updates)
    .where(and(eq(tasks.id, validatedId), eq(tasks.userId, userId)))
    .returning();

  if (!row) throw new Error("Task not found");
  return toTask(row);
}

export async function deleteTask(id: string): Promise<void> {
  const userId = await requireUserId();
  checkRateLimit(userId);
  const validatedId = validateId(id);
  const [deleted] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, validatedId), eq(tasks.userId, userId)))
    .returning({ id: tasks.id });
  if (!deleted) throw new Error("Task not found");
}

export async function reorderTasks(orderedIds: string[]): Promise<Task[]> {
  const userId = await requireUserId();
  checkRateLimit(userId);
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) throw new Error("Invalid orderedIds");
  if (orderedIds.length > MAX_ORDERED_IDS) throw new Error("Too many ids");
  if (new Set(orderedIds).size !== orderedIds.length) throw new Error("Duplicate ids in orderedIds");
  for (const oid of orderedIds) {
    validateId(oid);
  }

  const rows = await db.select().from(tasks).where(eq(tasks.userId, userId)).limit(MAX_TASKS_QUERY_LIMIT);
  const existingIds = new Set(rows.map((r) => r.id));
  for (const oid of orderedIds) {
    if (!existingIds.has(oid)) throw new Error("Task not found in orderedIds");
  }

  for (let i = 0; i < orderedIds.length; i++) {
    const taskId = orderedIds[i];
    const position = i + 1;
    await db
      .update(tasks)
      .set({ position, updatedAt: new Date() })
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  }

  const updated = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(asc(tasks.position))
    .limit(MAX_TASKS_QUERY_LIMIT);
  return updated.map(toTask);
}

export async function toggleTask(id: string): Promise<Task> {
  const userId = await requireUserId();
  checkRateLimit(userId);
  const validatedId = validateId(id);
  const [row] = await db.select().from(tasks).where(and(eq(tasks.id, validatedId), eq(tasks.userId, userId))).limit(1);
  if (!row) throw new Error("Task not found");
  const isCompleted = row.status === "completed";
  const [updated] = await db
    .update(tasks)
    .set({
      status: isCompleted ? "todo" : "completed",
      completedAt: isCompleted ? null : new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, validatedId), eq(tasks.userId, userId)))
    .returning();
  if (!updated) throw new Error("Task not found");
  return toTask(updated);
}

export async function duplicateTask(id: string): Promise<Task> {
  const userId = await requireUserId();
  checkRateLimit(userId);
  const validatedId = validateId(id);
  const [source] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, validatedId), eq(tasks.userId, userId)))
    .limit(1);
  if (!source) throw new Error("Task not found");

  const rows = await db.select().from(tasks).where(eq(tasks.userId, userId)).limit(MAX_TASKS_QUERY_LIMIT);
  const position = rows.reduce((max, r) => Math.max(max, r.position), 0) + 1;
  if (position < 1 || position > MAX_POSITION) throw new Error("Position out of bounds");
  const now = new Date();
  const newId = nextId();
  const copyTitle = `${source.title} (copy)`.slice(0, MAX_TITLE_LENGTH);

  const [copy] = await db
    .insert(tasks)
    .values({
      id: newId,
      userId,
      title: copyTitle,
      description: source.description,
      status: "todo",
      priority: source.priority,
      dueAt: source.dueAt,
      completedAt: null,
      position,
      createdAt: now,
      updatedAt: now,
      labelIds: (source.labelIds ?? []).slice(0, MAX_LABEL_IDS),
      subtasks: (source.subtasks ?? []).slice(0, MAX_SUBTASKS).map((s) => ({ ...s, id: nextId() })),
      categoryId: source.categoryId,
      startDate: source.startDate,
      endDate: source.endDate,
    })
    .returning();

  return toTask(copy);
}
