# RESTRUCTURE_RESULT.md — Tick

> Phase 3 verification — `restructure/module-layout` branch. Generated 2026-08-29.  
> Base: `main` @ `243d01d` (audit). Branch: `restructure/module-layout`. No merge.

## 1. Before/After Path Mapping — reuse from RESTRUCTURE_AUDIT.md §6 (all DONE)

> `@/` → `src/` (`tsconfig.json:22` unchanged). Moves via `git mv` preserving history. `src/app/*` and `src/middleware.ts` and `src/db/*` stay per decisions. 81 existing + 6 new split files (3 store hooks + 2 server splits + 1 domain re-export) = 87 paths tracked. All 81 existing mapped.

| # | Existing path | New path | Status | Notes |
|---|---------------|----------|--------|-------|
| 1 | `src/app/layout.tsx` | `src/app/layout.tsx` | DONE — STAY | root layout |
| 2 | `src/app/page.tsx` | `src/app/page.tsx` | DONE — STAY | landing |
| 3 | `src/app/globals.css` | `src/app/globals.css` | DONE — STAY | Tailwind v4 |
| 4 | `src/app/icon.svg` | `src/app/icon.svg` | DONE — STAY | |
| 5 | `src/app/sign-in/page.tsx` | `src/app/sign-in/page.tsx` | DONE — STAY | |
| 6 | `src/app/sign-up/page.tsx` | `src/app/sign-up/page.tsx` | DONE — STAY | |
| 7 | `src/app/forgot-password/page.tsx` | `src/app/forgot-password/page.tsx` | DONE — STAY | |
| 8 | `src/app/app/layout.tsx` | `src/app/app/layout.tsx` | DONE — STAY | app shell |
| 9 | `src/app/app/page.tsx` | `src/app/app/page.tsx` | DONE — STAY | Inbox |
| 10 | `src/app/app/today/page.tsx` | `src/app/app/today/page.tsx` | DONE — STAY | |
| 11 | `src/app/app/upcoming/page.tsx` | `src/app/app/upcoming/page.tsx` | DONE — STAY | |
| 12 | `src/app/app/completed/page.tsx` | `src/app/app/completed/page.tsx` | DONE — STAY | |
| 13 | `src/app/app/settings/page.tsx` | `src/app/app/settings/page.tsx` | DONE — STAY | |
| 14 | `src/app/app/labels/page.tsx` | `src/app/app/labels/page.tsx` | DONE — STAY | |
| 15 | `src/app/app/labels/[labelId]/page.tsx` | `src/app/app/labels/[labelId]/page.tsx` | DONE — STAY | |
| 16 | `src/middleware.ts` | `src/middleware.ts` | DONE — STAY | clerkMiddleware |
| 17 | `src/db/index.ts` | `src/db/index.ts` | DONE — STAY per #5 | no move |
| 18 | `src/db/schema.ts` | `src/db/schema.ts` | DONE — STAY per #5 | |
| 19 | `src/features/todos/types.ts` | `src/modules/tasks/domain/types.ts` | DONE | R |
| 20 | `src/features/todos/selectors.ts` | `src/modules/tasks/domain/selectors.ts` | DONE | R; now `from "@/modules/tasks/domain/date"` |
| 21 | `src/features/todos/guest-storage.ts` | `src/modules/tasks/domain/guest-storage.ts` | DONE | R |
| 22 | `src/features/todos/label-colors.ts` | `src/modules/tasks/domain/label-colors.ts` | DONE | R |
| 23 | `src/features/todos/seed.ts` | `src/modules/tasks/domain/seed.ts` | DONE | R per #6 |
| 24 | `src/features/todos/guest-storage.test.ts` | `src/modules/tasks/domain/guest-storage.test.ts` | DONE | R |
| 25 | `src/features/todos/seed.test.ts` | `src/modules/tasks/domain/seed.test.ts` | DONE | R; now `from "@/modules/tasks/domain/date"` |
| 26 | `src/features/todos/tasks-provider.tsx` | `src/modules/tasks/store/tasks-provider.tsx` | DONE | **SPLIT** — RM (887→304, hooks extracted) |
| 27 | *(new)* | `src/modules/tasks/store/use-task-mutations.ts` | DONE | NEW 311 lines |
| 28 | *(new)* | `src/modules/tasks/store/use-subtask-mutations.ts` | DONE | NEW 144 lines |
| 29 | *(new)* | `src/modules/tasks/store/use-label-category-mutations.ts` | DONE | NEW 302 lines |
| 30 | `src/features/todos/actions.ts` | `src/modules/tasks/server/actions.ts` | DONE | **SPLIT** — R (420→294, extracted) `"use server"` stays here only |
| 31 | *(new)* | `src/modules/tasks/server/rate-limit.ts` | DONE | NEW 20 lines (`RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_WRITES`, `checkRateLimit`, `__clearRateLimitForTests`) |
| 32 | *(new)* | `src/modules/tasks/server/validation.ts` | DONE | NEW 129 lines (`MAX_*`, `validate*`) |
| 33 | `src/features/auth/clerk-provider.tsx` | `src/modules/auth/clerk-provider.tsx` | DONE | R |
| 34 | `src/features/auth/errors.ts` | `src/modules/auth/errors.ts` | DONE | R |
| 35 | `src/features/auth/errors.test.ts` | `src/modules/auth/errors.test.ts` | DONE | R |
| 36 | `src/features/auth/sign-in-form.tsx` | `src/modules/auth/sign-in-form.tsx` | DONE | R; now `from "@/modules/auth/components/*"` |
| 37 | `src/features/auth/sign-up-form.tsx` | `src/modules/auth/sign-up-form.tsx` | DONE | R |
| 38 | `src/features/auth/forgot-password-form.tsx` | `src/modules/auth/forgot-password-form.tsx` | DONE | R |
| 39 | `src/features/theme/theme-provider.tsx` | `src/modules/theme/theme-provider.tsx` | DONE | R |
| 40 | `src/components/theme-toggle.tsx` | `src/modules/theme/theme-toggle.tsx` | DONE | R per #1 |
| 41 | `src/components/landing/app-mockup.tsx` | `src/modules/landing/app-mockup.tsx` | DONE | R |
| 42 | `src/components/landing/faq.tsx` | `src/modules/landing/faq.tsx` | DONE | R |
| 43 | `src/components/landing/features.tsx` | `src/modules/landing/features.tsx` | DONE | R |
| 44 | `src/components/landing/final-cta.tsx` | `src/modules/landing/final-cta.tsx` | DONE | R |
| 45 | `src/components/landing/footer.tsx` | `src/modules/landing/footer.tsx` | DONE | R |
| 46 | `src/components/landing/header.tsx` | `src/modules/landing/header.tsx` | DONE | R |
| 47 | `src/components/landing/hero.tsx` | `src/modules/landing/hero.tsx` | DONE | R |
| 48 | `src/components/landing/logo.tsx` | `src/modules/landing/logo.tsx` | DONE | R |
| 49 | `src/components/landing/pricing.tsx` | `src/modules/landing/pricing.tsx` | DONE | R |
| 50 | `src/components/landing/testimonials.tsx` | `src/modules/landing/testimonials.tsx` | DONE | R |
| 51 | `src/lib/constants.ts` | `src/modules/shared/lib/constants.ts` | DONE | R per #3 |
| 52 | `src/lib/date.ts` | `src/modules/shared/lib/date.ts` | DONE | R per #4 Choice A (canonical) |
| 52b | *(new re-export)* | `src/modules/tasks/domain/date.ts` | DONE | NEW 1 line `export * from "@/modules/shared/lib/date"` per Choice A |
| 53 | `src/hooks/use-is-desktop.ts` | `src/modules/shared/hooks/use-is-desktop.ts` | DONE | R |
| 54 | `src/components/ui/button.tsx` | `src/modules/shared/ui/button.tsx` | DONE | R |
| 55 | `src/components/auth/auth-actions.tsx` | `src/modules/auth/components/auth-actions.tsx` | DONE | R per #2 |
| 56 | `src/components/auth/auth-field.tsx` | `src/modules/auth/components/auth-field.tsx` | DONE | R per #2 |
| 57 | `src/components/auth/auth-overlay.tsx` | `src/modules/auth/components/auth-overlay.tsx` | DONE | R per #2 |
| 58 | `src/components/auth/auth-shell.tsx` | `src/modules/auth/components/auth-shell.tsx` | DONE | R per #2 |
| 59 | `src/components/app/add-task.tsx` | `src/modules/app-chrome/components/add-task.tsx` | DONE | R |
| 60 | `src/components/app/confirm-dialog.tsx` | `src/modules/app-chrome/components/confirm-dialog.tsx` | DONE | R |
| 61 | `src/components/app/filters.tsx` | `src/modules/app-chrome/components/filters.tsx` | DONE | R |
| 62 | `src/components/app/labels-view.tsx` | `src/modules/app-chrome/components/labels-view.tsx` | DONE | R |
| 63 | `src/components/app/label-tasks.tsx` | `src/modules/app-chrome/components/label-tasks.tsx` | DONE | R |
| 64 | `src/components/app/menus.tsx` | `src/modules/app-chrome/components/menus.tsx` | DONE | R |
| 65 | `src/components/app/popover.tsx` | `src/modules/app-chrome/components/popover.tsx` | DONE | R |
| 66 | `src/components/app/settings-view.tsx` | `src/modules/app-chrome/components/settings-view.tsx` | DONE | R |
| 67 | `src/components/app/sidebar.tsx` | `src/modules/app-chrome/components/sidebar.tsx` | DONE | R |
| 68 | `src/components/app/task-colors.tsx` | `src/modules/app-chrome/components/task-colors.tsx` | DONE | R |
| 69 | `src/components/app/task-context-menu.tsx` | `src/modules/app-chrome/components/task-context-menu.tsx` | DONE | R |
| 70 | `src/components/app/task-detail/task-detail-panel.tsx` | `src/modules/app-chrome/components/task-detail/task-detail-panel.tsx` | DONE | R |
| 71 | `src/components/app/task-detail/tags-field.tsx` | `src/modules/app-chrome/components/task-detail/tags-field.tsx` | DONE | R |
| 72 | `src/components/app/task-detail/subtasks-section.tsx` | `src/modules/app-chrome/components/task-detail/subtasks-section.tsx` | DONE | R |
| 73 | `src/components/app/task-detail/priority-field.tsx` | `src/modules/app-chrome/components/task-detail/priority-field.tsx` | DONE | R |
| 74 | `src/components/app/task-detail/due-date-field.tsx` | `src/modules/app-chrome/components/task-detail/due-date-field.tsx` | DONE | R |
| 75 | `src/components/app/task-detail/shared.tsx` | `src/modules/app-chrome/components/task-detail/shared.tsx` | DONE | R |
| 76 | `src/components/app/task-list.tsx` | `src/modules/app-chrome/components/task-list.tsx` | DONE | R |
| 77 | `src/components/app/task-row.tsx` | `src/modules/app-chrome/components/task-row.tsx` | DONE | R |
| 78 | `src/components/app/toast.tsx` | `src/modules/app-chrome/components/toast.tsx` | DONE | R |
| 79 | `src/components/app/top-bar.tsx` | `src/modules/app-chrome/components/top-bar.tsx` | DONE | R |
| 80 | `src/components/app/empty-states/completed-illustration.tsx` | `src/modules/app-chrome/components/empty-states/completed-illustration.tsx` | DONE | R |
| 81 | `src/components/app/empty-states/filter-illustration.tsx` | `src/modules/app-chrome/components/empty-states/filter-illustration.tsx` | DONE | R |
| 82 | `src/components/app/empty-states/inbox-illustration.tsx` | `src/modules/app-chrome/components/empty-states/inbox-illustration.tsx` | DONE | R |
| 83 | `src/components/app/empty-states/labels-illustration.tsx` | `src/modules/app-chrome/components/empty-states/labels-illustration.tsx` | DONE | R |
| 84 | `src/components/app/empty-states/search-illustration.tsx` | `src/modules/app-chrome/components/empty-states/search-illustration.tsx` | DONE | R |
| 85 | `src/components/app/empty-states/today-illustration.tsx` | `src/modules/app-chrome/components/empty-states/today-illustration.tsx` | DONE | R |
| 86 | `src/components/app/empty-states/upcoming-illustration.tsx` | `src/modules/app-chrome/components/empty-states/upcoming-illustration.tsx` | DONE | R |

All old dirs (`src/features/`, `src/components/app/`, `src/components/auth/`, `src/components/landing/`, `src/components/ui/`, `src/hooks/`, `src/lib/`) deleted (empty after `git mv`).

## 2. useTasks() Public API — unchanged (byte-identical to callers)

**Before:** `src/features/todos/tasks-provider.tsx:55-94` (`TasksContextValue`)
**After:** `src/modules/tasks/store/tasks-provider.tsx:49-88` — identical.

```
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
}
```

Verification:

- `grep -rn "from.*tasks-provider"` after: 16 consumers (`src/app/app/layout.tsx:8` `{TasksProvider}` + 15 `useTasks` sites) — same count as audit §2.
- No caller changed: `add-task.tsx:18`, `filters.tsx:6`, `label-tasks.tsx:10`, `labels-view.tsx:14`, `menus.tsx:23`, `sidebar.tsx:19`, `task-context-menu.tsx:6`, `task-detail/*:5`, `tags-field.tsx:12`, `task-detail-panel.tsx:14`, `task-list.tsx:13`, `task-row.tsx:9`, `toast.tsx:3` — all now `from "@/modules/tasks/store/tasks-provider"` only path change.
- Provider composes via `useTaskMutations`, `useSubtaskMutations`, `useLabelCategoryMutations` — external `useTasks()` signature not changed, hooks internal `setProTasks`/`showToast` wiring preserves behavior.

**Result: PASS — useTasks API identical before/after.**

## 3. Server Action Signatures — unchanged

**Before:** `src/features/todos/actions.ts:197-420`  
**After:** `src/modules/tasks/server/actions.ts:71-294` — only `"use server"` file; helpers moved to `rate-limit.ts`/`validation.ts`.

```
export async function getTasks(): Promise<Task[]>
export async function createTask(input: AddTaskInput): Promise<Task>
export async function updateTask(id: string, patch: Partial<Task>): Promise<Task>
export async function deleteTask(id: string): Promise<void>
export async function reorderTasks(orderedIds: string[]): Promise<Task[]>
export async function toggleTask(id: string): Promise<Task>
export async function duplicateTask(id: string): Promise<Task>
```

- Validation caps unchanged: title 200 (`validation.ts:12` `MAX_TITLE_LENGTH`), description 2000, labelIds 20, subtasks 50, position bounds 1..1_000_000.
- Rate-limit unchanged: `RATE_LIMIT_WINDOW_MS=60_000`, `RATE_LIMIT_MAX_WRITES=30` (`rate-limit.ts:1-2`), `checkRateLimit(userId)` per-user bucket.
- Consumer: `src/modules/tasks/store/tasks-provider.tsx:37` (`serverGetTasks`) + 3 mutation hooks (`serverCreateTask` etc) now `from "@/modules/tasks/server/actions"` — alias only, signatures byte-identical.
- `__clearRateLimitForTests` now lives in `src/modules/tasks/server/rate-limit.ts:9` (not re-exported from `actions.ts` to avoid client bundling; no test imports it via actions on this branch).

**Result: PASS — signatures unchanged.**

## 4. Verify — lint / test / build (only import/path fixes)

### `npm run lint` — PASS

```
> tick@0.1.0 lint
> eslint

(no output — 0 errors, 0 warnings)
```

Previous run had 3 warnings for unused `saveGuestCategories`/`saveGuestLabels`/`Subtask` in staged provider; fixed by removing unused imports (`tasks-provider.tsx:27-34`).

### `npm test` — PASS

```
> tick@0.1.0 test
> vitest run

 RUN  v4.1.10 C:/Users/Navi/Documents/my personal website

 Test Files  3 passed (3)
      Tests  44 passed (44)
   Start at  09:03:10
   Duration  438ms (transform 272ms, setup 0ms, import 358ms, tests 30ms, environment 0ms)
```

- 3 files: `src/modules/auth/errors.test.ts` (now `from "@/modules/auth/errors"`), `src/modules/tasks/domain/guest-storage.test.ts` (sibling `./guest-storage` + `./types`), `src/modules/tasks/domain/seed.test.ts` (now `from "@/modules/tasks/domain/date"` via Choice A re-export).

### `npm run build` — PASS

```
> tick@0.1.0 build
> next build

▲ Next.js 16.3.1 (Turbopack)
- Environments: .env
✓ Running next.config.ts took 56ms
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
  Creating an optimized production build ...
✓ Compiled successfully in 1118ms
  Running TypeScript ...
  Finished TypeScript in 2.8s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/16) ...
  Generating static pages using 7 workers (16/16) in 951ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /app
├ ○ /app/completed
├ ○ /app/labels
├   /app/labels/[labelId]
│ ├ ● /app/labels/work
│ ├ ● /app/labels/personal
│ └ ● /app/labels/errands
├ ○ /app/settings
├ ○ /app/today
├ ○ /app/upcoming
├ ○ /forgot-password
├ ○ /icon.svg
├ ○ /sign-in
└ ○ /sign-up

ƒ Proxy (Middleware)
○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses generateStaticParams)
```

Reported verbatim — no import/path errors. One fix required after initial split: removing `export { __clearRateLimitForTests } from "./rate-limit"` from `actions.ts:34` (re-export of non-server code caused client bundling to see no server exports); after removal, build passes.

## 5. Remaining NEEDS DECISION

**None.** All 6 audit flags resolved per 2026-08-29 decisions:

1. `theme-toggle` → `modules/theme/` ✓
2. `components/auth` → `modules/auth/components/` ✓
3. `constants` → `shared/lib/` ✓
4. `date` → Choice A: canonical `shared/lib/date.ts` + re-export `tasks/domain/date.ts` ✓
5. `db` → `src/db/` stay ✓
6. `seed` + 6 siblings → `tasks/domain/` ✓

## 6. Branch / Next Steps

- Branch `restructure/module-layout` not merged or deleted (as instructed). `git diff --cached --stat` shows mostly `R` renames for pure moves; split files show `D`+`A`/`RM` with edits (expected). `tsconfig.json` and `vitest.config.mts` path aliases unchanged (`@/`→`src/`).
- Manual smoke-test not run here (`npm run dev` — guest CRUD, limit 10, label filter, theme toggle, one auth flow) — perform before merging to `main`.
- Do not delete branch until RESTRUCTURE_RESULT.md review + smoke test pass.

---

*End of RESTRUCTURE_RESULT.md — Phase 3 complete. Lint PASS, Test PASS (3/44), Build PASS.*
