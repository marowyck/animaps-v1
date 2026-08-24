# ANIMAPS — Schema evolution

Rules for changing the data model as the product grows (web → API → iOS/Android).

## Source of truth

| Phase | Location |
|---|---|
| Now (docs only) | [`schema.prisma`](schema.prisma), [`der.dbml`](der.dbml), [`data-dictionary.md`](data-dictionary.md) |
| Wave 2+ | `apps/api/prisma/schema.prisma` — docs copy follows API or is removed |

Clients (`apps/web`, future `apps/mobile`) **never** access Postgres. Sync via API using `updatedAt` + cursor pagination.

## Prefer additive change

1. Add nullable columns, new tables, or new enum **values**.
2. Do not rename or drop columns in the same release as a large feature.
3. Expand → dual-write / backfill → contract (drop) only when old clients are gone.

## Postgres enums

- **Add values only.**
- Never rename or remove a value without expand-contract and a coordinated deploy.
- Volatile tags (`temperament`, clinic `services_offered`) stay as `String[]` with app validation until the set is stable.

## Media

- MVP: `photos String[]` (object-storage URLs).
- Later wave: introduce `MediaAsset`, migrate URLs, then drop arrays. Do not invent that table early.

## Mobile readiness (already in schema)

- Mutable rows carry `updatedAt`.
- `DevicePushToken` for APNs/FCM.
- `RefreshToken.clientType` / `deviceId` for multi-device revoke.
- Soft delete: `User.deletedAt`, `Animal.deletedAt` (tokens hard-delete; audit is append-only).

## Auth evolution

- `passwordHash` is nullable so OAuth can land without a full `AuthProvider` table yet.
- App rule until then: require `passwordHash` **or** an external identity (document when OAuth ships).

## Ownership checks

- “At least one of `ngoId` / `guardianId` / `clinicId` on `Animal`” stays an **application** rule for now.
- Optional later: raw SQL `CHECK` in a migration (Prisma does not express this cleanly).

## Checklist before a large schema PR

- [ ] Additive only (or expand-contract plan written)
- [ ] DER + data dictionary updated in the same PR
- [ ] Enum change is additive
- [ ] Mobile/web clients do not need a breaking API change in the same release (or versioned)
- [ ] No secrets / full PII in `AuditLog.metadata` or `Notification.payload`
