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
| `@animaps/web` | Landing + waitlist + auth UI + onboarding + dashboard shells + cookie consent |

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
│   ├── onboarding/      # Config-driven flows, draft, forms, VerificationFlow
│   ├── verification/    # Mock selfie helper (+ legacy SelfieVerificationStep)
│   ├── dashboard/       # DynamicDashboard, RoleBasedNavigation, shells
│   └── discover/        # Card stack, actions, mocks
└── components/          # Shared primitives (Button, Modal→portal, SelectableCard, …)
```

Import other features only through their `index.ts` public API.

Product UX docs: [user-flow.md](user-flow.md) · [onboarding.md](onboarding.md) · [user-types.md](user-types.md) · [conventions.md](conventions.md) · [roadmap.md](roadmap.md) · [docs/README.md](README.md).

## Dependency rules

1. Presentation depends on feature contracts / helpers — not the reverse.
2. When shared packages exist, they must stay free of React / Next / RN / Prisma / Nest.
3. `apps/api` (future) never depends on web or mobile.
4. Features must not import another feature’s internal files.
5. Do not put browser storage or Next Route Handler logic in shared packages (when they exist).
6. Follow [conventions.md](conventions.md) for UserType / onboarding / permissions patterns.

## Domains

| Domain | Where it lives today | Future |
|---|---|---|
| landing | `apps/web` features/landing | web-only |
| auth UI | `apps/web` features/auth (`/register`, `/login`, `/verify-email`) | Nest `identity` (real auth later) |
| onboarding | `features/onboarding` (dynamic flows by `UserType`, localStorage draft) | Nest `identity` prefs + intentions + profiles |
| user types / permissions | `features/user-types`, `features/permissions` (UI gating) | Nest guards + `UserType` |
| verification | `VerificationFlow` + `features/verification` mock helper | Nest + provider via `verification_requests` |
| dashboard / discover | web shells + mocks | Nest reads + matching service |
| waitlist / marketing | web feature + Next `/api/waitlist` | Nest `marketing` module |
| consent | web features/consent | web-only; mobile will use native privacy UX |
| identity, adoption, occurrence, notifications, analytics | docs only | `apps/api` modules |

## How to add a user type (summary)

See the full checklist in [conventions.md](conventions.md). Minimum: enum + profile (if needed) + `ONBOARDING_FLOWS` + `DASHBOARD_CONFIGS` + permissions + i18n (pt/en/es) + docs (Prisma/DBML/dictionary).

## Authorization (design)

- Access JWT (short-lived) + refresh token (hashed at rest).
- Same Nest auth endpoints for web and mobile.
- Web: prefer httpOnly cookie for refresh (or memory + rotation); access in memory.
- Mobile: Secure Store for refresh; access in memory.
- Authorization: `UserType` + verification flags from `identity` ([permissions-matrix.md](permissions-matrix.md)). UI gating alone is never enough ([permissions.md](permissions.md)).

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

- **Today:** `/register` is a two-step create-account UI (`features/auth` + `WaitlistForm`); step 2 validates a strong password client-side, then `POST /api/waitlist` persists the **profile lead only** (`parseWaitlistBody`; password not stored yet). Persistence is still `console.info` (schema already defines `WaitlistEntry`). `/login` is UI-only until Nest `identity` auth.
- **Wave 2:** Nest `marketing` persists `WaitlistEntry`; Nest `identity` owns real password/OAuth signup; web calls `NEXT_PUBLIC_API_BASE_URL`; remove the Next waitlist route. Extract shared types/validation into packages if API and web both need them.

## Tooling

- **pnpm workspaces** only (no Turborepo/Nx until multi-app CI needs them).
- Root scripts: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck` (recursive over apps).
