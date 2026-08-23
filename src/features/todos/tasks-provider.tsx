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
  addTask: (input: AddTaskInput) => string;
  taskLimit: number;
  toggleTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  archiveTask: (id: string) => void;
  restoreTask: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  addLabel: (name: string, tone: LabelTone) => string;
  updateLabel: (id: string, patch: Partial<Pick<Label, "name" | "tone">>) => void;
  deleteLabel: (id: string) => void;
  assignLabel: (taskId: string, labelId: string) => void;
  unassignLabel: (taskId: string, labelId: string) => void;
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
  const tasks = useSyncExternalStore(
    subscribeGuestTasks,
    getGuestTasksSnapshot,
    getGuestTasksServerSnapshot,
  );
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

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((message: string, undo?: () => void) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, undo });
    toastTimer.current = window.setTimeout(() => setToast(null), 4200);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const addTask = useCallback((input: AddTaskInput) => {
    if (tasks.length >= GUEST_TASK_LIMIT) return "";
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
  }, [tasks]);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setGuestTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, ...patch, updatedAt: new Date().toISOString() }
          : task,
      ),
    );
  }, []);

  const toggleTask = useCallback((id: string) => {
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
  }, []);

  const deleteTask = useCallback(
    (id: string) => {
      const removed = tasks.find((task) => task.id === id);
      setGuestTasks((current) => current.filter((task) => task.id !== id));
      if (removed) {
        showToast("Task deleted", () => {
          setGuestTasks((current) => [...current, removed]);
        });
      }
      setSelectedTaskId((selected) => (selected === id ? null : selected));
    },
    [tasks, showToast],
  );

  const duplicateTask = useCallback(
    (id: string) => {
      if (tasks.length >= GUEST_TASK_LIMIT) {
        showToast(`You've reached the ${GUEST_TASK_LIMIT}-task guest limit.`);
        return;
      }
      const source = tasks.find((task) => task.id === id);
      if (!source) return;
      const now = new Date().toISOString();
      const copy: Task = {
        ...source,
        id: nextId(),
        title: `${source.title} (copy)`,
        status: "todo",
        completedAt: null,
        position: nextPosition(tasks),
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
    [tasks, showToast],
  );

  const archiveTask = useCallback((id: string) => {
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
          task.id === id
            ? { ...task, status: "todo", updatedAt: new Date().toISOString() }
            : task,
        ),
      );
    });
    setSelectedTaskId((selected) => (selected === id ? null : selected));
  }, [showToast]);

  const restoreTask = useCallback((id: string) => {
    setGuestTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "todo",
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  }, []);

  const addSubtask = useCallback((taskId: string, title: string) => {
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
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
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
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
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
  }, []);

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
        setFilters((current) =>
          current.labelIds.includes(id)
            ? current
            : { ...current, labelIds: [...current.labelIds, id] },
        );
      });
    },
    [labels, tasks, showToast],
  );

  const assignLabel = useCallback((taskId: string, labelId: string) => {
    updateTask(taskId, {
      labelIds: [
        ...(tasks.find((task) => task.id === taskId)?.labelIds ?? []),
        labelId,
      ],
    });
  }, [tasks, updateTask]);

  const unassignLabel = useCallback(
    (taskId: string, labelId: string) => {
      updateTask(taskId, {
        labelIds: (tasks.find((task) => task.id === taskId)?.labelIds ?? []).filter(
          (id) => id !== labelId,
        ),
      });
    },
    [tasks, updateTask],
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
      setGuestTasks((current) =>
        current.map((task) =>
          task.categoryId === id
            ? { ...task, categoryId: null, updatedAt: new Date().toISOString() }
            : task,
        ),
      );
      showToast("Category deleted", () => {
        setCategories((current) => {
          if (current.some((category) => category.id === id)) return current;
          const next = [...current, removed];
          saveGuestCategories(next);
          return next;
        });
        setGuestTasks((current) =>
          current.map((task) =>
            affectedTaskIds.has(task.id)
              ? { ...task, categoryId: id, updatedAt: new Date().toISOString() }
              : task,
          ),
        );
      });
    },
    [categories, tasks, showToast],
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
      taskLimit: GUEST_TASK_LIMIT,
      toggleTask,
      updateTask,
      deleteTask,
      duplicateTask,
      archiveTask,
      restoreTask,
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
      toggleTask,
      updateTask,
      deleteTask,
      duplicateTask,
      archiveTask,
      restoreTask,
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
