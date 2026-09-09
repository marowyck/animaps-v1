# ANIMAPS — Profiles

Type-specific profile entities attached **1:1** to `User`. Optional PERSON enrichment rows (housing, experience, privacy) are documented in [profile.md](profile.md) and collected during onboarding via `ProfileForm`.

Related: [user-types.md](user-types.md) · [database.md](database.md) · [onboarding.md](onboarding.md) · [data-dictionary.md](data-dictionary.md) · [schema.prisma](schema.prisma).

---

## Ownership model

| `user_type` | Table | Prisma model |
|---|---|---|
| `person` | `person_profiles` | `PersonProfile` |
| `ong` | `organization_profiles` | `OrganizationProfile` |
| `veterinary_clinic` | `veterinary_profiles` | `VeterinaryProfile` |
| `other` | `other_profiles` | `OtherProfile` |

FK: `user_id` UUID PK → `users.id` `ON DELETE CASCADE`.

Frontend mirrors org/clinic fields in `OnboardingDraft.organization` / `.veterinary` until Wave 2 persistence.

---

## PersonProfile (`person_profiles`)

| Field | Type | Notes |
|---|---|---|
| `user_id` | uuid PK/FK | |
| `available_space` | enum | optional |
| `available_time` | enum | optional |
| `has_previous_experience` | boolean | default false |
| `has_other_pets` | boolean | default false |
| `preferred_size` / `preferred_species` | enum | narrow legacy; richer multi-select → Wave 2 `animal_preferences` |
| `is_rescuer` | boolean | allows `CreateAnimal` when true |
| `tax_id` | varchar | **PII** · required on `RequestAdoption` (app rule) |
| `updated_at` | timestamptz | |

Onboarding also drafts: intentions, animal prefs, interests (max 5), additional-info rows with per-field visibility.

---

## OrganizationProfile (`organization_profiles`)

| Field | Type | Notes |
|---|---|---|
| `user_id` | uuid PK/FK | |
| `company_tax_id` | varchar | **PII** · required in schema |
| `trade_name` | varchar | required |
| `description` | text | |
| `phone` / `email` / `website` | varchar | contact |
| `social_links` | jsonb | e.g. `{ instagram, facebook, other }` |
| `city` / `state` | varchar | |
| `animal_types_served` | varchar[] | |
| `has_shelter` | boolean | |
| `does_adoptions` | boolean | |
| `does_rescues` | boolean | |
| `accepts_volunteers` | boolean | |
| `accepts_donations` | boolean | |
| `service_area_radius_km` | decimal | PostGIS polygon later |
| `service_capacity` | int | |
| `verified` | boolean | institutional verification gate |
| `updated_at` | timestamptz | |

Onboarding steps: `organization-info` → `location` → `animal-types` → `services` → institutional `verification`.

---

## VeterinaryProfile (`veterinary_profiles`)

| Field | Type | Notes |
|---|---|---|
| `user_id` | uuid PK/FK | |
| `company_tax_id` | varchar | **PII** · required |
| `trade_name` | varchar | optional display name |
| `description` | text | |
| `phone` / `email` / `website` | varchar | |
| `address` | text | |
| `business_hours` | text | |
| `is_24h` | boolean | |
| `emergency_care` | boolean | |
| `home_service` | boolean | |
| `animals_served` | varchar[] | |
| `services_offered` | varchar[] | controlled list (vaccination, neutering, …) |
| `verified` | boolean | professional verification (future provider) |
| `updated_at` | timestamptz | |

Onboarding steps: `clinic-info` → `location` → `services` → `animals-served` → institutional `verification`.

---

## OtherProfile (`other_profiles`)

| Field | Type | Notes |
|---|---|---|
| `user_id` | uuid PK/FK | |
| `other_role` | `OtherRole` enum | see catalog |
| `notes` | text | optional freeform |
| `updated_at` | timestamptz | |

### `OtherRole` catalog

`independent_protector` · `foster_home` · `volunteer` · `animal_professional` · `animal_business` · `community_member` · `other`

v1 collects role + shared profile/additional-info steps. Dedicated sub-flows per role are additive later (config only).

---

## Cross-entity FKs (adoption domain)

Animals / adoptions reference origin actors with renamed columns (docs schema):

| Old | New |
|---|---|
| `ngo_id` | `organization_id` |
| `guardian_id` | `person_id` |
| `clinic_id` | `veterinary_id` |

App rule: at least one of `organization_id` / `person_id` / `veterinary_id` on `animals`.

---

## Decision log

- Institutional fields stay on org/clinic profiles — not on `users` — so PERSON accounts stay lean and verification flags are scoped.
- PERSON selfie status uses Wave 2 `verification_requests`; org/clinic `verified` booleans remain the privilege gate for animal CRUD ([permissions-matrix.md](permissions-matrix.md)).
- Enrichment lifestyle fields stay in [profile.md](profile.md) to avoid conflating adoption-readiness data with dating-style trivia (explicitly out of product scope).
