import { index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { Priority, Subtask, TaskStatus } from "@/modules/tasks/domain/types";

export const tasks = pgTable(
  "tasks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    status: text("status").$type<TaskStatus>().notNull().default("todo"),
    priority: text("priority").$type<Priority>().notNull().default("none"),
    dueAt: text("due_at"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    position: integer("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    labelIds: jsonb("label_ids").$type<string[]>().notNull().default([]),
    subtasks: jsonb("subtasks").$type<Subtask[]>().notNull().default([]),
    categoryId: text("category_id"),
    startDate: text("start_date"),
    endDate: text("end_date"),
  },
  (table) => [
    index("tasks_user_id_idx").on(table.userId),
    index("tasks_user_position_idx").on(table.userId, table.position),
    index("tasks_user_status_idx").on(table.userId, table.status),
  ],
);

export type TaskRow = typeof tasks.$inferSelect;
export type NewTaskRow = typeof tasks.$inferInsert;
