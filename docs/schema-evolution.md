# ANIMAPS — Schema evolution

Rules for changing the data model as the product grows (web → API → iOS/Android).

Related: [schema.prisma](schema.prisma) · [der.dbml](der.dbml) · [data-dictionary.md](data-dictionary.md) · [database.md](database.md) · [conventions.md](conventions.md).

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

- `users.user_type` is the single discriminator ([user-types.md](user-types.md)).
- Profile tables are 1:1 (`person_profiles`, `organization_profiles`, `veterinary_profiles`, `other_profiles`).
- When adding a public type: enum value + profile table (if needed) + waitlist enum value + docs in the **same** change set.
- Wave 2 onboarding tables (`user_intentions`, `animal_preferences`, `verification_requests`, …) are documented in [database.md](database.md) — add them additively; do not overload `person_profiles` with multi-select arrays that belong in dedicated tables.

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
- **Never** add password columns to `waitlist_entries`.
- `passwordHash` is nullable so Google/OAuth can land without a full `AuthProvider` table yet.
- App rule until then: require `passwordHash` **or** an external identity (document when OAuth ships).
- Google CTA on web is UI-only today; add an identity/provider table only when OAuth is implemented (additive).

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
- [ ] User-type / profile renames reflected in [user-types.md](user-types.md) / [profiles.md](profiles.md)

---

## Decision log

- Pre-launch vocabulary alignment (`person` / `organization` / `veterinary`) accepted while schema is docs-only.
- `OtherRole` promoted from free varchar to enum once the OTHER onboarding catalog stabilized.
