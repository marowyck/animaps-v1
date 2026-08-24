# ANIMAPS — Permissions matrix

Phase 0 artifact (basis for NestJS guards in Phase 2).  
Roles: `guardian`, `ngo`, `clinic`, `public_agency`, `biologist`.  
Flags: `verified` (NGO/clinic), `isRescuer` (guardian).

**Values:** `allow` · `deny` · `cond` (see condition).

**Auth:** `anon` = no login · `auth` = any authenticated user · `own` = resource owner.

Related: [`bounded-contexts.md`](bounded-contexts.md) · [`data-dictionary.md`](data-dictionary.md).

---

## Closed decisions

| Topic | Rule |
|---|---|
| Create `Animal` | NGO `verified` **OR** clinic `verified` **OR** guardian `isRescuer` |
| `RequestAdoption` | Authenticated guardian + `taxId` set |
| Parallel requests | Many on same animal; origin chooses |
| Animal → `in_process` | On first `approved` (not on request) |
| Create `Occurrence` | Anonymous or authenticated |
| Validate `Occurrence` | NGO verified / `public_agency`; `biologist` only if `wildlife_sighting` |
| Clinical report | Verified clinic only |

---

## Account / identity

| Action | anon | guardian | ngo | clinic | public_agency | biologist |
|---|---|---|---|---|---|---|
| `RegisterUser` | allow | deny* | deny* | deny* | deny* | deny* |
| `EditOwnProfile` | deny | allow | allow | allow | allow | allow |
| `DeleteOwnAccount` | deny | allow | allow | allow | allow | allow |
| `VerifyNgo` (admin) | deny | deny | deny | deny | cond¹ | deny |
| `VerifyClinic` (admin) | deny | deny | deny | deny | cond¹ | deny |

\* Already authenticated does not re-register the same role in MVP (separate flow if needed).  
¹ MVP: `public_agency` may verify institutions; or internal manual process — document operator.

---

## Animal / adoption

| Action | anon | guardian | ngo | clinic | public_agency | biologist |
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
⁵ Is animal origin (`ngoId` / `guardianId` / `clinicId` = self)  
⁶ Role guardian + `taxId` set + animal `available` (or still accepting requests)  
⁷ Is origin of the animal linked to the adoption  
⁸ Adoption requester (guardian) **or** animal origin  
⁹ Own score vs animal; origin sees candidate scores

---

## Occurrence

| Action | anon | guardian | ngo | clinic | public_agency | biologist |
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
¹¹ NGO verified or public_agency (and follower/care origin)  
¹² `wildlife_sighting` only (limited operational status)  
¹³ Only if `type = wildlife_sighting`

---

## Clinic / analytics / admin

| Action | anon | guardian | ngo | clinic | public_agency | biologist |
|---|---|---|---|---|---|---|
| `UpdateOwnClinicServices` | deny | deny | deny | allow | deny | deny |
| `IssueHealthReport` | deny | deny | deny | cond⁴ | deny | deny |
| `GetRegionalDashboard` | deny | deny | cond³ | deny | allow | allow |
| `GetWideAggregateDashboard` | deny | deny | deny | deny | allow | allow |
| `ExportAnonymizedData` | deny | deny | deny | deny | allow | allow |
| `VerifyNgo` / `VerifyClinic` | deny | deny | deny | deny | cond¹ | deny |

---

## Condition summary (future code)

```text
canCreateAnimal(user) =
  (role=ngo AND ngo.verified)
  OR (role=clinic AND clinic.verified)
  OR (role=guardian AND guardian.isRescuer)

canRequestAdoption(user) =
  role=guardian AND guardian.taxId IS NOT NULL

canValidateOccurrence(user, occurrence) =
  (role=ngo AND ngo.verified)
  OR (role=public_agency)
  OR (role=biologist AND occurrence.type = wildlife_sighting)

canReviewAdoption(user, adoption) =
  user.id IN { animal.ngoId, animal.guardianId, animal.clinicId }
```

---

## Implementation notes (Phase 2)

- NestJS guards: `RolesGuard` + `ResourceOwnerGuard` + `verified` / `isRescuer` checks
- Rate limit on `CreateOccurrence` (anon by IP) — infrastructure, Phase 4
- Public listings never return `email`, `phone`, `taxId`, `passwordHash`
