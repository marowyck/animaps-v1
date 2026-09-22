# ANIMAPS — Current structure (ETAPA 1)

Snapshot of the repository as of the Architecture Charter documentation pass. Living companion to [architecture.md](../architecture.md). Proposed target: [proposed-structure.md](proposed-structure.md). Migration backlog: [migration-plan.md](migration-plan.md).

**Scope of this document:** inventory and findings only. No files were moved or refactored in this pass.

---

## 1. Repository tree (what exists today)

```text
animaps/
├── apps/
│   ├── web/                    # @animaps/web — Next.js 16 / React 19 / Tailwind 4
│   └── api/                    # @animaps/api — NestJS + Prisma (Wave 2 scaffold)
├── docs/                       # Taxonomy: architecture, domains, features, …
├── .github/
│   └── workflows/
│       └── ci.yml              # lint + typecheck + build (workspace)
├── docker-compose.yml          # Local PostGIS for apps/api
├── .env.example
├── package.json                # Root scripts: dev / dev:api / build / lint / typecheck
├── pnpm-workspace.yaml         # packages: ["apps/*"] only
├── pnpm-lock.yaml
└── README.md
```

### What does **not** exist yet (by design)

| Expected later | Status |
|---|---|
| `apps/api` identity auth | Stub only (`GET /auth/status`) — register/login pending |
| `apps/admin` | Not scaffolded; admin UX TBD |
| `apps/institutional` | Not a separate app yet; institution UI lives inside `apps/web` |
| `apps/mobile` | Wave 3 — Expo (not scaffolded) |
| `packages/*` | Deferred until a second consumer needs shared contracts |
| `infra/` tree | Root `docker-compose.yml` only; formalize when Dockerfiles multiply |
| `tests/` (root e2e/integration) | Not present yet |

This matches the staged rollout in [architecture.md](../architecture.md) and [ADR-001](../decisions/ADR-001-monorepo-staged-rollout.md).

---

## 2. Workspace & tooling

| Item | Value |
|---|---|
| Package manager | pnpm 10 (`packageManager` in root `package.json`) |
| Workspace globs | `apps/*` only |
| Root scripts | `dev`, `build`, `lint` → `@animaps/web`; `typecheck` recursive |
| CI | `.github/workflows/ci.yml` — lint, typecheck, build |
| Persistence (Phase 1) | Browser `localStorage` per feature — **no** `DATABASE_URL` in web |

---

## 3. `apps/web` layout

```text
apps/web/src/
├── app/                    # Next.js App Router — thin pages
│   ├── api/waitlist/       # Temporary Route Handler (moves to apps/api in Wave 2)
│   ├── analytics/
│   ├── cases/              # list, new, claim, [id]
│   ├── dashboard/
│   ├── discover/
│   ├── institution/
│   ├── integrations/
│   ├── map/
│   ├── onboarding/[step]/
│   ├── reports/
│   ├── routing/
│   ├── settings/
│   ├── team/
│   ├── login/ · register/ · verify-email/
│   ├── layout.tsx · providers.tsx · page.tsx · globals.css
├── features/               # Domain / product features (primary organization)
├── components/             # Shared primitives + motion bits/
├── hooks/                  # Cross-cutting hooks (e.g. usePrefersReducedMotion)
├── i18n/                   # LocaleProvider + pt/en/es message dictionaries
└── …
```

### Feature inventory

| Feature | Role today |
|---|---|
| `landing/` | Marketing sections + clay mascots |
| `auth/` | Split layout, register/login, verify-email UI |
| `waitlist/` | Form + validation; profile lead via `/api/waitlist` |
| `consent/` | Cookie banner + localStorage |
| `onboarding/` | Config-driven multi-type flows, draft, VerificationFlow |
| `verification/` | Mock selfie helper (+ legacy step) |
| `user-types/` | PublicUserType helpers + DB mapping (authoritative UI discriminator) |
| `permissions/` | Coarse UI `hasPermission` catalog |
| `account-types/` | Additive `AccountType` catalog (not wired into pages yet) |
| `rbac/` | Additive RBAC seed keys (not wired into guards yet) |
| `dashboard/` | DynamicDashboard, RoleBasedNavigation, shells, nav config |
| `discover/` | Card stack + mocks |
| `cases/` | Case CRUD mocks, claim, detail, assignment, routing panels, store |
| `institution/` | Institution dashboard, map, analytics, profile, team, routing, integrations |

### Dependency rules already in force

From [architecture.md](../architecture.md) and [conventions.md](./conventions.md):

1. Features expose a public `index.ts`; other features must not deep-import internals.
2. `app/` routes stay thin — compose feature entry points.
3. Shared primitives live in `components/`; domain UI stays in its feature.
4. No shared packages until a second app needs the same contracts.
5. Clients never access the database (when API exists).

---

## 4. Persistence pattern (Phase 1)

All durable client state for new institutional/case work is **localStorage**, not an API:

| Feature area | Storage module |
|---|---|
| Cases | `features/cases/storage.ts` |
| Institution team | `features/institution/team/storage.ts` |
| Institution routing | `features/institution/routing/storage.ts` |
| Institution integrations | `features/institution/integrations/storage.ts` |
| Onboarding draft | `features/onboarding/storage.ts` |
| Cookie consent | `features/consent/storage.ts` |

This is intentional for Phase 1 mocks. Wave 2 replaces these with Nest + Prisma.

---

## 5. File-size hotspots (architectural findings)

Thresholds from the Architecture Charter (responsibility-first; line counts are signals):

| Threshold | Action |
|---|---|
| > 200 lines | Analyze |
| > 300 lines | Review responsibilities |
| > 500 lines | Justify |
| > 800 lines | Strong architectural smell |

### Primary hotspots (to address in migration Phase A/B)

| File | Lines | Issue |
|---|---|---|
| `features/cases/store.ts` | ~~590~~ → split (Phase A done) | Was a single store mixing CRUD, assignment, routing; now `store.ts` + `assignmentStore.ts` + `routingStore.ts` (+ `helpers` / `queries`) |
| `features/institution/InstitutionTeamShell.tsx` | ~~478~~ → ~174 composition (Phase B) | Shell + `team/TeamDepartmentsCard`, `TeamTeamsCard`, `TeamMembersCard` |
| `features/institution/integrations/InstitutionIntegrationsShell.tsx` | ~~407~~ → ~165 composition (Phase B) | Shell + `ConnectionsCard`, `SyncLogsCard`, `ExportAggregatesCard` |
| `features/cases/CaseDetail.tsx` | ~~360~~ → `CaseDetail/` folder (Phase B) | Shell (~123) + header/summary/timeline/panels |

### Secondary watch-list (analyze; not urgent)

| File | Lines | Notes |
|---|---|---|
| `features/onboarding/types.ts` | ~331 | Large draft/types surface — may stay if cohesive |
| `features/rbac/types.ts` | ~313 | Catalog seed — size justified if tables stay data-only |
| `components/Select.tsx` | ~328 | Shared primitive — review for extractable subparts |
| `features/dashboard/navigation.ts` | ~272 | Config tables — prefer keep unless mixed with UI logic |
| `features/onboarding/config/flows.ts` | ~263 | Flow config — acceptable if data-only |

### Intentionally large (not treated as monolitics)

| File | Lines | Why acceptable (for now) |
|---|---|---|
| `i18n/messages/{pt,en,es}.ts` | ~1336 each | Locale dictionaries — split by domain later if needed |
| `i18n/types.ts` | ~1020 | Mirrors message shape |

---

## 6. Documentation inventory

`docs/` uses the Phase C taxonomy: `architecture/`, `domains/`, `features/`, `api/`, `database/`, `security/`, `decisions/`, `roadmap/`, `infrastructure/`. Entry index: [../README.md](../README.md).

### Naming consolidation

| Files | Resolution |
|---|---|
| `docs/profile.md` vs `docs/profiles.md` | Merged into [domains/profiles.md](../domains/profiles.md); stub remains at [profile.md](../profile.md) |

### Coverage strengths

- Ecosystem layer documented under `domains/`.
- Schema drafts under `database/` (`schema.prisma`, `der.dbml`, `data-dictionary.md`).
- Conventions and ADRs under `architecture/` + `decisions/`.

### Coverage gaps (remaining)

- Empty apps/packages still deferred (Wave 2+).
- Further ADR growth as decisions accumulate.

---

## 7. False alarm: path “duplicates”

Git status snapshots sometimes showed both `apps/web/...` and `apps\web\...`. Directory listing confirmed **each file exists once**. This is a Windows/tooling display artifact, not on-disk duplication.

---

## 8. Summary of problems

1. ~~**Monolithic client store** — `cases/store.ts` exceeds the 500-line justify threshold with mixed responsibilities.~~ **Resolved in Phase A** (split into CRUD / assignment / routing modules).
2. ~~**Heavy institution shells** — Team and Integrations shells exceed 400 lines; composition and state should split.~~ **Resolved in Phase B** (shell + section cards).
3. ~~**Case detail density** — `CaseDetail.tsx` is approaching multi-panel complexity without a folder of subcomponents.~~ **Resolved in Phase B** (`CaseDetail/` folder).
4. ~~**Docs flatness** — Hard to navigate 40+ top-level docs.~~ **Resolved in Phase C** (taxonomy folders).
5. ~~**profile.md / profiles.md** — Ambiguous naming.~~ **Resolved in Phase C** (merged into `domains/profiles.md`).
6. **No tests / no API / no packages** — Expected for Phase 1; must not be “fixed” by empty scaffolding.

---

## 9. What is already healthy

- Feature-based frontend with public barrels.
- Thin `app/` pages for most routes.
- Clear Phase 1 vs Wave 2 boundary in architecture docs.
- Additive ecosystem catalogs (`account-types`, `rbac`) beside live `user-types` / `permissions`.
- Institutional subdomain folders under `features/institution/` (`team/`, `routing/`, `integrations/`).
- Docs taxonomy under `docs/{architecture,domains,features,…}/`.

---

## Decision log

- ETAPA 1 documents reality without restructuring code or moving existing docs.
- Hotspots are listed for [migration-plan.md](migration-plan.md); they are not refactored in this pass.
- Staged monorepo remains: do not scaffold empty `apps/api` / `packages/*` until Wave 2 work starts.
- Phase C applied the docs taxonomy and profile consolidation (2026-09-10).
