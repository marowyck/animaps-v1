# ANIMAPS — Profiles

Type-specific profile entities attached **1:1** to `User`, plus optional PERSON enrichment rows collected during onboarding via `ProfileForm`.

Related: [user-types.md](user-types.md) · [database overview](../database/overview.md) · [../features/onboarding.md](../features/onboarding.md) · [../database/data-dictionary.md](../database/data-dictionary.md) · [../database/schema.prisma](../database/schema.prisma) · [../security/permissions-matrix.md](../security/permissions-matrix.md).

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

## PERSON enrichment (additional info / privacy)

Optional enrichment rows collected during PERSON (and reused by OTHER) onboarding via `ProfileForm`. Fields are **optional** and oriented toward what NGOs / adoption flows need — not dating-style lifestyle trivia.

| Key | Purpose for NGOs |
|---|---|
| `animal_experience` | Prior care experience |
| `housing_type` | Apartment / house / rural |
| `has_yard` | Outdoor space |
| `other_pets` | Existing animals |
| `children_at_home` | Household with children |
| `available_time` | Capacity for daily care |
| `adoption_readiness` | Timeline to adopt |
| `foster_availability` | Temporary home capacity |
| `volunteer_interest` | Willingness to help orgs |
| `city_region` | Approximate area |

Out of scope (intentionally avoided): zodiac, love language, drinks/smoking, dating-style socials.

### Privacy model

Per field: `public` | `matches` | `private` via `PrivacySelector`. Defaults lean `matches` / `private`.

---

## OrganizationProfile (`organization_profiles`)

| Field | Type | Notes |
|---|---|---|
| `user_id` | uuid PK/FK | |
| `company_tax_id` | varchar | **PII** · nullable on first persist; required before `verified = true` |
| `trade_name` | varchar | required |
| `description` | text | |
| `phone` / `email` / `website` | varchar | contact |
| `social_links` | jsonb | e.g. `{ instagram, facebook, other }` |
| `city` / `state` | varchar | |
| `area_of_operation` | varchar | free-text from onboarding |
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
| `company_tax_id` | varchar | **PII** · nullable on first persist; required before `verified = true` |
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
- PERSON selfie status uses Wave 2 `verification_requests`; org/clinic `verified` booleans remain the privilege gate for animal CRUD ([../security/permissions-matrix.md](../security/permissions-matrix.md)).
- PERSON enrichment (formerly `profile.md`) is merged here to keep adoption-readiness data in one place and avoid dating-style trivia (explicitly out of product scope).
- Phase C (2026-09-10): consolidated `docs/profile.md` + `docs/profiles.md` → `docs/domains/profiles.md`.
