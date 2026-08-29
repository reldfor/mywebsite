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
  Task,
} from "@/modules/tasks/domain/types";
import {
  GUEST_TASK_LIMIT,
  getGuestTasksServerSnapshot,
  getGuestTasksSnapshot,
  loadGuestCategories,
  loadGuestLabels,
  subscribeGuestTasks,
} from "@/modules/tasks/domain/guest-storage";
import { seedLabels } from "@/modules/tasks/domain/seed";
import { getTasks as serverGetTasks } from "@/modules/tasks/server/actions";
import { useTaskMutations } from "./use-task-mutations";
import { useSubtaskMutations } from "./use-subtask-mutations";
import { useLabelCategoryMutations } from "./use-label-category-mutations";

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

  const {
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
    toggleTask,
    archiveTask,
    restoreTask,
    reorderTasks,
  } = useTaskMutations({
    isPro,
    guestTasks,
    proTasks,
    setProTasks,
    setSelectedTaskId,
    showToast,
  });

  const { addSubtask, toggleSubtask, deleteSubtask } = useSubtaskMutations({
    isPro,
    proTasks,
    setProTasks,
    showToast,
  });

  const {
    addLabel,
    updateLabel,
    deleteLabel,
    assignLabel,
    unassignLabel,
    addCategory,
    deleteCategory,
  } = useLabelCategoryMutations({
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
  });

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
