# ADR-005 — Report / Case separation

**Status:** Accepted  
**Date:** 2026-09-10  
**Related:** [cases.md](../domains/cases.md) · [case-routing.md](../domains/case-routing.md) · [overview.md](../domains/overview.md) · [database.md](../database/overview.md)

---

## Contexto

ANIMAPS receives citizen and partner intake (denúncias, animais perdidos/encontrados, risco) and must support institutional workflow (triage, assignment, updates, closure). Wave 2 already freezes geo **occurrences**; the ecosystem layer adds **Case** as the institutional process entity.

## Problema

If intake and institutional process share one overloaded entity, teams mix original evidence with internal workflow, mis-promise “delivered to agency,” and cannot evolve routing independently.

## Decisão

Treat **Report** (intake / occurrence / original record) and **Case** (institutional process) as **separate concepts**:

```text
User → Report → validation → classification → priority → routing
  → Case → institution → triage → service → updates → closure
```

- Do not auto-promote every received payload into a Case.
- Never tell a citizen a report was delivered to a public agency without a routing match.
- Case does **not** delete Wave 2 `occurrences` in this architecture pass; linking/unification is a later expand-contract if needed.
- Frontend `features/cases` models the institutional workflow; intake/report surfaces may remain distinct features/modules as they land.

## Alternativas

| Alternative | Why rejected |
|---|---|
| Single “ticket” entity for everything | Collapses evidence and process; privacy and status confusion |
| Drop occurrences in favor of Case immediately | Breaks Wave 2 freeze and geo pipeline plans |
| Case only for “denúncias” | Product needs lost/found, stray, public requests, etc. |

## Consequências

- Docs and schema must keep Case types, statuses (internal vs citizen), and routing explicit.
- Institution dashboard modules operate on Cases, not raw undifferentiated intake.
- Future API modules should expose clear boundaries between occurrence/report APIs and case APIs.
