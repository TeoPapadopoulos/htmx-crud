# Folio

Bun + Elysia boilerplate for server-rendered HTMX apps: authentication, OpenAPI, navigation, and a per-user notes CRUD.

## Stack

- Bun 1.3, TypeScript, Elysia
- HTMX 4 via **htmax** (SSE/WebSocket extensions already loaded)
- Better Auth (email/password, optional Google)
- Drizzle ORM + PostgreSQL
- Tailwind CSS v4
- Scalar OpenAPI at `/openapi`

## Setup

1. Copy env and fill secrets:

```bash
cp .env.example .env
# DATABASE_URL is already pointed at local Postgres in .env
# Generate BETTER_AUTH_SECRET with: openssl rand -base64 32
```

2. Install and migrate:

```bash
bun install
bun run db:migrate
```

3. Compile CSS once (also done automatically in `dev`):

```bash
bun run build:css
```

4. Start:

```bash
bun dev
```

App: http://localhost:3000  
OpenAPI: http://localhost:3000/openapi  
Health: http://localhost:3000/health

## Google OAuth (optional)

Leave `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` empty to hide the Google button.

To enable it, create an OAuth client in Google Cloud Console and add this redirect URI:

```
http://localhost:3000/api/auth/callback/google
```

Then set both env vars and restart.

## Scripts

| Script | Purpose |
| --- | --- |
| `bun dev` | Server with hot reload + Tailwind watch |
| `bun start` | Server only |
| `bun run db:generate` | Create a Drizzle migration from schema |
| `bun run db:migrate` | Apply migrations |
| `bun run db:studio` | Drizzle Studio |
| `bun run typecheck` | `tsc --noEmit` |

## Layout

Feature modules live under `src/modules`. Each feature keeps its controller (`index.ts` / `index.tsx`), `service.ts`, `model.ts`, and HTML `views.tsx`.

To add a feature, copy `src/modules/notes` and register the Elysia instance in `src/app.ts`.

HTML fragment routes are hidden from OpenAPI. JSON lives under `/api/notes` and is documented.

Better Auth is mounted at `/api/auth`. HTML login/signup call `auth.api` so validation errors return HTML that HTMX can swap.

## HTMX 4 / htmax

The layout loads `/public/js/htmax.min.js` (from `htmx.org@4.0.0-beta6`). Extensions such as SSE work without extra scripts:

```html
<div hx-sse:connect="/notes/stream"></div>
```

There is no SSE route yet; add an Elysia `text/event-stream` endpoint when you need live updates.
