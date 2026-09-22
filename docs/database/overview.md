# ANIMAPS — Database

Canonical schema: [schema.prisma](schema.prisma) · [der.dbml](der.dbml) · [data-dictionary.md](data-dictionary.md).  
REST shapes: [api.md](../api/overview.md). Evolution: [schema-evolution.md](schema-evolution.md).

Related: [user-types.md](../domains/user-types.md) · [account-types.md](../domains/account-types.md) · [overview.md](../domains/overview.md) · [profiles.md](../domains/profiles.md) · [onboarding.md](../features/onboarding.md) · [verification.md](../features/verification.md) · [profile.md](../domains/profiles.md) · [cases.md](../domains/cases.md) · [institutions.md](../domains/institutions.md) · [roles-and-permissions.md](../domains/roles-and-permissions.md) · [conventions.md](../architecture/conventions.md).

**Privacy policy slug in use (docs):** `v1-draft` — bump when a published policy ships; persist on `users.privacy_policy_version` and `waitlist_entries.privacy_policy_version`.

Frontend does **not** write Postgres yet. Draft state lives in `localStorage` (`animaps-onboarding-draft`).

---

## Closed decisions (Wave 2 freeze)

| Topic | Decision |
|---|---|
| Waitlist vs account | Phase 1: `/register` persists **lead only** (`waitlist_entries`). Wave 2 `RegisterUser` creates `users` + password hash, then sets `waitlist_entries.converted_user_id` when email matches. **Never** store passwords on waitlist. |
| `preferred_size` / `preferred_species` | **Legacy hint** on `person_profiles`. Source of truth for onboarding/matching inputs: `animal_preferences`. On persist, if a single non-`any` species/size exists, copy it onto the hint columns. |
| `is_rescuer` | PERSON flag for `CreateAnimal`. **Not collected** in current onboarding. `help_animals` intention does **not** set it. OTHER `independent_protector` is a catch-all role — OTHER cannot create animals in v1. Future: profile settings or admin. |
| `company_tax_id` | **Nullable** on first profile persist (onboarding does not collect CNPJ). **Required** by application before `verified = true`. |
| `public_agency` / `biologist` | Admin-assigned `user_type` only — **no** extra profile table. |
| Messages / donations / clinic reviews / volunteers | **Out of Wave 2 schema.** Keep nav placeholders. Conversations later (prefer thread keyed by `adoption_id`). |
| Favorites | `animal_favorites` is in schema so `/favorites` has an entity. UI remains placeholder until adoption listing exists. |
| Session (web) | Refresh token in **httpOnly cookie**; access token **in memory**. See [api.md](../api/overview.md) · [architecture.md](../architecture.md). |
| Location | Precise GPS never stored on `user_locations` — round to ~100 m (`Decimal(8,3)`) in the application. Occurrences keep precise PostGIS **and** denormalized `city` / `neighborhood` for LGPD-safe aggregates. |

---

## Ecosystem layer (Fase 1)

Additive model next to the Wave 2 freeze. Entry: [overview.md](../domains/overview.md). Schema already in [schema.prisma](schema.prisma) / [der.dbml](der.dbml). Frontend catalogs: `features/account-types`, `features/rbac` (not wired into live UI).

| Topic | Decision |
|---|---|
| `users.account_type` | **Nullable** `AccountType`. Derive from `user_type` until cutover. `user_type` stays the UI discriminator. |
| OTHER → PERSON | `user_type = other` maps to `account_type = person` + intentions from `other_profiles.other_role`. OTHER is not a fourth account type. |
| PUBLIC_AGENCY → INSTITUTION | Admin-assigned `public_agency` maps to INSTITUTION membership. Enum value **kept**. No extra Wave 2 profile table. |
| BIOLOGIST → PERSON + professional | Maps to PERSON + intention `animal_professional` + a **permission** (wildlife validate). Enum value **kept**. |
| Profiles not reparented | `organization_profiles` / `veterinary_profiles` stay 1:1 on `users.id`. Future expand-contract to `organizations.id`. |
| Occurrence vs Case | `occurrences` **kept** (Wave 2 map / later occurrence API). **Case** is the institutional work item and routing supersession. Fold/migration later when the Case API ships. |
| Messages | Still **out of schema**. Nav placeholder only. |

---

## Modeled now (Prisma / DBML)

| Table | Context | Role |
|---|---|---|
| `users` | identity | Shared account: email, `user_type`, nullable `account_type`, `account_status`, consent + policy version, guidelines, soft delete |
| `person_profiles` | identity | PERSON prefs + `is_rescuer` + `tax_id` |
| `organization_profiles` | identity | ONG institutional data + `area_of_operation` + `verified` (not reparented) |
| `veterinary_profiles` | identity | Clinic services / hours / animals served + `verified` (not reparented) |
| `other_profiles` | identity | `other_role` + notes |
| `user_intentions` | identity | PERSON multi-select intentions (expanded enum values) |
| `interests` / `user_interests` | identity | Catalog + join (app max **5**) |
| `animal_preferences` | identity | Rich multi-select species/size/filters |
| `verification_requests` | identity | Selfie **or** institutional (`kind`) |
| `user_locations` | identity | Permission + approximate coords + city/state |
| `user_profile_fields` | identity | Additional-info rows + per-field visibility |
| `auth_identities` | identity | Google (and future providers) |
| `notification_preferences` | notifications | in-app / email / push flags |
| `waitlist_entries` | marketing | Lead + consent; optional `converted_user_id` |
| `animals` / `adoptions` / `animal_favorites` | adoption | Listing, requests, saves |
| `occurrences` (+ followers, reports) | occurrence | Geo reports + claim hash + city/neighborhood — **kept** |
| Auth token tables | identity | Refresh / email verify / password reset (hash only) |
| `notifications`, `audit_logs`, `device_push_tokens` | cross-cutting | Inbox, audit, mobile push |
| `organizations` / `organization_members` | organization | Civil-society entities + memberships |
| `institution_types` / `institutions` | institution | Lookup + public bodies |
| `institution_departments` / `institution_teams` | institution | Hierarchy |
| `institution_members` | institution | User + role + optional dept/team |
| `institution_jurisdictions` / `institution_capabilities` / `institution_report_policies` | institution | Routing inputs + policy |
| `roles` / `permissions` / `role_permissions` / `user_platform_roles` | rbac | Configurable RBAC |
| `locations` / `case_types` / `cases` | cases | Work items + taxonomy + shared location |
| `case_status_history` / `case_assignments` / `case_routing` | cases | Timeline, assignment, forwards |
| `case_comments` / `case_attachments` / `case_participants` | cases | Collaboration |
| `data_exports` | privacy | Controlled export + audit |
| `integration_connections` / `integration_logs` | integrations | Later-wave placeholders |

**Rename summary (pre-launch, docs-only):** `UserRole` → `UserType`; `guardian_*` → `person_*`; `ngo_*` → `organization_*`; `clinic_*` → `veterinary_*`. See [user-types.md](../domains/user-types.md).

---

## OnboardingDraft → tables

Source: `apps/web/src/features/onboarding/types.ts`.

| Draft field | Persist | Notes |
|---|---|---|
| `email` | `users.email` | Also waitlist `email` before conversion |
| `displayName` | `users.name` | |
| `userType` | `users.user_type` | Convert SCREAMING_SNAKE → snake_case at the API boundary |
| `guidelinesAcceptedAt` | `users.guidelines_accepted_at` | |
| `intentions[]` | `user_intentions` | UNIQUE (`user_id`, `intention`) |
| `otherRole` | `other_profiles.other_role` | OTHER only |
| `animalTypes[]` | `animal_preferences.species` | PERSON + `adopt` |
| `animalSizes[]` | `animal_preferences.sizes` | PERSON + `adopt` |
| `animalFilters.ages` | `animal_preferences.ages` | |
| `animalFilters.sex` | `animal_preferences.sex` | |
| `animalFilters.vaccination` | `animal_preferences.vaccination` | |
| `animalFilters.neutered` | `animal_preferences.neutered` | |
| `animalFilters.specialNeeds` | `animal_preferences.special_needs` | |
| `animalFilters.compatibility` | `animal_preferences.compatibility` | |
| `animalFilters.energyLevel` | `animal_preferences.energy_level` | |
| `animalFilters.environment` | `animal_preferences.environment` | |
| `interestIds[]` | `user_interests` | Max 5; FKs must exist in `interests` seed |
| `additionalInfo[key]` | `user_profile_fields` | `field_key` + `value` + `visibility` |
| `organization.tradeName` | `organization_profiles.trade_name` | |
| `organization.description` | `organization_profiles.description` | |
| `organization.email` | `organization_profiles.email` | Distinct from login `users.email` |
| `organization.phone` | `organization_profiles.phone` | |
| `organization.website` | `organization_profiles.website` | |
| `organization.socialLinks` | `organization_profiles.social_links` | JSON `{ instagram, facebook, other }` |
| `organization.city` / `state` | `organization_profiles.city` / `state` | Also copy to `user_locations` when permission granted |
| `organization.areaOfOperation` | `organization_profiles.area_of_operation` | Free text; not the numeric radius |
| `organization.animalTypesServed` | `organization_profiles.animal_types_served` | |
| `organization.hasShelter` | `organization_profiles.has_shelter` | |
| `organization.doesAdoptions` | `organization_profiles.does_adoptions` | |
| `organization.doesRescues` | `organization_profiles.does_rescues` | |
| `organization.acceptsVolunteers` | `organization_profiles.accepts_volunteers` | |
| `organization.acceptsDonations` | `organization_profiles.accepts_donations` | |
| `veterinary.tradeName` | `veterinary_profiles.trade_name` | |
| `veterinary.description` | `veterinary_profiles.description` | |
| `veterinary.phone` / `email` / `website` | `veterinary_profiles.*` | |
| `veterinary.address` | `veterinary_profiles.address` | |
| `veterinary.businessHours` | `veterinary_profiles.business_hours` | |
| `veterinary.is24h` | `veterinary_profiles.is_24h` | |
| `veterinary.emergencyCare` | `veterinary_profiles.emergency_care` | |
| `veterinary.homeService` | `veterinary_profiles.home_service` | |
| `veterinary.animalsServed` | `veterinary_profiles.animals_served` | |
| `veterinary.servicesOffered` | `veterinary_profiles.services_offered` | Catalog: `CLINIC_SERVICE_IDS` |
| `selfieStatus` | latest `verification_requests` where `kind = selfie` | Do not duplicate as a user column |
| `selfiePreviewUrl` | `verification_requests.media_url` | Private storage; drop data-URLs |
| `institutionalVerificationStatus` | latest `verification_requests` where `kind = institutional` | Profile `verified` is set **only** by admin after approval |
| `locationPermission` | `user_locations.permission` | |
| `completedAt` | not a column | Infer from onboarding completion API / `users.updated_at` |

### Not in the draft (but required later)

| Field | When |
|---|---|
| `users.password_hash` | Register step 2 once identity ships |
| `users.privacy_policy_version` | Waitlist + register consent |
| `person_profiles.tax_id` | Optional until `RequestAdoption` |
| `person_profiles.is_rescuer` | Future settings / admin |
| `organization_profiles.company_tax_id` | Institutional verification |
| `veterinary_profiles.company_tax_id` | Institutional verification |
| `organization_profiles.service_area_radius_km` | Not in current location step |

### Interest seed (must match `INTEREST_CATALOG`)

`dogs` · `cats` · `adoption` · `rescue` · `foster` · `volunteering` · `pet_training` · `pet_health` · `nutrition` · `walks` · `nature` · `wildlife` · `animal_photo` · `pet_events` · `ngo_support` · `lost_found` · `responsible_ownership` · `special_needs` · `senior_pets` · `community`

Labels live in i18n (`onboarding.interests.items`), not in the catalog table.

### Institution type seed (must match `INSTITUTION_TYPE_IDS`)

Lookup table `institution_types.id` (varchar PK). Config uses `SCREAMING_SNAKE`; persist snake_case:

`city_hall` · `municipal_department` · `animal_welfare_department` · `environmental_department` · `health_department` · `zoonoses_center` · `environmental_agency` · `public_inspection` · `public_partner` · `other`

### Case type seed (must match `case_types`)

Lookup table `case_types.id` (varchar PK) — **not** a Postgres enum. Config keys in [cases.md](../domains/cases.md); persist snake_case:

`animal_abuse` · `animal_neglect` · `animal_abandonment` · `animal_at_risk` · `injured_animal` · `road_accident` · `lost_animal` · `found_animal` · `stray_animal` · `hoarding` · `illegal_activity` · `environmental_risk` · `public_request` · `other`

Labels live in i18n, not in the catalog table.

### Additional-info keys (must match `ADDITIONAL_INFO_KEYS`)

`animal_experience` · `housing_type` · `has_yard` · `other_pets` · `children_at_home` · `available_time` · `adoption_readiness` · `foster_availability` · `volunteer_interest` · `city_region`

---

## Nav vs schema (do not invent tables for placeholders)

| Nav id | Route | Schema | Wave |
|---|---|---|---|
| `discover` | `/discover` | reads animals / orgs (API) | 3 |
| `dashboard` | `/dashboard` | aggregations | 3 |
| `animals` | `/animals` | `animals` | 3 |
| `matches` | `/matches` | `adoptions` + matching service | 3 |
| `favorites` | `/favorites` | `animal_favorites` | 3 |
| `messages` | `/messages` | **none** — cut from schema until Phase 08 | 3+ |
| `reports` | `/reports` | `occurrences` | 3 |
| `profile` | `/profile` | profiles + `user_profile_fields` | 2 |
| `settings` | `/settings` | `notification_preferences` + account | 2 |
| `adoptionRequests` | `/adoption-requests` | `adoptions` | 3 |
| `volunteers` | `/volunteers` | **none** — placeholder only | later |
| `donations` | `/donations` | **none** — placeholder only | later |
| `organization` | `/organization` | `organization_profiles` | 2 |
| `services` | `/services` | `veterinary_profiles.services_offered` | 2 |
| `location` | `/location` | `veterinary_profiles.address` + `user_locations` | 2 |
| `reviews` | `/reviews` | **none** — placeholder only | later |

---

## First migration extras (raw SQL)

Prisma cannot express these cleanly — ship in the same migration as `apps/api` scaffold:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE INDEX occurrences_location_gix ON occurrences USING GIST (location);

ALTER TABLE animals ADD CONSTRAINT animals_has_origin_chk
  CHECK (organization_id IS NOT NULL OR person_id IS NOT NULL OR veterinary_id IS NOT NULL);
```

---

## Decision log

- Wave 2 candidate tables promoted into Prisma / DBML / dictionary (no longer “later”).
- Do not overload `waitlist_entries` with credentials or profile blobs — waitlist is marketing only; conversion is a nullable FK.
- Intention / interest slugs stay English in code; UI via i18n.
- `verification_requests.kind` keeps one pipeline for selfie + institutional without splitting tables.
- Animal origin FKs renamed for vocabulary consistency before any production DB exists (safe expand).
- `company_tax_id` made nullable so onboarding can persist without CNPJ.
- `users.status` is `account_status` enum; soft delete remains `deleted_at` (do not add a `deleted` status).
- Conversations, donations, reviews, volunteer rosters stay **out** of the DER until those product phases start — nav placeholders are not a schema commitment.
- Fase 1: `account_type` nullable on `users`; OTHER → PERSON intentions; PUBLIC_AGENCY → INSTITUTION; BIOLOGIST → PERSON + professional permission.
- `organization_profiles` / `veterinary_profiles` not reparented to `organizations.id` (future expand-contract).
- Occurrence kept; Case is the institutional supersession. Fold/migration when the Case API ships.
- Messages still out of schema. Institution HTTP, routing engine, and named government APIs are **not** this freeze.
