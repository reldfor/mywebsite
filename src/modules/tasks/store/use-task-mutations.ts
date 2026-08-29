"use client";

import { useCallback } from "react";
import { GUEST_TASK_LIMIT, setGuestTasks } from "@/modules/tasks/domain/guest-storage";
import {
  createTask as serverCreateTask,
  deleteTask as serverDeleteTask,
  duplicateTask as serverDuplicateTask,
  reorderTasks as serverReorderTasks,
  toggleTask as serverToggleTask,
  updateTask as serverUpdateTask,
} from "@/modules/tasks/server/actions";
import type { AddTaskInput, Subtask, Task } from "@/modules/tasks/domain/types";

function nextPosition(tasks: Task[]): number {
  return tasks.reduce((max, task) => Math.max(max, task.position), 0) + 1;
}

function nextId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useTaskMutations({
  isPro,
  guestTasks,
  proTasks,
  setProTasks,
  setSelectedTaskId,
  showToast,
}: {
  isPro: boolean;
  guestTasks: Task[];
  proTasks: Task[];
  setProTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setSelectedTaskId: React.Dispatch<React.SetStateAction<string | null>>;
  showToast: (message: string, undo?: () => void) => void;
}) {
  const addTask = useCallback(
    async (input: AddTaskInput) => {
      if (isPro) {
        try {
          const created = await serverCreateTask(input);
          setProTasks((prev) => [...prev, created]);
          return created.id;
        } catch {
          showToast("Failed to create task");
          return "";
        }
      }
      if (guestTasks.length >= GUEST_TASK_LIMIT) return "";
      const id = nextId();
      const now = new Date().toISOString();
      const due = input.dueAt ?? null;
      const dateOnly = due ? due.slice(0, 10) : null;
      const subtasks: Subtask[] = (input.subtasks ?? [])
        .map((subtitle) => subtitle.trim())
        .filter((subtitle) => subtitle.length > 0)
        .map((subtitle, index) => ({
          id: nextId(),
          title: subtitle,
          completed: false,
          position: index + 1,
        }));
      setGuestTasks((current) => [
        ...current,
        {
          id,
          title: input.title.trim(),
          description: (input.description ?? "").trim(),
          status: "todo",
          priority: input.priority ?? "none",
          dueAt: due,
          completedAt: null,
          position: nextPosition(current),
          createdAt: now,
          updatedAt: now,
          labelIds: input.labelIds ?? [],
          subtasks,
          categoryId: input.categoryId ?? null,
          startDate: dateOnly,
          endDate: dateOnly,
        },
      ]);
      return id;
    },
    [isPro, guestTasks.length, showToast, setProTasks],
  );

  const updateTask = useCallback(
    async (id: string, patch: Partial<Task>) => {
      if (isPro) {
        try {
          const updated = await serverUpdateTask(id, patch);
          setProTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
        } catch {
          showToast("Failed to update task");
        }
        return;
      }
      setGuestTasks((current) =>
        current.map((task) =>
          task.id === id
            ? { ...task, ...patch, updatedAt: new Date().toISOString() }
            : task,
        ),
      );
    },
    [isPro, showToast, setProTasks],
  );

  const toggleTask = useCallback(
    async (id: string) => {
      if (isPro) {
        try {
          const updated = await serverToggleTask(id);
          setProTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
        } catch {
          showToast("Failed to update task");
        }
        return;
      }
      setGuestTasks((current) =>
        current.map((task) => {
          if (task.id !== id) return task;
          const completed = task.status === "completed";
          return {
            ...task,
            status: completed ? "todo" : "completed",
            completedAt: completed ? null : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }),
      );
    },
    [isPro, showToast, setProTasks],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (isPro) {
        const removed = proTasks.find((task) => task.id === id);
        setProTasks((prev) => prev.filter((task) => task.id !== id));
        setSelectedTaskId((selected) => (selected === id ? null : selected));
        try {
          await serverDeleteTask(id);
          if (removed) showToast("Task deleted");
        } catch {
          if (removed) setProTasks((prev) => [...prev, removed]);
          showToast("Failed to delete task");
        }
        return;
      }
      const removed = guestTasks.find((task) => task.id === id);
      setGuestTasks((current) => current.filter((task) => task.id !== id));
      if (removed) {
        showToast("Task deleted", () => {
          setGuestTasks((current) => [...current, removed]);
        });
      }
      setSelectedTaskId((selected) => (selected === id ? null : selected));
    },
    [isPro, proTasks, guestTasks, showToast, setProTasks, setSelectedTaskId],
  );

  const duplicateTask = useCallback(
    async (id: string) => {
      if (isPro) {
        try {
          const copy = await serverDuplicateTask(id);
          setProTasks((prev) => [...prev, copy]);
          showToast("Task duplicated");
        } catch {
          showToast("Failed to duplicate task");
        }
        return;
      }
      if (guestTasks.length >= GUEST_TASK_LIMIT) {
        showToast(`You've reached the ${GUEST_TASK_LIMIT}-task guest limit.`);
        return;
      }
      const source = guestTasks.find((task) => task.id === id);
      if (!source) return;
      const now = new Date().toISOString();
      const copy: Task = {
        ...source,
        id: nextId(),
        title: `${source.title} (copy)`,
        status: "todo",
        completedAt: null,
        position: nextPosition(guestTasks),
        createdAt: now,
        updatedAt: now,
        subtasks: source.subtasks.map((subtask) => ({
          ...subtask,
          id: nextId(),
        })),
      };
      setGuestTasks((current) => [...current, copy]);
      showToast("Task duplicated");
    },
    [isPro, guestTasks, showToast, setProTasks],
  );

  const archiveTask = useCallback(
    async (id: string) => {
      if (isPro) {
        try {
          const updated = await serverUpdateTask(id, { status: "archived" as Task["status"] });
          setProTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
          showToast("Task archived");
        } catch {
          showToast("Failed to archive task");
        }
        setSelectedTaskId((selected) => (selected === id ? null : selected));
        return;
      }
      const previous = guestTasks.find((task) => task.id === id);
      setGuestTasks((current) =>
        current.map((task) =>
          task.id === id
            ? {
                ...task,
                status: "archived",
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      );
      showToast("Task archived", () => {
        setGuestTasks((current) =>
          current.map((task) =>
            task.id === id && previous
              ? {
                  ...task,
                  status: previous.status,
                  updatedAt: new Date().toISOString(),
                }
              : task,
          ),
        );
      });
      setSelectedTaskId((selected) => (selected === id ? null : selected));
    },
    [isPro, guestTasks, showToast, setProTasks, setSelectedTaskId],
  );

  const restoreTask = useCallback(
    async (id: string) => {
      if (isPro) {
        try {
          const updated = await serverUpdateTask(id, { status: "todo" as Task["status"], completedAt: null });
          setProTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
        } catch {
          showToast("Failed to restore task");
        }
        return;
      }
      setGuestTasks((current) =>
        current.map((task) =>
          task.id === id
            ? {
                ...task,
                status: "todo",
                completedAt: null,
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      );
    },
    [isPro, showToast, setProTasks],
  );

  const reorderTasks = useCallback(
    async (orderedIds: string[]) => {
      if (isPro) {
        try {
          const reordered = await serverReorderTasks(orderedIds);
          setProTasks(reordered);
        } catch {
          showToast("Failed to reorder tasks");
        }
        return;
      }
      setGuestTasks((current) => {
        const map = new Map(current.map((t) => [t.id, t]));
        return orderedIds
          .map((id, index) => {
            const task = map.get(id);
            if (!task) return null;
            return { ...task, position: index + 1, updatedAt: new Date().toISOString() };
          })
          .filter((t): t is Task => t !== null);
      });
    },
    [isPro, showToast, setProTasks],
  );

  return {
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
    toggleTask,
    archiveTask,
    restoreTask,
    reorderTasks,
  };
}
