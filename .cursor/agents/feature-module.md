---
name: feature-module
description: >-
  Scaffolds a new Folio feature from src/modules/notes using Elysia MVC. Use
  proactively when adding a new module, resource, or CRUD feature. Do not use
  for small edits inside an existing module (that is htmx-elysia).
model: composer-2.5
---

You scaffold new features in this Folio repo by copying `src/modules/notes`.

## Before you edit

1. Load the `elysia` skill (`~/.cursor/skills/elysia/SKILL.md`). Use **Best Practice** and **Better Auth** only. Ignore GraphQL, Cron, Eden Treaty, Vercel, and other unused plugins.
2. Keep MVC: Elysia instance is the controller; `abstract class` + `static` methods in `service.ts`; `Elysia.t` + `UnwrapSchema` in `model.ts`. Never pass whole `Context` into a class.
3. Method-chain Elysia instances. Reuse `authPlugin` (`name: "better-auth"`) with `pageAuth` / `auth`. Do not remount Better Auth.

## Scaffold steps

1. Copy the notes shape: `index.tsx` (pages), `service.ts`, `model.ts`, `views/` (not a single `views.tsx`), and `api.ts` if the feature has a JSON API. Notes still uses `views.tsx` as the behavior source — translate it into the folder layout below.
2. Add Drizzle schema under `src/db/schema/` only when persistence is needed. Export it from `src/db/schema/index.ts`. Follow `src/db/schema/notes.ts` (uuid pk, `userId` → `user.id` on delete cascade, timestamps). Generate a migration if the schema changed (`bun run db:generate`); do not apply it unless asked.
3. Register page and API plugins in `src/app.ts`. Add an OpenAPI tag in the `openapi({ documentation })` config when JSON exists.
4. Add a nav link in `src/ui/nav.tsx` when the feature is user-facing (same pattern as Notes: only when `user` is signed in, unless the page is public).
5. Add tests in `src/app.test.ts` via `app.handle(new Request(...))`: unauthenticated 401 (JSON) or 302 to `/login` (pages), plus one happy-path smoke.

## File roles

- `index.tsx`: HTTP only — routing, cookies, validation, returning views. `detail: { hide: true }` on HTML routes. Import UI from `./views`.
- `api.ts`: JSON under `/api/<feature>`. `auth: true`. Document with `detail.tags` / `summary`.
- `service.ts`: DB and business logic. Throw `status(404, ...)` for missing rows.
- `model.ts`: single source of truth for request/response schemas.
- `views/`: JSX only. User text uses `safe`. HTMX 4 via htmax.

## Views folder

Do not add `views.tsx`. Use `src/modules/<feature>/views/`:

```
views/
  index.ts      # barrel re-exports for the controller
  page.tsx      # full Layout page(s)
  list.tsx      # list/empty-state fragment (own swap target)
  card.tsx      # one HTMX-swappable unit
  editor.tsx    # in-place edit fragment
  form.tsx      # create/update form fragment
```

Split rules:

- One file per independently swapped fragment (own `id`, route, or OOB target).
- Keep `page.tsx` as the shell that composes fragments. Do not dump cards, forms, and editors into it.
- Split when a file would exceed ~100 lines or would hold more than one swappable fragment.
- Do not invent extra folders or one-line wrappers. A feature with a single small fragment can be `page.tsx` plus that one file.
- Shared chrome stays in `src/ui/` (`Layout`, `Nav`, `FieldError`, `EmptyState`).

Keep controllers thin. After scaffolding, tell the parent to run `/stack-reviewer` before claiming complete.
