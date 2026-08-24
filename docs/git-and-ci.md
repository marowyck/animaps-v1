# ANIMAPS — Git and CI conventions

Phase 0 document. Defines flow **before** and during monorepo growth.  
CI workflow (`.github/workflows/ci.yml`) evolves with apps; workspace is `apps/*` only today.

---

## Closed decisions

| Topic | Decision |
|---|---|
| Package manager | **pnpm** workspaces |
| CI | **GitHub Actions** |
| Human review | Solo MVP — **no** required approval; self-review + CI |
| Branches | `main` = production · `develop` = staging · `feature/*` → `develop` · `hotfix/*` → `main` (+ backport `develop`) |
| CI on PR | `lint` + `typecheck` + `test` + `build` (per existing app) |

---

## 1. Branch flow

```text
feature/* ──PR──► develop (staging) ──release/PR──► main (production)
hotfix/*  ──PR──► main ──backport──► develop
```

| Branch | Use |
|---|---|
| `main` | Production. Stable merges only (via `develop` or `hotfix/*`). |
| `develop` | Staging. Continuous feature integration. |
| `feature/<slug>` | Isolated work (e.g. `feature/identity-register`). PR → `develop`. |
| `hotfix/<slug>` | Urgent production fix. PR → `main`; then merge/cherry-pick to `develop`. |

**Rules**

- No day-to-day direct commits to `main` (except initial repo bootstrap).
- Prefer PRs even solo: clear history + CI.
- Feature names: English kebab-case, domain-aligned (`feature/adoption-request`, `feature/occurrence-map`).

---

## 2. Conventional Commits

Format: `<type>(optional-scope): <short English summary>`

| Type | When |
|---|---|
| `feat` | New functionality |
| `fix` | Bug fix |
| `docs` | Docs only |
| `chore` | Maintenance, deps, configs |
| `refactor` | Code change without feat/fix |
| `test` | Tests |
| `ci` | Pipeline / Actions |

**Useful scopes:** `identity`, `adoption`, `occurrence`, `web`, `api`, `docs`, `waitlist`.

**Examples**

```text
feat(adoption): add RequestAdoption use case
fix(occurrence): allow null userId for anonymous reports
docs: add LGPD checklist and privacy draft
chore(web): bump next
ci: define lint typecheck test build matrix
```

---

## 3. Pull request policy (solo MVP)

- **Human reviewer:** not required.
- **Self-review:** author runs DoD below before merge.
- **CI:** when workflow exists, merge only with green checks (enable branch protection then).
- **Default base:** `feature/*` → `develop`. Releases `develop` → `main` with a short release note.

### Definition of Done (paste in PR)

```markdown
## DoD
- [ ] PR scope is single and described
- [ ] Conventional commit(s) / PR title clear
- [ ] No secrets (.env, tokens, keys) in the diff
- [ ] Code/schema identifiers in English
- [ ] Aligned with domain docs (bounded contexts / permissions / LGPD) if touching rules
- [ ] CI green (lint, typecheck, test, build) — when pipeline exists
- [ ] Self-review done (diff reread)
```

---

## 4. Monorepo (pnpm)

**Current / target layout** (`pnpm-workspace.yaml` = `apps/*` only):

```text
/
  apps/
    web/          # Next.js — exists (@animaps/web)
    api/          # NestJS — Wave 2 (not scaffolded yet)
    mobile/       # Expo — Wave 3 (not scaffolded yet)
  docs/
  pnpm-workspace.yaml
  package.json    # root scripts
```

**No `packages/*` required today.** Extract shared packages (`types`, `validation`, `api-client`) only when a second app needs the same contracts — see [`architecture.md`](architecture.md).

**Root scripts** (recursive over apps):

| Script | Role |
|---|---|
| `pnpm lint` | ESLint across apps |
| `pnpm typecheck` | `tsc --noEmit` per app |
| `pnpm test` | Unit/integration tests (as apps add them) |
| `pnpm build` | Build each existing app |
| `pnpm dev` | Dev (currently filters `@animaps/web`) |

Filters: `pnpm --filter @animaps/web <cmd>` (and future `@animaps/api`, etc.).

---

## 5. CI — GitHub Actions (definition)

**When:** push/PR to `develop` and `main` (and PRs targeting those bases).

**Jobs per existing app** (today: `web`; add `api` when scaffolded), Node LTS:

1. Checkout + setup pnpm + install (`pnpm install --frozen-lockfile`)
2. `lint`
3. `typecheck`
4. `test`
5. `build`

**Notes**

- Cache pnpm store.
- Do **not** assume `packages/*` in the matrix until packages exist.
- After a stable pipeline: enable **branch protection** on `main` and `develop` with required status checks (still 0 required approvals for solo MVP).

---

## 6. Environments

| Environment | Typical branch | Hosting (planned) |
|---|---|---|
| Local | any | Docker/local Postgres+PostGIS (API Wave 2) |
| Staging | `develop` | Railway/Render (api) + Vercel preview/staging (web) |
| Production | `main` | Same providers, separate prod project |

### Keep out of Git

- `.env`, `.env.local`, `.env.*.local`
- Secrets: `DATABASE_URL`, JWT keys, Mapbox, S3/R2, third-party tokens
- Cloud credentials / service-account files
- `node_modules/`, builds (`dist/`, `.next/`)

Use GitHub Actions secrets / host env vars.

---

## 7. Intent checklist

- [x] `pnpm-workspace.yaml` with `apps/*` (no packages required)
- [ ] `.github/workflows/ci.yml` for existing apps
- [ ] Protect `main` and `develop` (required checks; approvals = 0 solo MVP)
- [ ] Staging ≠ production (separate URLs and secrets)
- [ ] Add `api` / `mobile` to CI matrix when scaffolded
