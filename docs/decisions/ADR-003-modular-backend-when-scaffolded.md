# ADR-003 — Modular backend when scaffolded

**Status:** Accepted (scaffold started 2026-09-10)  
**Date:** 2026-09-10  
**Related:** [architecture.md](../architecture.md) · [bounded-contexts.md](../architecture/bounded-contexts.md) · [api.md](../api/overview.md) · [apps/api/README.md](../../apps/api/README.md)

---

## Contexto

Wave 2 will introduce NestJS + Prisma + PostgreSQL/PostGIS. There is no `apps/api` yet. Domain docs already describe bounded contexts (identity, adoption, occurrence, …) and an ecosystem layer (organizations, institutions, cases).

## Problema

When the API appears, how should it be structured so business rules stay testable and findable, without putting domain logic in controllers or the web app?

## Decisão

When `apps/api` is scaffolded:

- Use a **modular Nest monolith** under `apps/api/src/modules/<domain>/`.
- Prefer layers: Controller → Service / Use case → Repository → Database.
- For complex domains, organize by use case folders (`create-case/`, `assign-case/`, …) rather than one giant service.
- API never depends on `apps/web` or mobile UI.
- Share Zod/types via `packages/*` only when a second consumer needs them.
- Persist via Prisma; publish in-process domain events as described in bounded contexts.

Until that wave starts, schema remains in docs (`schema.prisma`, `der.dbml`) and the web continues with mocks/localStorage.

**Update (2026-09-10):** `apps/api` is scaffolded with Nest modules (`health`, `marketing`, `identity` stub), Prisma under `apps/api/prisma`, and `POST /marketing/waitlist`. Full identity auth and shared packages remain future work. Docs schema remains a mirror — evolve `apps/api/prisma/schema.prisma` first in runtime work.

## Alternativas

| Alternative | Why rejected |
|---|---|
| Microservices from day one | Operational cost too high for current team/phase |
| Business rules in Next Route Handlers long-term | Couples UI deploy to domain; harder for mobile |
| Anemic “all logic in repositories” | Hides domain decisions in persistence |

## Consequências

- Scaffolding is gated by real Wave 2 work ([migration-plan.md](../architecture/migration-plan.md) Phase D).
- Temporary `/api/waitlist` in Next is allowed until Nest `marketing` / `identity` replace it.
- Frontend must treat API contracts as boundaries, not leak Prisma models into components.
