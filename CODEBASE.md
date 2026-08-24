# CODEBASE.md — Tick

Read this file first. It maps the entire project so you do not need to glob/grep the tree.

## Status

- Landing page + task app with local state (React context) — working.
- Guest tier: Inbox and all views run on real guest tasks persisted to browser `localStorage` — tasks (`todo-app:guest-tasks`), categories (`todo-app:guest-categories`), labels (`todo-app:guest-labels`) — sanitized load/save with injectable storage for tests, external store via `useSyncExternalStore` (`subscribeGuestTasks`/`getGuestTasksSnapshot`/`setGuestTasks` in `guest-storage.ts`). 10-task guest limit (`GUEST_TASK_LIMIT = 10`) enforced in the provider (UI + client-side guard). New guests start empty (no auto-seed); `features/todos/seed.ts` provides `seedLabels` (3 defaults) and optional tutorial seeding via `createSeedTasks()` (6 tasks: welcome, complete, today, upcoming, priority, subtasks) — caller-driven, not auto-persisted, validated in `seed.test.ts` to stay within the guest limit.
- **Clerk authentication is live** behind the app's custom UI (sign-in, sign-up + email verification, Google OAuth, forgot password, user menu, sign out). No Neon/Drizzle/API routes yet — that's the next phase.
- Next.js 16.3.1 (App Router), React 19.2.8, Tailwind v4.3.3, TypeScript 5.9, lucide-react 1.31.0, **@clerk/react 6.14.3** (Clerk's v7 custom-flow SDK — see "Clerk integration notes" below), vitest 4.1.10. No shadcn, TanStack Query, dnd-kit, zod, react-hook-form in direct dependencies (zod/@tanstack/query appear only transitively via `@clerk/shared`).
- Static export build (`next.config.ts` uses `output: "export"` with `allowedDevOrigins: ["192.168.68.59"]`; build output `out/`) — Cloudflare Pages target.

### Clerk integration notes (read before touching auth)

- Provider: `ClerkProvider` is re-exported through `src/features/auth/clerk-provider.tsx` (a `"use client"` boundary) and wraps the root layout. It passes `publishableKey` explicitly because `@clerk/shared` reads env at runtime and Next can only inline statically-referenced `NEXT_PUBLIC_*` vars.
- Package choice: we use **`@clerk/react`** (same hooks API the Next.js SDK re-exports), NOT `@clerk/nextjs`. The v7 `@clerk/nextjs` provider statically imports server-action modules (`keyless-actions`, `server-actions`) which Next.js rejects with `output: "export"`. When the backend phase lands (Neon + route handlers per AGENTS.md), switch the hosting to a Workers-compatible path and use `@clerk/nextjs/server` (`auth()`) for server-side authorization.
- Flow API (v7 "future" resources): `useSignIn()` / `useSignUp()` return `{ signIn, errors, fetchStatus }`. Methods: `signIn.password()`, `signIn.sso()` (Google, popup-based), `signIn.mfa.*`, `signIn.finalize({ navigate })`, `signUp.password()`, `signUp.verifications.*`, `signUp.finalize({ navigate })`, `signIn.resetPasswordEmailCode.*`. Errors surface as `errors.fields.<field>.message` and `errors.global[]` — mapped to friendly copy in `features/auth/errors.ts` (never display raw Clerk messages).
- Google OAuth uses the **popup flow** (`signIn.sso({ popup })`) — fully client-side, no callback route, works on a static host. If the popup is blocked it falls back to a full-page redirect.
- Bot protection: the `<div id="clerk-captcha" />` placeholder is rendered in both auth forms (required when Clerk bot protection is on).
- Route protection: `/app` stays open to guests on purpose (product rule: no-login tier is first-class, AGENTS.md §15/§27). Signed-in users are redirected from `/sign-in`, `/sign-up`, `/forgot-password` to `/app`. The `UserMenu` swaps between guest and account states via `useUser()`; sign-out ends the Clerk session and returns to `/`.

## File map

### App routes (src/app)
- `layout.tsx` — root layout: fonts (Archivo, Instrument Sans, Geist Mono), theme init script, metadata ("Tick"), wrapped in ClerkProvider.
- `page.tsx` — landing page, composes landing sections.
- `icon.svg` — favicon/metadata icon.
- `sign-in/page.tsx`, `sign-up/page.tsx`, `forgot-password/page.tsx` — custom auth pages (Clerk behind the UI).
- `app/layout.tsx` — app shell: ThemeProvider > TasksProvider > TopBar, Sidebar, main, TaskDetailPanel, MobileNav, Toast.
- `app/page.tsx` (Inbox), `app/today`, `app/upcoming`, `app/completed`, `app/settings`, `app/labels`, `app/labels/[labelId]` — view pages; each is a thin wrapper rendering a view component. Calendar/timeline views were replaced by the labels system.
- `globals.css` — Tailwind v4 entry, theme tokens (light/dark via `data-theme`).

### State layer (src/features)
- `todos/types.ts` — ALL domain types: Task, TaskStatus, Priority, Label, Subtask, Category, View, SortKey, Filters, LabelTone, CategoryColor, CategoryIcon.
- `todos/tasks-provider.tsx` — the entire app state: `TasksProvider` + `useTasks()`. Handles CRUD, status changes, labels, subtasks, selection, sorting, search, guest limit, localStorage persistence via `guest-storage.ts` external store, category creation (`addCategory`) / deletion (`deleteCategory`, unassigns affected tasks) and label creation (`addLabel`) / update (`updateLabel`) / deletion (`deleteLabel`, unassigns affected tasks + cleans filters). Also `assignLabel`/`unassignLabel`, `archiveTask`/`restoreTask`, `duplicateTask` (with limit guard), undo toasts for delete/archive/category/label. Central file — read before touching task behavior.
- `todos/guest-storage.ts` — localStorage persistence for guest data: tasks (key `todo-app:guest-tasks`), categories (key `todo-app:guest-categories`), labels (key `todo-app:guest-labels`), all sanitized load/save with legacy tone migration (`pen→blue`, `marker→yellow` via `label-colors.ts`). Guest limit constant (`GUEST_TASK_LIMIT = 10`). External store (`subscribeGuestTasks`, `getGuestTasksSnapshot`, `getGuestTasksServerSnapshot`, `setGuestTasks`, `cachedTasks`) for `useSyncExternalStore`; storage injectable via `storage?` param for tests. Unit-tested in `todos/guest-storage.test.ts`.
- `todos/selectors.ts` — pure filter/sort/group helpers used by views (`getViewTasks`, `applyFilters`, `sortTasks`, `countOpenTasks`, `countDueToday`, etc.).
- `todos/seed.ts` — `seedLabels` (3 defaults: Work/blue, Personal/yellow, Errands/gray) + optional `createSeedTasks(now)` (6 tutorial tasks for onboarding: welcome, complete, today via `daysFromNow(0)`, upcoming via `daysFromNow(3)`, priority, subtasks). Categories and labels are created (`addCategory`/`addLabel`) and deleted (`deleteCategory`/`deleteLabel`) or updated (`updateLabel`) by the user; tasks/categories/labels persist per guest under their respective `todo-app:*` keys. Tested in `todos/seed.test.ts` (limit ≤10, unique ids, label refs).
- `todos/label-colors.ts` — `LABEL_COLORS` (12 `LabelTone` values), `labelDotClasses`/`labelTextClasses`, `legacyLabelToneMap`.
- `theme/theme-provider.tsx` — `ThemeProvider` + `useTheme()` (light/dark only, system inferred via `matchMedia` on first load, persisted as `tick.theme`, applied via `data-theme` + `meta[name="theme-color"]`).
- `auth/clerk-provider.tsx` — client boundary that injects the publishable key into `@clerk/react`'s ClerkProvider.
- `auth/errors.ts` — maps Clerk error codes to friendly user-facing messages (unit-tested in `auth/errors.test.ts`).
- `auth/sign-in-form.tsx` — custom sign-in: email/password via `signIn.password()`, device-trust/second-factor email-code step (`signIn.mfa.*`), loading/error states, redirect when already signed in.
- `auth/sign-up-form.tsx` — custom sign-up: `signUp.password()` + email verification step (`signUp.verifications.*`, resend, code errors), finalize on completion.
- `auth/forgot-password-form.tsx` — custom reset: email → reset code → new password (`signIn.resetPasswordEmailCode.*`), finalize signs in.

### Components (src/components)
- `ui/button.tsx` — Button (variants: primary/secondary/ghost/destructive, sizes).
- `landing/` — header, hero, value-strip, features, how-it-works, guest-account (pricing), final-cta, footer, reveal (scroll animation), section-heading, logo.
- `app/` — top-bar, sidebar, task-list, task-row, task-detail/ (side panel editor split: `task-detail-panel.tsx` orchestrator + `tags-field.tsx`, `subtasks-section.tsx`, `priority-field.tsx`, `due-date-field.tsx`, `shared.tsx`), add-task (expanded composer / quick capture), filters (FilterControl/SortControl), settings-view, mobile-nav, menus (TaskActionsMenu/RowMenu/UserMenu in `menus.tsx`), popover, toast, confirm-dialog, labels-view, label-tasks, task-colors (category color/icon maps).
- `auth/` — auth-shell, auth-field, auth-actions (SubmitButton, GoogleButton — real Clerk Google OAuth via popup flow, OrDivider), auth-overlay.
- `theme-toggle.tsx`.

### Support
- `hooks/use-is-desktop.ts` — viewport breakpoint hook.
- `lib/constants.ts` — appName ("Tick"), container class, navLinks, authLinks.
- `lib/date.ts` — date helpers.

### Root
- `AGENTS.md` — full product spec (tiers, DB model, rules). Read only for requirements, not code orientation.
- `package.json` — scripts: dev, build, start, lint, test (vitest run).
- `next.config.ts` — static export config (`output: "export"`, `allowedDevOrigins`).
- `vitest.config.mts` — vitest config (`@/` alias, node environment).
- `eslint.config.mjs` — flat ESLint config (next vitals + TS).
- `postcss.config.mjs` — Tailwind v4 PostCSS plugin (`@tailwindcss/postcss`).

## Conventions

- Path alias `@/` → `src/`.
- All app-state components are `"use client"`. Pages are mostly thin wrappers.
- Dark mode: `data-theme` attribute on `<html>`; components use Tailwind `dark:` variants / CSS vars in globals.css.
- Domain types live in `features/todos/types.ts` only — do not redefine Task elsewhere.
- Task mutations go through `useTasks()`; do not poke localStorage directly (tasks via `setGuestTasks`, labels/categories via `saveGuestLabels`/`saveGuestCategories`).
- Labels persist to `todo-app:guest-labels` with legacy tone migration; categories to `todo-app:guest-categories`.
- Mobile + desktop layouts handled in the same components via Tailwind breakpoints (no separate files).
- No comments in code unless requested; keep components small and composable.
- Auth flows go through the Clerk hooks (`useSignIn`/`useSignUp`/`useUser`/`useAuth`/`useClerk` from `@clerk/react`) — never build a parallel auth system. All Clerk errors must pass through `features/auth/errors.ts` before reaching the UI.

## Golden rules for edits

1. Reuse `useTasks()` — never duplicate task logic.
2. Put new view components in `components/app/`, new landing sections in `components/landing/`.
3. New domain types → `features/todos/types.ts`. New helpers → `lib/` or `features/todos/selectors.ts`.
4. Tailwind v4: config is CSS-based (`@theme` in globals.css), no `tailwind.config.js`.
5. This is a static export — no server-only code unless you add a backend (then read AGENTS.md first: Clerk + Neon PostgreSQL required).
6. Run `npm run lint` after edits; `npm test` for the vitest suite; `npm run build` before finishing.

## Backend roadmap (from AGENTS.md, when you start)

Order: Neon schema (profiles, todos, labels, todo_labels, subtasks, anonymous_workspaces) → Drizzle migrations → API routes → guest tier quotas (10 todos server-side) → sync/local caching. When server-side auth is needed, adopt the Cloudflare Workers deployment path and `@clerk/nextjs/server` (`auth()`) — see "Clerk integration notes" above.
