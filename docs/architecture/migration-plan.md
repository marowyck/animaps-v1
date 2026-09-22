# ANIMAPS — Migration plan (ETAPA 3)

Ordered backlog to move from [current-structure.md](current-structure.md) toward [proposed-structure.md](proposed-structure.md). **Nothing in this file is executed by the Architecture Charter documentation pass** — each phase needs separate approval before implementation.

After every phase that touches code or docs: run `pnpm lint`, `pnpm typecheck`, and `pnpm build` (and tests when they exist).

---

## Guiding rules

1. Prefer small, reversible PRs over big-bang moves.
2. Do not scaffold empty `apps/api` / `packages/*` until Wave 2 work starts.
3. Split files on responsibility, not line count alone.
4. Update cross-links in the same PR when moving docs.
5. Keep Phase 1 localStorage behavior working until API replacement ships.

---

## Phase A — Split `cases` store (code, low risk)

**Goal:** Remove the multi-responsibility hotspot in `features/cases/store.ts` (~590 lines).

### Likely touch list

| Path | Change |
|---|---|
| `apps/web/src/features/cases/store.ts` | Keep core case list/CRUD + persistence sync |
| `apps/web/src/features/cases/useCaseAssignment.ts` (new) or `assignmentStore.ts` | Assignment actions / state |
| `apps/web/src/features/cases/useCaseRouting.ts` (new) or `routingStore.ts` | Routing-related case state |
| `apps/web/src/features/cases/useCases.ts` | Re-export / compose focused APIs |
| `apps/web/src/features/cases/index.ts` | Public API stays stable for consumers |
| Panels that import the store | Prefer barrel imports; update if internals move |

### Approach

1. Identify action groups in `store.ts` (CRUD, assignment, routing, hydrate/persist).
2. Extract assignment and routing into dedicated modules that call shared persistence helpers in `storage.ts`.
3. Keep a thin facade in `useCases` / `index.ts` so pages do not break.
4. No UI redesign in this phase.

### Risk

| Risk | Mitigation |
|---|---|
| localStorage shape drift | Keep `storage.ts` serialization format unchanged |
| Missed imports | Typecheck + manual smoke of cases list/detail/claim |
| Circular imports | Shared types stay in `types.ts`; stores import types only |

### Rollback

Revert the PR; single-file store returns. No schema or API impact.

### Done when

- No single cases store file mixing unrelated domains above ~300 lines without justification.
- Cases list, create, claim, detail, assignment, routing panels still work against localStorage.

---

## Phase B — Decompose institution shells & CaseDetail (code)

**Goal:** Componentize heavy shells and case detail.

### Touch list

| Path | Change |
|---|---|
| `InstitutionTeamShell.tsx` (~478) | Shell + subcomponents (members list, invite/form, role controls, …) |
| `InstitutionIntegrationsShell.tsx` (~407) | Shell + connection cards / config panels |
| `CaseDetail.tsx` (~360) | Folder or sibling components for header, timeline, assignment, routing panels wiring |
| Related `index.ts` barrels | Export only what pages need |

### Approach

1. Extract presentational sections first (props in / callbacks out).
2. Leave data hooks (`useInstitutionOrg`, `useIntegrations`, `useCases`) as the owners of state.
3. Keep routes under `app/` thin.

### Risk

| Risk | Mitigation |
|---|---|
| Prop drilling explosion | Colocate small hooks next to sections |
| Broken i18n keys | Reuse existing message keys; no copy rewrite |

### Rollback

Revert component extraction PR.

### Done when

- Shells are primarily composition.
- Case detail panels are independently readable files.

---

## Phase C — Docs taxonomy move (docs only)

**Goal:** Apply the mapping in [proposed-structure.md](proposed-structure.md) §6.

### Steps

1. Create `docs/domains/`, `docs/features/`, `docs/api/`, `docs/database/`, `docs/security/`, `docs/roadmap/` (as needed).
2. `git mv` files per mapping table.
3. Consolidate `profile.md` + `profiles.md` into one profiles doc (preserve both intents in sections).
4. Update relative links in every moved file and in:
   - `docs/README.md`
   - root `README.md`
   - `docs/architecture.md` / architecture subdocs
   - in-code comments that link to docs (if any)
5. Leave short stub redirects at old paths **only if** external bookmarks matter; otherwise prefer a single index update.

### Risk

Broken links in PRs and bookmarks. Mitigate with a link grep (`](...md)`) and README smoke.

### Rollback

`git revert` of the move commit(s).

### Done when

- Index reflects new taxonomy.
- No dangling relative links from the move set.
- `profile` / `profiles` ambiguity resolved.

---

## Phase D — Wave 2 API scaffold (infra + backend trigger)

**Goal:** Create `apps/api` only when Nest + Prisma work actually starts.

### Steps (outline)

1. Scaffold Nest app under `apps/api` with modular layout from proposed-structure.
2. Move or copy Prisma from `docs/schema.prisma` into `apps/api` (per [architecture.md](../architecture.md)).
3. Wire `pnpm-workspace.yaml` if packages are introduced.
4. Extract `packages/shared-types` / `validation` / `api-client` **only** when web consumes shared contracts.
5. Replace waitlist Route Handler with Nest `marketing` module when ready.
6. Formalize `infra/compose` from root `docker-compose.yml` when Dockerfiles multiply.

### Explicit non-goals for Phase D start

- Empty `apps/admin` / `apps/institutional` / `apps/mobile` placeholders.
- Empty `packages/ui` without a second consumer.

### Risk

Premature abstraction. Gate: first real endpoint + Prisma migrate.

### Rollback

Remove scaffold branch; docs schema remains source of truth until cutover.

---

## Phase E — Tests & CI expansion (when product-critical paths stabilize)

| Item | Notes |
|---|---|
| Unit tests near features/modules | Prefer colocated or `apps/*/tests` |
| `tests/e2e/` | Auth, onboarding, cases, institution flows |
| CI workflows | Split frontend/backend/e2e when api exists ([git-and-ci.md](../infrastructure/git-and-ci.md)) |

Do not block Phase A–C on e2e.

---

## Phase F — Optional `apps/institutional`

Revisit only if institution UX cannot stay maintainable inside `apps/web` (bundle size, auth branding, deploy isolation). Until then, deepen `features/institution/*`.

---

## Recommended order

```text
A (cases store)
  → B (shells / CaseDetail)
    → C (docs taxonomy)     # can run parallel to A/B if staffing allows
      → D (api scaffold)    # gated by Wave 2 start
        → E (tests/CI)
          → F (institutional app?)  # optional
```

Documentation pass (this charter) is **complete** when ADRs + architecture trio exist and are indexed — it does **not** include A–F execution.

---

## Checklist before starting any phase

1. Confirm phase still matches current code (re-read hotspots).
2. Open a focused PR with Conventional Commits (`refactor(cases): …`, `docs: …`).
3. Run lint / typecheck / build.
4. Update owning docs (current vs future behavior).
5. If structure changed materially, append a Decision log entry or ADR.

---

## Decision log

- Migration is phased and approval-gated; documentation pass does not refactor hotspots.
- Wave 2 scaffolding is explicitly gated to avoid empty monorepo noise.
- Docs taxonomy is a dedicated phase so link updates stay reviewable.
- **Phase A (2026-09-10):** Split `features/cases/store.ts` (~590) into `helpers.ts`, `queries.ts`, core `store.ts` (CRUD), `assignmentStore.ts`, and `routingStore.ts`. `useCases` / `index` remain the public facade; localStorage shape unchanged.
- **Phase B (2026-09-10):** Decomposed `CaseDetail` into `CaseDetail/` subcomponents; `InstitutionTeamShell` into team cards (`TeamDepartmentsCard`, `TeamTeamsCard`, `TeamMembersCard`); `InstitutionIntegrationsShell` into `ConnectionsCard`, `SyncLogsCard`, `ExportAggregatesCard`. Public barrels unchanged.
- **Phase C (2026-09-10):** Docs taxonomy applied — files moved under `architecture/`, `domains/`, `features/`, `api/`, `database/`, `security/`, `roadmap/`, `infrastructure/`; `profile.md` + `profiles.md` consolidated into `domains/profiles.md` (stub at old `profile.md`); cross-links + root/`docs` README updated.
- **Phase D (2026-09-10):** Scaffolded `@animaps/api` (Nest modular layout, Prisma schema copied to `apps/api/prisma`, `GET /health`, `POST /marketing/waitlist`, identity stub). No empty `packages/*` / admin / institutional / mobile. Web waitlist Route Handler not removed yet (cutover later).
