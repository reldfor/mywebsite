"use client";

import { useCallback } from "react";
import {
  saveGuestCategories,
  saveGuestLabels,
  setGuestTasks,
} from "@/modules/tasks/domain/guest-storage";
import { updateTask as serverUpdateTask } from "@/modules/tasks/server/actions";
import type {
  Category,
  CategoryColor,
  CategoryIcon,
  Filters,
  Label,
  LabelTone,
  Task,
} from "@/modules/tasks/domain/types";

function nextId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useLabelCategoryMutations({
  isPro,
  tasks,
  proTasks,
  labels,
  categories,
  setLabels,
  setCategories,
  setFilters,
  showToast,
  updateTask,
  setProTasks,
}: {
  isPro: boolean;
  tasks: Task[];
  proTasks: Task[];
  labels: Label[];
  categories: Category[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  showToast: (message: string, undo?: () => void) => void;
  updateTask: (id: string, patch: Partial<Task>) => void | Promise<void>;
  setProTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const addLabel = useCallback(
    (name: string, tone: LabelTone) => {
      const id = nextId();
      setLabels((current) => {
        const next = [...current, { id, name: name.trim(), tone }];
        saveGuestLabels(next);
        return next;
      });
      return id;
    },
    [setLabels],
  );

  const updateLabel = useCallback(
    (id: string, patch: Partial<Pick<Label, "name" | "tone">>) => {
      setLabels((current) => {
        const next = current.map((label) =>
          label.id === id
            ? {
                ...label,
                name: patch.name !== undefined ? patch.name.trim() : label.name,
                tone: patch.tone ?? label.tone,
              }
            : label,
        );
        saveGuestLabels(next);
        return next;
      });
    },
    [setLabels],
  );

  const deleteLabel = useCallback(
    (id: string) => {
      const removed = labels.find((label) => label.id === id);
      if (!removed) return;
      const affectedTaskIds = new Set(
        tasks
          .filter((task) => task.labelIds.includes(id))
          .map((task) => task.id),
      );
      setLabels((current) => {
        const next = current.filter((label) => label.id !== id);
        saveGuestLabels(next);
        return next;
      });
      if (isPro) {
        for (const taskId of affectedTaskIds) {
          const task = proTasks.find((t) => t.id === taskId);
          if (!task) continue;
          const nextLabelIds = task.labelIds.filter((labelId) => labelId !== id);
          serverUpdateTask(taskId, { labelIds: nextLabelIds })
            .then((updated) => {
              setProTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
            })
            .catch(() => {});
        }
      } else {
        setGuestTasks((current) =>
          current.map((task) =>
            task.labelIds.includes(id)
              ? {
                  ...task,
                  labelIds: task.labelIds.filter((labelId) => labelId !== id),
                  updatedAt: new Date().toISOString(),
                }
              : task,
          ),
        );
      }
      setFilters((current) =>
        current.labelIds.includes(id)
          ? {
              ...current,
              labelIds: current.labelIds.filter((labelId) => labelId !== id),
            }
          : current,
      );
      showToast("Label deleted", () => {
        setLabels((current) => {
          if (current.some((label) => label.id === id)) return current;
          const next = [...current, removed];
          saveGuestLabels(next);
          return next;
        });
        if (isPro) {
          for (const taskId of affectedTaskIds) {
            const task = proTasks.find((t) => t.id === taskId);
            if (!task || task.labelIds.includes(id)) continue;
            const nextLabelIds = [...task.labelIds, id];
            serverUpdateTask(taskId, { labelIds: nextLabelIds })
              .then((updated) => {
                setProTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
              })
              .catch(() => {});
          }
        } else {
          setGuestTasks((current) =>
            current.map((task) =>
              affectedTaskIds.has(task.id)
                ? {
                    ...task,
                    labelIds: [...task.labelIds, id],
                    updatedAt: new Date().toISOString(),
                  }
                : task,
            ),
          );
        }
        setFilters((current) =>
          current.labelIds.includes(id)
            ? current
            : { ...current, labelIds: [...current.labelIds, id] },
        );
      });
    },
    [labels, tasks, proTasks, isPro, showToast, setLabels, setFilters, setProTasks],
  );

  const assignLabel = useCallback(
    async (taskId: string, labelId: string) => {
      if (isPro) {
        const task = proTasks.find((t) => t.id === taskId);
        if (!task || task.labelIds.includes(labelId)) return;
        const nextLabelIds = [...task.labelIds, labelId];
        try {
          const updated = await serverUpdateTask(taskId, { labelIds: nextLabelIds });
          setProTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        } catch {
          showToast("Failed to assign label");
        }
        return;
      }
      updateTask(taskId, {
        labelIds: [
          ...(tasks.find((task) => task.id === taskId)?.labelIds ?? []),
          labelId,
        ],
      });
    },
    [isPro, proTasks, tasks, showToast, updateTask, setProTasks],
  );

  const unassignLabel = useCallback(
    async (taskId: string, labelId: string) => {
      if (isPro) {
        const task = proTasks.find((t) => t.id === taskId);
        if (!task || !task.labelIds.includes(labelId)) return;
        const nextLabelIds = task.labelIds.filter((id) => id !== labelId);
        try {
          const updated = await serverUpdateTask(taskId, { labelIds: nextLabelIds });
          setProTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        } catch {
          showToast("Failed to unassign label");
        }
        return;
      }
      updateTask(taskId, {
        labelIds: (tasks.find((task) => task.id === taskId)?.labelIds ?? []).filter(
          (id) => id !== labelId,
        ),
      });
    },
    [isPro, proTasks, tasks, showToast, updateTask, setProTasks],
  );

  const addCategory = useCallback(
    (name: string, icon: CategoryIcon, color: CategoryColor) => {
      const category: Category = {
        id: nextId(),
        name: name.trim(),
        icon,
        color,
      };
      setCategories((current) => {
        const next = [...current, category];
        saveGuestCategories(next);
        return next;
      });
      return category.id;
    },
    [setCategories],
  );

  const deleteCategory = useCallback(
    (id: string) => {
      const removed = categories.find((category) => category.id === id);
      if (!removed) return;
      const affectedTaskIds = new Set(
        tasks.filter((task) => task.categoryId === id).map((task) => task.id),
      );
      setCategories((current) => {
        const next = current.filter((category) => category.id !== id);
        saveGuestCategories(next);
        return next;
      });
      if (isPro) {
        for (const taskId of affectedTaskIds) {
          serverUpdateTask(taskId, { categoryId: null })
            .then((updated) => {
              setProTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
            })
            .catch(() => {});
        }
      } else {
        setGuestTasks((current) =>
          current.map((task) =>
            task.categoryId === id
              ? { ...task, categoryId: null, updatedAt: new Date().toISOString() }
              : task,
          ),
        );
      }
      showToast("Category deleted", () => {
        setCategories((current) => {
          if (current.some((category) => category.id === id)) return current;
          const next = [...current, removed];
          saveGuestCategories(next);
          return next;
        });
        if (isPro) {
          for (const taskId of affectedTaskIds) {
            serverUpdateTask(taskId, { categoryId: id })
              .then((updated) => {
                setProTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
              })
              .catch(() => {});
          }
        } else {
          setGuestTasks((current) =>
            current.map((task) =>
              affectedTaskIds.has(task.id)
                ? { ...task, categoryId: id, updatedAt: new Date().toISOString() }
                : task,
            ),
          );
        }
      });
    },
    [categories, tasks, isPro, showToast, setCategories, setProTasks],
  );

  return {
    addLabel,
    updateLabel,
    deleteLabel,
    assignLabel,
    unassignLabel,
    addCategory,
    deleteCategory,
  };
}
