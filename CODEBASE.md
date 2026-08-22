# CODEBASE.md — Tick

Read this file first. It maps the entire project so you do not need to glob/grep the tree.

## Status

- Landing page + task app with local state (React context) — working.
- Guest tier: Inbox and all views run on real guest tasks persisted to browser `localStorage` (`todo-app:guest-tasks`), with a 10-task guest limit enforced in the provider (UI + client-side guard). No demo/seed tasks — new guests start empty. Storage layer is `features/todos/guest-storage.ts` (sanitized load/save, swappable for backend storage later).
- **Clerk authentication is live** behind the app's custom UI (sign-in, sign-up + email verification, Google OAuth, forgot password, user menu, sign out). No Neon/Drizzle/API routes yet — that's the next phase.
- Next.js 16 (App Router), React 19, Tailwind v4, TypeScript, lucide-react, **@clerk/react** (Clerk's v7 custom-flow SDK — see "Clerk integration notes" below), vitest. No shadcn, TanStack Query, dnd-kit, zod, react-hook-form yet.
- Static export build (`next.config.ts` uses `output: "export"`; build output `out/`) — Cloudflare Pages target.

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
- `sign-in/page.tsx`, `sign-up/page.tsx`, `forgot-password/page.tsx` — custom auth pages (Clerk behind the UI).
- `app/layout.tsx` — app shell: ThemeProvider > TasksProvider > TopBar, Sidebar, main, TaskDetailPanel, MobileNav, MobileAddButton, Toast.
- `app/page.tsx` (Inbox), `app/today`, `app/upcoming`, `app/completed`, `app/calendar`, `app/timeline`, `app/settings` — view pages; each is a thin wrapper rendering a view component.
- `globals.css` — Tailwind v4 entry, theme tokens (light/dark via `data-theme`).

### State layer (src/features)
- `todos/types.ts` — ALL domain types: Task, TaskStatus, Priority, Label, Subtask, Category, View, SortKey, Filters, LabelTone, CategoryColor, CategoryIcon.
- `todos/tasks-provider.tsx` — the entire app state: `TasksProvider` + `useTasks()`. Handles CRUD, status changes, labels, subtasks, selection, sorting, search, guest limit, localStorage persistence, category creation (`addCategory`) / deletion (`deleteCategory`, unassigns affected tasks) and label creation (`addLabel`) / deletion (`deleteLabel`, unassigns affected tasks + cleans filters). Central file — read before touching task behavior.
- `todos/guest-storage.ts` — localStorage persistence for guest data: tasks (key `todo-app:guest-tasks`) and categories (key `todo-app:guest-categories`), sanitized load/save, swappable for backend storage later. Guest limit constant (`GUEST_TASK_LIMIT = 10`). Unit-tested in `todos/guest-storage.test.ts`.
- `todos/selectors.ts` — pure filter/sort/group helpers used by views.
- `todos/seed.ts` — default labels only (no demo tasks). Categories and labels are created (`addCategory`/`addLabel`) and deleted (`deleteCategory`/`deleteLabel`) by the user in the task composer / task detail panel; categories persist per guest under `todo-app:guest-categories`, labels are in-memory (reset to seeds on reload).
- `theme/theme-provider.tsx` — `ThemeProvider` + `useTheme()` (light/dark/system, persisted as `tick.theme`).
- `auth/clerk-provider.tsx` — client boundary that injects the publishable key into `@clerk/react`'s ClerkProvider.
- `auth/errors.ts` — maps Clerk error codes to friendly user-facing messages (unit-tested in `auth/errors.test.ts`).
- `auth/sign-in-form.tsx` — custom sign-in: email/password via `signIn.password()`, device-trust/second-factor email-code step (`signIn.mfa.*`), loading/error states, redirect when already signed in.
- `auth/sign-up-form.tsx` — custom sign-up: `signUp.password()` + email verification step (`signUp.verifications.*`, resend, code errors), finalize on completion.
- `auth/forgot-password-form.tsx` — custom reset: email → reset code → new password (`signIn.resetPasswordEmailCode.*`), finalize signs in.

### Components (src/components)
- `ui/button.tsx` — Button (variants: primary/secondary/ghost/destructive, sizes).
- `landing/` — header, hero, value-strip, features, how-it-works, guest-account (pricing), final-cta, footer, product-mock (UI mockup), reveal (scroll animation), section-heading, logo.
- `app/` — top-bar, sidebar, task-list, task-row, task-detail-panel (side panel editor), add-task (expanded composer / quick capture), filters (FilterControl/SortControl), view-switch, calendar-view, timeline-view, settings-view, mobile-nav, mobile-add-button, menus (TaskActionsMenu/RowMenu/UserMenu), popover, toast, task-colors (category color/icon maps).
- `auth/` — auth-shell, auth-field, auth-actions (SubmitButton, GoogleButton — real Clerk Google OAuth via popup flow, OrDivider).
- `theme-toggle.tsx`.

### Support
- `hooks/use-is-desktop.ts` — viewport breakpoint hook.
- `lib/constants.ts` — appName ("Tick"), container class, navLinks, authLinks.
- `lib/date.ts` — date helpers.

### Root
- `AGENTS.md` — full product spec (tiers, DB model, rules). Read only for requirements, not code orientation.
- `package.json` — scripts: dev, build, start, lint, test (vitest).
- `next.config.ts` — static export config.
- `vitest.config.mts` — vitest config (`@/` alias, node environment).

## Conventions

- Path alias `@/` → `src/`.
- All app-state components are `"use client"`. Pages are mostly thin wrappers.
- Dark mode: `data-theme` attribute on `<html>`; components use Tailwind `dark:` variants / CSS vars in globals.css.
- Domain types live in `features/todos/types.ts` only — do not redefine Task elsewhere.
- Task mutations go through `useTasks()`; do not poke localStorage directly.
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
