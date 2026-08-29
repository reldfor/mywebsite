# Tick — Project Overview

> **Tagline:** "a todo list you'll actually finish" — *Your tasks, not your taskmaster.*

Tick is a quiet, keyboard-first todo workspace built with **Next.js 16 (App Router) + React 19 + Tailwind v4**. It works **without login** (guest tier, localStorage) and upgrades to a **Clerk-authenticated** tier with server persistence (Neon + Drizzle). Landing page + app shell are live; DB-backed sync is the next phase.

---

## 1. What it is & Status

| Area | State |
|------|-------|
| **Landing page** (`/`) | Live — Hero, Features, Testimonials, Pricing, FAQ, Final CTA, Footer |
| **Task app** (`/app`) | Live — Inbox/Today/Upcoming/Completed/Labels/Settings, fully client-side |
| **Guest tier** | Live — React Context (`TasksProvider`) + `localStorage` + `useSyncExternalStore` external store |
| **Auth (Clerk)** | Live (client-only) — custom sign-in / sign-up / verification / forgot-password / Google OAuth popup |
| **Database / API** | Scaffolded (`src/db/schema.ts`, `src/features/todos/actions.ts` with Neon/Drizzle) but not yet wired to UI in static export. `next.config.ts` currently has no `output: "export"` (see note below). |
| **Hosting target** | Cloudflare Pages (static) → Workers path when server auth lands |

> **Note on `AGENTS.md` / `CODEBASE.md` vs reality (Aug 2026):** Those docs describe `output: "export"` and `@clerk/react` only. The current code uses `@clerk/nextjs` + `useUser` from `@clerk/nextjs`, has `src/middleware.ts` (Clerk) and server actions (`"use server"` in `actions.ts`). `next.config.ts:3` has no export — consistent with the server-action path. Treat `AGENTS.md` as the *product spec* and this file as the *verified tree snapshot*.

---

## 2. Features

### Landing (`src/app/page.tsx` → `src/components/landing/`)
- **Header** — nav (`#features`, `#pricing`, `#faq`) + CTA (`/app`, `/sign-in`)
- **Hero** — headline `Your tasks, not your taskmaster.` + `AppMockup` (fake app grid)
- **Features** — 5-card grid (Capture, Organize, Focus, Sync, etc.)
- **Testimonials / Pricing / FAQ** — pricing is "Pro free at launch", FAQ is collapsible (`tl-faq`)
- **Final CTA** + **Footer**
- Styling scoped to `.tick-landing` tokens (see `globals.css:591`)

### Task App (`src/app/app/*` → `src/components/app/`)
- **Views:** Inbox (`todo`+`in_progress`), Today (due today or overdue), Upcoming (future `dueAt`), Completed, Labels (per-label), Settings
- **Task CRUD:** `addTask`, `updateTask`, `deleteTask`, `duplicateTask`, `toggleTask`, `archiveTask`/`restoreTask`, `reorderTasks` (manual drag order via `position`)
- **Rich task fields:** `title` (200), `description` (2000), `priority` (none/low/medium/high/urgent), `dueAt` + derived `startDate`/`endDate`, `status` (todo/in_progress/completed/archived), `labelIds[]`, `categoryId`, `subtasks[]`
- **Subtasks:** `addSubtask` / `toggleSubtask` / `deleteSubtask` (per-task `position`)
- **Labels & Categories:** `addLabel`/`updateLabel`/`deleteLabel`, `addCategory`/`deleteCategory` (deletion unassigns tasks + cleans filters; undo via toast)
- **Labels:** 12 `LabelTone`s (`gray`…`brown`) + 3 seed defaults (Work/blue, Personal/yellow, Errands/gray) — `src/features/todos/label-colors.ts`
- **Filtering & Sorting:** `Filters` (statuses, priorities, due, labelIds) + `SortKey` (manual/due/priority/created/updated) — `src/features/todos/selectors.ts` + `Filters`/`SortControl` UI
- **Search:** sidebar+topBar global `searchQuery` (`matchesSearch` checks title+description)
- **Selection:** `selectedTaskId` → `TaskDetailPanel` (side sheet split into `tags-field`, `priority-field`, `due-date-field`, `subtasks-section`)
- **Composer:** `AddTask` — collapsed FAB / desktop pill → expanded form (due date/time, category, priority, labels, subtasks, notes). Guest limit guard: shows `Create an account` at `tasks.length >= taskLimit`.
- **Guest limit UX:** limit bar in `Sidebar` (shows at all counts for guests), upgrade prompt at 8/10, hard block at 10
- **Toasts & Undo:** `Toast` with undo actions for delete/archive/label/category deletes
- **Empty states:** dedicated illustrations per view (`src/components/app/empty-states/`)

### Auth (`src/features/auth/` + `src/components/auth/` + `src/app/(sign-in|sign-up|forgot-password)`)
- **Flows:** email/password sign-in (`signIn.password`), sign-up (`signUp.password` + email code `signUp.verifications.*`), forgot password (`signIn.resetPasswordEmailCode.*`), Google OAuth popup (`signIn.sso({ popup })`), MFA/email-code device trust (`signIn.mfa.*`), bot captcha placeholder (`<div id="clerk-captcha" />`)
- **Hooks:** `useSignIn`/`useSignUp`/`useUser`/`useAuth`/`useClerk` from `@clerk/nextjs` (current) — `AGENTS.md` prescribes `@clerk/react` for static export
- **Error handling:** every Clerk error mapped through `features/auth/errors.ts` (`clerkCodeToMessage`, `clerkFieldMessage`, `clerkGlobalMessage`) — never raw Clerk copy
- **Route behavior:** `/app` open to guests (by design); signed-in users redirect away from `/sign-in` etc.; `SidebarAccountMenu` swaps guest ↔ account via `useUser()`

### Theming (`src/features/theme/`)
- `ThemeProvider` + `useTheme()` — `light`/`dark`, initial from `localStorage:tick.theme` or `matchMedia`, applied via `data-theme` on `<html>` + `meta[name="theme-color"]`. Script in `src/app/layout.tsx:33` prevents FOUC.

---

## 3. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.3.1 App Router, React 19.2.8, TypeScript 5.9 |
| Styling | Tailwind CSS v4.3.3 (CSS-first `@theme` in `globals.css`, no `tailwind.config.js`), PostCSS `@tailwindcss/postcss` |
| Auth | Clerk — `@clerk/nextjs` 7.8.2 + `@clerk/react` 6.14.3 (v7 future resource API) |
| DB | Neon PostgreSQL (`@neondatabase/serverless` 1.1.0) + Drizzle ORM 0.45.2 + `drizzle-kit` |
| Icons | `lucide-react` 1.31.0 |
| Motion | `motion` 13.1.1 |
| Tests | `vitest` 4.1.10 (node env, `@/` alias), ESLint 9 + `eslint-config-next` |
| Fonts | `next/font` — Geist, Geist Mono, Inter |

---

## 4. Codebase Structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx                # root: fonts, theme init script, <ClerkProvider>
│   │   ├── globals.css               # Tailwind v4 tokens + app + landing theme vars
│   │   ├── page.tsx                  # / — landing composition
│   │   ├── icon.svg
│   │   ├── sign-in/page.tsx          # custom Clerk pages
│   │   ├── sign-up/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── app/
│   │       ├── layout.tsx            # app shell: ThemeProvider > TasksProvider > TopBar+Sidebar+Detail+Toast
│   │       ├── page.tsx              # /app — Inbox
│   │       ├── today/page.tsx
│   │       ├── upcoming/page.tsx
│   │       ├── completed/page.tsx
│   │       ├── labels/page.tsx
│   │       ├── labels/[labelId]/page.tsx
│   │       └── settings/page.tsx
│   ├── components/
│   │   ├── ui/button.tsx             # variant: primary/secondary/ghost/destructive
│   │   ├── theme-toggle.tsx
│   │   ├── landing/                  # header, hero, app-mockup, features, testimonials, pricing, faq, final-cta, footer, logo
│   │   ├── app/                      # top-bar, sidebar, task-list, task-row, add-task, filters, menus, popover, toast,
│   │   │   ├── task-detail/          # task-detail-panel + tags-field, subtasks-section, priority-field, due-date-field, shared
│   │   │   ├── empty-states/         # inbox/today/upcoming/completed/labels/search/filter illustrations
│   │   │   ├── labels-view, label-tasks, settings-view, task-colors, task-context-menu, confirm-dialog
│   │   │   └── ...
│   │   └── auth/                     # auth-shell, auth-field, auth-actions (SubmitButton, GoogleButton), auth-overlay
│   ├── features/
│   │   ├── todos/
│   │   │   ├── types.ts              # single source of truth: Task, Label, Category, Priority, etc.
│   │   │   ├── tasks-provider.tsx    # 887-line central store — all mutations via useTasks()
│   │   │   ├── guest-storage.ts      # localStorage (todo-app:guest-*) + sanitize + external store + GUEST_TASK_LIMIT=10
│   │   │   ├── selectors.ts          # getViewTasks, applyFilters, sortTasks, counts
│   │   │   ├── seed.ts               # seedLabels (3) + createSeedTasks() (6 tutorials)
│   │   │   ├── label-colors.ts       # LABEL_COLORS (12), dot/text classes, legacy tone map
│   │   │   ├── actions.ts            # "use server" — getTasks/createTask/updateTask/deleteTask/reorder/toggle/duplicate (Drizzle + auth + rate-limit + validation)
│   │   │   └── *.test.ts             # guest-storage.test.ts, seed.test.ts
│   │   ├── auth/
│   │   │   ├── clerk-provider.tsx    # client boundary re-exporting ClerkProvider with publishableKey
│   │   │   ├── errors.ts             # Clerk code → friendly message map
│   │   │   ├── sign-in-form.tsx      # password + MFA step
│   │   │   ├── sign-up-form.tsx      # password + verification step
│   │   │   └── forgot-password-form.tsx
│   │   └── theme/theme-provider.tsx
│   ├── hooks/use-is-desktop.ts
│   ├── lib/constants.ts              # appName, container, navLinks, authLinks
│   ├── lib/date.ts                   # daysFromNow, isDueToday/isOverdue/isUpcoming, formatDueShort
│   ├── db/
│   │   ├── schema.ts                 # pgTable `tasks` (userId, title, status, priority, dueAt, position, labelIds jsonb…)
│   │   └── index.ts                  # neon → drizzle singleton (server-only)
│   └── middleware.ts                 # Clerk middleware
├── drizzle/                          # generated migrations
├── drizzle.config.ts                 # requires DATABASE_URL
├── next.config.ts                    # allowedDevOrigins: ["192.168.68.59"] (no output:"export" at present)
├── vitest.config.mts                 # alias @→src, env node
├── eslint.config.mjs / postcss.config.mjs / tsconfig.json
├── package.json                      # scripts: dev, build, start, lint, test
├── AGENTS.md                         # product spec + agent rules (tiers, DB plan, quotas)
├── CODEBASE.md                       # detailed file map (some export/auth details stale — see §1 note)
└── CLAUDE.md                         # → @AGENTS.md
```

---

## 5. Architecture Notes

### State & Persistence
- `TasksProvider` (`src/features/todos/tasks-provider.tsx:115`) is the sole state owner. `useTasks()` is the only mutation path.
- **Guest:** `guest-storage.ts` — keys `todo-app:guest-tasks`, `todo-app:guest-categories`, `todo-app:guest-labels`. Load is sanitized (drops malformed entries, migrates legacy tones `pen→blue`, `marker→yellow`). External store (`subscribeGuestTasks`/`getGuestTasksSnapshot`/`setGuestTasks`) feeds `useSyncExternalStore`; `storage` param is injectable for tests. `GUEST_TASK_LIMIT = 10`.
- **Pro (scaffolded):** `isPro = isLoaded && isSignedIn` (`tasks-provider.tsx:117`). When `isPro`, tasks come from `serverGetTasks()` → `proTasks` state; all mutations fan out to `server*` actions. Guests never hit the server. Labels/categories remain localStorage in both tiers today (DB has only `tasks` table).
- Guest→account migration (preserve tasks/labels/subtasks/order, no dupes, no delete-on-failure) is **planned, not yet implemented** — see AGENTS.md product rules.

### Domain Types (`src/features/todos/types.ts`)
`Priority = none|low|medium|high|urgent`, `TaskStatus = todo|in_progress|completed|archived`, `LabelTone` (12), `CategoryColor`/`CategoryIcon` (6 each), `Task` (id, title, description, status, priority, dueAt, completedAt, position, createdAt, updatedAt, labelIds[], subtasks[], categoryId, startDate, endDate), `View`, `SortKey`, `Filters`.

### Auth
- `src/features/auth/clerk-provider.tsx:1` — `"use client"` wrapper injecting `publishableKey` (Next can only inline statically-referenced `NEXT_PUBLIC_*`).
- `src/middleware.ts` — Clerk auth middleware.
- Google OAuth is **popup**-based (`signIn.sso({ popup })`) — no callback route, works on static host.
- Errors via `src/features/auth/errors.ts` — maps `form_identifier_not_found`, `form_password_incorrect`, `form_code_*`, `too_many_requests`, `captcha_*`, `oauth_*`, `session_expired`, etc.

### Server Actions (`src/features/todos/actions.ts`)
Validated, rate-limited (30 writes / 60s per user, in-memory bucket) CRUD over `tasks` table: `getTasks`, `createTask`, `updateTask`, `deleteTask`, `reorderTasks`, `toggleTask`, `duplicateTask`. All gated by `auth()` → `userId`; ownership via `where(eq(tasks.userId, userId))`. Input caps: title 200, description 2000, labelIds 20, subtasks 50, position 1..1_000_000.

### Styling
- Tailwind v4: theme via `@theme inline` in `globals.css:3` (paper/surface/ink/pen/marker/line/composer/lp-* tokens). No `tailwind.config.js`.
- Light tokens in `:root` (`globals.css:53`), dark in `:root[data-theme="dark"]` (`:141`), system fallback in `@media (prefers-color-scheme: dark)` for unset theme.
- Landing tokens isolated under `.tick-landing` (`:592`).
- App components are `"use client"`; pages are thin wrappers. Responsive: shared components with `md:`/`lg:` breakpoints, no separate mobile files.

---

## 6. Routes

| Path | File | Purpose |
|------|------|---------|
| `/` | `src/app/page.tsx` | Landing |
| `/sign-in` | `src/app/sign-in/page.tsx` | Clerk sign-in |
| `/sign-up` | `src/app/sign-up/page.tsx` | Clerk sign-up + verification |
| `/forgot-password` | `src/app/forgot-password/page.tsx` | Reset via code |
| `/app` | `src/app/app/page.tsx` | Inbox |
| `/app/today` | `src/app/app/today/page.tsx` | Due today / overdue |
| `/app/upcoming` | `src/app/app/upcoming/page.tsx` | Future due |
| `/app/completed` | `src/app/app/completed/page.tsx` | Completed |
| `/app/labels` | `src/app/app/labels/page.tsx` | Manage + browse labels |
| `/app/labels/[labelId]` | `src/app/app/labels/[labelId]/page.tsx` | Label-filtered tasks |
| `/app/settings` | `src/app/app/settings/page.tsx` | Settings |

---

## 7. Configuration & Scripts

```bash
npm run dev     # next dev (allowedDevOrigins: 192.168.68.59)
npm run lint    # eslint
npm test        # vitest run (node env, @ → src)
npm run build   # next build (currently standard build; AGENTS.md expects static export to out/)
```

- **Env:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (client), `DATABASE_URL` (server, for `drizzle.config.ts` + `src/db/index.ts`). `.env` gitignored.
- **Path alias:** `@/` → `src/` (`tsconfig.json`, `vitest.config.mts`).
- **Tests:** colocated `*.test.ts` — `guest-storage.test.ts`, `seed.test.ts`, `auth/errors.test.ts`.

---

## 8. Conventions (from AGENTS.md)

- Domain types only in `features/todos/types.ts`.
- Mutations only via `useTasks()`; no direct `localStorage` access.
- Clerk errors only via `features/auth/errors.ts`.
- Auth only via `@clerk/*` hooks; no parallel system.
- Tailwind v4 CSS-based config; dark mode via `data-theme`.
- No code comments unless requested.
- Verify with `lint → test → build`.

---

## 9. Backend Roadmap (from AGENTS.md, not yet live)

`Neon schema → Drizzle migrations → API routes → server-side guest quota (10) → sync/caching`. Planned tables: `profiles` (unique `clerk_user_id`), `todos` (owned by `user_id` XOR `anonymous_workspace_id`), `labels`, `todo_labels`, `subtasks`, `anonymous_workspaces`. Use `userId` as canonical id; validate with Zod; per-IP rate limits for anonymous. File/image storage is out of scope v1. When server auth is required, adopt Workers deployment + `@clerk/nextjs/server` (`auth()`).
