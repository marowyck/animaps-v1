# ADR-001 — Monorepo with staged rollout

**Status:** Accepted  
**Date:** 2026-09-10  
**Related:** [architecture.md](../architecture.md) · [proposed-structure.md](../architecture/proposed-structure.md)

---

## Contexto

ANIMAPS will eventually include a web client, Nest API, optional admin and institutional clients, and mobile. The codebase is still Phase 1: only `apps/web` exists, with localStorage mocks and no Nest app.

## Problema

How should the repository grow without either (a) a premature empty tree of apps/packages, or (b) a single unscoped app that cannot split later?

## Decisão

Use a **pnpm monorepo** with workspace glob `apps/*` (and `packages/*` when shared packages appear).

- **Phase 1:** only `apps/web`.
- **Wave 2:** add `apps/api` when backend work starts; extract `packages/*` only when two consumers need the same contracts.
- **Wave 3+:** mobile / admin / optional institutional app when product needs them.
- Do **not** scaffold empty apps or packages “for shape.”

## Alternativas

| Alternative | Why rejected |
|---|---|
| Scaffold full target tree now | Empty folders, false sense of progress, maintenance noise |
| Single repo without workspaces | Harder to add API/mobile with clear boundaries later |
| Turborepo/Nx from day one | Extra complexity before multi-app CI needs them |

## Consequências

- `pnpm-workspace.yaml` stays minimal until packages exist.
- Architecture docs must state wave gates clearly.
- Institutional UX may live under `apps/web` until a dedicated app is justified.
