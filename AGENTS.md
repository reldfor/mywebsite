# AGENTS.md

## Project Overview

Build a feature-rich, responsive to-do list web application designed for desktop and mobile browsers.

The application must be deployable on **Cloudflare Pages** for the frontend and should have a free-first architecture suitable for a personal project or small public launch.

Core product idea:

- Users can use the app without creating an account.
- Anonymous users receive a limited local/cloud-backed experience.
- Registered users receive a larger synchronized workspace.
- Authentication must support both **email/password** and **Google OAuth**.
- - The application should feel polished, fast, accessible, and production-ready.

Do not build the project as a demo or throwaway prototype. Structure it so features can be extended without a major rewrite.

---

# 1. Product Tiers

## Anonymous / No-Login Tier

Users must be able to start using the application immediately without signing up.

Limits:

- Maximum **10 to-do items**.
- No account synchronization across devices.
- Data should be associated with the anonymous browser/session.
- The UI must clearly communicate the anonymous limitations without aggressively blocking the user.

Anonymous users should be encouraged to create an account when they approach a limit.

### Anonymous behavior

Prefer persistent anonymous storage using a server-backed anonymous identifier when practical.

Do not rely exclusively on browser localStorage for the authoritative data if the backend is available.

The anonymous identifier must not expose sensitive information and must not contain predictable user IDs.

---

## Registered / Signed-In Tier

Registered users receive:

- Unlimited to-do items, subject to reasonable anti-abuse limits.
- Multiple devices can access the same account.
- Persistent cloud synchronization.
- Email/password authentication.
- Google OAuth authentication.
- Account management.
- Data export and deletion.
- Richer organization and productivity features.

---

# 2. Recommended Tech Stack

## Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** for accessible primitives where useful
- **Lucide React** for icons
- **TanStack Query** for server-state management
- **Zod** for runtime validation
- **React Hook Form** for complex forms
- **dnd-kit** for drag-and-drop task organization
- **date-fns** for date handling

Use modern React patterns and keep components small and composable.

Avoid unnecessary global state.

Use TanStack Query for remote/server state and a small local state layer only when necessary.

## Hosting

- **Cloudflare Pages** for the web application.
- Use Cloudflare's current recommended deployment path for the selected Next.js architecture.
- Do not hard-code provider-specific assumptions into UI code.

Cloudflare currently documents both static Next.js deployment through Pages and a Workers-based path for full-stack Next.js. Prefer a static frontend + external managed backend when that keeps the architecture simpler and more reliable. [1]

## Backend / Data

**Neon PostgreSQL is the only application database.** Do not use Supabase as the database provider.

Authentication and application data are separate concerns.

**Authentication: Clerk only.** Do not use  Firebase Auth, Auth.js/NextAuth, Lucia, custom JWT authentication, or any other authentication provider.

Recommended:

- **Clerk**
  - The only authentication provider
  - Email/password authentication
  - Google OAuth
  - Session management
  - Sign-in/sign-up UI
  - Account management

- **PostgreSQL**
  - Application data
  - Task data
  - Labels
  - Subtasks
    - Usage/quota tracking

- **Neon PostgreSQL** is recommended for the initial database because it provides managed PostgreSQL and works well with a Cloudflare-hosted frontend.

Clerk should be the **only authentication provider**. Do not implement authentication manually or use 

Clerk's current Next.js integration supports App Router authentication, sessions, protected routes, Server Components, Server Actions, and Route Handlers. Clerk also supports Google as a social connection and email authentication. [2][3]

Use Clerk's `userId` as the canonical authenticated user identifier in application tables.

Do not store passwords in the application's database.

Do not use Clerk metadata as the primary database for todos or other large application data. Clerk documents an 8 KB metadata limit and recommends storing larger application data in the application's own database. [4]

## File Storage

Images and file attachments are **out of scope for the current version**.

Do not implement:

- Image uploads
- Image previews
- Image storage
- Image storage quotas
- Image processing
- File attachment UI

The architecture should remain extensible so attachments can be added in a future version without redesigning the todo data model.

---

# 3. Authentication

Authentication must support:

## Email and Password

Configure Clerk to provide:

- Sign up
- Sign in
- Sign out
- Email verification
- Forgot password
- Reset password
- Change password
- Account deletion

Do not implement password hashing manually.

Delegate authentication to Clerk.

Never store plaintext passwords.

Use Clerk's hosted/prebuilt authentication components where practical rather than rebuilding the entire authentication flow.

## Google

Provide:

- `Continue with Google`

Use Clerk's Google social connection.

Handle:

- successful login
- cancelled OAuth
- expired/rejected OAuth session
- existing account association
- redirect errors

Do not create a second custom authentication system alongside Clerk.

---

# 4. Anonymous Data Model

Anonymous users should have a stable anonymous workspace identifier.

Suggested model:

`anonymous_workspaces`

The anonymous workspace is **not a Clerk user**. It is a separate guest identity used before sign-up.

Fields:

- `id`
- `created_at`
- `last_seen_at`
- `expires_at` if anonymous retention is implemented
- `metadata` only when genuinely necessary

Suggested anonymous task ownership:

- `anonymous_workspace_id`

Do not allow anonymous users to query arbitrary workspace IDs.

Anonymous access must be protected with server-side validation/rate limiting.

---

# 5. Database Model

Suggested tables:

## profiles

- `id` UUID
- `clerk_user_id` unique, references the Clerk user
- `display_name`
- `avatar_url`
- `created_at`
- `updated_at`

## todos

- `id`
- `user_id` nullable
- `anonymous_workspace_id` nullable
- `title`
- `description`
- `status`
- `priority`
- `due_at`
- `completed_at`
- `position`
- `created_at`
- `updated_at`

Suggested status values:

- `todo`
- `in_progress`
- `completed`
- `archived`

Suggested priority values:

- `none`
- `low`
- `medium`
- `high`
- `urgent`

Only one of `user_id` or `anonymous_workspace_id` should own a task.

## labels

- `id`
- `user_id`
- `name`
- `color`
- `created_at`

## todo_labels

- `todo_id`
- `label_id`

## subtasks

- `id`
- `todo_id`
- `title`
- `completed`
- `position`
- `created_at`
- `updated_at`

# 6. Core Features

The application should be feature-rich while remaining easy to understand.

## Todo management

Implement:

- Create task
- Edit task
- Complete task
- Reopen task
- Delete task
- Archive task
- Restore archived task
- Duplicate task
- Bulk select
- Bulk complete
- Bulk delete
- Bulk archive
- Undo destructive actions where practical

## Task details

Each task should support:

- Title
- Description
- Priority
- Status
- Due date
- Optional reminder
- Labels
- Subtasks
- External links
- Created date
- Updated date
- Completion date

## Organization

Support:

- Inbox
- Today
- Upcoming
- Completed
- Archived
- Custom labels
- Search
- Filtering
- Sorting

Recommended filters:

- Status
- Priority
- Due date
- Label
- Completed/uncompleted

Recommended sorting:

- Manual order
- Due date
- Priority
- Created date
- Updated date

## Drag and drop

Use drag-and-drop for task ordering and optionally for moving tasks between status groups.

Do not make drag-and-drop the only way to reorder tasks. Provide accessible controls as well.

---

# 8. Security

Security is a first-class requirement.

## Database security

Neon PostgreSQL is the source of truth for application data.

Authorization must be enforced in the application's server-side data-access layer using the authenticated Clerk `userId`.

Users must only be able to access:

- their own profile
- their own todos
- their own labels
- their own subtasks
- their own file metadata

Anonymous access must be scoped to its anonymous workspace.

Never rely only on frontend filtering for authorization.

## Storage security

Storage objects must not be guessable.

Example:

`users/{user_id}/todos/{todo_id}/{random_id}.webp`

Do not use:

Never put email addresses into storage object paths.

Use storage policies to prevent users from reading or deleting another user's files.

## Input validation

Validate all mutations with Zod or equivalent schemas.

Validate:

- title length
- description length
- labels
- URLs
- dates
- IDs
- uploaded file sizes
- allowed MIME types

Prevent:

- SQL injection
- XSS
- unsafe HTML rendering
- arbitrary redirects
- malicious URLs
- oversized payload abuse

Never render task descriptions as raw HTML unless they go through a strong sanitizer.

---

# 9. Rate Limiting and Abuse Protection

Anonymous access must not become an unlimited public API.

Implement reasonable protections for:

- task creation
- task deletion
- image uploads
- authentication attempts
- account creation
- password reset requests
- search requests where expensive

Use server-side rate limits.

Prefer Cloudflare-compatible rate limiting where appropriate, or backend/provider-supported controls.

Do not attempt to implement rate limiting exclusively in React.

---

# 10. UX Requirements

The UI should feel like a modern productivity application rather than an admin dashboard.

Required characteristics:

- Responsive
- Mobile-first
- Desktop-friendly
- Fast
- Accessible
- Keyboard-friendly
- Clear empty states
- Clear loading states
- Clear error states
- Optimistic interactions where safe
- Undo for destructive actions where practical
- Consistent spacing
- Consistent typography
- Strong visual hierarchy

Do not overload every screen with controls.

Feature-rich does not mean cluttered.

---

# 11. Main Screens

Implement at minimum:

## Landing / Welcome

The landing page is the primary public-facing marketing page.

It should feel like a polished modern productivity product, not a generic SaaS template.

### Header

Desktop:

- Logo/app name on the left.
- Navigation links in the center or right.
- `Sign in` as a secondary action.
- `Get started` as the primary action.

Mobile:

- Logo on the left.
- Compact menu button.
- Primary CTA remains easy to reach.

Do not put a large registration form directly in the hero.

### Hero section

The first viewport should immediately communicate the product.

Use a strong headline such as:

> Get your tasks out of your head and into one simple workspace.

Supporting text should explain that users can start immediately without an account and can create an account later for unlimited tasks and larger file storage.

Hero actions:

- **Start for free** — opens the guest/no-login experience.
- **Create an account** — opens Clerk sign-up.

Also provide a subtle `Sign in` path.

On the right side of desktop layouts, show a polished product preview/mock task board rather than a generic stock image.

The preview should demonstrate the actual product UI:

- Task list
- Completed task state
- Priority indicator
- Due date
- Labels
- Clean empty space
- Subtle interactions/hover states

On mobile, the product preview should stack below the CTA.

### Trust / value strip

Immediately below the hero, show 3–4 concise value points:

- No account required
- 10 free guest tasks
- Unlimited tasks with an account

Keep this section compact.

### Feature section

Show the major capabilities in visually distinct cards:

- Fast task capture
- Labels and priorities
- Subtasks
- Due dates
- Search and filters
- Drag-and-drop organization
- Cross-device account sync

Each card should have a concise explanation and a simple icon/illustration.

### How it works

Use three steps:

1. Create a task.
2. Organize and complete it.
3. Sign in when you want your workspace synced and expanded.

### Pricing / plan comparison

Show the two product tiers clearly:

**Guest**
- No account
- 10 todos
- Single-device/browser experience

**Free Account**
- Email or Google sign-in
- Unlimited todos
- Cross-device synchronization

Make the free account visually more prominent without pretending the guest tier does not exist.

### Final CTA

End with a simple centered CTA:

> Start organizing your day.

Primary action:

`Start for free`

Secondary action:

`Create an account`

### Footer

Include:

- Product name/logo
- Features
- Sign in
- Create account
- Privacy
- Terms
- Contact
- Copyright

Do not overcrowd the footer.

### Visual direction

The landing page should use:

- Strong typography
- Large whitespace
- Soft rounded cards
- Subtle borders
- Minimal shadows
- Restrained animation
- High contrast
- Clear hierarchy
- Responsive spacing
- Product screenshots/mockups instead of generic decorative graphics

Avoid:

- Excessive gradients
- Huge animated backgrounds
- Fake testimonials
- Fake user counts
- Fake company logos
- Fake reviews
- Stock-photo-heavy layouts
- Generic AI-generated SaaS illustrations

Everything shown on the landing page must represent a real feature or a clearly labeled visual mockup.

## Main App

Desktop layout:

- Sidebar/navigation
- Main task area
- Optional detail panel

Mobile layout:

- Compact navigation
- Task list
- Floating or bottom create action
- Task details as a full-screen/page/modal view

## Task Detail

Display:

- Title
- Description
- Status
- Priority
- Due date
- Labels
- Subtasks
- Links
- Metadata

## Search

Provide:

- Global task search
- Filters
- Sorting
- Keyboard-accessible search shortcut where appropriate

## Settings

Include:

- Profile
- Appearance
- Account
- Connected authentication
- Data export
- Delete account

## Authentication Pages

Include:

- Sign in
- Sign up
- Forgot password
- Reset password
- OAuth callback/error state
- Email verification state

---

# 12. Account Upgrade Flow

Anonymous users should not be forced to register immediately.

When they reach:

- 8/10 tasks
- 9/10 tasks
- 10/10 tasks

show progressively stronger but non-annoying upgrade prompts.

At 10/10:

> You've reached the 10-task guest limit. Create a free account to continue with unlimited tasks and sync your workspace across devices.

When an anonymous user signs up, support migrating their guest tasks into the new account.

Migration requirements:

- Move all eligible anonymous todos.
- Preserve created dates when practical.
- Preserve labels, subtasks, and task ordering.
- Do not create duplicates.
- Remove or invalidate the old anonymous workspace after successful migration.

If migration fails, do not delete the guest data.

---

# 13. Offline and Sync Behavior

The application should tolerate temporary network loss.

Recommended approach:

- Cache recently loaded tasks.
- Allow safe local edits when practical.
- Synchronize when the network returns.
- Show an offline indicator.
- Avoid silently losing edits.

Do not claim the application is fully offline-capable unless all relevant synchronization edge cases are actually implemented.

For the first version, a reliable online-first architecture with lightweight caching is preferable to an overly complex offline sync engine.

---

# 14. Performance

Optimize for:

- Fast initial load
- Small JavaScript bundles
- Lazy-loaded dialogs and heavy features
- Debounced search
- Paginated or virtualized task lists for large accounts
- Minimal unnecessary database requests

Do not fetch every user's task and subtask data when only the inbox summary is needed.

Use proper indexes for:

- owner ID
- status
- due date
- created date
- updated date
- label relationships

---

# 15. Accessibility

Meet WCAG-oriented accessibility practices.

Requirements:

- Semantic HTML
- Visible keyboard focus
- Proper labels
- Correct button vs link usage
- Accessible dialogs
- Screen-reader-friendly status messages
- Keyboard support for task operations
- Do not rely only on color
- Sufficient contrast

Drag-and-drop interactions must have a keyboard-accessible alternative.

---

# 16. Project Structure

Use a structure similar to:

```text
src/
  app/
    page.tsx
    login/
    signup/
    forgot-password/
    reset-password/
    app/
      page.tsx
      today/
      upcoming/
      completed/
      archive/
      search/
      settings/
  components/
    ui/
    auth/
    todos/
    layout/
    dialogs/
  lib/
    validation/
    storage/
    utils/
    constants/
  hooks/
  types/
  features/
    auth/
    todos/
    labels/
    settings/
```

Do not place all business logic inside page components.

Keep database/storage logic isolated from presentation components.

---

# 17. Environment Variables

Never commit secrets.

Expected browser-safe configuration may include:

```text
```

Never expose:

```text
```

or any equivalent privileged credential to browser JavaScript.

Use Cloudflare/hosting environment secrets for server-side privileged values when required.

---

# 18. Database Rules

Create database migrations.

Do not make manual dashboard-only schema changes that are not represented in migrations.

Every schema change should be reproducible from a clean database.

Add indexes intentionally.

Use constraints where possible instead of relying only on application code.

Example:

- UUID primary keys
- Foreign keys
- `NOT NULL` where appropriate
- Unique constraints
- Check constraints for valid enum-like values

---

# 19. Testing

Use automated tests where they provide meaningful protection.

Recommended:

- **Vitest** for unit tests
- **Testing Library** for UI behavior
- **Playwright** for end-to-end flows

Critical tests:

1. Anonymous user can create up to 10 todos.
2. Anonymous user cannot create an 11th todo.
6. Registered user can create more than 10 todos.
8. User A cannot access User B's todos.
10. Email sign-up works.
11. Email sign-in works.
12. Password reset works.
13. Google login works.
14. Guest-to-account migration works.
16. Deleting an account removes or schedules cleanup of owned data.

---

# 20. Deployment

The project must be deployable from GitHub to Cloudflare Pages.

Do not require a permanently running custom server for the frontend.

Cloudflare Pages currently supports Git-based deployments and preview deployments. Its documented static Next.js Pages workflow uses:

```text
Build command: npx next build
Build output: out
```

when using Next.js static export. [1]

If the implementation requires server-side Next.js functionality, use the current Cloudflare-supported Workers deployment architecture instead of forcing incompatible static-export workarounds.

Cloudflare Pages currently has a 500-builds-per-month limit on the Free plan, and Pages Functions are billed as Workers usage. [4][5]

The application must not assume infinite free backend usage.

---

# 21. Free-Tier Safety

Implement monitoring and sensible safeguards.

Recommended safeguards:

- Per-IP anonymous rate limits
- Per-account upload rate limits
- Maximum request payloads
- Server-side quota checks
- Suspicious activity throttling
- Database indexes

Do not let users bypass the 10-task guest limit by manipulating browser state.

---

# 22. Data Export and Account Deletion

Signed-in users should be able to:

- Export their task data.
- Delete their account.

Export should include:

- Todos
- Labels
- Subtasks
- Relevant timestamps

Deletion should remove or queue removal of:

- Auth account
- Profile
- Todos
- Labels
- Subtasks

Use cascading relationships carefully.

---

# 23. Design Principles

Use these principles throughout implementation:

1. **Simple by default**
2. **Fast interactions**
3. **Clear task hierarchy**
4. **Feature-rich without clutter**
5. **Accessible**
6. **Mobile-first**
7. **Secure by default**
8. **Server-side authorization**
9. **Progressive disclosure**
10. **No unnecessary dependencies**

Avoid copying the UI of Todoist, Notion, Microsoft To Do, or other products. The application should have its own visual identity.

---

# 24. Agent Coding Rules

When implementing features:

- Inspect the existing architecture before creating new files.
- Reuse existing components.
- Do not duplicate business logic.
- Prefer small focused components.
- Keep server/data access separate from UI.
- Validate data at trust boundaries.
- Never weaken authorization to make a feature easier.
- Never expose service-role credentials.
- Do not bypass the application's server-side authorization checks for convenience.
- Add migrations for schema changes.
- Add tests for important business rules.
- Keep mobile and desktop layouts intentional.
- Avoid unnecessary dependencies.
- Explain major architectural changes in code comments or documentation.
- Do not silently replace the backend architecture.
- Do not introduce a paid dependency when a reasonable free/open-source option exists.

When an implementation choice has meaningful trade-offs, choose the approach that minimizes vendor lock-in and operational complexity.

---

# 25. Definition of Done

A feature is not considered complete until:

- The UI works on mobile and desktop.
- Loading, empty, error, and success states exist.
- Authorization is enforced server-side.
- Validation exists at the appropriate boundary.
- Quotas are enforced server-side.
- The feature does not leak another user's data.
- Important destructive actions have confirmation or undo where appropriate.
- Relevant automated tests exist.
- The implementation does not expose secrets.
- The code follows the project's established architecture.

---

# 26. Initial Implementation Order

Implement in this order:

1. Project setup
3. Authentication
4. Database schema + RLS
5. Anonymous workspace
6. Todo CRUD
7. Task details
8. Labels and filtering
10. Guest-to-account migration
11. Search
12. Subtasks
13. Drag-and-drop organization
14. Settings
15. Data export
16. Account deletion
17. Accessibility pass
18. Performance pass
19. Automated tests
20. Cloudflare Pages deployment
21. Production security review

Do not build every advanced feature before the core data model and authorization are proven.

---

# 27. Important Product Rules

These rules are non-negotiable unless the project specification is deliberately changed:

- No-login users must be supported.
- Anonymous users: **10 todos maximum**.
- Signed-in users: **unlimited todos** under the application quota policy.
- Authentication: **Clerk only**, with email/password + Google OAuth.
- Frontend hosting target: **Cloudflare Pages**.
- Do not expose privileged backend credentials.
- Enforce all ownership and product limits server-side.
- Support migration from guest usage to an authenticated account.
- Keep the architecture extensible enough to add billing or paid plans later.

---

# References

Neon documentation:
https://neon.com/docs

Drizzle ORM documentation:
https://orm.drizzle.team/docs/overview

[1] Cloudflare Pages — Next.js deployment and static export guidance:
https://developers.cloudflare.com/pages/framework-guides/nextjs/

[2] Clerk — Next.js authentication:
https://clerk.com/nextjs-authentication

[3] Clerk — social connections / Google OAuth:
https://clerk.com/docs/guides/configure/auth-strategies/social-connections/overview

[4] Clerk — user metadata limits and usage:
https://clerk.com/docs/guides/users/extending

[3] Cloudflare R2 — current pricing and free tier:
https://developers.cloudflare.com/r2/pricing/

[4] Cloudflare Pages — current platform limits:
https://developers.cloudflare.com/pages/platform/limits/

[5] Cloudflare Workers — current pricing and Pages Functions billing:
https://developers.cloudflare.com/workers/platform/pricing/

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
