"use client";

import { useCallback } from "react";
import { setGuestTasks } from "@/modules/tasks/domain/guest-storage";
import { updateTask as serverUpdateTask } from "@/modules/tasks/server/actions";
import type { Task } from "@/modules/tasks/domain/types";

function nextId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useSubtaskMutations({
  isPro,
  proTasks,
  setProTasks,
  showToast,
}: {
  isPro: boolean;
  proTasks: Task[];
  setProTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  showToast: (message: string, undo?: () => void) => void;
}) {
  const addSubtask = useCallback(
    async (taskId: string, title: string) => {
      if (isPro) {
        const task = proTasks.find((t) => t.id === taskId);
        if (!task) return;
        const position =
          task.subtasks.reduce((max, subtask) => Math.max(max, subtask.position), 0) + 1;
        const nextSubtasks = [
          ...task.subtasks,
          { id: nextId(), title: title.trim(), completed: false, position },
        ];
        try {
          const updated = await serverUpdateTask(taskId, { subtasks: nextSubtasks });
          setProTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        } catch {
          showToast("Failed to add subtask");
        }
        return;
      }
      setGuestTasks((current) =>
        current.map((task) => {
          if (task.id !== taskId) return task;
          const position =
            task.subtasks.reduce(
              (max, subtask) => Math.max(max, subtask.position),
              0,
            ) + 1;
          return {
            ...task,
            updatedAt: new Date().toISOString(),
            subtasks: [
              ...task.subtasks,
              {
                id: nextId(),
                title: title.trim(),
                completed: false,
                position,
              },
            ],
          };
        }),
      );
    },
    [isPro, proTasks, showToast, setProTasks],
  );

  const toggleSubtask = useCallback(
    async (taskId: string, subtaskId: string) => {
      if (isPro) {
        const task = proTasks.find((t) => t.id === taskId);
        if (!task) return;
        const nextSubtasks = task.subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask,
        );
        try {
          const updated = await serverUpdateTask(taskId, { subtasks: nextSubtasks });
          setProTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        } catch {
          showToast("Failed to update subtask");
        }
        return;
      }
      setGuestTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? {
                ...task,
                updatedAt: new Date().toISOString(),
                subtasks: task.subtasks.map((subtask) =>
                  subtask.id === subtaskId
                    ? { ...subtask, completed: !subtask.completed }
                    : subtask,
                ),
              }
            : task,
        ),
      );
    },
    [isPro, proTasks, showToast, setProTasks],
  );

  const deleteSubtask = useCallback(
    async (taskId: string, subtaskId: string) => {
      if (isPro) {
        const task = proTasks.find((t) => t.id === taskId);
        if (!task) return;
        const nextSubtasks = task.subtasks.filter((subtask) => subtask.id !== subtaskId);
        try {
          const updated = await serverUpdateTask(taskId, { subtasks: nextSubtasks });
          setProTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        } catch {
          showToast("Failed to delete subtask");
        }
        return;
      }
      setGuestTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? {
                ...task,
                updatedAt: new Date().toISOString(),
                subtasks: task.subtasks.filter(
                  (subtask) => subtask.id !== subtaskId,
                ),
              }
            : task,
        ),
      );
    },
    [isPro, proTasks, showToast, setProTasks],
  );

  return {
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  };
}
