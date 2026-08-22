import { describe, expect, it } from "vitest";
import {
  GUEST_CATEGORIES_KEY,
  GUEST_TASKS_KEY,
  getGuestTasksServerSnapshot,
  loadGuestCategories,
  loadGuestTasks,
  saveGuestCategories,
  saveGuestTasks,
} from "./guest-storage";
import type { Category, Task } from "./types";

type MockStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

function createMockStorage(initial?: unknown, key = GUEST_TASKS_KEY): MockStorage {
  const data = new Map<string, string>();
  if (initial !== undefined) {
    data.set(key, JSON.stringify(initial));
  }
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
}

function makeTask(overrides: Partial<Task> = {}): Task {
  const now = new Date().toISOString();
  return {
    id: "task-1",
    title: "Buy groceries",
    description: "",
    status: "todo",
    priority: "none",
    dueAt: null,
    completedAt: null,
    position: 1,
    createdAt: now,
    updatedAt: now,
    labelIds: [],
    subtasks: [],
    categoryId: null,
    startDate: null,
    endDate: null,
    ...overrides,
  };
}

describe("loadGuestTasks", () => {
  it("returns an empty list when nothing is stored", () => {
    expect(loadGuestTasks(createMockStorage())).toEqual([]);
  });

  it("returns an empty list when storage is unavailable", () => {
    expect(loadGuestTasks(null)).toEqual([]);
  });

  it("returns an empty list when storage access throws", () => {
    const throwing: MockStorage = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {},
    };
    expect(loadGuestTasks(throwing)).toEqual([]);
  });

  it("loads valid tasks stored as JSON", () => {
    const task = makeTask({
      id: "a",
      title: "Pay electric bill",
      dueAt: "2026-08-20",
    });
    expect(loadGuestTasks(createMockStorage([task]))).toEqual([task]);
  });

  it("returns an empty list for corrupted JSON", () => {
    const storage: MockStorage = {
      getItem: () => "{not json",
      setItem: () => {},
    };
    expect(loadGuestTasks(storage)).toEqual([]);
  });

  it("returns an empty list when the stored value is not an array", () => {
    expect(loadGuestTasks(createMockStorage({ id: "x" }))).toEqual([]);
  });

  it("drops invalid entries and defaults missing fields", () => {
    const storage = createMockStorage([
      { id: "ok", title: "Valid" },
      { title: "missing id" },
      "nope",
      null,
    ]);
    const tasks = loadGuestTasks(storage);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      id: "ok",
      title: "Valid",
      status: "todo",
      priority: "none",
      subtasks: [],
      labelIds: [],
    });
  });
});

describe("saveGuestTasks", () => {
  it("persists tasks as JSON under the guest key", () => {
    const task = makeTask({ id: "a", title: "Pay electric bill" });
    let stored = "";
    const storage: MockStorage = {
      getItem: () => stored,
      setItem: (key, value) => {
        stored = value;
      },
    };
    saveGuestTasks([task], storage);
    expect(storage.getItem(GUEST_TASKS_KEY)).toBe(JSON.stringify([task]));
  });

  it("does not throw when storage is unavailable or full", () => {
    const throwing: MockStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota exceeded");
      },
    };
    expect(() => saveGuestTasks([makeTask()], throwing)).not.toThrow();
    expect(() => saveGuestTasks([makeTask()], null)).not.toThrow();
  });
});

describe("getGuestTasksServerSnapshot", () => {
  it("returns an empty list that is referentially stable across calls", () => {
    expect(getGuestTasksServerSnapshot()).toEqual([]);
    expect(getGuestTasksServerSnapshot()).toBe(getGuestTasksServerSnapshot());
  });
});

describe("loadGuestCategories", () => {
  it("returns null when nothing is stored", () => {
    expect(loadGuestCategories(createMockStorage())).toBeNull();
  });

  it("returns null when storage is unavailable", () => {
    expect(loadGuestCategories(null)).toBeNull();
  });

  it("loads valid categories stored as JSON", () => {
    const categories: Category[] = [
      { id: "research", name: "Research", icon: "flask", color: "yellow" },
    ];
    expect(loadGuestCategories(createMockStorage(categories, GUEST_CATEGORIES_KEY))).toEqual(
      categories,
    );
  });

  it("returns null for corrupted JSON", () => {
    const storage: MockStorage = {
      getItem: () => "{not json",
      setItem: () => {},
    };
    expect(loadGuestCategories(storage)).toBeNull();
  });

  it("drops invalid entries and defaults unknown icon and color", () => {
    const storage = createMockStorage(
      [
        { id: "ok", name: "Valid" },
        { title: "missing id" },
        "nope",
      ],
      GUEST_CATEGORIES_KEY,
    );
    expect(loadGuestCategories(storage)).toEqual([
      { id: "ok", name: "Valid", icon: "list", color: "gray" },
    ]);
  });
});

describe("saveGuestCategories", () => {
  it("persists categories as JSON under the guest key", () => {
    const categories: Category[] = [
      { id: "ops", name: "Operations", icon: "zap", color: "pink" },
    ];
    let stored = "";
    const storage: MockStorage = {
      getItem: () => stored,
      setItem: (key, value) => {
        stored = value;
      },
    };
    saveGuestCategories(categories, storage);
    expect(storage.getItem(GUEST_CATEGORIES_KEY)).toBe(
      JSON.stringify(categories),
    );
  });

  it("does not throw when storage is unavailable or full", () => {
    const throwing: MockStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota exceeded");
      },
    };
    expect(() => saveGuestCategories([], throwing)).not.toThrow();
    expect(() => saveGuestCategories([], null)).not.toThrow();
  });
});
