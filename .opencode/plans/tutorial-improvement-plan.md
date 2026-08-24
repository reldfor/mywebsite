# Tutorial Improvement Plan — Tick (preserved 2026-08-24)

> Seeded tasks were removed on 2026-08-24 per user request ("Just remove the seeded tasks for now, but remember this plan"). Keep this file as the source of truth when re-introducing a tutorial.

## Current state after removal
- `src/features/todos/tasks-provider.tsx:103-108` no longer auto-seeds `createSeedTasks()`; new guests start empty. `seed.ts` still exports `seedLabels` and `createSeedTasks` but is unused for tasks.
- `CODEBASE.md` should be updated to say "no seed/demo tasks — new guests start empty" once change ships.

## Problems the plan solves (verified 2026-08-24)
- 6/10 quota consumed, `GUEST_TASK_LIMIT=10` in `guest-storage.ts:20`, `addTask` guard `tasks-provider.tsx:146`, gate UI `add-task.tsx:132`.
- Irreversible delete, no replay, stale `daysFromNow(0/3)` dates, hints buried in description `seed.ts:36`.
- No progress/dismiss, no spotlight for Search `top-bar.tsx:14`, Filters `filters.tsx:58`, Detail panel `task-detail-panel.tsx:21`.
- No storage for tutorial state, no analytics, mobile density issues.

## Recommended approach: Hybrid (seed tasks + banner + optional spotlight)
Rejected: full blocking overlay tour.

### Data model
- Detect tutorial via `id.startsWith("seed-")` helper `isTutorialTask` (no Task type migration). Alternative later: `meta.tutorial`.
- New key `tick:tutorial` in `src/features/tutorial/tutorial-storage.ts` mirroring `guest-storage.ts:89` pattern:
  `TutorialState = { dismissed: boolean; dismissedAt: string|null; completedAt: string|null }`
  with `load/save/clear` + tests.
- Provider exposes `tutorialTasks`, `tutorialProgress`, `dismissTutorial()` (filter out seeds + save dismissed), `resetTutorial()` (re-seed).
- Quota: `effectiveCount = tasks.filter(!isTutorialTask).length` for limit check; update messaging in `add-task.tsx`.

### Content refresh `seed.ts`
- Reduce to 5 tasks, shorten titles, fix `subtasks()` ID bug `seed-subtask-${position}-${index}` should capture after `nextPosition()`.
- Refresh due dates on load (or set null except Today/Upcoming demos) to avoid overdue drift via `isOverdue` in `lib/date.ts`.
- Add demo category persisted via `saveGuestCategories`.

### UI
1. `src/components/app/tutorial/tutorial-banner.tsx` rendered in `TaskList` `task-list.tsx:61` above groups, only if `tasks.some(isTutorialTask) && !dismissed`. Shows `completed/total`, CTA Dismiss/Clear. `role="status"`.
2. Optional `spotlight.tsx` using existing `Popover` anchored to `data-tutorial-id="search|filters|task-row"` added to `TopBar`, `FilterControl`, `TaskRow`. Trigger after first seed toggle; step index in `TUTORIAL_KEY`; respects `prefers-reduced-motion` `globals.css:430`.
3. `task-row.tsx:104` badge for tutorial tasks (`aria-label="Tutorial task"`).
4. `settings-view.tsx:35` add "Replay tutorial" → `resetTutorial()`.
5. `toggleTask` celebration when last seed completes.

### File changes
- Modify: `seed.ts`, `guest-storage.ts`, `tasks-provider.tsx`, `task-list.tsx`, `task-row.tsx`, `top-bar.tsx`, `filters.tsx`, `add-task.tsx`, `settings-view.tsx`, `globals.css`, `CODEBASE.md`.
- Create: `src/features/tutorial/tutorial-storage.ts`, `tutorial-storage.test.ts`, `components/app/tutorial/tutorial-banner.tsx`, `components/app/tutorial/spotlight.tsx`.

### Phases
1. Foundation (1-2h): storage + helper, fix seed, provider quota/dismiss/reset + tests.
2. Banner+Badge (1h): banner in TaskList, row badge, empty-state fix `task-list.tsx:111`.
3. Polish (1h): spotlight, Settings replay, date refresh, docs, `npm run lint && npm test && npm run build`.

### Edge cases
- Migrating existing guests: if seeds exist but no key, init `dismissed:false`.
- Static export: all client-only, guard `window.localStorage`.
- SSR snapshot `getGuestTasksServerSnapshot` returns `[]` → banner hidden until hydrated.

### Open questions recorded
1. Should tutorial count toward 10 limit? Recommendation: no.
2. Dismiss = delete (with undo toast `showToast`) vs archive?
3. Spotlight in v1 or banner-only to keep "no tour" promise `how-it-works.tsx:10`?
4. Auto-reset after 30 days or manual only?

### How to re-enable
- Re-add seed effect in `tasks-provider.tsx` or call `createSeedTasks()` from `resetTutorial()`.
- Bring back `hasGuestTasksKey` import and seed check, or better gate on `tutorialState.dismissed`.
