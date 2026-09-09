# ANIMAPS — Data dictionary

Sources: [`der.dbml`](der.dbml) · [`schema.prisma`](schema.prisma) · [`bounded-contexts.md`](bounded-contexts.md) · [`schema-evolution.md`](schema-evolution.md) · [`user-types.md`](user-types.md) · [`profiles.md`](profiles.md).

**Convention:** DB column = `snake_case` · API/TypeScript = `camelCase` · enums = `snake_case`.

**LGPD legend:** **PII** = personal or sensitive data.

---

## Business rules (schema vs application)

| Rule | Where |
|---|---|
| Person `tax_id` optional at signup; **required** on `RequestAdoption` | Application (`adoption`) |
| Only verified `ong` / verified `veterinary_clinic` / person with `is_rescuer` create `Animal` | Application + authz |
| Parallel `adoptions` on the same animal; origin chooses | Application (`adoption`) |
| Animal → `in_process` on first `approved` (not on `requested`) | Application (`adoption`) |
| `occurrences.user_id` nullable (anonymous); claim later | Schema + application |
| At least one of `organization_id` / `person_id` / `veterinary_id` on `animals` | Application (optional future DB CHECK) |
| Soft-deleted users/animals excluded from public lists | Application (`deleted_at IS NULL`) |

---

## Enums

| Enum | Values |
|---|---|
| `user_type` | `person`, `ong`, `veterinary_clinic`, `other`, `public_agency`, `biologist` |
| `other_role` | `independent_protector`, `foster_home`, `volunteer`, `animal_professional`, `animal_business`, `community_member`, `other` |
| `available_space` | `small_apartment`, `large_apartment`, `house_with_yard`, `farm` |
| `available_time` | `low`, `moderate`, `high` |
| `preferred_size` | `small`, `medium`, `large`, `any` |
| `preferred_species` | `dog`, `cat`, `other`, `any` |
| `animal_species` | `dog`, `cat`, `other` |
| `animal_size` | `small`, `medium`, `large` |
| `animal_status` | `available`, `in_process`, `adopted` |
| `adoption_status` | `requested`, `under_review`, `approved`, `rejected`, `completed`, `cancelled` |
| `occurrence_type` | `abandonment`, `mistreatment`, `vehicle_collision`, `wildlife_sighting`, `lost_animal`, `found_animal` |
| `occurrence_status` | `open`, `in_progress`, `resolved`, `invalid` |
| `waitlist_profile_type` | `person`, `ong`, `veterinary_clinic`, `other` |
| `client_type` | `web`, `mobile_ios`, `mobile_android`, `unknown` |
| `push_platform` | `ios`, `android` |
| `notification_type` | `user_registered`, `organization_verified`, `veterinary_verified`, `adoption_requested`, `adoption_completed`, `animal_registered_for_matching`, `new_compatible_animal_available`, `occurrence_created`, `occurrence_status_changed`, `occurrence_resolved`, `generic` |
| `veterinary_service` (array values) | `vaccination`, `neutering`, `emergency_care`, `grooming`, `consultation`, `surgery`, `imaging`, `hospitalization` |
| `temperament_tag` (array values) | open controlled list (`docile`, `playful`, …) |
| `audit_action` | `organization_verified`, `veterinary_verified`, `user_type_changed`, `account_deleted`, `data_exported`, `occurrence_validated` |
| `occurrence_report_reason` | `spam`, `duplicate`, `false_information`, `inappropriate_content` |

---

## `users`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `name` | `name` | varchar | yes | — | |
| `email` | `email` | varchar | yes | — | UNIQUE · **PII** |
| `username` | `username` | varchar | no | null | UNIQUE · public handle |
| `password_hash` | — | varchar | no* | null | Never expose · **PII** · email/password register (hashed) **or** external identity (Google/OAuth). Never store on `waitlist_entries`. |
| `user_type` | `userType` | `user_type` | yes | — | See [`user-types.md`](user-types.md) |
| `avatar_url` | `avatarUrl` | varchar | no | null | Object-storage URL |
| `status` | `status` | varchar | no | `active` | Account lifecycle |
| `phone` | `phone` | varchar | no | null | **PII** |
| `city` | `city` | varchar | no | null | |
| `state` | `state` | varchar | no | null | |
| `lgpd_consent` | `lgpdConsent` | boolean | yes | false | |
| `lgpd_consent_at` | `lgpdConsentAt` | timestamptz | no | null | |
| `email_verified_at` | `emailVerifiedAt` | timestamptz | no | null | Set on `VerifyEmail` |
| `deleted_at` | `deletedAt` | timestamptz | no | null | Soft delete |
| `created_at` | `createdAt` | timestamptz | yes | now() | |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

**Indexes:** UNIQUE (`email`); UNIQUE (`username`); (`deleted_at`).

---

## `person_profiles`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | — | PK, FK → `users.id` |
| `available_space` | `availableSpace` | enum | no | null | |
| `available_time` | `availableTime` | enum | no | null | |
| `has_previous_experience` | `hasPreviousExperience` | boolean | yes | false | |
| `has_other_pets` | `hasOtherPets` | boolean | yes | false | |
| `preferred_size` | `preferredSize` | enum | no | null | |
| `preferred_species` | `preferredSpecies` | enum | no | null | |
| `is_rescuer` | `isRescuer` | boolean | yes | false | Allows `Animal.create` |
| `tax_id` | `taxId` | varchar | no* | null | **PII** · *required on `RequestAdoption` |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

---

## `organization_profiles`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | — | PK, FK → `users.id` |
| `company_tax_id` | `companyTaxId` | varchar | yes | — | **PII** |
| `trade_name` | `tradeName` | varchar | yes | — | |
| `description` | `description` | text | no | null | |
| `phone` | `phone` | varchar | no | null | **PII** |
| `email` | `email` | varchar | no | null | **PII** |
| `website` | `website` | varchar | no | null | |
| `social_links` | `socialLinks` | jsonb | no | null | |
| `city` | `city` | varchar | no | null | |
| `state` | `state` | varchar | no | null | |
| `animal_types_served` | `animalTypesServed` | varchar[] | no | {} | |
| `has_shelter` | `hasShelter` | boolean | yes | false | |
| `does_adoptions` | `doesAdoptions` | boolean | yes | false | |
| `does_rescues` | `doesRescues` | boolean | yes | false | |
| `accepts_volunteers` | `acceptsVolunteers` | boolean | yes | false | |
| `accepts_donations` | `acceptsDonations` | boolean | yes | false | |
| `service_area_radius_km` | `serviceAreaRadiusKm` | decimal | no | null | PostGIS polygon later |
| `service_capacity` | `serviceCapacity` | int | no | null | |
| `verified` | `verified` | boolean | yes | false | Manual |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

---

## `veterinary_profiles`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | — | PK, FK → `users.id` |
| `company_tax_id` | `companyTaxId` | varchar | yes | — | **PII** |
| `trade_name` | `tradeName` | varchar | no | null | |
| `description` | `description` | text | no | null | |
| `phone` | `phone` | varchar | no | null | **PII** |
| `email` | `email` | varchar | no | null | **PII** |
| `website` | `website` | varchar | no | null | |
| `address` | `address` | text | no | null | **PII** |
| `services_offered` | `servicesOffered` | varchar[] | no | {} | `veterinary_service` values |
| `business_hours` | `businessHours` | text | no | null | |
| `is_24h` | `is24h` | boolean | yes | false | |
| `emergency_care` | `emergencyCare` | boolean | yes | false | |
| `home_service` | `homeService` | boolean | yes | false | |
| `animals_served` | `animalsServed` | varchar[] | no | {} | |
| `verified` | `verified` | boolean | yes | false | Manual — same as organization |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

---

## `other_profiles`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | — | PK, FK → `users.id` |
| `other_role` | `otherRole` | `other_role` | no | null | See catalog · [profiles.md](profiles.md) |
| `notes` | `notes` | text | no | null | Freeform |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

---

## `animals`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `organization_id` | `organizationId` | uuid | no* | null | FK → `users.id` |
| `person_id` | `personId` | uuid | no* | null | FK → `users.id` (rescuer) |
| `veterinary_id` | `veterinaryId` | uuid | no* | null | FK → `users.id` |
| `name` | `name` | varchar | yes | — | |
| `species` | `species` | enum | yes | — | |
| `breed` | `breed` | varchar | no | null | |
| `estimated_age` | `estimatedAge` | varchar | no | null | |
| `size` | `size` | enum | no | null | |
| `temperament` | `temperament` | varchar[] | no | {} | |
| `health_history` | `healthHistory` | text | no | null | |
| `photos` | `photos` | text[] | no | {} | MVP URLs · MediaAsset later |
| `status` | `status` | enum | yes | `available` | `in_process` on first approve |
| `deleted_at` | `deletedAt` | timestamptz | no | null | Soft delete |
| `created_at` | `createdAt` | timestamptz | yes | now() | |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

\* Application: at least one of `organization_id`, `person_id`, `veterinary_id`.

**Indexes:** (`status`), (`species`, `size`), (`deleted_at`).

---

## `adoptions`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `animal_id` | `animalId` | uuid | yes | — | FK → `animals.id` |
| `person_id` | `personId` | uuid | yes | — | FK → `users.id` |
| `organization_id` | `organizationId` | uuid | no | null | Origin organization when applicable |
| `compatibility_score` | `compatibilityScore` | decimal | no | null | 0–100 |
| `status` | `status` | enum | yes | `requested` | |
| `requested_at` | `requestedAt` | timestamptz | yes | now() | |
| `completed_at` | `completedAt` | timestamptz | no | null | |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

**Indexes:** UNIQUE (`animal_id`, `person_id`); (`animal_id`, `status`); (`person_id`).

**Parallelism:** multiple rows per animal allowed for different persons; one row per person–animal pair.

---

## `occurrences`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `user_id` | `userId` | uuid | no | null | null = anonymous · **PII** if set |
| `type` | `type` | enum | yes | — | |
| `description` | `description` | text | no | null | |
| `location` | `location` | geography(Point,4326) | yes | — | **PII** (precise geo) · Prisma `Unsupported` |
| `photos` | `photos` | text[] | no | {} | |
| `status` | `status` | enum | yes | `open` | |
| `validated_by` | `validatedBy` | uuid | no | null | FK → `users.id` |
| `created_at` | `createdAt` | timestamptz | yes | now() | |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

**Indexes:** GIST (`location`); (`status`, `type`); (`created_at`).

---

## `occurrence_followers`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `occurrence_id` | `occurrenceId` | uuid | yes | — | FK → `occurrences.id` |
| `user_id` | `userId` | uuid | yes | — | FK → `users.id` |
| `created_at` | `createdAt` | timestamptz | yes | now() | |

**Indexes:** UNIQUE (`occurrence_id`, `user_id`).

---

## `notifications`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `user_id` | `userId` | uuid | yes | — | FK · **PII** (association) |
| `type` | `type` | `notification_type` | yes | — | |
| `message` | `message` | text | yes | — | |
| `payload` | `payload` | jsonb | no | null | No secrets / full PII |
| `read` | `read` | boolean | yes | false | |
| `created_at` | `createdAt` | timestamptz | yes | now() | |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

**Indexes:** (`user_id`, `read`, `created_at`).

---

## `refresh_tokens`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `user_id` | `userId` | uuid | yes | — | FK → `users.id` |
| `token_hash` | — | varchar | yes | — | UNIQUE · hash only · secret |
| `client_type` | `clientType` | `client_type` | yes | `unknown` | web / mobile |
| `device_id` | `deviceId` | varchar | no | null | Multi-device revoke |
| `user_agent` | `userAgent` | varchar | no | null | |
| `revoked_at` | `revokedAt` | timestamptz | no | null | Logout / revoke |
| `expires_at` | `expiresAt` | timestamptz | yes | — | |
| `created_at` | `createdAt` | timestamptz | yes | now() | |

**Indexes:** UNIQUE (`token_hash`); (`user_id`); (`device_id`).

---

## `email_verification_tokens` / `password_reset_tokens`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `id` | `id` | uuid | yes | PK |
| `user_id` | `userId` | uuid | yes | FK |
| `token_hash` | — | varchar | yes | UNIQUE · hash only |
| `expires_at` | `expiresAt` | timestamptz | yes | |
| `used_at` | `usedAt` | timestamptz | no | Set when consumed |
| `created_at` | `createdAt` | timestamptz | yes | |

---

## `device_push_tokens`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `user_id` | `userId` | uuid | yes | — | FK → `users.id` |
| `platform` | `platform` | `push_platform` | yes | — | `ios` / `android` |
| `token` | `token` | varchar | yes | — | UNIQUE · **PII**/device secret |
| `created_at` | `createdAt` | timestamptz | yes | now() | |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |
| `last_seen_at` | `lastSeenAt` | timestamptz | yes | now() | Refresh on app open |

**Indexes:** UNIQUE (`token`); (`user_id`).

---

## `waitlist_entries`

Marketing lead from **`/register` step 1** (profile + LGPD). **Step 2 password is UI-only today** and must never be columns on this table — credentials belong on `users.password_hash` when identity auth ships.

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `name` | `name` | varchar | yes | — | **PII** |
| `email` | `email` | varchar | yes | — | UNIQUE · **PII** |
| `profile_type` | `profileType` | `waitlist_profile_type` | yes | — | Register step 1 (`person` / `ong` / `veterinary_clinic` / `other`) |
| `city` | `city` | varchar | no | null | |
| `state` | `state` | varchar | no | null | |
| `lgpd_consent_at` | `lgpdConsentAt` | timestamptz | yes | — | Consent timestamp |
| `created_at` | `createdAt` | timestamptz | yes | now() | |

**Indexes:** UNIQUE (`email`); (`created_at`).

**Out of scope on this table:** `password_hash`, OAuth tokens, locale preference (client `localStorage` only).

---

## `audit_logs`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `id` | `id` | uuid | yes | PK |
| `actor_id` | `actorId` | uuid | no | FK; null = system |
| `action` | `action` | `audit_action` | yes | |
| `target_type` | `targetType` | varchar | no | e.g. `user`, `occurrence` |
| `target_id` | `targetId` | uuid | no | |
| `metadata` | `metadata` | jsonb | no | No secrets / full PII |
| `created_at` | `createdAt` | timestamptz | yes | Append-only |

**Indexes:** (`actor_id`, `created_at`).

---

## `occurrence_reports`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `id` | `id` | uuid | yes | PK |
| `occurrence_id` | `occurrenceId` | uuid | yes | FK |
| `reported_by` | `reportedBy` | uuid | no | null if anonymous |
| `reason` | `reason` | `occurrence_report_reason` | yes | |
| `notes` | `notes` | text | no | |
| `created_at` | `createdAt` | timestamptz | yes | |

**Indexes:** (`occurrence_id`).

---

## Indexes (summary)

| Table | Index | Why |
|---|---|---|
| `users` | UNIQUE `email`; UNIQUE `username`; `deleted_at` | Login · handle · soft delete |
| `occurrences` | GIST `location` | `ST_DWithin` |
| `adoptions` | UNIQUE (`animal_id`, `person_id`) | One request per pair |
| `device_push_tokens` | UNIQUE `token` | Push delivery |
| `waitlist_entries` | UNIQUE `email` | Lead dedupe |
| Token tables | UNIQUE `token_hash` | Auth |

**Token rule:** store **hashes only** (refresh, email verify, password reset) — never plaintext.

**PostGIS:** `CREATE EXTENSION IF NOT EXISTS postgis;` + `CREATE INDEX ... USING GIST (location)` in migration SQL (Prisma does not auto-GIST `Unsupported`).
