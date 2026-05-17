# BlueScrubsPrep

A PLAB medical exam preparation platform for international medical graduates targeting UK practice. Features AI-powered study tools, MCQ practice, OSCE simulations, analytics, leaderboards, and adaptive learning.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000 / workflow port)
- `pnpm --filter @workspace/bluescrubs run dev` — run the frontend (Vite dev server)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Required environment variables

- `DATABASE_URL` — Postgres connection string (provisioned)
- `SESSION_SECRET` — session signing secret (provisioned)
- `AI_INTEGRATIONS_OPENAI_API_KEY` — OpenAI API key for AI features (set via Replit AI Integrations)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — OpenAI base URL (set via Replit AI Integrations)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4 + Wouter (SPA routing) + shadcn/ui
- API: Express 5 (at `/api` path)
- DB: PostgreSQL + Drizzle ORM
- Auth: Replit Auth (OpenID Connect)
- AI: OpenAI via Replit AI Integrations

## Where things live

- `artifacts/bluescrubs/` — React + Vite frontend (previewPath `/`)
- `artifacts/api-server/` — Express 5 API server (previewPath `/api`)
- `artifacts/api-server/src/shared/` — shared types and schema (also sym-linked/copied to `artifacts/bluescrubs/src/shared/`)
- `lib/db/src/schema/index.ts` — Drizzle schema (source of truth for DB)
- `artifacts/bluescrubs/src/assets/` — static assets (images, video)

## Architecture decisions

- The original repo used a single Express+Vite server; in this monorepo the frontend and API are separated into distinct artifacts routed through a shared reverse proxy.
- `@shared/*` alias resolves to `./src/shared/` in both the frontend and api-server packages for shared types and schema.
- OpenAI clients use a placeholder fallback key at module load time so the server starts without credentials; AI features fail gracefully per-request when no key is configured.
- The DB schema lives in `lib/db/src/schema/index.ts` for drizzle-kit push; the api-server imports the same types from its local `src/shared/schema.ts` copy.
- Express 5 uses path-to-regexp v8 which does not support the `:param?` optional syntax — use separate routes instead.

## Product

- PLAB 1 MCQ practice with adaptive AI engine and block-based timed modes
- PLAB 2 OSCE station simulations with AI feedback
- Analytics dashboard with progress charts and streak tracking
- Global and weekly leaderboards with country-level stats
- AI study companion chat
- Replit Auth login flow

## User preferences

- Keep shared types in `artifacts/api-server/src/shared/` and mirror to `artifacts/bluescrubs/src/shared/`

## Gotchas

- Always run `pnpm --filter @workspace/db run push` after schema changes in `lib/db/src/schema/index.ts`
- Express 5 does not support `:param?` optional route params — split into two routes instead
- The `pg` package must be listed as an `external` in `artifacts/api-server/build.mjs` AND as a `dependency` in its `package.json`
- All top-level `new OpenAI(...)` calls must use `|| 'placeholder-configure-openai-key'` fallback to prevent crash at startup when key is not set
- `@tailwindcss/vite` v4 requires `@import "tailwindcss"` (not `@tailwind base/components/utilities`); custom colors must be declared in `@theme inline` for `@apply` to work

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
