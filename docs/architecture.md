# ANIMAPS — Architecture

Living guide for the monorepo. Product roadmap: [README.md](../README.md). Domain: [bounded-contexts.md](bounded-contexts.md). Schema: [schema-evolution.md](schema-evolution.md) · [data-dictionary.md](data-dictionary.md).

## Fundamental boundary

```text
apps/web  ──┐
            ├──> HTTP REST ──> apps/api (NestJS, Wave 2) ──> PostgreSQL + PostGIS
apps/mobile ┘   (Wave 3)
```

- Clients never access the database.
- Shared packages are created only when a second app needs the same contracts (not today).
- Web and mobile keep separate presentation layers (no shared UI kit).

## Repository structure

```text
animaps/
├── apps/
│   ├── web/                 # Next.js — feature-based UI (exists)
│   ├── api/                 # NestJS modular monolith (Wave 2 — not scaffolded)
│   └── mobile/              # Expo (Wave 3 — not scaffolded)
└── docs/
```

`pnpm-workspace.yaml` lists `apps/*` only. When web + API (or mobile) share DTOs/validation, extract `packages/{types,validation,api-client}` again.

## Current apps

| Package | Role |
|---|---|
| `@animaps/web` | Landing + waitlist + cookie consent |

## Web feature layout

```text
apps/web/src/
├── app/                 # Next routing + bootstrap (thin)
│   ├── api/waitlist/    # Temporary Route Handler (moves to apps/api in Wave 2)
│   └── providers.tsx    # Lenis / GSAP smooth scroll
├── features/
│   ├── landing/         # Marketing sections (web-only)
│   ├── waitlist/        # Form UI + client/server validation + types
│   └── consent/         # Cookie banner (web-only localStorage)
└── components/          # Shared primitives (Button, Input, Select…)
```

Import other features only through their `index.ts` public API.

## Dependency rules

1. Presentation depends on feature contracts / helpers — not the reverse.
2. When shared packages exist, they must stay free of React / Next / RN / Prisma / Nest.
3. `apps/api` (future) never depends on web or mobile.
4. Features must not import another feature’s internal files.
5. Do not put browser storage or Next Route Handler logic in shared packages (when they exist).

## Domains

| Domain | Where it lives today | Future |
|---|---|---|
| landing | `apps/web` features/landing | web-only |
| waitlist / marketing | web feature + Next `/api/waitlist` | Nest `marketing` module |
| consent | web features/consent | web-only; mobile will use native privacy UX |
| identity, adoption, occurrence, notifications, analytics | docs only | `apps/api` modules |

## Authentication (design — not implemented)

- Access JWT (short-lived) + refresh token (hashed at rest).
- Same Nest auth endpoints for web and mobile.
- Web: prefer httpOnly cookie for refresh (or memory + rotation); access in memory.
- Mobile: Secure Store for refresh; access in memory.
- Authorization: roles + verification flags from `identity` ([permissions-matrix.md](permissions-matrix.md)).

## Environment variables

| App | Public | Secrets |
|---|---|---|
| web | `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` | none (no `DATABASE_URL`) |
| api | — | `DATABASE_URL`, JWT secrets |
| mobile | `EXPO_PUBLIC_API_BASE_URL` | none |

## How to add a new product feature

1. **API module** (Wave 2+): add `apps/api/src/modules/<domain>/` with proportional structure (flat for simple; layered for complex).
2. **Shared contract** (when 2+ apps need it): create or extend packages under `packages/`.
3. **Web feature**: `apps/web/src/features/<name>/` with public `index.ts`.
4. **Mobile feature** (Wave 3): mirror the same API via a thin client — do not import web components.

## How to add an API module (Wave 2)

1. Create Nest module under `apps/api/src/modules/<context>/`.
2. Persist via Prisma (`apps/api/prisma` — moved from docs when scaffolding).
3. Publish/consume in-process domain events as in [bounded-contexts.md](bounded-contexts.md).
4. Expose REST; share Zod/types with clients only when a package exists.

## Waitlist today vs Wave 2

- **Today:** `POST /api/waitlist` Next Route Handler uses `features/waitlist` (`parseWaitlistBody`); persistence is `console.info` (schema already defines `WaitlistEntry`).
- **Wave 2:** Nest `marketing` persists `WaitlistEntry`; web calls `NEXT_PUBLIC_API_BASE_URL`; remove the Next route. Extract shared types/validation into packages if API and web both need them.

## Tooling

- **pnpm workspaces** only (no Turborepo/Nx until multi-app CI needs them).
- Root scripts: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck` (recursive over apps).
