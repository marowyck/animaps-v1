# ANIMAPS — Architecture

Living guide for the monorepo. Product roadmap: [root README](../README.md). Domain: [bounded-contexts.md](architecture/bounded-contexts.md). Schema: [schema-evolution.md](database/schema-evolution.md) · [data-dictionary.md](database/data-dictionary.md). Ecosystem layer: [overview.md](domains/overview.md) · [government.md](domains/government.md).

## Architecture charter (governance)

The Architecture Charter is the standing policy for modularity, feature organization, anti-monolith thresholds, and staged monorepo growth. It does **not** require scaffolding empty apps or packages before a wave needs them.

| Doc | Role |
|---|---|
| [architecture/current-structure.md](architecture/current-structure.md) | ETAPA 1 — inventory and findings (as-is) |
| [architecture/proposed-structure.md](architecture/proposed-structure.md) | ETAPA 2 — target shape, docs taxonomy map, conventions |
| [architecture/migration-plan.md](architecture/migration-plan.md) | ETAPA 3 — phased backlog (approval-gated; not auto-executed) |
| [decisions/](decisions/) | ADRs (monorepo, features, backend, RBAC, report/case) |

Start with ADRs: [ADR-001](decisions/ADR-001-monorepo-staged-rollout.md) · [ADR-002](decisions/ADR-002-feature-based-frontend.md) · [ADR-003](decisions/ADR-003-modular-backend-when-scaffolded.md) · [ADR-004](decisions/ADR-004-rbac-layering.md) · [ADR-005](decisions/ADR-005-report-case-separation.md).

## Fundamental boundary

```text
apps/web  ──┐
            ├──> HTTP REST ──> apps/api (NestJS, Wave 2) ──> PostgreSQL + PostGIS
apps/mobile ┘   (Wave 3)
```

- Clients never access the database.
- Shared packages are created only when a second app needs the same contracts (not today).
- Web and mobile keep separate presentation layers (no shared UI kit).

The **ecosystem layer** (Fase 1) sits on the same identity stack: nullable `account_type` → organization / institution memberships → scoped RBAC → Case. It does not fork auth. Government UX is a distinct workspace ([government.md](./domains/government.md)), not a second product. See [overview.md](./domains/overview.md).

## Repository structure

```text
animaps/
├── apps/
│   ├── web/                 # Next.js — feature-based UI
│   ├── api/                 # NestJS modular monolith (Wave 2 scaffold)
│   └── mobile/              # Expo (Wave 3 — not scaffolded)
└── docs/
```

`pnpm-workspace.yaml` lists `apps/*` only. Shared `packages/*` still wait until web + api share DTOs.

## Current apps

| Package | Role |
|---|---|
| `@animaps/web` | Landing + waitlist + auth UI + onboarding + dashboard shells + institution mocks |
| `@animaps/api` | Nest health + `POST /marketing/waitlist` + Prisma schema; identity auth stub |

## Web feature layout

```text
apps/web/src/
├── app/                 # Next routing + bootstrap (thin)
│   ├── api/waitlist/    # Temporary Route Handler (moves to apps/api in Wave 2)
│   ├── register/        # Two-step create-account UI (waitlist backend)
│   ├── login/           # Login UI placeholder (real auth later)
│   ├── verify-email/    # Email OTP UI (mock verify)
│   ├── onboarding/[step]/ # Dynamic multi-type onboarding
│   ├── dashboard/       # Type-aware home (ONG/clinic); PERSON → discover
│   ├── discover/        # Discovery cards (mocks)
│   └── providers.tsx    # Locale + Toast + OnboardingProvider + Lenis / GSAP
├── features/
│   ├── landing/         # Marketing sections + clay mascots (web-only)
│   ├── auth/            # Split layout, register/login, verify-email form
│   ├── waitlist/        # Form UI + client/server validation + types
│   ├── consent/         # Cookie banner (web-only localStorage)
│   ├── user-types/      # PublicUserType helpers + DB mapping
│   ├── permissions/     # UI capability catalog (hasPermission)
│   ├── account-types/   # Additive AccountType catalog (not wired into UI yet)
│   ├── rbac/            # Additive RBAC seed keys (not wired into guards yet)
│   ├── onboarding/      # Config-driven flows, draft, forms, VerificationFlow
│   ├── verification/    # Mock selfie helper (+ legacy SelfieVerificationStep)
│   ├── dashboard/       # DynamicDashboard, RoleBasedNavigation, shells
│   └── discover/        # Card stack, actions, mocks
└── components/          # Shared primitives (Button, Modal→portal, SelectableCard, …)
```

Import other features only through their `index.ts` public API.

Product UX docs: [user-flow.md](./features/user-flow.md) · [onboarding.md](./features/onboarding.md) · [user-types.md](./domains/user-types.md) · [overview.md](./domains/overview.md) · [conventions.md](./architecture/conventions.md) · [roadmap.md](./roadmap/roadmap.md) · [docs/README.md](README.md).

`UserType` (`features/user-types`) remains the **authoritative UI discriminator** for register, onboarding, dashboard, and `hasPermission` until a dedicated cutover. `account_type`, Case, and RBAC are documented + catalogued beside that freeze — they do not replace it in this pass.

## Dependency rules

1. Presentation depends on feature contracts / helpers — not the reverse.
2. When shared packages exist, they must stay free of React / Next / RN / Prisma / Nest.
3. `apps/api` (future) never depends on web or mobile.
4. Features must not import another feature’s internal files.
5. Do not put browser storage or Next Route Handler logic in shared packages (when they exist).
6. Follow [conventions.md](./architecture/conventions.md) for UserType / onboarding / permissions patterns.

## Domains

| Domain | Where it lives today | Future |
|---|---|---|
| landing | `apps/web` features/landing | web-only |
| auth UI | `apps/web` features/auth (`/register`, `/login`, `/verify-email`) | Nest `identity` (real auth later) |
| onboarding | `features/onboarding` (dynamic flows by `UserType`, localStorage draft) | Nest `PUT /me/onboarding` ([api.md](./api/overview.md)) |
| user types / permissions | `features/user-types`, `features/permissions` (UI gating) | Nest guards + `UserType` until RBAC cutover |
| account types / RBAC | `features/account-types`, `features/rbac` (catalogs only) | `account_type` + membership roles ([overview.md](./domains/overview.md)) |
| verification | `VerificationFlow` + `features/verification` mock helper | Nest + provider via `verification_requests` |
| dashboard / discover | web shells + mocks | Nest reads + matching service; institution modules proposed ([institution-dashboard.md](./features/institution-dashboard.md) · [government.md](./domains/government.md)) |
| waitlist / marketing | web feature + Next `/api/waitlist` | Nest `marketing` module |
| consent | web features/consent | web-only; mobile will use native privacy UX |
| identity, adoption, occurrence, notifications, analytics | docs only | `apps/api` modules |
| cases / institutions / routing | docs + schema | Later API modules; Case does not drop `occurrences` |

## How to add a user type (summary)

See the full checklist in [conventions.md](./architecture/conventions.md). Minimum: enum + profile (if needed) + `ONBOARDING_FLOWS` + `DASHBOARD_CONFIGS` + permissions + i18n (pt/en/es) + docs (Prisma/DBML/dictionary).

## Authorization (design)

- Access JWT (short-lived, **memory**) + refresh token (hashed at rest).
- Same Nest auth endpoints for web and mobile ([api.md](./api/overview.md)).
- Web refresh: **httpOnly cookie** `animaps_refresh` (Secure, SameSite=Lax). Not localStorage.
- Mobile: Secure Store for refresh; access in memory.
- Authorization: `UserType` + verification flags from `identity` ([permissions-matrix.md](./security/permissions-matrix.md)) remain the live design until RBAC memberships ship ([roles-and-permissions.md](./domains/roles-and-permissions.md)). UI gating alone is never enough ([permissions.md](./security/permissions.md)).
- Local PostGIS: repo `docker-compose.yml`.

## Environment variables

| App | Public | Secrets |
|---|---|---|
| web | `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` | none (no `DATABASE_URL`) |
| api | — | `DATABASE_URL`, JWT secrets, cookie signing if needed |
| mobile | `EXPO_PUBLIC_API_BASE_URL` | none |

## How to add a new product feature

1. **API module** (Wave 2+): add `apps/api/src/modules/<domain>/` with proportional structure (flat for simple; layered for complex).
2. **Shared contract** (when 2+ apps need it): create or extend packages under `packages/`.
3. **Web feature**: `apps/web/src/features/<name>/` with public `index.ts`.
4. **Mobile feature** (Wave 3): mirror the same API via a thin client — do not import web components.

## How to add an API module (Wave 2)

1. Create Nest module under `apps/api/src/modules/<context>/`.
2. Persist via Prisma (`apps/api/prisma/schema.prisma` — docs mirror under `docs/database/schema.prisma`).
3. Publish/consume in-process domain events as in [bounded-contexts.md](./architecture/bounded-contexts.md).
4. Expose REST; share Zod/types with clients only when a package exists.

## Waitlist today vs Wave 2

- **Today (web):** `/register` two-step UI; Next `POST /api/waitlist` still accepts the profile lead (`parseWaitlistBody`; password not stored). May still be a placeholder log.
- **API scaffold:** Nest `POST /marketing/waitlist` persists `WaitlistEntry` when Postgres is migrated. Switch web to `NEXT_PUBLIC_API_BASE_URL` and remove the Next route at cutover. Nest `identity` register/login is still a stub (`GET /auth/status`). Contract: [api.md](./api/overview.md).

## Tooling

- **pnpm workspaces** only (no Turborepo/Nx until multi-app CI needs them).
- Root scripts: `pnpm dev` (web), `pnpm dev:api`, `pnpm build` / `lint` / `typecheck` (recursive), `pnpm prisma:generate` / `prisma:migrate`.
- Local PostGIS: [`docker-compose.yml`](../docker-compose.yml).