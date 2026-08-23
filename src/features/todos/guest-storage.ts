import type {
  Category,
  CategoryColor,
  CategoryIcon,
  Label,
  LabelTone,
  Priority,
  Subtask,
  Task,
  TaskStatus,
} from "./types";

export const GUEST_TASKS_KEY = "todo-app:guest-tasks";

export const GUEST_CATEGORIES_KEY = "todo-app:guest-categories";

export const GUEST_LABELS_KEY = "todo-app:guest-labels";

export const GUEST_TASK_LIMIT = 10;

export type GuestTaskStorage = Pick<Storage, "getItem" | "setItem">;

const validStatuses: TaskStatus[] = [
  "todo",
  "in_progress",
  "completed",
  "archived",
];

const validPriorities: Priority[] = ["none", "low", "medium", "high", "urgent"];

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStringOrNull(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function sanitizeSubtask(value: unknown): Subtask | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  if (!isString(record.id) || !isString(record.title)) return null;
  return {
    id: record.id,
    title: record.title,
    completed: typeof record.completed === "boolean" ? record.completed : false,
    position: typeof record.position === "number" ? record.position : 0,
  };
}

function sanitizeTask(value: unknown): Task | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  if (!isString(record.id) || !isString(record.title)) return null;
  const now = new Date().toISOString();
  const status = validStatuses.includes(record.status as TaskStatus)
    ? (record.status as TaskStatus)
    : "todo";
  const priority = validPriorities.includes(record.priority as Priority)
    ? (record.priority as Priority)
    : "none";
  return {
    id: record.id,
    title: record.title,
    description: isString(record.description) ? record.description : "",
    status,
    priority,
    dueAt: isStringOrNull(record.dueAt) ? record.dueAt : null,
    completedAt: isStringOrNull(record.completedAt) ? record.completedAt : null,
    position: typeof record.position === "number" ? record.position : 0,
    createdAt: isString(record.createdAt) ? record.createdAt : now,
    updatedAt: isString(record.updatedAt) ? record.updatedAt : now,
    labelIds: Array.isArray(record.labelIds)
      ? record.labelIds.filter(isString)
      : [],
    subtasks: Array.isArray(record.subtasks)
      ? record.subtasks
          .map(sanitizeSubtask)
          .filter((subtask): subtask is Subtask => subtask !== null)
      : [],
    categoryId: isStringOrNull(record.categoryId) ? record.categoryId : null,
    startDate: isStringOrNull(record.startDate) ? record.startDate : null,
    endDate: isStringOrNull(record.endDate) ? record.endDate : null,
  };
}

function browserStorage(): GuestTaskStorage | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadGuestTasks(
  storage?: GuestTaskStorage | null,
): Task[] {
  const store = storage ?? browserStorage();
  if (!store) return [];
  try {
    const raw = store.getItem(GUEST_TASKS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(sanitizeTask)
      .filter((task): task is Task => task !== null);
  } catch {
    return [];
  }
}

export function saveGuestTasks(
  tasks: Task[],
  storage?: GuestTaskStorage | null,
): void {
  const store = storage ?? browserStorage();
  if (!store) return;
  try {
    store.setItem(GUEST_TASKS_KEY, JSON.stringify(tasks));
  } catch {
    return;
  }
}

type Listener = () => void;

const listeners = new Set<Listener>();

let cachedTasks: Task[] | null = null;

export function subscribeGuestTasks(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getGuestTasksSnapshot(): Task[] {
  if (cachedTasks === null) cachedTasks = loadGuestTasks();
  return cachedTasks;
}

const EMPTY_TASKS_SNAPSHOT: Task[] = [];

export function getGuestTasksServerSnapshot(): Task[] {
  return EMPTY_TASKS_SNAPSHOT;
}

export function setGuestTasks(
  update: Task[] | ((current: Task[]) => Task[]),
): void {
  const current = getGuestTasksSnapshot();
  const next = typeof update === "function" ? update(current) : update;
  cachedTasks = next;
  saveGuestTasks(next);
  for (const listener of listeners) {
    listener();
  }
}

const validCategoryColors: CategoryColor[] = [
  "blue",
  "cyan",
  "green",
  "pink",
  "yellow",
  "gray",
];

const validCategoryIcons: CategoryIcon[] = [
  "package",
  "palette",
  "terminal",
  "zap",
  "flask",
  "list",
];

function sanitizeCategory(value: unknown): Category | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  if (!isString(record.id) || !isString(record.name)) return null;
  const color = validCategoryColors.includes(record.color as CategoryColor)
    ? (record.color as CategoryColor)
    : "gray";
  const icon = validCategoryIcons.includes(record.icon as CategoryIcon)
    ? (record.icon as CategoryIcon)
    : "list";
  return { id: record.id, name: record.name, icon, color };
}

export function loadGuestCategories(
  storage?: GuestTaskStorage | null,
): Category[] | null {
  const store = storage ?? browserStorage();
  if (!store) return null;
  try {
    const raw = store.getItem(GUEST_CATEGORIES_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed
      .map(sanitizeCategory)
      .filter((category): category is Category => category !== null);
  } catch {
    return null;
  }
}

export function saveGuestCategories(
  categories: Category[],
  storage?: GuestTaskStorage | null,
): void {
  const store = storage ?? browserStorage();
  if (!store) return;
  try {
    store.setItem(GUEST_CATEGORIES_KEY, JSON.stringify(categories));
  } catch {
    return;
  }
}

const validLabelTones: LabelTone[] = ["pen", "marker", "gray"];

function sanitizeLabel(value: unknown): Label | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  if (!isString(record.id) || !isString(record.name)) return null;
  const tone = validLabelTones.includes(record.tone as LabelTone)
    ? (record.tone as LabelTone)
    : "gray";
  return { id: record.id, name: record.name.trim(), tone };
}

export function loadGuestLabels(
  storage?: GuestTaskStorage | null,
): Label[] | null {
  const store = storage ?? browserStorage();
  if (!store) return null;
  try {
    const raw = store.getItem(GUEST_LABELS_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed
      .map(sanitizeLabel)
      .filter((label): label is Label => label !== null);
  } catch {
    return null;
  }
}

export function saveGuestLabels(
  labels: Label[],
  storage?: GuestTaskStorage | null,
): void {
  const store = storage ?? browserStorage();
  if (!store) return;
  try {
    store.setItem(GUEST_LABELS_KEY, JSON.stringify(labels));
  } catch {
    return;
  }
}
