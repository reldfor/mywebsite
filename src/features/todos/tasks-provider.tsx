"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Category,
  Filters,
  Label,
  LabelTone,
  SortKey,
  Task,
} from "./types";
import { createSeedTasks, seedCategories, seedLabels } from "./seed";

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
  addTaskInputRef: React.RefObject<HTMLInputElement | null>;
  addTask: (title: string, date?: string | null) => string;
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
  assignLabel: (taskId: string, labelId: string) => void;
  unassignLabel: (taskId: string, labelId: string) => void;
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
  const [tasks, setTasks] = useState<Task[]>(() => createSeedTasks());
  const [labels, setLabels] = useState<Label[]>(seedLabels);
  const [categories] = useState<Category[]>(seedCategories);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortKey>("manual");
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | null>(null);
  const addTaskInputRef = useRef<HTMLInputElement | null>(null);

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

  const addTask = useCallback((title: string, date?: string | null) => {
    const id = nextId();
    const now = new Date().toISOString();
    const due = date ?? null;
    setTasks((current) => [
      ...current,
      {
        id,
        title: title.trim(),
        description: "",
        status: "todo",
        priority: "none",
        dueAt: due,
        completedAt: null,
        position: nextPosition(current),
        createdAt: now,
        updatedAt: now,
        labelIds: [],
        subtasks: [],
        categoryId: null,
        startDate: due,
        endDate: due,
      },
    ]);
    return id;
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, ...patch, updatedAt: new Date().toISOString() }
          : task,
      ),
    );
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((current) =>
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
      setTasks((current) => current.filter((task) => task.id !== id));
      if (removed) {
        showToast("Task deleted", () => {
          setTasks((current) => [...current, removed]);
        });
      }
      setSelectedTaskId((selected) => (selected === id ? null : selected));
    },
    [tasks, showToast],
  );

  const duplicateTask = useCallback(
    (id: string) => {
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
      setTasks((current) => [...current, copy]);
      showToast("Task duplicated");
    },
    [tasks, showToast],
  );

  const archiveTask = useCallback((id: string) => {
    setTasks((current) =>
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
      setTasks((current) =>
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
    setTasks((current) =>
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
    setTasks((current) =>
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
    setTasks((current) =>
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
    setTasks((current) =>
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
    setLabels((current) => [
      ...current,
      { id, name: name.trim(), tone },
    ]);
    return id;
  }, []);

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
      assignLabel,
      unassignLabel,
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
      assignLabel,
      unassignLabel,
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
