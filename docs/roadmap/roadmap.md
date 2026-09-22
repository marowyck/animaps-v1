# ANIMAPS — Product roadmap

Two timelines coexist and must stay reconciled:

1. **Infra waves** (repo / README “Current status”): Phase 0 architecture → Phase 1 landing → Phase 2 Nest API → Phase 3 full web → Phase 4 mobile.
2. **Product UX phases** (this doc, 01–09): foundation → multi-type onboarding → profile → verification → dashboards → animals → match → messages → community.
3. **Ecosystem fases** (1–8, additive): Foundation → Onboarding → Cases → Institution dashboard → Analytics → Teams → Routing → Integrations.

This file owns the **product UX phases** and the **ecosystem fases**. Infra waves remain in [README.md](../README.md) and [architecture.md](../architecture.md). Ecosystem thesis: [overview.md](../domains/overview.md). Engineering norms: [conventions.md](../architecture/conventions.md).

---

## Product phases

### Phase 01 — Foundation

- Architecture & folder conventions
- Design system tokens
- Documentation scaffold (+ conventions)
- Shared components
- Auth route shells + `/verify-email`

**Status:** Largely done (frontend).

### Phase 02 — Multi-type onboarding

- `UserType` at register (`PERSON` / `ONG` / `VETERINARY_CLINIC` / `OTHER`)
- Config-driven flows (`ONBOARDING_FLOWS`, conditional steps)
- PERSON intentions + conditional animal preferences
- ONG / clinic / OTHER collection forms
- Interests (max 5) for PERSON

**Status:** Frontend mocks shipped (localStorage draft). Current flows **unchanged** while ecosystem AccountType is documented only.

### Phase 03 — Profile

- Optional additional-info rows + privacy
- Type-specific profile drafts (org / veterinary / other role)
- Photos / bio (later)

### Phase 04 — Verification

- Selfie capture UX (PERSON)
- Institutional verification placeholder (ONG / clinic)
- Status machine; provider integration (future)
- Later: institution verification machine ([institutions.md](../domains/institutions.md))

### Phase 05 — Dashboards

- `DynamicDashboard` + `RoleBasedNavigation`
- Per-type nav / summary catalogs
- UI permissions gating
- Modular widgets (later)
- InstitutionDashboard is **proposed only** ([institution-dashboard.md](../features/institution-dashboard.md)) — not this shell

**Status:** Shells + mocks shipped.

### Phase 06 — Animals

- Animal CRUD (API)
- Photos & traits
- Listing for adoption

### Phase 07 — Match

- Compatibility scoring
- Favorites / connections
- Discover card actions wired to API

### Phase 08 — Messages

- Conversations
- Notifications

**Schema:** still out of the DER ([database.md](../database/overview.md)).

### Phase 09 — Community

- NGOs / protectors
- Reports / lost & found
- Geo map (PostGIS)
- Later: Case as institutional supersession of occurrence routing ([cases.md](../domains/cases.md))

---

## Ecosystem fases (additive)

These do **not** replace phases 01–09. They layer organizations, public institutions, Case, and RBAC on the same identity stack.

### Fase 1 — Foundation

- Nullable `account_type`; orgs / institutions / RBAC / Case tables in docs schema
- Frontend catalogs: `features/account-types`, `features/rbac` (not wired)
- Wave 2 `user_type`, profiles, occurrences, DynamicDashboard stay authoritative

**Status:** Docs + schema + additive modules (this pass).

### Fase 2 — Onboarding

- First question AccountType; OTHER folds into PERSON (`accountType`) while keeping OTHER flow
- Org / institution subtype collection at register + onboarding steps
- INSTITUTION flow + institutional verification soft-gate; home `/dashboard`
- Expanded PERSON intentions; `resolveFlowKey` bridges AccountType → Wave 2 flows

**Status:** UI cutover in `apps/web` (draft + waitlist/register + flows + i18n). Persistence of `account_type` waits Nest `identity`.

### Fase 3 — Cases

- Citizen create + claim + citizen-facing status
- Attachments, comments (visibility), participants
- Occurrence kept until expand-contract when the Case API ships (`occurrence_id` optional on Case)
- Soft-gated institution mock inbox (full workspace = Fase 4); routing engine = Fase 7

**Status:** Web mock in `apps/web` (`features/cases`, routes `/cases*`). Persistence waits Nest Case API.

### Fase 4 — Institution dashboard

- Build [institution-dashboard.md](../features/institution-dashboard.md) as a **separate** workspace ([government.md](../domains/government.md))
- Do not reuse match cards / Discover as the government home
- Soft-gate: unverified institutions get profile/settings + read-only cases, not live triage

**Status:** Web mock (`features/institution`, routes `/dashboard` branch, `/institution`, `/settings`, `/map`, `/analytics`, `/team`). Nest institutions API still future.

### Fase 5 — Analytics

- Institution statistics / map (privacy-respecting)
- `VIEW_STATISTICS` / `VIEW_ANALYTICS` / `VIEW_MAP`
- Period filters, type/status/priority/city aggregates, weekly timeline, aggregate CSV export
- City intensity grid (no exact reporter pins)

**Status:** Web mock in `features/institution` (`analytics.ts`, `/analytics`, `/map`). Nest `analytics` read-side still future.

### Fase 6 — Teams

- Departments, teams, memberships, assignment
- Multi-member orgs; still no shared institutional logins

**Status:** Web mock (`features/institution/team`, `/team`, case assignment on detail). Nest institutions membership API still future.

### Fase 7 — Routing

- Jurisdiction + capability matching ([case-routing.md](../domains/case-routing.md))
- Never set citizen `routed` without a routing row

**Status:** Web mock (`features/institution/routing`, `/routing`, case routing panel, auto-match on create). Nest routing engine still future. No external government APIs.

### Fase 8 — Integrations

- Generic connections / logs / export ([integrations.md](../features/integrations.md))
- No named government API in this roadmap item

**Status:** Web mock (`features/institution/integrations`, `/integrations`). Nest `integrations` module + vault still future. Sync failure never flips citizen status.

---

## Mapping to infra waves

| Track | Earliest infra wave |
|---|---|
| Product 01–05 (UI shells + mocks) | Phase 1 web (current) |
| Ecosystem Fase 1 (docs, schema, catalogs) | Phase 1 web (current) |
| Real auth, email OTP, persistence of profiles / intentions | Phase 2 Nest `identity` |
| Ecosystem Fase 2 onboarding cutover (`account_type` persist) | Phase 2 Nest `identity` |
| Animals, match, messages, occurrences | Phase 3 web + API modules |
| Ecosystem Fases 3–7 (cases, institution UI, analytics, teams, routing) | Phase 3 web + API modules |
| Ecosystem Fase 8 integrations | Phase 3+ (after Case API) |
| Native push / Secure Store | Phase 4 mobile |

---

## Working rules

- Ship frontend mocks first; document “current vs future” in each feature doc.
- Do not invent parallel schemas that contradict [data-dictionary.md](../database/data-dictionary.md); extend via [database.md](../database/overview.md) candidates.
- Do not fork auth/onboarding per user type — extend config ([conventions.md](../architecture/conventions.md)).
- Ecosystem work is **additive**: do not rewrite Wave 2 freeze contracts in the same PR as catalog-only modules.
- Update this roadmap when a phase completes or scope shifts.
