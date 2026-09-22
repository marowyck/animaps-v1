# ADR-004 — RBAC layering beside UserType

**Status:** Accepted  
**Date:** 2026-09-10  
**Related:** [overview.md](../domains/overview.md) · [roles-and-permissions.md](../domains/roles-and-permissions.md) · [permissions.md](../security/permissions.md) · [account-types.md](../domains/account-types.md)

---

## Contexto

Today the live UI discriminator is `UserType` (`features/user-types`) with coarse `hasPermission` in `features/permissions`. The ecosystem layer adds `account_type`, organization/institution memberships, and configurable RBAC catalogs (`features/account-types`, `features/rbac`) that are not yet wired into guards.

## Problema

How do we introduce proper authorization (roles → permissions → resource access) without rewriting the freeze for Wave 2 identity/onboarding overnight?

## Decisão

Use an **additive layering** model:

```text
User → AccountType → Membership (org/institution) → Role (scoped) → Permissions → Resource access
```

- Keep `UserType` + UI `hasPermission` authoritative for register, onboarding, and dashboard **until cutover**.
- Document and catalog RBAC / `account_type` beside that freeze; do not replace live paths in this pass.
- UI gating alone is never enough once the API exists — Nest guards + membership checks are the real AuthZ.
- Prefer centralized permission catalogs over scattered `if (type === …)` trees in JSX.

## Alternativas

| Alternative | Why rejected |
|---|---|
| Hardcode every capability on `user_type` forever | Cannot express org/institution memberships |
| Replace `UserType` immediately in UI | Breaks onboarding/dashboard freeze mid-Phase 1 |
| Separate auth systems per account type | Violates one-identity principle |

## Consequências

- Two parallel catalogs exist briefly (`permissions` vs `rbac`) — intentional.
- Cutover must be an explicit project with docs + schema lockstep.
- Platform roles (`MODERATOR`, `ADMIN`, …) live as scoped platform memberships, not a second login.
