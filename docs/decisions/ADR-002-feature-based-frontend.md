# ADR-002 — Feature-based frontend

**Status:** Accepted  
**Date:** 2026-09-10  
**Related:** [architecture.md](../architecture.md) · [conventions.md](../architecture/conventions.md)

---

## Contexto

`apps/web` hosts landing, auth, onboarding, dashboard, cases, institution surfaces, and more. Multiple user types and product areas must remain findable as the UI grows.

## Problema

How should frontend code be organized so developers can locate a domain quickly without giant pages or a dumping-ground `components/` folder?

## Decisão

Organize primarily by **feature** under `apps/web/src/features/<name>/`:

- Each feature exposes a public `index.ts`.
- Other features import **only** through that barrel.
- `app/` routes stay thin (params + composition).
- Shared primitives live in `apps/web/src/components/`; domain UI stays in its feature.
- Prefer hooks/services/types colocated with the feature as complexity grows.

## Alternativas

| Alternative | Why rejected |
|---|---|
| Organize only by technical layer (`components/`, `hooks/`, `services/` globally) | Domains scatter; hard to find “cases” or “onboarding” |
| One folder per route only | Duplicates domain logic across routes |
| Deep shared “modules” prematurely | Couples web to future packages before needed |

## Consequências

- New work must ask “which feature owns this?” before creating files.
- Cross-feature deep imports are forbidden.
- Large features should grow internal structure (components/, hooks/, …) rather than one mega-file.
