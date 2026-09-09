# ANIMAPS — Documentation

Index of product, domain, and frontend docs. Keep this file aligned when adding or renaming docs.

**Code naming:** English (`camelCase` API / `snake_case` DB; config keys often `SCREAMING_SNAKE`). **UI copy:** Portuguese (default) + English + Spanish via client dictionaries (no `/en` or `/es` routes).

**Start here for style & extensibility:** [conventions.md](conventions.md).

---

## Product & architecture

| Doc | Content |
|---|---|
| [conventions.md](conventions.md) | Engineering norms: naming, UserType, onboarding, modals, docs checklist |
| [architecture.md](architecture.md) | Monorepo boundaries, web feature layout, auth design, roadmap waves |
| [bounded-contexts.md](bounded-contexts.md) | DDD contexts (identity, adoption, occurrence, …) |
| [user-types.md](user-types.md) | UserType catalog, legacy mapping, selection at register |
| [profiles.md](profiles.md) | Type-specific profile tables and fields |
| [user-flow.md](user-flow.md) | End-to-end journey: signup → onboarding → dashboard |
| [roadmap.md](roadmap.md) | Product phases reconciled with infra waves |

## Data & privacy

| Doc | Content |
|---|---|
| [database.md](database.md) | Modeled tables + Wave 2 candidates (intentions, prefs, verification) |
| [data-dictionary.md](data-dictionary.md) | Canonical fields, types, LGPD notes |
| [der.dbml](der.dbml) | ER diagram (dbdiagram.io) |
| [schema.prisma](schema.prisma) | Prisma draft (docs only until API) |
| [schema-evolution.md](schema-evolution.md) | How to change the DB safely |
| [permissions.md](permissions.md) | UI capability catalog (`hasPermission`) |
| [permissions-matrix.md](permissions-matrix.md) | Domain action matrix (Nest guards target) |
| [lgpd-checklist.md](lgpd-checklist.md) | Minimum LGPD checklist for MVP |
| [privacy-policy-draft.md](privacy-policy-draft.md) | Internal privacy draft |

## Auth, onboarding & product UI

| Doc | Content |
|---|---|
| [authentication.md](authentication.md) | Email verification, login/register relation, security notes |
| [onboarding.md](onboarding.md) | Dynamic multi-type onboarding engine and flows |
| [verification.md](verification.md) | Selfie + institutional verification |
| [profile.md](profile.md) | Optional PERSON enrichment fields + privacy |
| [dashboard.md](dashboard.md) | DynamicDashboard, RoleBasedNavigation, per-type nav |
| [matching.md](matching.md) | Discover structure, actions, future algorithm |

## Design & components

| Doc | Content |
|---|---|
| [design-system.md](design-system.md) | Tokens, typography, states, accessibility |
| [components.md](components.md) | Shared UI + feature component catalog |
| [ui-patterns.md](ui-patterns.md) | Toasts, language menu, auth form chrome |
| [landing-design-brief.md](landing-design-brief.md) | Landing visual identity |
| [landing-content-brief.md](landing-content-brief.md) | Landing content goals |
| [landing-tech-plan.md](landing-tech-plan.md) | Landing stack, SEO, deploy |

## Process

| Doc | Content |
|---|---|
| [git-and-ci.md](git-and-ci.md) | Branches, Conventional Commits, CI |
| [personas.md](personas.md) | Product personas |
| [pilot-ngo.md](pilot-ngo.md) | Pilot NGO selection |

---

## Documentation rule

Whenever a new feature or architectural decision ships:

1. Update the relevant doc(s) in this folder (and [conventions.md](conventions.md) if a reusable pattern appears).
2. Record technical decisions and **current (mock)** vs **future (API)** behavior.
3. Document user flow, data involved, and extension points.
4. If schema changed: keep Prisma + DBML + dictionary in lockstep.
5. Refresh this index when adding a top-level doc.
