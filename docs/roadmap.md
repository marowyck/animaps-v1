# ANIMAPS — Product roadmap

Two timelines coexist and must stay reconciled:

1. **Infra waves** (repo / README “Current status”): Phase 0 architecture → Phase 1 landing → Phase 2 Nest API → Phase 3 full web → Phase 4 mobile.
2. **Product UX phases** (this doc): foundation → multi-type onboarding → profile → verification → dashboards → animals → match → messages → community.

This file owns the **product UX phases**. Infra waves remain in [README.md](../README.md) and [architecture.md](architecture.md). Engineering norms: [conventions.md](conventions.md).

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

**Status:** Frontend mocks shipped (localStorage draft).

### Phase 03 — Profile

- Optional additional-info rows + privacy
- Type-specific profile drafts (org / veterinary / other role)
- Photos / bio (later)

### Phase 04 — Verification

- Selfie capture UX (PERSON)
- Institutional verification placeholder (ONG / clinic)
- Status machine; provider integration (future)

### Phase 05 — Dashboards

- `DynamicDashboard` + `RoleBasedNavigation`
- Per-type nav / summary catalogs
- UI permissions gating
- Modular widgets (later)

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

### Phase 09 — Community

- NGOs / protectors
- Reports / lost & found
- Geo map (PostGIS)

---

## Mapping to infra waves

| Product phase | Earliest infra wave |
|---|---|
| 01–05 (UI shells + mocks) | Phase 1 web (current) |
| Real auth, email OTP, persistence of profiles / intentions | Phase 2 Nest `identity` |
| Animals, match, messages, occurrences | Phase 3 web + API modules |
| Native push / Secure Store | Phase 4 mobile |

---

## Working rules

- Ship frontend mocks first; document “current vs future” in each feature doc.
- Do not invent parallel schemas that contradict [data-dictionary.md](data-dictionary.md); extend via [database.md](database.md) candidates.
- Do not fork auth/onboarding per user type — extend config ([conventions.md](conventions.md)).
- Update this roadmap when a phase completes or scope shifts.
