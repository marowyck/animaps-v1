# ANIMAPS — Account types

The ecosystem layer introduces **`account_type`**: `PERSON` | `ORGANIZATION` | `INSTITUTION`. It sits **above** the Wave 2 `user_type` discriminator. It does not replace it in this pass.

Related: [overview.md](overview.md) · [user-types.md](user-types.md) · [organizations.md](organizations.md) · [institutions.md](institutions.md) · [roles-and-permissions.md](roles-and-permissions.md) · [onboarding.md](../features/onboarding.md) · [database.md](../database/overview.md) · [conventions.md](../architecture/conventions.md).

**Status:** model + mapping. Public signup still uses `UserTypeSelector` (`PERSON` / `ONG` / `VETERINARY_CLINIC` / `OTHER`). `account_type` is derived until a later cutover.

---

## Dual model (non-breaking)

| Column | Owner | Role now | Role later |
|---|---|---|---|
| `users.user_type` | Wave 2 freeze | Still used for waitlist / many UI permissions | Kept until clients cut over |
| `users.account_type` | Ecosystem Fase 1–2 | Prefer for flow resolution when set (`resolveFlowKey`) | Nullable until Nest persist |
| `users.account_type` | Ecosystem layer | **Nullable**; filled by mapping from `user_type` | Becomes the coarse identity axis |

Application invariant: when both are set, they must be consistent with the mapping table below. Do not drop `user_type` values (`ong`, `veterinary_clinic`, `other`, `public_agency`, `biologist`) in this pass.

Config/UI uses `SCREAMING_SNAKE`. Postgres uses `snake_case`. Convert only at API boundaries — same rule as [user-types.md](user-types.md).

---

## Catalog

| TS / config | DB | Meaning | Public signup (today) |
|---|---|---|---|
| `PERSON` | `person` | Individual with multi-select intentions | Yes (`user_type = person`; also destination for `other`) |
| `ORGANIZATION` | `organization` | Civil-society / private entity with members | Indirect: `ong` and `veterinary_clinic` map here |
| `INSTITUTION` | `institution` | Public body with jurisdiction + verification machine | No — `public_agency` is admin-assigned today |

There is **no** fourth top-level account type named OTHER. Catch-all intent lives on PERSON (intention `OTHER`) and on org/institution **subtypes** (`OTHER` rows).

---

## PERSON — multi-intention catalog

One PERSON account. Many intentions. Do not create a login per intention.

| Intention (config) | DB slug | Maps from Wave 2 | Notes |
|---|---|---|---|
| `ADOPTER` | `adopter` | `user_intentions.adopt` | Conditional animal preferences stay as today |
| `PET_OWNER` | `pet_owner` | `pet_owner` | |
| `VOLUNTEER` | `volunteer` | `help_animals` + OTHER `volunteer` | `help_animals` does **not** set `is_rescuer` ([database.md](../database/overview.md)) |
| `FOSTER_HOME` | `foster_home` | OTHER `foster_home` | |
| `INDEPENDENT_PROTECTOR` | `independent_protector` | OTHER `independent_protector` | Wave 2: OTHER cannot `CreateAnimal` in v1 |
| `COMMUNITY_MEMBER` | `community_member` | `community` + OTHER `community_member` | |
| `REPORTER` | `reporter` | `report` | Cases / occurrences — not a separate account |
| `LOST_PET_OWNER` | `lost_pet_owner` | `lost_animal` | |
| `FOUND_PET_REPORTER` | `found_pet_reporter` | `found_animal` | |
| `ANIMAL_PROFESSIONAL` | `animal_professional` | OTHER `animal_professional` + admin `BIOLOGIST` | Wildlife validation stays a **permission**, not a user type |
| `OTHER` | `other` | `explore` + OTHER `other` / `animal_business`* | `explore` → OTHER; business-as-person stays intention until they create an org |

\* OTHER `animal_business` as a **solo** person maps to intention `OTHER` (or later a dedicated intention). Operating as a company maps to ORGANIZATION subtype `ANIMAL_BUSINESS`.

Wave 2 table `user_intentions` and enum `user_intention_kind` stay. The expanded catalog is additive documentation (+ future seed values). Do not rename persisted slugs until a coordinated persist wave.

PERSON still uses the coarse UI catalog in [permissions.md](../security/permissions.md) until session flags exist. See [roles-and-permissions.md](roles-and-permissions.md).

---

## ORGANIZATION subtypes

Stored on `organizations.organization_type` (controlled enum or catalog — product-stable enough for an enum; adding values is additive per [schema-evolution.md](../database/schema-evolution.md)).

| Subtype | DB | Typical Wave 2 origin |
|---|---|---|
| `NGO` | `ngo` | `user_type = ong` + `organization_profiles` |
| `ANIMAL_SHELTER` | `animal_shelter` | Future split from ONG; not collected today |
| `VETERINARY_CLINIC` | `veterinary_clinic` | `user_type = veterinary_clinic` + `veterinary_profiles` |
| `VETERINARY_HOSPITAL` | `veterinary_hospital` | Future; same profile family as clinic until split |
| `ANIMAL_BUSINESS` | `animal_business` | OTHER role / future org onboarding |
| `ANIMAL_SERVICE` | `animal_service` | Grooming, training, transport, etc. |
| `PRIVATE_INSTITUTION` | `private_institution` | Private foundation / institute (not public INSTITUTION) |
| `OTHER` | `other` | Catch-all org |

Onboarding question: “What kind of organization do you represent?” — collect at register and/or `organization-type` step. ONG / clinic field steps stay as in [onboarding.md](../features/onboarding.md).

`organization_profiles` and `veterinary_profiles` remain 1:1 on `users.id` — **not moved** to `organizations.id` in this pass ([organizations.md](organizations.md)).

---

## INSTITUTION subtypes (lookup table)

Institution types are a **seeded lookup** (`institution_types`), **not** a hard Postgres enum, so operators can add types without a migration.

| Seed key | Typical body |
|---|---|
| `CITY_HALL` | Prefeitura |
| `MUNICIPAL_DEPARTMENT` | Secretaria municipal (generic) |
| `ANIMAL_WELFARE_DEPARTMENT` | Departamento / coordenadoria de bem-estar animal |
| `ENVIRONMENTAL_DEPARTMENT` | Secretaria de meio ambiente |
| `HEALTH_DEPARTMENT` | Secretaria de saúde |
| `ZOONOSES_CENTER` | Centro de zoonoses / CCZ |
| `ENVIRONMENTAL_AGENCY` | Órgão ambiental (municipal / estadual) |
| `PUBLIC_INSPECTION` | Fiscalização |
| `PUBLIC_PARTNER` | Órgão público parceiro |
| `OTHER` | Catch-all; free-text `type_other` on the institution row |

Onboarding question (future, separate flow): “What kind of public institution do you represent?” Privileged tools stay locked until verification reaches `APPROVED` ([institutions.md](institutions.md)).

---

## Legacy `UserType` mapping

Wave 2 catalog is unchanged: public `PERSON` / `ONG` / `VETERINARY_CLINIC` / `OTHER`; admin `PUBLIC_AGENCY` / `BIOLOGIST`. Mapping for the ecosystem layer:

| `user_type` (DB) | `account_type` | Extra |
|---|---|---|
| `person` | `PERSON` | Copy existing `user_intentions` |
| `ong` | `ORGANIZATION` | Subtype `NGO`; keep `organization_profiles` |
| `veterinary_clinic` | `ORGANIZATION` | Subtype `VETERINARY_CLINIC`; keep `veterinary_profiles` |
| `other` | `PERSON` | Intentions from `other_profiles.other_role` (table below) |
| `public_agency` | `INSTITUTION` | Admin-created institution + membership; **no** extra Wave 2 profile table (freeze) |
| `biologist` | `PERSON` | Intention `ANIMAL_PROFESSIONAL` + admin-granted wildlife / validate permission |

### OTHER → PERSON intentions

| `other_role` | PERSON intention(s) |
|---|---|
| `independent_protector` | `INDEPENDENT_PROTECTOR` |
| `foster_home` | `FOSTER_HOME` |
| `volunteer` | `VOLUNTEER` |
| `animal_professional` | `ANIMAL_PROFESSIONAL` |
| `animal_business` | `OTHER` (or create ORGANIZATION `ANIMAL_BUSINESS` later) |
| `community_member` | `COMMUNITY_MEMBER` |
| `other` | `OTHER` |

`other_profiles` stays for Wave 2 persist. Dual-write to intentions is a future persist step.

### PUBLIC_AGENCY → INSTITUTION

Today: admin-assigned `user_type`, **no** extra profile table ([database.md](../database/overview.md)). Target: an `institutions` row (type from lookup, often `CITY_HALL` or `OTHER` until classified) and an `institution_members` row for that user with a role that can grant `VALIDATE_CASE` / incoming-case permissions. Occurrence validation in [permissions-matrix.md](../security/permissions-matrix.md) still keys off `public_agency` until Nest guards read memberships.

### BIOLOGIST → PERSON + ANIMAL_PROFESSIONAL

Today: admin-assigned, no extra profile table; wildlife_sighting validation only. Target: PERSON + intention `ANIMAL_PROFESSIONAL` + a **permission** (or platform/institution role), not a seventh `user_type`. The enum value `biologist` remains until cutover.

---

## Membership model

```text
User (one login, one password / OAuth)
  ├─ account_type = PERSON (typical)
  ├─ organization_members[]  → organizations + role_id
  └─ institution_members[]   → institutions + role_id
```

| Rule | Detail |
|---|---|
| One login | Never a shared “Prefeitura” or “ONG” password ([security.md](../security/security.md)) |
| Many memberships | Same user, different roles per org/institution |
| Founder | First org/institution admin is a membership with `ORGANIZATION_ADMIN` / `INSTITUTION_ADMIN` |
| PERSON without membership | Fine — intentions + UI catalog only |
| Context switch | Future: session carries `active_organization_id` / `active_institution_id` |

Platform-wide roles (`SUPER_ADMIN`, `PLATFORM_ADMIN`) live in `user_platform_roles`, not on a membership ([roles-and-permissions.md](roles-and-permissions.md)).

---

## Onboarding entry (Fase 2 UI)

First question: “How do you want to use ANIMAPS?” (`AccountTypeSelector` on waitlist / register)

| Option | Account type | Flow key today |
|---|---|---|
| Person / tutor | `PERSON` | `PERSON` |
| Organization | `ORGANIZATION` | `ONG` or `VETERINARY_CLINIC` after subtype |
| Public institution | `INSTITUTION` | `INSTITUTION` |
| Other | `PERSON` + `userType: OTHER` | `OTHER` (role-selection flow) |

Do not fork register/login per type ([authentication.md](../features/authentication.md)). Details: [onboarding.md](../features/onboarding.md).

---

## Current vs future

| Current | Future |
|---|---|
| AccountType at `/register` step 1; `user_type` still on waitlist | Persist `account_type` + org/institution rows via Nest |
| OTHER is still a public `user_type` for the OTHER flow | PERSON + intentions only; `other_profiles` retired after backfill |
| Admin types on the same enum | Membership + permissions; enum kept until Nest + clients migrate |
| One profile row per user | User + N memberships; profiles re-parented later |

---

## Decision log

- `account_type` is additive and nullable; `user_type` remains Wave 2 source of truth until Nest cutover.
- OTHER folds into PERSON **accountType** at signup; OTHER flow retained for UX until intention backfill.
- PUBLIC_AGENCY → INSTITUTION; BIOLOGIST → PERSON + `ANIMAL_PROFESSIONAL` + permission. Both Wave 2 enum values stay.
- Institution subtypes are a lookup table so new public-body kinds do not require a Postgres enum migration.
- Memberships implement “one person, many orgs/institutions, distinct roles” without shared accounts.
