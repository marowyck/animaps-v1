# ANIMAPS — Schema evolution

Rules for changing the data model as the product grows (web → API → iOS/Android).

Related: [schema.prisma](schema.prisma) · [der.dbml](der.dbml) · [data-dictionary.md](data-dictionary.md) · [database.md](./overview.md) · [conventions.md](../architecture/conventions.md) · [overview.md](../domains/overview.md).

---

## Source of truth

| Phase | Location |
|---|---|
| Now (docs only) | [`schema.prisma`](schema.prisma), [`der.dbml`](der.dbml), [`data-dictionary.md`](data-dictionary.md) |
| Wave 2+ | `apps/api/prisma/schema.prisma` — docs copy follows API or is removed |

Clients (`apps/web`, future `apps/mobile`) **never** access Postgres. Sync via API using `updatedAt` + cursor pagination.

---

## Prefer additive change

1. Add nullable columns, new tables, or new enum **values**.
2. Do not rename or drop columns in the same release as a large feature **once data exists in production**.
3. Expand → dual-write / backfill → contract (drop) only when old clients are gone.

**Pre-launch exception:** renames such as `UserRole` → `UserType`, `guardian_profiles` → `person_profiles`, and animal FKs (`ngo_id` → `organization_id`, …) were applied in docs while no production database exists. After Wave 2 ships with real data, treat those names as frozen and use expand-contract for any further renames.

---

## Postgres enums

- **Add values only** after production.
- Never rename or remove a value without expand-contract and a coordinated deploy.
- Volatile tags (`temperament`, clinic `services_offered`) stay as `String[]` with app validation until the set is stable.
- Controlled catalogs that are already product-stable may be enums (`other_role`, `user_type`).

---

## UserType + profiles

- `users.user_type` is the single discriminator ([user-types.md](../domains/user-types.md)).
- Profile tables are 1:1 (`person_profiles`, `organization_profiles`, `veterinary_profiles`, `other_profiles`).
- When adding a public type: enum value + profile table (if needed) + waitlist enum value + docs in the **same** change set.
- Onboarding tables (`user_intentions`, `animal_preferences`, `verification_requests`, `user_locations`, `user_profile_fields`, …) are in the docs Prisma — do not overload `person_profiles` with multi-select arrays.

---

## Media

- MVP: `photos String[]` (object-storage URLs).
- Later wave: introduce `MediaAsset`, migrate URLs, then drop arrays. Do not invent that table early.

---

## Mobile readiness (already in schema)

- Mutable rows carry `updatedAt`.
- `DevicePushToken` for APNs/FCM.
- `RefreshToken.clientType` / `deviceId` for multi-device revoke.
- Soft delete: `User.deletedAt`, `Animal.deletedAt` (tokens hard-delete; audit is append-only).

---

## Auth evolution

- `/register` is a **two-step UI**: (1) profile lead → `waitlist_entries` (`profile_type`); (2) strong password validated client-side only until identity auth persists a hash on `users.password_hash`.
- **Never** add password columns to `waitlist_entries`. Conversion is `converted_user_id`.
- `passwordHash` is nullable; `auth_identities` holds Google (and future) subjects. App rule: `passwordHash` **or** ≥1 `auth_identities` row.
- Web refresh: httpOnly cookie; access token in memory ([api.md](../api/overview.md)).

---

## Ownership checks

- “At least one of `organizationId` / `personId` / `veterinaryId` on `Animal`” stays an **application** rule for now.
- Optional later: raw SQL `CHECK` in a migration (Prisma does not express this cleanly).

---

## Checklist before a large schema PR

- [ ] Additive only (or expand-contract plan written) — unless still pre-production docs-only
- [ ] DER + data dictionary + Prisma updated in the same PR
- [ ] Enum change is additive (post-production)
- [ ] Mobile/web clients do not need a breaking API change in the same release (or versioned)
- [ ] No secrets / full PII in `AuditLog.metadata` or `Notification.payload`
- [ ] User-type / profile renames reflected in [user-types.md](../domains/user-types.md) / [profiles.md](../domains/profiles.md)

---

## Ecosystem foundation (Fase 1)

Additive layer beside the Wave 2 freeze. Product entry: [overview.md](../domains/overview.md). Closed mapping: [account-types.md](../domains/account-types.md).

| Change | Rule |
|---|---|
| `users.account_type` | **Nullable** column. Fill by mapping from `user_type` when known. Do not make it required in the same release as the first production data. |
| New tables | Organizations, institutions (+ types, depts, teams, members, jurisdictions, capabilities, report policies), RBAC (`roles`, `permissions`, `role_permissions`, `user_platform_roles`), Case family (`locations`, `case_types`, `cases`, history, assignments, routing, comments, attachments, participants), `data_exports`, `integration_connections` / `integration_logs`. |
| Occurrence vs Case | **Keep** `occurrences`. Case supersedes Occurrence for **institutional routing**. Fold or link (`occurrence_id`) later when the Case API ships — expand-contract, do not drop the map MVP in this pass. |
| Profile FKs | `organization_profiles` / `veterinary_profiles` remain PK/FK on `users.id`. **Do not reparent** to `organizations.id` yet. Future expand-contract when multi-member orgs are the source of truth. |
| Intention enum | **Add values only** (`volunteer`, `foster_home`, `independent_protector`, `animal_professional`, `lost_pet_owner`, `found_pet_reporter`, `other`). Do **not** rename persisted slugs (`adopt`, `report`, `help_animals`, …) after production. |
| Frontend | `features/account-types` and `features/rbac` are **additive** catalogs. `user-types`, `permissions`, `onboarding`, and `dashboard` stay untouched until a dedicated cutover. |

`user_type` remains the live UI discriminator until clients and Nest guards cut over together.

---

## Decision log

- Pre-launch vocabulary alignment (`person` / `organization` / `veterinary`) accepted while schema is docs-only.
- `OtherRole` promoted from free varchar to enum once the OTHER onboarding catalog stabilized.
- Wave 2 onboarding tables promoted into Prisma/DBML (still docs-only until `apps/api`).
- `users.status` → `account_status` enum; `company_tax_id` nullable until verification; occurrence `city`/`neighborhood` + `claim_token_hash`.
- Messages / donations / reviews / volunteers stay **out** of the DER (nav placeholders are not schema).
- Fase 1: additive nullable `account_type` on `users`; do not require it until cutover.
- New org / institution / RBAC / Case tables are additive; Wave 2 identity + occurrence tables stay.
- Occurrence kept alongside Case. Case supersedes for institutional routing; fold/migration later when the API ships.
- `organization_profiles` / `veterinary_profiles` not reparented to `organizations.id` (future expand-contract).
- Intention enum values added, not renamed, so persisted Wave 2 slugs stay valid post-production.
- Frontend: `account-types` + `rbac` modules additive; `user-types` / `permissions` / `onboarding` / `dashboard` untouched.
