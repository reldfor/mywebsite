# AGENTS.md

## Orientation

- Read `CODEBASE.md` first — it maps the code, status, and conventions so you don't need to explore the tree. This file is the product spec + agent rules; `CLAUDE.md` just points here.
- `AGENTS.md` is gitignored but tracked as a working reference; the full historical spec lives in git history.
- The `nextjs-agent-rules` block at the bottom is auto-managed by `next dev` — never remove it.

## Current state (verified)

- Static Next.js 16.3.1 (App Router) + React 19 + TypeScript + Tailwind v4. `next.config.ts` uses `output: "export"` (build output `out/`), Cloudflare Pages target. No server code, route handlers, or API routes — everything is client-side.
- Guest-only task app: state in `features/todos/tasks-provider.tsx`, persistence in `features/todos/guest-storage.ts` (localStorage keys `todo-app:guest-tasks` / `todo-app:guest-categories`), 10-task guest limit (`GUEST_TASK_LIMIT`) enforced in the provider.
- Clerk auth is live but client-side only: `@clerk/react` v6 with the v7 "future" resources API (`useSignIn`/`useSignUp`), custom UI, Google OAuth via popup (`signIn.sso`). Deliberately NOT `@clerk/nextjs` — its provider statically imports server-action modules that break static export. When the backend lands, switch hosting to the Workers-compatible path and `@clerk/nextjs/server` (`auth()`).
- No database yet (no Neon/Drizzle/API routes) — backend rules below are the plan, not implemented.
- Env: only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (in `.env`, gitignored). No server-side secrets exist yet.

## Commands

- `npm run dev` — dev server. `next.config.ts` pins `allowedDevOrigins: ["192.168.68.59"]` for LAN access.
- `npm run lint` → `npm test` (vitest, node env, `@/` alias) → `npm run build` (static export). Run all three after changes.
- `npm run build` fails on any server-only code (static export) — that's a feature, not a bug.
- Unit tests live next to their modules (`*.test.ts`); currently only `guest-storage.test.ts` and `auth/errors.test.ts`.

## Conventions

- Path alias `@/` → `src/`.
- All domain types live in `features/todos/types.ts` — never redefine Task/Status/Priority elsewhere.
- Task mutations go through `useTasks()` only — never touch localStorage directly.
- All Clerk errors must pass through `features/auth/errors.ts` before reaching the UI; never display raw Clerk messages.
- Auth via `@clerk/react` hooks only — no parallel auth system.
- Tailwind v4: config is CSS-based (`@theme` in `src/app/globals.css`), no `tailwind.config.js`. Dark mode via `data-theme` on `<html>`.
- App-state components are `"use client"`; pages are thin wrappers. Mobile + desktop layouts live in the same component via breakpoints.
- No code comments unless asked.

## Product rules (non-negotiable)

- No-login tier is first-class: guests get max **10 todos**, single browser, no sync. UI shows upgrade prompts from 8/10.
- Signed-in: unlimited todos under quota policy, cross-device sync.
- Auth: **Clerk only** (email/password + Google OAuth). Never store passwords; never use Clerk metadata for app data (8 KB limit).
- Database: **Neon PostgreSQL only** (no Supabase). Drizzle ORM + migrations for every schema change — reproducible from a clean database.
- Frontend host: **Cloudflare Pages**; static + managed backend preferred, Workers path if server-side Next.js features are required.
- Enforce ownership and quotas **server-side** when the backend lands — never rely on client-side guards alone.
- Guest→account migration must preserve tasks/labels/subtasks/order, create no duplicates, and not delete guest data on failure.
- File/image storage is out of scope for v1 — don't build it.
- Never expose privileged credentials; browser gets `NEXT_PUBLIC_*` only.

## Backend plan (when started)

Order: Neon schema → Drizzle migrations → API routes → server-side guest quota (10) → sync/caching. Schema targets: `profiles` (unique `clerk_user_id`), `todos` (owned by `user_id` XOR `anonymous_workspace_id`; status, priority, due_at, position), `labels`, `todo_labels`, `subtasks`, `anonymous_workspaces`. Use Clerk `userId` as the canonical user id. Validate all mutations with Zod; per-IP rate limits for anonymous access.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
