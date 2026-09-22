# ANIMAPS — Documentation

Index of product, domain, and process docs. Keep this file aligned when adding or renaming docs.

**Code naming:** English (`camelCase` API / `snake_case` DB; config keys often `SCREAMING_SNAKE`). **UI copy:** Portuguese (default) + English + Spanish via client dictionaries (no `/en` or `/es` routes).

**Start here for style & extensibility:** [architecture/conventions.md](architecture/conventions.md).  
**Start here for the ecosystem layer:** [domains/overview.md](domains/overview.md).  
**Architecture charter:** [architecture.md](architecture.md) · [architecture/](architecture/) · [decisions/](decisions/).

Docs live in a **taxonomy** (Phase C): `architecture/` · `domains/` · `features/` · `api/` · `database/` · `security/` · `decisions/` · `roadmap/` · `infrastructure/`.

---

## Architecture & decisions

| Doc | Content |
|---|---|
| [architecture.md](architecture.md) | Monorepo boundaries, web feature layout, auth design, roadmap waves |
| [architecture/current-structure.md](architecture/current-structure.md) | Charter ETAPA 1 — inventory and findings |
| [architecture/proposed-structure.md](architecture/proposed-structure.md) | Charter ETAPA 2 — target tree, docs taxonomy |
| [architecture/migration-plan.md](architecture/migration-plan.md) | Charter ETAPA 3 — phased migration backlog |
| [architecture/conventions.md](architecture/conventions.md) | Engineering norms: naming, UserType, onboarding, docs checklist |
| [architecture/bounded-contexts.md](architecture/bounded-contexts.md) | DDD contexts (identity, adoption, occurrence, …) |
| [architecture/ui-guidelines.md](architecture/ui-guidelines.md) | How to apply the brand on new screens |
| [architecture/responsive.md](architecture/responsive.md) | Breakpoints and layout rules |
| [decisions/ADR-001-monorepo-staged-rollout.md](decisions/ADR-001-monorepo-staged-rollout.md) | ADR — pnpm monorepo, wave-gated apps/packages |
| [decisions/ADR-002-feature-based-frontend.md](decisions/ADR-002-feature-based-frontend.md) | ADR — `features/` organization + public barrels |
| [decisions/ADR-003-modular-backend-when-scaffolded.md](decisions/ADR-003-modular-backend-when-scaffolded.md) | ADR — Nest modules when `apps/api` starts |
| [decisions/ADR-004-rbac-layering.md](decisions/ADR-004-rbac-layering.md) | ADR — UserType freeze + additive RBAC |
| [decisions/ADR-005-report-case-separation.md](decisions/ADR-005-report-case-separation.md) | ADR — Report/intake vs Case process |

## Domains

| Doc | Content |
|---|---|
| [domains/overview.md](domains/overview.md) | Ecosystem thesis: users / organizations / institutions, Case |
| [domains/account-types.md](domains/account-types.md) | `account_type` catalog + legacy `UserType` mapping |
| [domains/user-types.md](domains/user-types.md) | UserType catalog, selection at register |
| [domains/profiles.md](domains/profiles.md) | 1:1 profile tables + PERSON enrichment / privacy |
| [domains/organizations.md](domains/organizations.md) | Civil-society orgs, members, verification |
| [domains/institutions.md](domains/institutions.md) | Public bodies, departments, teams |
| [domains/government.md](domains/government.md) | Distinct government workspace |
| [domains/roles-and-permissions.md](domains/roles-and-permissions.md) | Configurable RBAC seed |
| [domains/cases.md](domains/cases.md) | Case entity, types, statuses |
| [domains/case-routing.md](domains/case-routing.md) | Jurisdiction + capability matching |
| [domains/matching.md](domains/matching.md) | Discover / future match |

## Features (product UX)

| Doc | Content |
|---|---|
| [features/user-flow.md](features/user-flow.md) | Signup → onboarding → dashboard |
| [features/authentication.md](features/authentication.md) | Email verification, login/register |
| [features/onboarding.md](features/onboarding.md) | Dynamic multi-type onboarding |
| [features/verification.md](features/verification.md) | Selfie + institutional verification |
| [features/dashboard.md](features/dashboard.md) | DynamicDashboard, RoleBasedNavigation |
| [features/institution-dashboard.md](features/institution-dashboard.md) | Institution modules |
| [features/integrations.md](features/integrations.md) | Generic connectors / export mocks |
| [features/design-system.md](features/design-system.md) | Tokens, typography, states |
| [features/components.md](features/components.md) | Shared UI catalog |
| [features/ui-patterns.md](features/ui-patterns.md) | Toasts, language menu, auth chrome |
| [features/landing/](features/landing/) | Landing content / design / tech briefs |

## API & database

| Doc | Content |
|---|---|
| [api/overview.md](api/overview.md) | REST contract (identity + marketing + onboarding) |
| [database/overview.md](database/overview.md) | OnboardingDraft → tables + Wave 2 freeze |
| [database/data-dictionary.md](database/data-dictionary.md) | Canonical fields, LGPD notes |
| [database/der.dbml](database/der.dbml) | ER diagram (dbdiagram.io) |
| [database/schema.prisma](database/schema.prisma) | Prisma draft (docs only until API) |
| [database/schema-evolution.md](database/schema-evolution.md) | How to change the DB safely |
| [database/data-flow.md](database/data-flow.md) | Case / routing / membership flow |

## Security & privacy

| Doc | Content |
|---|---|
| [security/security.md](security/security.md) | AuthZ gates, verification, rate limits |
| [security/privacy.md](security/privacy.md) | Case classification, reporter visibility |
| [security/permissions.md](security/permissions.md) | UI `hasPermission` catalog |
| [security/permissions-matrix.md](security/permissions-matrix.md) | Domain action matrix |
| [security/audit.md](security/audit.md) | Audit reuse |
| [security/lgpd-checklist.md](security/lgpd-checklist.md) | MVP LGPD checklist |
| [security/privacy-policy-draft.md](security/privacy-policy-draft.md) | Internal privacy draft |

## Roadmap & infrastructure

| Doc | Content |
|---|---|
| [roadmap/roadmap.md](roadmap/roadmap.md) | Product phases reconciled with infra waves |
| [roadmap/personas.md](roadmap/personas.md) | Product personas |
| [roadmap/pilot-ngo.md](roadmap/pilot-ngo.md) | Pilot NGO selection |
| [infrastructure/git-and-ci.md](infrastructure/git-and-ci.md) | Branches, Conventional Commits, CI |

Local PostGIS: [`docker-compose.yml`](../docker-compose.yml) (used when `apps/api` exists).

Stub for old bookmarks: [profile.md](profile.md) → [domains/profiles.md](domains/profiles.md).

---

## Documentation rule

Whenever a new feature or architectural decision ships:

1. Update the relevant doc(s) under the correct taxonomy folder (and [architecture/conventions.md](architecture/conventions.md) if a reusable pattern appears).
2. Record technical decisions and **current (mock)** vs **future (API)** behavior.
3. Document user flow, data involved, and extension points.
4. If schema changed: keep Prisma + DBML + dictionary in lockstep under `database/`.
5. Refresh this index when adding a doc.
6. Structural / cross-cutting decisions: add or update an ADR under [decisions/](decisions/) and keep [architecture/migration-plan.md](architecture/migration-plan.md) in sync when phases complete.
