import { describe, expect, it } from "vitest";
import { GUEST_TASK_LIMIT } from "./guest-storage";
import { createSeedTasks, seedLabels } from "./seed";
import { daysUntil, todayISO } from "@/modules/tasks/domain/date";

const validStatuses = ["todo", "in_progress", "completed", "archived"] as const;
const validPriorities = ["none", "low", "medium", "high", "urgent"] as const;

describe("createSeedTasks", () => {
  const tasks = createSeedTasks();

  it("stays within the guest task limit", () => {
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.length).toBeLessThanOrEqual(GUEST_TASK_LIMIT);
  });

  it("assigns unique ids and sequential positions", () => {
    expect(new Set(tasks.map((task) => task.id)).size).toBe(tasks.length);
    expect(tasks.map((task) => task.position)).toEqual(
      tasks.map((_, index) => index + 1),
    );
  });

  it("uses valid statuses and priorities", () => {
    for (const task of tasks) {
      expect(validStatuses).toContain(task.status);
      expect(validPriorities).toContain(task.priority);
      expect(task.title.length).toBeGreaterThan(0);
    }
  });

  it("only references seeded labels", () => {
    const labelIds = new Set(seedLabels.map((label) => label.id));
    for (const task of tasks) {
      for (const labelId of task.labelIds) {
        expect(labelIds.has(labelId)).toBe(true);
      }
    }
  });

  it("gives subtasks unique ids and sequential positions", () => {
    for (const task of tasks) {
      expect(new Set(task.subtasks.map((s) => s.id)).size).toBe(
        task.subtasks.length,
      );
      expect(task.subtasks.map((s) => s.position)).toEqual(
        task.subtasks.map((_, index) => index + 1),
      );
    }
  });

  it("includes one task due today and one due in three days", () => {
    expect(tasks.some((task) => task.dueAt === todayISO())).toBe(true);
    expect(
      tasks.some((task) => task.dueAt !== null && daysUntil(task.dueAt) === 3),
    ).toBe(true);
  });
});
