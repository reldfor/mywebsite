"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import type {
  AddTaskInput,
  Category,
  CategoryColor,
  CategoryIcon,
  Filters,
  Label,
  LabelTone,
  SortKey,
  Subtask,
  Task,
} from "./types";
import {
  GUEST_TASK_LIMIT,
  getGuestTasksServerSnapshot,
  getGuestTasksSnapshot,
  loadGuestCategories,
  loadGuestLabels,
  saveGuestCategories,
  saveGuestLabels,
  setGuestTasks,
  subscribeGuestTasks,
} from "./guest-storage";
import { seedLabels } from "./seed";
import {
  createTask as serverCreateTask,
  deleteTask as serverDeleteTask,
  duplicateTask as serverDuplicateTask,
  getTasks as serverGetTasks,
  reorderTasks as serverReorderTasks,
  toggleTask as serverToggleTask,
  updateTask as serverUpdateTask,
} from "./actions";

type Toast = {
  id: number;
  message: string;
  undo?: () => void;
};

type TasksContextValue = {
  tasks: Task[];
  labels: Label[];
  categories: Category[];
  selectedTaskId: string | null;
  searchQuery: string;
  searchOpen: boolean;
  filters: Filters;
  sort: SortKey;
  toast: Toast | null;
  addTaskInputRef: React.RefObject<HTMLElement | null>;
  addTask: (input: AddTaskInput) => string | Promise<string>;
  taskLimit: number;
  isPro: boolean;
  isLoaded: boolean;
  toggleTask: (id: string) => void | Promise<void>;
  updateTask: (id: string, patch: Partial<Task>) => void | Promise<void>;
  deleteTask: (id: string) => void | Promise<void>;
  duplicateTask: (id: string) => void | Promise<void>;
  archiveTask: (id: string) => void | Promise<void>;
  restoreTask: (id: string) => void | Promise<void>;
  reorderTasks: (orderedIds: string[]) => void | Promise<void>;
  addSubtask: (taskId: string, title: string) => void | Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => void | Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => void | Promise<void>;
  addLabel: (name: string, tone: LabelTone) => string;
  updateLabel: (id: string, patch: Partial<Pick<Label, "name" | "tone">>) => void;
  deleteLabel: (id: string) => void;
  assignLabel: (taskId: string, labelId: string) => void | Promise<void>;
  unassignLabel: (taskId: string, labelId: string) => void | Promise<void>;
  addCategory: (name: string, icon: CategoryIcon, color: CategoryColor) => string;
  deleteCategory: (id: string) => void;
  setSelectedTaskId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSearchOpen: (open: boolean) => void;
  setFilters: (filters: Filters) => void;
  setSort: (sort: SortKey) => void;
  showToast: (message: string, undo?: () => void) => void;
  dismissToast: () => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

const defaultFilters: Filters = {
  statuses: [],
  priorities: [],
  due: "all",
  labelIds: [],
};

function nextPosition(tasks: Task[]): number {
  return tasks.reduce((max, task) => Math.max(max, task.position), 0) + 1;
}

function nextId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const isPro = isLoaded && !!isSignedIn;

  const guestTasks = useSyncExternalStore(
    subscribeGuestTasks,
    getGuestTasksSnapshot,
    getGuestTasksServerSnapshot,
  );
  const [proTasks, setProTasks] = useState<Task[]>([]);
  const [proLoaded, setProLoaded] = useState(false);

  const [labels, setLabels] = useState<Label[]>(
    () => loadGuestLabels() ?? seedLabels,
  );
  const [categories, setCategories] = useState<Category[]>(
    () => loadGuestCategories() ?? [],
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortKey>("manual");
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | null>(null);
  const addTaskInputRef = useRef<HTMLElement | null>(null);

  const tasks = isPro ? proTasks : guestTasks;
  const taskLimit = isPro ? Number.POSITIVE_INFINITY : GUEST_TASK_LIMIT;

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!isPro) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset Pro cache when switching to guest
      setProLoaded(false);
      return;
    }
    let cancelled = false;
    setProLoaded(false);
    serverGetTasks()
      .then((fetched) => {
        if (!cancelled) {
          setProTasks(fetched);
          setProLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setProLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isPro]);

  const showToast = useCallback((message: string, undo?: () => void) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, undo });
    toastTimer.current = window.setTimeout(() => setToast(null), 4200);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

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
    [isPro, guestTasks.length, showToast],
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
    [isPro, showToast],
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
    [isPro, showToast],
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
    [isPro, proTasks, guestTasks, showToast],
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
    [isPro, guestTasks, showToast],
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
    [isPro, guestTasks, showToast],
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
    [isPro, showToast],
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
    [isPro, showToast],
  );

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
    [isPro, proTasks, showToast],
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
    [isPro, proTasks, showToast],
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
    [isPro, proTasks, showToast],
  );

  const addLabel = useCallback((name: string, tone: LabelTone) => {
    const id = nextId();
    setLabels((current) => {
      const next = [...current, { id, name: name.trim(), tone }];
      saveGuestLabels(next);
      return next;
    });
    return id;
  }, []);

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
    [],
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
    [labels, tasks, proTasks, isPro, showToast],
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
    [isPro, proTasks, tasks, showToast, updateTask],
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
    [isPro, proTasks, tasks, showToast, updateTask],
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
    [],
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
    [categories, tasks, isPro, showToast],
  );

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      labels,
      categories,
      selectedTaskId,
      searchQuery,
      searchOpen,
      filters,
      sort,
      toast,
      addTaskInputRef,
      addTask,
      taskLimit,
      isPro,
      isLoaded: isPro ? proLoaded : isLoaded,
      toggleTask,
      updateTask,
      deleteTask,
      duplicateTask,
      archiveTask,
      restoreTask,
      reorderTasks,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      addLabel,
      updateLabel,
      deleteLabel,
      assignLabel,
      unassignLabel,
      addCategory,
      deleteCategory,
      setSelectedTaskId,
      setSearchQuery,
      setSearchOpen,
      setFilters,
      setSort,
      showToast,
      dismissToast,
    }),
    [
      tasks,
      labels,
      categories,
      selectedTaskId,
      searchQuery,
      searchOpen,
      filters,
      sort,
      toast,
      addTask,
      taskLimit,
      isPro,
      proLoaded,
      isLoaded,
      toggleTask,
      updateTask,
      deleteTask,
      duplicateTask,
      archiveTask,
      restoreTask,
      reorderTasks,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      addLabel,
      updateLabel,
      deleteLabel,
      assignLabel,
      unassignLabel,
      addCategory,
      deleteCategory,
      setSearchQuery,
      setSearchOpen,
      setFilters,
      setSort,
      showToast,
      dismissToast,
    ],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within TasksProvider");
  }
  return context;
}
