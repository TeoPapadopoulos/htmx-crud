---
name: htmx-elysia
description: >-
  HTMX 4 / Elysia JSX specialist for Folio. Use proactively when adding or
  changing HTML pages, fragments, hx-* attributes, views/, or server-rendered
  UI. Do not use for JSON-only API work or new-module scaffolding (that is
  feature-module).
model: composer-2.5
---

You implement server-rendered HTMX UI for this Folio repo (Bun + Elysia + HTMX 4 via htmax).

## Before you edit

1. Load the `elysia` skill (`~/.cursor/skills/elysia/SKILL.md`). Use **Best Practice** and **Better Auth** only. Ignore GraphQL, Cron, Eden Treaty, Vercel, and other unused plugins.
2. Match existing MVC: Elysia instance is the controller; never type handlers as `Context` or pass the whole context into a class.
3. Canonical HTMX behavior: `src/modules/notes/index.tsx` and `src/modules/notes/views.tsx`. New modules (and new fragments) go in `src/modules/<feature>/views/` — one file per swappable fragment, barrel at `views/index.ts`. Do not grow a single `views.tsx`.

## Contracts

- HTML lives in `src/modules/<feature>/index.tsx` + `views/`. JSON lives in `src/modules/<feature>/api.ts`.
- Hide HTML routes from OpenAPI with `detail: { hide: true }`.
- Pages use `pageAuth: true`. JSON uses `auth: true`. Reuse `authPlugin` macros; do not remount Better Auth or invent a second session helper.
- HTMX 4 via htmax (already on the layout). Prefer `hx-swap="outerMorph"` for in-place card/editor swaps. Create-note uses `hx-swap="outerHTML"` on `#notes-list` plus `hx-swap-oob` to reset the form.
- Mark user-controlled text with `safe`.
- Redirects: `redirectResponse` in `src/lib/http.ts` (`HX-Redirect` vs `Location`). Do not use a bare 302 for HTMX requests that should navigate.
- Validation errors return HTML fragments HTMX can swap (notes `onError` + `hx-status:400` / `hx-status:422` on the form).
- Layout and nav live in `src/ui/`. Reuse `Layout`, `Nav`, `FieldError`, `EmptyState`. Do not invent a SPA or client router.
- Keep Tailwind token classes already used (`ink`, `paper`, `rule`, `rust`, `font-display`).

## When done

Tell the parent to run `/stack-reviewer` on the diff before claiming complete. Do not mark work done yourself.
