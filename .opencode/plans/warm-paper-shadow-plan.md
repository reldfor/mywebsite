# Plan: Warm Paper Background (#FAF9F6) + Subtle Card/Interactive Shadows — Dark Mode Frozen

## Context
User wants: (1) light UI background `#FAF9F6`, (2) subtle drop shadows on cards + interactive elements, (3) **dark mode byte-for-byte unchanged**. No structure/content/typography/layout changes. Stack is Next 16 static export + Tailwind v4 with CSS `@theme` tokens in `src/app/globals.css:35-82`. Verified `src/app/globals.css:38` is `--paper:#fcfcfc` (light), `84-115` is `:root[data-theme="dark"]`, `117-150` is `@media (prefers-color-scheme: dark)` — both must remain untouched.

Current light tokens (`src/app/globals.css:35-82`):
```css
:root { --paper:#fcfcfc; --surface:#ffffff; --inverse-ink:#fcfcfc;
        --shadow-card:0 1px 2px rgba(0,0,0,.04),0 4px 24px rgba(0,0,0,.04);
        --shadow-pop:0 8px 32px rgba(0,0,0,.08);
        --shadow-fab:0 8px 24px rgba(0,0,0,.12); }
```
Dark tokens (`84-115` + `117-150`) — DO NOT EDIT:
```css
--paper:#0a0a0a; --surface:#141414; --inverse-ink:#0a0a0a;
--shadow-card:0 1px 2px rgba(0,0,0,.4),0 12px 40px rgba(0,0,0,.5);
--shadow-pop:0 12px 40px rgba(0,0,0,.6); --shadow-fab:0 8px 24px rgba(0,0,0,.6);
```

## Constraint Enforcement: How Dark Stays Identical

**Rule:** All edits scoped to light `:root` (`35-82`) and to className additions that are neutral in dark. Dark blocks are excluded from diff. Verification will diff `globals.css:84-150` before/after and assert zero change.

**Shadow subtlety problem:** Adding `shadow-[var(--shadow-card)]` to a card that was previously flat would, in dark, suddenly render the heavy dark shadow (`rgba(0,0,0,.5)`) — that would violate "dark unchanged". So newly-shadowed elements must be light-only.

**Solution (adopt in plan):**
- Light `:root` — update `--paper` to `#FAF9F6`, tweak light shadow tokens (slightly more definition on warm paper), add `--shadow-interactive:0 1px 2px rgba(0,0,0,.06)` **only in light `:root`** (lines 64-66 area). Do NOT add `--shadow-interactive` to dark blocks.
- For each newly-shadowed card/chip, use `shadow-[var(--shadow-card)] dark:shadow-none` (or `dark:shadow-[0_0_0_transparent]`). In light → var resolves to light shadow; in dark → forced to none, preserving prior flat look. For elements that already have dark shadows (auth-shell, product-mock, popovers, toast), keep existing `shadow-[var(--shadow-card)]` / `shadow-[var(--shadow-pop)]` as-is — no `dark:shadow-none`, so dark keeps its heavy shadow unchanged (status quo).
- Alternative considered and rejected: add shadow unconditionally — would change dark. Rejected per user constraint.

`--inverse-ink` decision updated: keep `#fcfcfc` in dark, change only light `#fcfcfc`→`#FAF9F6` if user approves. Better: **leave `--inverse-ink` untouched entirely** to guarantee dark unchanged and minimize light risk (ΔE between #fcfcfc and #FAF9F6 on ink bg is invisible). Plan now proposes **not** changing `--inverse-ink` unless explicitly requested. Dark `--inverse-ink:#0a0a0a` untouched in any case.

## Discovery Inventory (read-only audit)

**Background consumers** — `bg-paper` via `body` (`globals.css:163`), `app/layout.tsx:16`, `sidebar.tsx:46`, `mobile-nav.tsx:47`, `header.tsx:24` etc. Changing light `--paper` alone repaints light canvas; `--surface:#ffffff` cards gain warm contrast.

**Already shadowed (keep as-is, dark unchanged):**
- `components/auth/auth-shell.tsx:35` `shadow-[var(--shadow-card)]` — has dark heavy shadow today; keep.
- `components/landing/product-mock.tsx:95` `shadow-[var(--shadow-card)]` — keep.
- `components/app/add-task.tsx:237` composer `shadow-[var(--shadow-card)]` — keep.
- `components/app/popover.tsx`, `confirm-dialog.tsx`, `settings-view.tsx` `shadow-[var(--shadow-pop)]` — keep.
- `components/app/toast.tsx:16` `shadow-[var(--shadow-fab)]` — keep.

**Cards missing shadow (light-only candidates):**
- `components/landing/features.tsx:72` 8 articles `rounded-xl border border-line bg-surface p-5` — flat in both modes today.
- `components/landing/guest-account.tsx:38` guest article `bg-paper` — flat.
- `components/landing/guest-account.tsx:81` ink article `bg-ink` — flat; recommend skip (dark card, shadow would be odd; also violates dark-unchanged if added).
- `components/app/add-task.tsx:130` guest-limit banner — flat.
- `components/app/calendar-view.tsx:117` month container `overflow-hidden rounded-xl border bg-surface` — flat.
- `components/app/task-detail-panel.tsx:177` panel — flat border-l today; default plan: **do not add** shadow (would change dark panel).

**Interactive elements missing light shadow:**
- `components/ui/button.tsx:15` secondary — flat.
- Chips: `add-task.tsx:34-39` (`chipIdle`/`iconChip`), `task-detail-panel.tsx:48-51`, `filters.tsx:50,103`, `view-switch.tsx:21`, calendar nav `calendar-view.tsx:124,135,144`, hero pill `hero.tsx:15` — all flat.

## Proposed Changes (Dark-Blocked Edits)

### 1. `src/app/globals.css:38` — light only
- `--paper: #fcfcfc` → `--paper: #FAF9F6` **in `:root` only**. Dark blocks (`84-115`, `117-150`) no change.
- Leave `--inverse-ink` as-is unless user opts in; if changed, change only in light `:root` (`55`), not dark.
- Leave `--surface:#ffffff` etc. untouched.

### 2. `src/app/globals.css:64-66` — light only + new light-only var
In light `:root`:
```css
--shadow-card: 0 1px 3px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.04);
--shadow-pop:  0 8px 24px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.04);
--shadow-fab:  0 8px 24px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.08);
--shadow-interactive: 0 1px 2px rgba(0,0,0,.06);
```
Dark blocks: **zero edits** — they keep their `.4/.5/.6` shadows.

### 3. Cards — add light-only shadow classes
Pattern: `shadow-[var(--shadow-card)] dark:shadow-none` so dark renders exactly as before (flat).

- `src/components/landing/features.tsx:72` → `... bg-surface p-5 shadow-[var(--shadow-card)] dark:shadow-none`
- `src/components/landing/guest-account.tsx:38` → `... bg-paper p-6 sm:p-7 shadow-[var(--shadow-card)] dark:shadow-none`
- `src/components/app/add-task.tsx:130` → `... bg-surface px-5 py-6 text-center shadow-[var(--shadow-card)] dark:shadow-none`
- `src/components/app/calendar-view.tsx:117` → `... bg-surface shadow-[var(--shadow-card)] dark:shadow-none`
- Ink card `81` — **skip**.
- Panel `177` — **skip** (would need `lg:dark:shadow-none` etc.; keep flat to preserve dark).

### 4. Interactive elements — light-only subtle shadows
Pattern same: `shadow-[var(--shadow-interactive)] dark:shadow-none` (active/ink states keep no shadow, so dark active stays flat).

- `src/components/ui/button.tsx:15` secondary: `"bg-surface ... border border-line shadow-[var(--shadow-interactive)] dark:shadow-none hover:border-ink/20 ..."`
- `src/components/app/add-task.tsx:36` `chipIdle` + `39` `iconChip`: add `shadow-[var(--shadow-interactive)] dark:shadow-none`
- `src/components/app/task-detail-panel.tsx:51` `chipIdle` same
- `src/components/app/filters.tsx:50,103` pills same
- `src/components/app/calendar-view.tsx:124,135,144` nav buttons same
- `src/components/app/view-switch.tsx:21` container: add `shadow-[var(--shadow-interactive)] dark:shadow-none`
- `src/components/landing/hero.tsx:15` pill: add `shadow-[var(--shadow-interactive)] dark:shadow-none`
- Keep `transition-colors`; shadow appears instantly, no layout cost. Do NOT change to `transition-all`.

### 5. Non-goals
- No grid/padding/margin/font/line-height/letter-spacing changes.
- No JSX reordering, no new wrappers.
- No color changes beyond light `--paper` (and optional light `--inverse-ink`) and light shadow vars.
- Dark CSS (`84-150`) and dark rendering of all components remain pixel-identical.

## File Checklist (Dark Diff = 0)
| File | Line | Edit Scope |
|------|------|------------|
| `src/app/globals.css` | 38 | light `:root` `#fcfcfc`→`#FAF9F6` only |
| `src/app/globals.css` | 64-66 | light `:root` update shadows + add `--shadow-interactive` only |
| `src/components/landing/features.tsx` | 72 | add `shadow-[var(--shadow-card)] dark:shadow-none` |
| `src/components/landing/guest-account.tsx` | 38 | add `shadow-[var(--shadow-card)] dark:shadow-none` |
| `src/components/app/add-task.tsx` | 130,36,39 | banner + chips light-only shadows |
| `src/components/app/calendar-view.tsx` | 117,124,135,144 | month + nav light-only shadows |
| `src/components/app/task-detail-panel.tsx` | 51 | chip light-only shadow |
| `src/components/app/filters.tsx` | 50,103 | pill light-only shadows |
| `src/components/app/view-switch.tsx` | 21 | container light-only shadow |
| `src/components/ui/button.tsx` | 15 | secondary light-only shadow |
| `src/components/landing/hero.tsx` | 15 | pill light-only shadow |

Explicitly **not touched**: `globals.css:84-150`, `theme-provider.tsx`, any `data-theme` logic.

## Verification (must prove dark unchanged)
1. `npm run lint` → `npm test` (guest-storage, auth/errors) → `npm run build` (static export).
2. **Dark diff check:** `git diff src/app/globals.css` — assert lines 84-150 unchanged; `git diff` for shadow classes shows `dark:shadow-none` present so dark rendering is flat (matches pre-change). Optional visual diff: `npm run dev`, toggle `data-theme="dark"` via `ThemeProvider`; screenshot before/after and pixel-compare — expect 0 diff in dark, warm #FAF9F6 + shadows in light.
3. Light visual: 375px/768px/1280px, eyedropper body #FAF9F6, cards #ffffff with hairline shadow, no layout shift (`box-shadow` non-layout, `overflow-hidden` wrappers — shadows on `calendar-month` will be `dark:shadow-none` so no dark clipping change; light clipping minimal due to small spread).
4. If user prefers strictest guarantee, skip adding shadows to elements that are `overflow-hidden` (calendar month) and rely only on `border` for separation — still meets "subtle" via cards only.

## Risks
- Light vs white ΔE ~2 — shadows compensate; if still flat, would need border-line warming — out of scope.
- `dark:shadow-none` is correct for newly-shadowed elements; for already-shadowed elements we deliberately do NOT add it, so dark keeps its existing heavy shadow (unchanged).
- Per-chip shadows: use light-only; if visual noise, switch to `hover:shadow-... dark:shadow-none` instead of idle.

## Open Questions (Resolved per new constraint)
1. `--inverse-ink` — **propose leave untouched** to keep dark trivially unchanged. Change only if user wants paper-tinted text on ink in light.
2. Ink card / detail panel — skip per dark-unchanged.
3. Chips idle vs hover — recommend idle for buttons/containers, hover-only for tiny chips if noise concern.

Effort: Low — ~15 replacements, all light-scoped, <2 min verify.
