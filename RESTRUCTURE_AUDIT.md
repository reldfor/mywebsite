# RESTRUCTURE_AUDIT.md — Tick

> Phase 1 audit — read-only. No files moved, renamed, or edited. Generated 2026-08-29.
> Tooling: `find src -type f | wc -l` = 81, `grep -rn` for deps, `wc -l` for line counts. All paths verified on `main` (`cff71c1`).

## 0. Target Structure (final — updated per 2026-08-29 decisions, Choice A for date)

The Phase 1 prompt requested a target structure via `[PASTE THE FULL TARGET STRUCTURE FROM ABOVE HERE]` which was not supplied. Initial audit used an inferred tree; this revision locks the **Phase 2 module order** (`tasks/`, `auth/`, `theme/`, `landing/`, `shared/`, `app-chrome/`, `db/`) and the explicit split paths, updated per user decisions: 1) `theme-toggle→modules/theme`, 2) `components/auth→modules/auth/components` (not `ui`), 3) `constants→shared/lib`, 4) `date→modules/tasks/domain/date.ts` **Choice A** (canonical `shared/lib/date.ts` + re-export), 5) `db→src/db` stay, 6) `seed`+all 7 domain files → `modules/tasks/domain/`. All new paths under `src/` (`@/`→`src/`, `tsconfig.json:22`). `src/app/` and `src/middleware.ts` stay (Next.js).

```
src/
  app/                            # ← stays: Next.js App Router (15 files)
  middleware.ts                   # ← stays: src/middleware.ts
  db/                             # ← stays: src/db/ per decision #5 (top-level)
    index.ts
    schema.ts
  modules/
    tasks/
      domain/                     # ← per decision #6: was model/, now domain/ (7 files + date re-export per #4 Choice A)
        types.ts
        selectors.ts
        guest-storage.ts
        guest-storage.test.ts
        label-colors.ts
        seed.ts
        seed.test.ts
        date.ts                   # ← Choice A: re-export from @/modules/shared/lib/date (canonical stays shared)
      store/
        tasks-provider.tsx               # keep context + useTasks() signature
        use-task-mutations.ts            # NEW — split from tasks-provider.tsx
        use-subtask-mutations.ts         # NEW — split from tasks-provider.tsx
        use-label-category-mutations.ts  # NEW — split from tasks-provider.tsx
      server/
        actions.ts                       # "use server" stays here only
        rate-limit.ts                    # NEW — extracted from actions.ts
        validation.ts                    # NEW — extracted from actions.ts
    auth/
      clerk-provider.tsx
      errors.ts
      errors.test.ts
      sign-in-form.tsx
      sign-up-form.tsx
      forgot-password-form.tsx
      components/                        # ← per decision #2: was ui/, now components/
        auth-shell.tsx
        auth-field.tsx
        auth-actions.tsx
        auth-overlay.tsx
    theme/
      theme-provider.tsx
      theme-toggle.tsx                   # ← per decision #1
    landing/
      app-mockup.tsx
      faq.tsx
      features.tsx
      final-cta.tsx
      footer.tsx
      header.tsx
      hero.tsx
      logo.tsx
      pricing.tsx
      testimonials.tsx
    shared/
      lib/
        constants.ts                     # ← per decision #3
        date.ts                          # ← canonical (Choice A); domain/date re-exports it
      hooks/
        use-is-desktop.ts
      ui/
        button.tsx
    app-chrome/
      components/
        add-task.tsx
        confirm-dialog.tsx
        filters.tsx
        labels-view.tsx
        label-tasks.tsx
        menus.tsx
        popover.tsx
        settings-view.tsx
        sidebar.tsx
        task-colors.tsx
        task-context-menu.tsx
        task-detail/
          task-detail-panel.tsx
          tags-field.tsx
          subtasks-section.tsx
          priority-field.tsx
          due-date-field.tsx
          shared.tsx
        task-list.tsx
        task-row.tsx
        toast.tsx
        top-bar.tsx
        empty-states/
          completed-illustration.tsx
          filter-illustration.tsx
          inbox-illustration.tsx
          labels-illustration.tsx
          search-illustration.tsx
          today-illustration.tsx
          upcoming-illustration.tsx
```

> Choice A note: `lib/date.ts:204` has 5 non-tasks consumers (`components/app/add-task.tsx:20`, `task-detail/*:7`, `task-list.tsx:23`, `task-row.tsx:11`). Canonical stays `shared/lib/date.ts`; `modules/tasks/domain/date.ts` is a thin `export * from "@/modules/shared/lib/date"` so tasks domain can import via `@/modules/tasks/domain/date` without coupling `app-chrome→tasks`.

Decisions: #1 modules/theme ✓, #2 modules/auth/components ✓, #3 shared/lib ✓, #4 Choice A (re-export) ✓, #5 src/db stay ✓, #6 domain rename (7 files) ✓ — all NEEDS DECISION resolved.

---

## 1. Current File Inventory — every file under `src/`, grouped by top-level folder, with line counts

**Totals:** 81 files — `src/app:15`, `src/components:44`, `src/features:16`, `src/hooks:1`, `src/lib:2`, `src/db:2`, `src/middleware.ts:1`.

### `src/app` — 15 files (App Router routes + global assets)

| File | Lines |
|------|------:|
| `src/app/layout.tsx` | 71 |
| `src/app/page.tsx` | 32 |
| `src/app/globals.css` | 1399 |
| `src/app/icon.svg` | 4 |
| `src/app/sign-in/page.tsx` | 21 |
| `src/app/sign-up/page.tsx` | 21 |
| `src/app/forgot-password/page.tsx` | 21 |
| `src/app/app/layout.tsx` | 54 |
| `src/app/app/page.tsx` | 11 |
| `src/app/app/today/page.tsx` | 11 |
| `src/app/app/upcoming/page.tsx` | 11 |
| `src/app/app/completed/page.tsx` | 11 |
| `src/app/app/settings/page.tsx` | 11 |
| `src/app/app/labels/page.tsx` | 11 |
| `src/app/app/labels/[labelId]/page.tsx` | 21 |

### `src/components` — 44 files

| File | Lines |
|------|------:|
| `src/components/app/add-task.tsx` | 600 |
| `src/components/app/confirm-dialog.tsx` | 76 |
| `src/components/app/filters.tsx` | 319 |
| `src/components/app/labels-view.tsx` | 354 |
| `src/components/app/label-tasks.tsx` | 137 |
| `src/components/app/menus.tsx` | 504 |
| `src/components/app/popover.tsx` | 71 |
| `src/components/app/settings-view.tsx` | 169 |
| `src/components/app/sidebar.tsx` | 214 |
| `src/components/app/task-colors.tsx` | 82 |
| `src/components/app/task-context-menu.tsx` | 129 |
| `src/components/app/task-detail/task-detail-panel.tsx` | 379 |
| `src/components/app/task-detail/tags-field.tsx` | 356 |
| `src/components/app/task-detail/subtasks-section.tsx` | 181 |
| `src/components/app/task-detail/priority-field.tsx` | 93 |
| `src/components/app/task-detail/due-date-field.tsx` | 100 |
| `src/components/app/task-detail/shared.tsx` | 16 |
| `src/components/app/task-list.tsx` | 246 |
| `src/components/app/task-row.tsx` | 340 |
| `src/components/app/toast.tsx` | 43 |
| `src/components/app/top-bar.tsx` | 47 |
| `src/components/app/empty-states/completed-illustration.tsx` | 160 |
| `src/components/app/empty-states/filter-illustration.tsx` | 45 |
| `src/components/app/empty-states/inbox-illustration.tsx` | 45 |
| `src/components/app/empty-states/labels-illustration.tsx` | 46 |
| `src/components/app/empty-states/search-illustration.tsx` | 45 |
| `src/components/app/empty-states/today-illustration.tsx` | 52 |
| `src/components/app/empty-states/upcoming-illustration.tsx` | 50 |
| `src/components/auth/auth-actions.tsx` | 200 |
| `src/components/auth/auth-field.tsx` | 72 |
| `src/components/auth/auth-overlay.tsx` | 82 |
| `src/components/auth/auth-shell.tsx` | 73 |
| `src/components/landing/app-mockup.tsx` | 337 |
| `src/components/landing/faq.tsx` | 105 |
| `src/components/landing/features.tsx` | 214 |
| `src/components/landing/final-cta.tsx` | 20 |
| `src/components/landing/footer.tsx` | 71 |
| `src/components/landing/header.tsx` | 61 |
| `src/components/landing/hero.tsx` | 40 |
| `src/components/landing/logo.tsx` | 24 |
| `src/components/landing/pricing.tsx` | 138 |
| `src/components/landing/testimonials.tsx` | 59 |
| `src/components/theme-toggle.tsx` | 24 |
| `src/components/ui/button.tsx` | 40 |

### `src/features` — 16 files

| File | Lines |
|------|------:|
| `src/features/auth/clerk-provider.tsx` | 15 |
| `src/features/auth/errors.ts` | 94 |
| `src/features/auth/errors.test.ts` | 99 |
| `src/features/auth/sign-in-form.tsx` | 349 |
| `src/features/auth/sign-up-form.tsx` | 352 |
| `src/features/auth/forgot-password-form.tsx` | 385 |
| `src/features/theme/theme-provider.tsx` | 80 |
| `src/features/todos/types.ts` | 92 |
| `src/features/todos/guest-storage.ts` | 284 |
| `src/features/todos/guest-storage.test.ts` | 276 |
| `src/features/todos/label-colors.ts` | 51 |
| `src/features/todos/seed.ts` | 103 |
| `src/features/todos/seed.test.ts` | 58 |
| `src/features/todos/selectors.ts` | 149 |
| `src/features/todos/tasks-provider.tsx` | 887 |
| `src/features/todos/actions.ts` | 420 |

### `src/hooks` — 1 file

| File | Lines |
|------|------:|
| `src/hooks/use-is-desktop.ts` | 19 |

### `src/lib` — 2 files

| File | Lines |
|------|------:|
| `src/lib/constants.ts` | 18 |
| `src/lib/date.ts` | 204 |

### `src/db` — 2 files

| File | Lines |
|------|------:|
| `src/db/index.ts` | 17 |
| `src/db/schema.ts` | 32 |

### `src/` root — 1 file

| File | Lines |
|------|------:|
| `src/middleware.ts` | 10 |

---

## 2. Cross-File Dependencies

### `src/features/todos/tasks-provider.tsx` (887 lines)

**Imports FROM (what it depends on):**

| Source | Symbols |
|--------|---------|
| `react` (`tasks-provider.tsx:3-13`) | `createContext`, `useCallback`, `useContext`, `useEffect`, `useMemo`, `useRef`, `useState`, `useSyncExternalStore`, `ReactNode` |
| `@clerk/nextjs` (`:14`) | `useUser` |
| `./types` (`:15-26`) | `AddTaskInput`, `Category`, `CategoryColor`, `CategoryIcon`, `Filters`, `Label`, `LabelTone`, `SortKey`, `Subtask`, `Task` |
| `./guest-storage` (`:27-37`) | `GUEST_TASK_LIMIT`, `getGuestTasksServerSnapshot`, `getGuestTasksSnapshot`, `loadGuestCategories`, `loadGuestLabels`, `saveGuestCategories`, `saveGuestLabels`, `setGuestTasks`, `subscribeGuestTasks` |
| `./seed` (`:38`) | `seedLabels` |
| `./actions` (`:39-47`) | `createTask as serverCreateTask`, `deleteTask as serverDeleteTask`, `duplicateTask as serverDuplicateTask`, `getTasks as serverGetTasks`, `reorderTasks as serverReorderTasks`, `toggleTask as serverToggleTask`, `updateTask as serverUpdateTask` |

**Imported BY (every file that imports from it):** — 16 files via `grep -rn "from.*tasks-provider"`:

```
src/app/app/layout.tsx:8                          → { TasksProvider }
src/components/app/add-task.tsx:18                → { useTasks }
src/components/app/filters.tsx:6                  → { useTasks }
src/components/app/label-tasks.tsx:10             → { useTasks }
src/components/app/labels-view.tsx:14             → { useTasks }
src/components/app/menus.tsx:23                   → { useTasks }
src/components/app/sidebar.tsx:19                 → { useTasks }
src/components/app/task-context-menu.tsx:6        → { useTasks }
src/components/app/task-detail/due-date-field.tsx:5   → { useTasks }
src/components/app/task-detail/priority-field.tsx:5   → { useTasks }
src/components/app/task-detail/subtasks-section.tsx:5 → { useTasks }
src/components/app/task-detail/tags-field.tsx:12      → { useTasks }
src/components/app/task-detail/task-detail-panel.tsx:14 → { useTasks }
src/components/app/task-list.tsx:13              → { useTasks }
src/components/app/task-row.tsx:9                → { useTasks }
src/components/app/toast.tsx:3                   → { useTasks }
```

### `src/features/todos/types.ts` (92 lines)

**Imports FROM:** none — pure type declarations.

| Source | Symbols |
|--------|---------|
| *(none)* | — |

**Imported BY:** 21 files via `grep -rn "from.*types"`:

```
src/db/schema.ts:2                                     → { Priority, Subtask, TaskStatus }
src/features/todos/actions.ts:11                       → { AddTaskInput, Priority, Subtask, Task, TaskStatus }
src/features/todos/guest-storage.ts:1-11                → { Category, CategoryColor, CategoryIcon, Label, LabelTone, Priority, Subtask, Task, TaskStatus }
src/features/todos/selectors.ts:1                       → { Filters, Priority, SortKey, Task, View }
src/features/todos/tasks-provider.tsx:15                → { AddTaskInput, Category, CategoryColor, CategoryIcon, Filters, Label, LabelTone, SortKey, Subtask, Task }
src/features/todos/label-colors.ts:1                    → { LabelTone }
src/features/todos/seed.ts:1                             → { Label, Subtask, Task }
src/features/todos/guest-storage.test.ts:14              → { Category, Task }
src/components/app/add-task.tsx:21                       → { Category, Label, Priority }
src/components/app/filters.tsx:7                         → { Priority, SortKey }
src/components/app/labels-view.tsx:20                    → { Label, LabelTone }
src/components/app/menus.tsx:24                          → { Task }
src/components/app/task-colors.tsx:2                     → { CategoryColor, CategoryIcon }
src/components/app/task-context-menu.tsx:7               → { Task }
src/components/app/task-detail/due-date-field.tsx:6     → { Task }
src/components/app/task-detail/priority-field.tsx:6     → { Priority, Task }
src/components/app/task-detail/subtasks-section.tsx:6   → { Subtask, Task }
src/components/app/task-detail/tags-field.tsx:14        → { Category, Label, Task }
src/components/app/task-detail/task-detail-panel.tsx:15 → { Task }
src/components/app/task-list.tsx:22                      → { Task, View }
src/components/app/task-row.tsx:10                       → { Priority, Task }
```

### `src/features/todos/actions.ts` (420 lines)

**Imports FROM:**

| Source | Symbols |
|--------|---------|
| `server-only` (`actions.ts:3`) | side-effect (ensures server-only) |
| `@clerk/nextjs/server` (`:5`) | `auth` |
| `drizzle-orm` (`:6`) | `and`, `asc`, `eq` |
| `@/db` (`:8`) | `db` |
| `@/db/schema` (`:9-10`) | `tasks`, `TaskRow` (type) |
| `./types` (`:11`) | `AddTaskInput`, `Priority`, `Subtask`, `Task`, `TaskStatus` |

**Imported BY:** 1 file (strict `from.*actions` excluding `components/auth/auth-actions` false positives):

```
src/features/todos/tasks-provider.tsx:39-47 → { createTask, deleteTask, duplicateTask, getTasks, reorderTasks, toggleTask, updateTask, __clearRateLimitForTests }
```

False positives for `auth-actions` (not `todos/actions.ts`):

```
src/features/auth/forgot-password-form.tsx:8 → { SubmitButton } from "@/components/auth/auth-actions"
src/features/auth/sign-in-form.tsx:12       → from "@/components/auth/auth-actions"
src/features/auth/sign-up-form.tsx:12       → from "@/components/auth/auth-actions"
```

### `src/features/todos/selectors.ts` (149 lines)

**Imports FROM:**

| Source | Symbols |
|--------|---------|
| `./types` (`selectors.ts:1`) | `Filters`, `Priority`, `SortKey`, `Task`, `View` |
| `@/lib/date` (`:2`) | `isDueToday`, `isOverdue`, `isUpcoming` |

**Imported BY:** 4 files:

```
src/components/app/sidebar.tsx:20     → { countDueToday, countOpenTasks }
src/components/app/task-list.tsx:16-21 → { activeFilterCount, applyFilters, getViewTasks, matchesSearch, sortTasks }
src/components/app/label-tasks.tsx:12 → { getTasksByLabel, matchesSearch }
src/components/app/filters.tsx:8      → { activeFilterCount }
```

### `src/features/todos/guest-storage.ts` (284 lines)

**Imports FROM:**

| Source | Symbols |
|--------|---------|
| `./types` (`guest-storage.ts:1-11`) | `Category`, `CategoryColor`, `CategoryIcon`, `Label`, `LabelTone`, `Priority`, `Subtask`, `Task`, `TaskStatus` |
| `./label-colors` (`:12`) | `LABEL_COLORS`, `legacyLabelToneMap` |

**Imported BY:** 3 files:

```
src/features/todos/tasks-provider.tsx:27-37      → { GUEST_TASK_LIMIT, getGuestTasksServerSnapshot, getGuestTasksSnapshot, loadGuestCategories, loadGuestLabels, saveGuestCategories, saveGuestLabels, setGuestTasks, subscribeGuestTasks }
src/features/todos/guest-storage.test.ts:2-13    → { GUEST_CATEGORIES_KEY, GUEST_LABELS_KEY, GUEST_TASKS_KEY, getGuestTasksServerSnapshot, hasGuestTasksKey, loadGuestCategories, loadGuestLabels, loadGuestTasks, saveGuestCategories, saveGuestTasks, GUEST_TASK_LIMIT }
src/features/todos/seed.test.ts:2                → { GUEST_TASK_LIMIT }
```

---

## 3. Barrel / index Files

**Result: 1 `index.ts` exists — not a barrel.**

| File | Type | Notes |
|------|------|-------|
| `src/db/index.ts` (17 lines) | DB singleton | `import * as schema from "./schema"`, `export const db = createDb()` (Drizzle + Neon). Not a re-export barrel. |

- `src/features/todos/index.ts` — does not exist
- `src/features/auth/index.ts` — does not exist
- `src/components/index.ts`, `src/components/app/index.ts`, `src/lib/index.ts`, `src/hooks/index.ts` — do not exist

All 81 files use direct `from "@/…"` or sibling `./` imports; no `export * from` barrels were found (`grep -rn "export \*" src` → 0 hits). No path updates needed for barrels beyond the single `db/index.ts` consumer updates (2 files import `from "@/db"`).

---

## 4. Test File Inventory

| Test file | Lines | What it imports |
|-----------|------:|-----------------|
| `src/features/auth/errors.test.ts` | 99 | `vitest:{describe,expect,it}` + `from "@/features/auth/errors"` → `clerkCodeToMessage, clerkErrorsMessage, clerkErrorToMessage, clerkFieldMessage, clerkGlobalMessage`. Note: uses `@/` alias even though test is adjacent to `errors.ts` (not `./errors`). |
| `src/features/todos/guest-storage.test.ts` | 276 | `vitest` + `from "./guest-storage"` → `GUEST_CATEGORIES_KEY, GUEST_LABELS_KEY, GUEST_TASKS_KEY, getGuestTasksServerSnapshot, hasGuestTasksKey, loadGuestCategories, loadGuestLabels, loadGuestTasks, saveGuestCategories, saveGuestTasks` + `from "./types"` → `Category, Task` (type-only). Uses injectable `MockStorage` (`{getItem,setItem}`) — no filesystem or localStorage dependency. |
| `src/features/todos/seed.test.ts` | 58 | `vitest` + `from "./guest-storage"` → `GUEST_TASK_LIMIT` + `from "./seed"` → `createSeedTasks, seedLabels` + `from "@/lib/date"` → `daysUntil, todayISO`. Asserts `createSeedTasks().length ≤ GUEST_TASK_LIMIT`, unique ids, sequential positions, label refs valid. |

No other `*.test.ts` or `*.spec.ts` files exist. All tests run with `vitest run` (node env, `@` alias via `vitest.config.mts:7`).

---

## 5. Hardcoded Relative Imports (`../../`) — highest-risk during restructure

**Strict `../../` (more than one level up): 0 matches.**

```bash
grep -rn "../../" src --include="*.ts" --include="*.tsx" -n  # → No matches
grep -rn 'from.*"\.\./' src --include="*.ts" --include="*.tsx" -n  # → No matches
```

All cross-folder imports use the `@/` alias (`@/` → `src/` via `tsconfig.json:22` and `vitest.config.mts:7`). Zero double-hop relative imports means restructure risk is low: only sibling `./` relatives need updating inside moved folders.

**All relative imports in `src/` (24 total, all single-level `./` sibling co-location):**

```
src/components/app/labels-view.tsx:21                         → "./confirm-dialog"
src/components/app/task-detail/due-date-field.tsx:8           → "./shared"
src/components/app/task-detail/priority-field.tsx:7           → "./shared"
src/components/app/task-detail/subtasks-section.tsx:7         → "./shared"
src/components/app/task-detail/tags-field.tsx:15              → "./shared"
src/components/app/task-detail/task-detail-panel.tsx:17       → "./due-date-field"
src/components/app/task-detail/task-detail-panel.tsx:18       → "./priority-field"
src/components/app/task-detail/task-detail-panel.tsx:19       → "./subtasks-section"
src/components/app/task-detail/task-detail-panel.tsx:20       → "./tags-field"
src/components/app/task-row.tsx:12                            → "./task-context-menu"
src/db/index.ts:6                                              → "./schema"
src/features/todos/actions.ts:11                               → "./types"
src/features/todos/guest-storage.ts:11-12                      → "./types", "./label-colors"
src/features/todos/selectors.ts:1                              → "./types"
src/features/todos/seed.ts:1                                   → "./types"
src/features/todos/tasks-provider.tsx:15-47                    → "./types", "./guest-storage", "./seed", "./actions"
src/features/todos/guest-storage.test.ts:2-14                  → "./guest-storage", "./types"
src/features/todos/seed.test.ts:2-3                            → "./guest-storage", "./seed"
```

These 24 will need rewiring only if their folder moves (e.g. `task-detail/shared.tsx` stays co-located, so no change; `guest-storage.ts → label-colors.ts` stays co-located under `modules/tasks/model/`; `tasks-provider.tsx → actions` becomes cross-module alias).

---

## 6. Target Mapping Table — every existing file → exact new path

> All new paths are relative to repo root. `@/` alias stays `src/*` (`tsconfig.json:22`), so imports become `@/modules/...`. Move via `git mv` to preserve history. `src/app/` and `src/middleware.ts` are intentionally **not moved** (Next.js conventions).

| # | Existing path | Lines | New path | Notes |
|---|---------------|------:|----------|-------|
| 1 | `src/app/layout.tsx` | 71 | `src/app/layout.tsx` | **STAY** — root layout (ClerkProvider boundary) |
| 2 | `src/app/page.tsx` | 32 | `src/app/page.tsx` | **STAY** — landing page |
| 3 | `src/app/globals.css` | 1399 | `src/app/globals.css` | **STAY** — Tailwind v4 tokens |
| 4 | `src/app/icon.svg` | 4 | `src/app/icon.svg` | **STAY** |
| 5 | `src/app/sign-in/page.tsx` | 21 | `src/app/sign-in/page.tsx` | **STAY** |
| 6 | `src/app/sign-up/page.tsx` | 21 | `src/app/sign-up/page.tsx` | **STAY** |
| 7 | `src/app/forgot-password/page.tsx` | 21 | `src/app/forgot-password/page.tsx` | **STAY** |
| 8 | `src/app/app/layout.tsx` | 54 | `src/app/app/layout.tsx` | **STAY** — app shell (TasksProvider+Sidebar) |
| 9 | `src/app/app/page.tsx` | 11 | `src/app/app/page.tsx` | **STAY** — Inbox |
| 10 | `src/app/app/today/page.tsx` | 11 | `src/app/app/today/page.tsx` | **STAY** |
| 11 | `src/app/app/upcoming/page.tsx` | 11 | `src/app/app/upcoming/page.tsx` | **STAY** |
| 12 | `src/app/app/completed/page.tsx` | 11 | `src/app/app/completed/page.tsx` | **STAY** |
| 13 | `src/app/app/settings/page.tsx` | 11 | `src/app/app/settings/page.tsx` | **STAY** |
| 14 | `src/app/app/labels/page.tsx` | 11 | `src/app/app/labels/page.tsx` | **STAY** |
| 15 | `src/app/app/labels/[labelId]/page.tsx` | 21 | `src/app/app/labels/[labelId]/page.tsx` | **STAY** |
| 16 | `src/middleware.ts` | 10 | `src/middleware.ts` | **STAY** — `clerkMiddleware()` |
| 17 | `src/db/index.ts` | 17 | `src/db/index.ts` | **STAY** per decision #5 — no move; `import * as schema from "./schema"` unchanged; `actions.ts:8` stays `from "@/db"` |
| 18 | `src/db/schema.ts` | 32 | `src/db/schema.ts` | **STAY** per decision #5 |
| 19 | `src/features/todos/types.ts` | 92 | `src/modules/tasks/domain/types.ts` | MOVE — canonical domain types (per decision #6: model→domain) |
| 20 | `src/features/todos/selectors.ts` | 149 | `src/modules/tasks/domain/selectors.ts` | MOVE — per #6; `from "@/lib/date"` → `@/modules/tasks/domain/date` (Choice A re-export, canonical `shared/lib/date`) |
| 21 | `src/features/todos/guest-storage.ts` | 284 | `src/modules/tasks/domain/guest-storage.ts` | MOVE — per #6; `from "./label-colors"` stays sibling; consumers → `@/modules/tasks/domain/guest-storage` |
| 22 | `src/features/todos/label-colors.ts` | 51 | `src/modules/tasks/domain/label-colors.ts` | MOVE — per #6; `LabelTone` → `@/modules/tasks/domain/types` |
| 23 | `src/features/todos/seed.ts` | 103 | `src/modules/tasks/domain/seed.ts` | MOVE — per #6; `from "./types"` stays sibling |
| 24 | `src/features/todos/guest-storage.test.ts` | 276 | `src/modules/tasks/domain/guest-storage.test.ts` | MOVE per #6 with domain; relative stays sibling |
| 25 | `src/features/todos/seed.test.ts` | 58 | `src/modules/tasks/domain/seed.test.ts` | MOVE per #6; `from "@/lib/date"` → `@/modules/tasks/domain/date` (Choice A re-export) |
| 26 | `src/features/todos/tasks-provider.tsx` | 887 | `src/modules/tasks/store/tasks-provider.tsx` | **SPLIT** — keep provider/context/`useTasks()` signature. Compose three new hooks. Imports: `./types`→`../domain/types`, `./guest-storage`→`../domain/guest-storage`, `./seed`→`../domain/seed`, `./actions`→`../server/actions` |
| 27 | *(new split)* | — | `src/modules/tasks/store/use-task-mutations.ts` | **NEW** — `addTask`, `updateTask`, `deleteTask`, `duplicateTask`, `toggleTask`, `archiveTask`, `restoreTask`, `reorderTasks` |
| 28 | *(new split)* | — | `src/modules/tasks/store/use-subtask-mutations.ts` | **NEW** — `addSubtask`, `toggleSubtask`, `deleteSubtask` |
| 29 | *(new split)* | — | `src/modules/tasks/store/use-label-category-mutations.ts` | **NEW** — `addLabel`, `updateLabel`, `deleteLabel`, `addCategory`, `deleteCategory` (+ `assignLabel`/`unassignLabel` per spec — if spec keeps them in provider, document explicitly) |
| 30 | `src/features/todos/actions.ts` | 420 | `src/modules/tasks/server/actions.ts` | **SPLIT** — keep `"use server"` + exported actions only (`getTasks`, `createTask`, `updateTask`, `deleteTask`, `reorderTasks`, `toggleTask`, `duplicateTask`, `__clearRateLimitForTests`); delegate to rate-limit + validation |
| 31 | *(new split)* | — | `src/modules/tasks/server/rate-limit.ts` | **NEW** — `RATE_LIMIT_WINDOW_MS:27`, `RATE_LIMIT_MAX_WRITES:28`, `rateLimitBuckets:29`, `checkRateLimit:31` |
| 32 | *(new split)* | — | `src/modules/tasks/server/validation.ts` | **NEW** — `MAX_TITLE_LENGTH:16`…`MAX_SUBTASK…`, `validateId:83`, `validateTitle:91`, `validateDescription:99`, `validateStatus:106`, `validatePriority:113`, `validateDueAt:120`, `validateIsoNullable:131`, `validateCategoryId:141`, `validatePosition:150`, `validateLabelIds:159`, `validateSubtasks:175` |
| 33 | `src/features/auth/clerk-provider.tsx` | 15 | `src/modules/auth/clerk-provider.tsx` | MOVE — module `auth/` |
| 34 | `src/features/auth/errors.ts` | 94 | `src/modules/auth/errors.ts` | MOVE — consumers: `features/auth/*-form.tsx:5-8` and `errors.test.ts` via `@/features/auth/errors` → `@/modules/auth/errors` |
| 35 | `src/features/auth/errors.test.ts` | 99 | `src/modules/auth/errors.test.ts` | MOVE with auth; update `@/features/auth/errors` → `@/modules/auth/errors` |
| 36 | `src/features/auth/sign-in-form.tsx` | 349 | `src/modules/auth/sign-in-form.tsx` | MOVE — per #2: `from "@/components/auth/auth-actions"` → `@/modules/auth/components/auth-actions` |
| 37 | `src/features/auth/sign-up-form.tsx` | 352 | `src/modules/auth/sign-up-form.tsx` | MOVE — per #2: same |
| 38 | `src/features/auth/forgot-password-form.tsx` | 385 | `src/modules/auth/forgot-password-form.tsx` | MOVE — per #2: same |
| 39 | `src/features/theme/theme-provider.tsx` | 80 | `src/modules/theme/theme-provider.tsx` | MOVE — module `theme/` |
| 40 | `src/components/theme-toggle.tsx` | 24 | `src/modules/theme/theme-toggle.tsx` | MOVE — per #1: `modules/theme/` (resolved) |
| 41 | `src/components/landing/app-mockup.tsx` | 337 | `src/modules/landing/app-mockup.tsx` | MOVE — module `landing/` |
| 42 | `src/components/landing/faq.tsx` | 105 | `src/modules/landing/faq.tsx` | MOVE |
| 43 | `src/components/landing/features.tsx` | 214 | `src/modules/landing/features.tsx` | MOVE |
| 44 | `src/components/landing/final-cta.tsx` | 20 | `src/modules/landing/final-cta.tsx` | MOVE |
| 45 | `src/components/landing/footer.tsx` | 71 | `src/modules/landing/footer.tsx` | MOVE |
| 46 | `src/components/landing/header.tsx` | 61 | `src/modules/landing/header.tsx` | MOVE |
| 47 | `src/components/landing/hero.tsx` | 40 | `src/modules/landing/hero.tsx` | MOVE |
| 48 | `src/components/landing/logo.tsx` | 24 | `src/modules/landing/logo.tsx` | MOVE |
| 49 | `src/components/landing/pricing.tsx` | 138 | `src/modules/landing/pricing.tsx` | MOVE |
| 50 | `src/components/landing/testimonials.tsx` | 59 | `src/modules/landing/testimonials.tsx` | MOVE |
| 51 | `src/lib/constants.ts` | 18 | `src/modules/shared/lib/constants.ts` | MOVE — per #3: module `shared/lib/` |
| 52 | `src/lib/date.ts` | 204 | `src/modules/shared/lib/date.ts` | MOVE — per #4 **Choice A**: canonical stays `shared/lib/date.ts`; add re-export at `src/modules/tasks/domain/date.ts` (`export * from "@/modules/shared/lib/date"`) |
| 52b | *(new re-export)* | — | `src/modules/tasks/domain/date.ts` | **NEW** — Choice A re-export: `export * from "@/modules/shared/lib/date"` so domain can import via `@/modules/tasks/domain/date` |
| 53 | `src/hooks/use-is-desktop.ts` | 19 | `src/modules/shared/hooks/use-is-desktop.ts` | MOVE — module `shared/hooks/` |
| 54 | `src/components/ui/button.tsx` | 40 | `src/modules/shared/ui/button.tsx` | MOVE — module `shared/ui/` |
| 55 | `src/components/auth/auth-actions.tsx` | 200 | `src/modules/auth/components/auth-actions.tsx` | MOVE — per #2: `modules/auth/components/` (resolved) |
| 56 | `src/components/auth/auth-field.tsx` | 72 | `src/modules/auth/components/auth-field.tsx` | MOVE — per #2: same |
| 57 | `src/components/auth/auth-overlay.tsx` | 82 | `src/modules/auth/components/auth-overlay.tsx` | MOVE — per #2: same |
| 58 | `src/components/auth/auth-shell.tsx` | 73 | `src/modules/auth/components/auth-shell.tsx` | MOVE — per #2: same |
| 59 | `src/components/app/add-task.tsx` | 600 | `src/modules/app-chrome/components/add-task.tsx` | MOVE — module `app-chrome` |
| 60 | `src/components/app/confirm-dialog.tsx` | 76 | `src/modules/app-chrome/components/confirm-dialog.tsx` | MOVE |
| 61 | `src/components/app/filters.tsx` | 319 | `src/modules/app-chrome/components/filters.tsx` | MOVE |
| 62 | `src/components/app/labels-view.tsx` | 354 | `src/modules/app-chrome/components/labels-view.tsx` | MOVE — co-located `from "./confirm-dialog"` stays sibling |
| 63 | `src/components/app/label-tasks.tsx` | 137 | `src/modules/app-chrome/components/label-tasks.tsx` | MOVE |
| 64 | `src/components/app/menus.tsx` | 504 | `src/modules/app-chrome/components/menus.tsx` | MOVE |
| 65 | `src/components/app/popover.tsx` | 71 | `src/modules/app-chrome/components/popover.tsx` | MOVE |
| 66 | `src/components/app/settings-view.tsx` | 169 | `src/modules/app-chrome/components/settings-view.tsx` | MOVE |
| 67 | `src/components/app/sidebar.tsx` | 214 | `src/modules/app-chrome/components/sidebar.tsx` | MOVE |
| 68 | `src/components/app/task-colors.tsx` | 82 | `src/modules/app-chrome/components/task-colors.tsx` | MOVE |
| 69 | `src/components/app/task-context-menu.tsx` | 129 | `src/modules/app-chrome/components/task-context-menu.tsx` | MOVE |
| 70 | `src/components/app/task-detail/task-detail-panel.tsx` | 379 | `src/modules/app-chrome/components/task-detail/task-detail-panel.tsx` | MOVE — sibling `from "./*-field"` stays sibling |
| 71 | `src/components/app/task-detail/tags-field.tsx` | 356 | `src/modules/app-chrome/components/task-detail/tags-field.tsx` | MOVE — `from "./shared"` stays sibling |
| 72 | `src/components/app/task-detail/subtasks-section.tsx` | 181 | `src/modules/app-chrome/components/task-detail/subtasks-section.tsx` | MOVE |
| 73 | `src/components/app/task-detail/priority-field.tsx` | 93 | `src/modules/app-chrome/components/task-detail/priority-field.tsx` | MOVE |
| 74 | `src/components/app/task-detail/due-date-field.tsx` | 100 | `src/modules/app-chrome/components/task-detail/due-date-field.tsx` | MOVE |
| 75 | `src/components/app/task-detail/shared.tsx` | 16 | `src/modules/app-chrome/components/task-detail/shared.tsx` | MOVE |
| 76 | `src/components/app/task-list.tsx` | 246 | `src/modules/app-chrome/components/task-list.tsx` | MOVE |
| 77 | `src/components/app/task-row.tsx` | 340 | `src/modules/app-chrome/components/task-row.tsx` | MOVE — `from "./task-context-menu"` stays sibling |
| 78 | `src/components/app/toast.tsx` | 43 | `src/modules/app-chrome/components/toast.tsx` | MOVE |
| 79 | `src/components/app/top-bar.tsx` | 47 | `src/modules/app-chrome/components/top-bar.tsx` | MOVE |
| 80 | `src/components/app/empty-states/completed-illustration.tsx` | 160 | `src/modules/app-chrome/components/empty-states/completed-illustration.tsx` | MOVE |
| 81 | `src/components/app/empty-states/filter-illustration.tsx` | 45 | `src/modules/app-chrome/components/empty-states/filter-illustration.tsx` | MOVE |
| 82 | `src/components/app/empty-states/inbox-illustration.tsx` | 45 | `src/modules/app-chrome/components/empty-states/inbox-illustration.tsx` | MOVE |
| 83 | `src/components/app/empty-states/labels-illustration.tsx` | 46 | `src/modules/app-chrome/components/empty-states/labels-illustration.tsx` | MOVE |
| 84 | `src/components/app/empty-states/search-illustration.tsx` | 45 | `src/modules/app-chrome/components/empty-states/search-illustration.tsx` | MOVE |
| 85 | `src/components/app/empty-states/today-illustration.tsx` | 52 | `src/modules/app-chrome/components/empty-states/today-illustration.tsx` | MOVE |
| 86 | `src/components/app/empty-states/upcoming-illustration.tsx` | 50 | `src/modules/app-chrome/components/empty-states/upcoming-illustration.tsx` | MOVE |

> Count: 81 existing + 6 new split files (`use-*-mutations.ts`×3 + `rate-limit.ts`+`validation.ts` + co-location no extra). No file left unmapped.

### NEEDS DECISION — RESOLVED per 2026-08-29 (Choice A)

| # | File | Decision (locked) | Reasoning |
|---|------|-------------------|-----------|
| 1 | `src/components/theme-toggle.tsx` (24 lines) | **→ `src/modules/theme/theme-toggle.tsx`** (modules/theme/) | Per user #1. Component toggles `data-theme` (`theme-provider.tsx:80`) but rendered in app-chrome; theme owns it, app-chrome imports via `@/modules/theme/theme-toggle`. |
| 2 | `src/components/auth/auth-*.tsx` (4 files) | **→ `src/modules/auth/components/*`** (not `ui/`) | Per user #2. Shells/fields only used by `features/auth/*-form.tsx`; auth owns them. Consumers update `from "@/components/auth/*"`→`@/modules/auth/components/*`. |
| 3 | `src/lib/constants.ts` (18 lines) | **→ `src/modules/shared/lib/constants.ts`** | Per user #3. Cross-cutting (nav/auth links), shared is correct. |
| 4 | `src/lib/date.ts` (204 lines) | **→ Choice A: `src/modules/shared/lib/date.ts` canonical + `src/modules/tasks/domain/date.ts` re-export** | Per user #4 Choice A. Verified 5 app-chrome consumers + 2 tasks consumers; canonical stays shared to avoid `app-chrome→tasks` inversion; domain re-exports so `selectors.ts:2` can import via `@/modules/tasks/domain/date`. |
| 5 | `src/db/*` (2 files) | **→ `src/db/*` STAY (top-level)** | Per user #5. No move; `from "@/db"` stays; no `drizzle.config.ts` change. |
| 6 | `src/features/todos/seed.ts` + 6 siblings | **→ `src/modules/tasks/domain/*` (8 files total)** | Per user #6 “rename all 7 to domain”. All `types.ts`, `selectors.ts`, `guest-storage(.test).ts`, `label-colors.ts`, `seed(.test).ts` → `domain/`; with #4 re-export, `domain/` holds 8 files. |

All 6 flags now resolved. No remaining NEEDS DECISION.

---

## Appendix — Import Rewrite Checklist (Phase 2)

After each `git mv`, update these alias imports (`tsconfig.json:22` stays `@/→src/*`, `vitest.config.mts:7` stays `@→src`):

| Old import | New import (final, Choice A) |
|------------|------------|
| `from "@/features/todos/types"` | `from "@/modules/tasks/domain/types"` (21 files) per #6 |
| `from "@/features/todos/guest-storage"` | `from "@/modules/tasks/domain/guest-storage"` (2 files + provider) |
| `from "@/features/todos/selectors"` | `from "@/modules/tasks/domain/selectors"` (4 files) |
| `from "@/features/todos/tasks-provider"` | `from "@/modules/tasks/store/tasks-provider"` (16 files) |
| `from "./types"` (inside tasks) | stays `./types` if co-located under `domain/`; provider's `./types` → `../domain/types` |
| `from "./guest-storage"` / `"./label-colors"` / `"./seed"` | stay sibling under `domain/`; provider's → `../domain/*` |
| `from "./actions"` (provider) | `from "../server/actions"` |
| `from "@/features/auth/errors"` | `from "@/modules/auth/errors"` |
| `from "@/features/auth/clerk-provider"` | `from "@/modules/auth/clerk-provider"` |
| `from "@/features/theme/theme-provider"` | `from "@/modules/theme/theme-provider"` |
| `from "@/components/app/*"` | `from "@/modules/app-chrome/components/*"` |
| `from "@/components/landing/*"` | `from "@/modules/landing/*"` |
| `from "@/components/auth/*"` | `from "@/modules/auth/components/*"` per #2 |
| `from "@/components/ui/button"` | `from "@/modules/shared/ui/button"` |
| `from "@/components/theme-toggle"` | `from "@/modules/theme/theme-toggle"` per #1 |
| `from "@/lib/constants"` | `from "@/modules/shared/lib/constants"` per #3 |
| `from "@/lib/date"` | `from "@/modules/shared/lib/date"` for app-chrome + `from "@/modules/tasks/domain/date"` for tasks domain (Choice A re-export: both resolve to shared canonical) |
| `from "@/hooks/use-is-desktop"` | `from "@/modules/shared/hooks/use-is-desktop"` |
| `from "@/db"` / `from "@/db/schema"` | **STAY** `from "@/db"` per #5 (no change) |

**Verification commands for Phase 2:** `git diff --stat` should show `R` renames only; `grep -rn "from \"@/features/" src` and `grep -rn "from \"@/components/" src` should return 0 after rewiring; `npm run lint`, `npm test`, `npm run build` must pass with only import-path fixes (no logic changes) before proceeding to Phase 3.

---

*End of RESTRUCTURE_AUDIT.md — Phase 1 complete. Do not start Phase 2 until NEEDS DECISION #1-6 are approved and `git status` is clean (stash `index.html` deletion + `PROJECT.md` untracked before branching).*
