# ANIMAPS — Permissions matrix

Phase 0 artifact (basis for NestJS guards in Phase 2).  
**UserType** (DB `snake_case`): `person`, `ong`, `veterinary_clinic`, `other`, `public_agency`, `biologist`.  
Public signup uses the first four; `public_agency` and `biologist` are admin-assigned.

Flags: `verified` (ONG / clinic), `isRescuer` (person).

**Values:** `allow` · `deny` · `cond` (see condition).

**Auth:** `anon` = no login · `auth` = any authenticated user · `own` = resource owner.

Related: [permissions.md](permissions.md) (UI capability catalog) · [roles-and-permissions.md](../domains/roles-and-permissions.md) (future RBAC) · [user-types.md](../domains/user-types.md) · [bounded-contexts.md](../architecture/bounded-contexts.md) · [data-dictionary.md](../database/data-dictionary.md).

Institutional actions (inbox, assign, route, export) will move to **RBAC memberships** when that API ships. This matrix stays the Wave 2 target for adoption / occurrence / identity guards keyed by `user_type` + `verified` / `isRescuer`.

---

## Closed decisions

| Topic | Rule |
|---|---|
| Create `Animal` | ONG `verified` **OR** clinic `verified` **OR** person `isRescuer` |
| `RequestAdoption` | Authenticated person + `taxId` set |
| Parallel requests | Many on same animal; origin chooses |
| Animal → `in_process` | On first `approved` (not on request) |
| Create `Occurrence` | Anonymous or authenticated |
| Validate `Occurrence` | ONG verified / `public_agency`; `biologist` only if `wildlife_sighting` |
| Clinical report | Verified clinic only |

---

## Account / identity

| Action | anon | person | ong | veterinary_clinic | public_agency | biologist |
|---|---|---|---|---|---|---|
| `RegisterUser` | allow | deny* | deny* | deny* | deny* | deny* |
| `EditOwnProfile` | deny | allow | allow | allow | allow | allow |
| `DeleteOwnAccount` | deny | allow | allow | allow | allow | allow |
| `VerifyOrganization` (admin) | deny | deny | deny | deny | cond¹ | deny |
| `VerifyVeterinary` (admin) | deny | deny | deny | deny | cond¹ | deny |

\* Already authenticated does not re-register the same type in MVP (separate flow if needed).  
¹ MVP: `public_agency` may verify institutions; or internal manual process — document operator.

---

## Animal / adoption

| Action | anon | person | ong | veterinary_clinic | public_agency | biologist |
|---|---|---|---|---|---|---|
| `ListAvailableAnimals` | allow | allow | allow | allow | allow | allow |
| `GetAnimalPublic` | allow | allow | allow | allow | allow | allow |
| `CreateAnimal` | deny | cond² | cond³ | cond⁴ | deny | deny |
| `UpdateOwnAnimal` | deny | cond⁵ | cond⁵ | cond⁵ | deny | deny |
| `ArchiveOwnAnimal` | deny | cond⁵ | cond⁵ | cond⁵ | deny | deny |
| `RequestAdoption` | deny | cond⁶ | deny | deny | deny | deny |
| `ReviewAdoption` | deny | cond⁷ | cond⁷ | cond⁷ | deny | deny |
| `CompleteAdoption` | deny | cond⁷ | cond⁷ | cond⁷ | deny | deny |
| `CancelAdoption` | deny | cond⁸ | cond⁸ | cond⁸ | deny | deny |
| `ViewCompatibilityScore` | deny | allow⁹ | allow | allow | deny | deny |

² `isRescuer = true`  
³ `verified = true`  
⁴ `verified = true`  
⁵ Is animal origin (`organizationId` / `personId` / `veterinaryId` = self)  
⁶ Role person + `taxId` set + animal `available` (or still accepting requests)  
⁷ Is origin of the animal linked to the adoption  
⁸ Adoption requester (person) **or** animal origin  
⁹ Own score vs animal; origin sees candidate scores

---

## Occurrence

| Action | anon | person | ong | veterinary_clinic | public_agency | biologist |
|---|---|---|---|---|---|---|
| `ListOccurrencesNearby` | allow* | allow* | allow* | allow* | allow* | allow* |
| `GetOccurrencePublic` | allow* | allow* | allow* | allow* | allow* | allow* |
| `CreateOccurrence` | allow | allow | allow | allow | allow | allow |
| `ClaimOccurrence` | deny | allow¹⁰ | allow¹⁰ | allow¹⁰ | allow¹⁰ | allow¹⁰ |
| `UpdateOccurrenceStatus` | deny | deny | cond¹¹ | deny | cond¹¹ | cond¹² |
| `ValidateOccurrence` | deny | deny | cond³ | deny | allow | cond¹³ |
| `FollowOccurrence` | deny | deny | cond³ | deny | allow | cond¹³ |
| `ReportFalseOccurrence` | deny | allow | allow | allow | allow | allow |

\* No author PII; geo may be approximate in public listings (LGPD E0.6).  
¹⁰ Only if `userId` still null  
¹¹ ONG verified or public_agency (and follower/care origin)  
¹² `wildlife_sighting` only (limited operational status)  
¹³ Only if `type = wildlife_sighting`

---

## Clinic / analytics / admin

| Action | anon | person | ong | veterinary_clinic | public_agency | biologist |
|---|---|---|---|---|---|---|
| `UpdateOwnClinicServices` | deny | deny | deny | allow | deny | deny |
| `IssueHealthReport` | deny | deny | deny | cond⁴ | deny | deny |
| `GetRegionalDashboard` | deny | deny | cond³ | deny | allow | allow |
| `GetWideAggregateDashboard` | deny | deny | deny | deny | allow | allow |
| `ExportAnonymizedData` | deny | deny | deny | deny | allow | allow |
| `VerifyOrganization` / `VerifyVeterinary` | deny | deny | deny | deny | cond¹ | deny |

---

## Condition summary (future code)

```text
canCreateAnimal(user) =
  (userType=ong AND organization.verified)
  OR (userType=veterinary_clinic AND veterinary.verified)
  OR (userType=person AND person.isRescuer)

canRequestAdoption(user) =
  userType=person AND person.taxId IS NOT NULL

canValidateOccurrence(user, occurrence) =
  (userType=ong AND organization.verified)
  OR (userType=public_agency)
  OR (userType=biologist AND occurrence.type = wildlife_sighting)

canReviewAdoption(user, adoption) =
  user.id IN { animal.organizationId, animal.personId, animal.veterinaryId }
```

---

## Implementation notes (Phase 2)

- NestJS guards: `RolesGuard` + `ResourceOwnerGuard` + `verified` / `isRescuer` checks
- Rate limit on `CreateOccurrence` (anon by IP) — infrastructure, Phase 4
- Public listings never return `email`, `phone`, `taxId`, `passwordHash`

---

## Decision log

- **2025-09 / 2026-09:** Renamed role columns `guardian` → `person`, `ngo` → `ong`, `clinic` → `veterinary_clinic` to align with `UserType` enum and profile table names (`PersonProfile`, `OrganizationProfile`, `VeterinaryProfile`). Animal FKs: `organizationId` / `personId` / `veterinaryId`. `public_agency` and `biologist` unchanged.
- Frontend UI gating documented separately in [permissions.md](permissions.md); this matrix remains the authoritative action-level spec.
