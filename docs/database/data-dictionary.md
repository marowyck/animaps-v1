# ANIMAPS — Data dictionary

Sources: [`der.dbml`](der.dbml) · [`schema.prisma`](schema.prisma) · [`bounded-contexts.md`](../architecture/bounded-contexts.md) · [`schema-evolution.md`](schema-evolution.md) · [`user-types.md`](../domains/user-types.md) · [`profiles.md`](../domains/profiles.md) · [`overview.md`](../domains/overview.md) · [`account-types.md`](../domains/account-types.md) · [`cases.md`](../domains/cases.md) · [`roles-and-permissions.md`](../domains/roles-and-permissions.md).

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
| `account_type` | `person`, `organization`, `institution` |
| `account_status` | `active`, `pending_verification`, `suspended` |
| `organization_type` | `ngo`, `animal_shelter`, `veterinary_clinic`, `veterinary_hospital`, `animal_business`, `animal_service`, `private_institution`, `other` |
| `institution_verification_status` | `draft`, `pending_verification`, `under_review`, `approved`, `rejected`, `suspended` |
| `jurisdiction_type` | `national`, `state`, `municipal`, `regional`, `local` |
| `role_scope` | `platform`, `organization`, `institution` |
| `membership_status` | `invited`, `active`, `suspended`, `left` |
| `case_source` | `citizen`, `ngo`, `veterinary`, `institution`, `system`, `import`, `api`, `partner` |
| `case_status` | `new`, `triage`, `under_review`, `assigned`, `in_progress`, `waiting_information`, `resolved`, `closed`, `cancelled`, `duplicate`, `invalid` |
| `case_citizen_status` | `registered_on_platform`, `awaiting_routing`, `routed`, `received`, `under_analysis`, `in_progress`, `resolved` |
| `case_priority` | `low`, `medium`, `high`, `critical` |
| `reporter_visibility` | `public`, `restricted`, `confidential`, `anonymous` |
| `data_classification` | `public`, `internal`, `restricted`, `confidential`, `sensitive` |
| `location_precision` | `exact`, `approximate`, `city`, `region`, `hidden` |
| `case_comment_visibility` | `internal`, `public` |
| `case_participant_role` | `reporter`, `assignee`, `observer`, `routed_institution` |
| `case_routing_reason` | `initial`, `no_competence`, `out_of_region`, `out_of_type`, `partnership`, `specialization`, `other` |
| `integration_sync_status` | `pending`, `syncing`, `success`, `failed`, `retrying`, `disabled` |
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
| `waitlist_profile_type` | `person`, `ong`, `veterinary_clinic`, `other`, `institution` |
| `client_type` | `web`, `mobile_ios`, `mobile_android`, `unknown` |
| `push_platform` | `ios`, `android` |
| `notification_type` | `user_registered`, `organization_verified`, `veterinary_verified`, `adoption_requested`, `adoption_completed`, `animal_registered_for_matching`, `new_compatible_animal_available`, `occurrence_created`, `occurrence_status_changed`, `occurrence_resolved`, `generic` |
| `veterinary_service` (array values) | `vaccination`, `neutering`, `emergency_care`, `grooming`, `consultation`, `surgery`, `imaging`, `hospitalization` |
| `temperament_tag` (array values) | open controlled list (`docile`, `playful`, …) |
| `audit_action` | `organization_verified`, `veterinary_verified`, `user_type_changed`, `account_deleted`, `data_exported`, `occurrence_validated`, `institution_verified`, `institution_suspended`, `case_created`, `case_status_changed`, `case_assigned`, `case_routed`, `role_granted`, `membership_changed` |
| `occurrence_report_reason` | `spam`, `duplicate`, `false_information`, `inappropriate_content` |
| `user_intention_kind` | `adopt`, `pet_owner`, `help_animals`, `report`, `lost_animal`, `found_animal`, `community`, `explore`, `volunteer`, `foster_home`, `independent_protector`, `animal_professional`, `lost_pet_owner`, `found_pet_reporter`, `other` |
| `location_permission` | `granted`, `denied`, `not_requested` |
| `verification_kind` | `selfie`, `institutional` |
| `verification_status` | `pending`, `processing`, `approved`, `rejected`, `retry_required` |
| `privacy_visibility` | `public`, `matches`, `private` |
| `auth_provider` | `google` |

---

## `users`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `name` | `name` | varchar | yes | — | |
| `email` | `email` | varchar | yes | — | UNIQUE · **PII** |
| `username` | `username` | varchar | no | null | UNIQUE · public handle |
| `password_hash` | — | varchar | no* | null | Never expose · **PII** · email/password hash **or** a row in `auth_identities`. Never store on `waitlist_entries`. |
| `user_type` | `userType` | `user_type` | yes | — | Authoritative UI discriminator until cutover · [`user-types.md`](../domains/user-types.md) |
| `account_type` | `accountType` | `account_type` | no | null | **Nullable** until ecosystem cutover · derived from `user_type` when unset · [`account-types.md`](../domains/account-types.md) |
| `avatar_url` | `avatarUrl` | varchar | no | null | Object-storage URL |
| `status` | `status` | `account_status` | yes | `active` | Not a substitute for `deleted_at` |
| `phone` | `phone` | varchar | no | null | **PII** |
| `city` | `city` | varchar | no | null | |
| `state` | `state` | varchar | no | null | |
| `lgpd_consent` | `lgpdConsent` | boolean | yes | false | |
| `lgpd_consent_at` | `lgpdConsentAt` | timestamptz | no | null | |
| `privacy_policy_version` | `privacyPolicyVersion` | varchar | no | null | Slug accepted at consent (`v1-draft`) |
| `guidelines_accepted_at` | `guidelinesAcceptedAt` | timestamptz | no | null | Onboarding guidelines gate |
| `email_verified_at` | `emailVerifiedAt` | timestamptz | no | null | Set on `VerifyEmail` |
| `deleted_at` | `deletedAt` | timestamptz | no | null | Soft delete |
| `created_at` | `createdAt` | timestamptz | yes | now() | |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

**Indexes:** UNIQUE (`email`); UNIQUE (`username`); (`deleted_at`); (`account_type`).

---

## `person_profiles`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | — | PK, FK → `users.id` |
| `available_space` | `availableSpace` | enum | no | null | |
| `available_time` | `availableTime` | enum | no | null | |
| `has_previous_experience` | `hasPreviousExperience` | boolean | yes | false | |
| `has_other_pets` | `hasOtherPets` | boolean | yes | false | |
| `preferred_size` | `preferredSize` | enum | no | null | Legacy hint — source of truth: `animal_preferences` |
| `preferred_species` | `preferredSpecies` | enum | no | null | Legacy hint — source of truth: `animal_preferences` |
| `is_rescuer` | `isRescuer` | boolean | yes | false | Allows `Animal.create`. Not set by current onboarding. |
| `tax_id` | `taxId` | varchar | no* | null | **PII** · *required on `RequestAdoption` |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

---

## `organization_profiles`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | — | PK, FK → `users.id` |
| `company_tax_id` | `companyTaxId` | varchar | no* | null | **PII** · *required before `verified = true` |
| `trade_name` | `tradeName` | varchar | yes | — | |
| `description` | `description` | text | no | null | |
| `phone` | `phone` | varchar | no | null | **PII** |
| `email` | `email` | varchar | no | null | **PII** |
| `website` | `website` | varchar | no | null | |
| `social_links` | `socialLinks` | jsonb | no | null | |
| `city` | `city` | varchar | no | null | |
| `state` | `state` | varchar | no | null | |
| `area_of_operation` | `areaOfOperation` | varchar | no | null | Free-text from onboarding |
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
| `company_tax_id` | `companyTaxId` | varchar | no* | null | **PII** · *required before `verified = true` |
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
| `other_role` | `otherRole` | `other_role` | no | null | See catalog · [profiles.md](../domains/profiles.md) |
| `notes` | `notes` | text | no | null | Freeform |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

---

## `user_intentions`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | PK part · FK → `users.id` |
| `intention` | `intention` | `user_intention_kind` | yes | PK part |
| `created_at` | `createdAt` | timestamptz | yes | |

**Indexes:** PK (`user_id`, `intention`).

---

## `interests`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `id` | `id` | varchar | yes | Slug PK (`dogs`, `cats`, …) — see [database.md](./overview.md) seed |
| `sort_order` | `sortOrder` | int | yes | default 0 |
| `created_at` | `createdAt` | timestamptz | yes | |

Labels are i18n, not columns.

---

## `user_interests`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | PK part · FK |
| `interest_id` | `interestId` | varchar | yes | PK part · FK → `interests.id` |
| `created_at` | `createdAt` | timestamptz | yes | |

App rule: max **5** rows per user.

---

## `animal_preferences`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | — | PK, FK → `users.id` |
| `species` | `species` | varchar[] | no | {} | Draft `animalTypes` |
| `sizes` | `sizes` | varchar[] | no | {} | Draft `animalSizes` |
| `ages` | `ages` | varchar[] | no | {} | |
| `sex` | `sex` | varchar[] | no | {} | |
| `vaccination` | `vaccination` | varchar[] | no | {} | |
| `neutered` | `neutered` | varchar[] | no | {} | |
| `special_needs` | `specialNeeds` | varchar[] | no | {} | |
| `compatibility` | `compatibility` | varchar[] | no | {} | |
| `energy_level` | `energyLevel` | varchar[] | no | {} | |
| `environment` | `environment` | varchar[] | no | {} | |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

Empty array = any / not specified.

---

## `verification_requests`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `id` | `id` | uuid | yes | PK |
| `user_id` | `userId` | uuid | yes | FK |
| `kind` | `kind` | `verification_kind` | yes | `selfie` \| `institutional` |
| `status` | `status` | `verification_status` | yes | default `pending` |
| `provider` | `provider` | varchar | no | null until third-party |
| `provider_ref` | `providerRef` | varchar | no | |
| `media_url` | `mediaUrl` | text | no | **PII** · private short-lived URL · not a biometric template |
| `rejection_reason` | `rejectionReason` | varchar | no | |
| `created_at` / `updated_at` | | timestamptz | yes | |

**Indexes:** (`user_id`, `kind`, `created_at`). Latest row per kind is the live status.

Privilege gates remain `organization_profiles.verified` / `veterinary_profiles.verified` (admin after approved institutional request).

---

## `user_locations`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | PK, FK |
| `permission` | `permission` | `location_permission` | yes | default `not_requested` |
| `city` / `state` / `neighborhood` | | varchar | no | Approximate area |
| `approx_latitude` / `approx_longitude` | | decimal(8,3) | no | **PII** · round in app (~100 m) · never raw GPS |
| `updated_at` | `updatedAt` | timestamptz | yes | |

---

## `user_profile_fields`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | PK part |
| `field_key` | `fieldKey` | varchar | yes | PK part · see [profile.md](../domains/profiles.md) |
| `value` | `value` | varchar | no | **PII** depending on key |
| `visibility` | `visibility` | `privacy_visibility` | yes | default `private` |
| `updated_at` | `updatedAt` | timestamptz | yes | |

---

## `auth_identities`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `id` | `id` | uuid | yes | PK |
| `user_id` | `userId` | uuid | yes | FK |
| `provider` | `provider` | `auth_provider` | yes | `google` (add values only) |
| `provider_subject` | `providerSubject` | varchar | yes | IdP subject · **PII** |
| `created_at` | `createdAt` | timestamptz | yes | |

**Indexes:** UNIQUE (`provider`, `provider_subject`); (`user_id`).

---

## `notification_preferences`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | — | PK, FK |
| `in_app` | `inApp` | boolean | yes | true | |
| `email` | `email` | boolean | yes | true | |
| `push` | `push` | boolean | yes | false | Mobile Wave 3 |
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

\* Application + future SQL CHECK: at least one of `organization_id`, `person_id`, `veterinary_id`.

**Indexes:** (`status`), (`species`, `size`), (`deleted_at`).

---

## `animal_favorites`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | PK part · FK |
| `animal_id` | `animalId` | uuid | yes | PK part · FK |
| `created_at` | `createdAt` | timestamptz | yes | |

**Indexes:** PK (`user_id`, `animal_id`); (`animal_id`).

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
| `city` | `city` | varchar | no | null | Denormalized for aggregates (not a substitute for `location`) |
| `neighborhood` | `neighborhood` | varchar | no | null | Denormalized for LGPD-safe export |
| `photos` | `photos` | text[] | no | {} | |
| `status` | `status` | enum | yes | `open` | |
| `validated_by` | `validatedBy` | uuid | no | null | FK → `users.id` |
| `claim_token_hash` | — | varchar | no | null | UNIQUE · hash only · anonymous `ClaimOccurrence` |
| `geo_consent_at` | `geoConsentAt` | timestamptz | no | null | Occurrence geo/photo consent |
| `created_at` | `createdAt` | timestamptz | yes | now() | |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

**Indexes:** GIST (`location`); (`status`, `type`); (`created_at`); (`city`, `neighborhood`).

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
| `profile_type` | `profileType` | `waitlist_profile_type` | yes | — | Register step 1 (`person` / `ong` / `veterinary_clinic` / `other` / `institution`) |
| `city` | `city` | varchar | no | null | |
| `state` | `state` | varchar | no | null | |
| `lgpd_consent_at` | `lgpdConsentAt` | timestamptz | yes | — | Consent timestamp |
| `privacy_policy_version` | `privacyPolicyVersion` | varchar | no | null | Policy slug at consent |
| `converted_user_id` | `convertedUserId` | uuid | no | null | UNIQUE FK → `users.id` when RegisterUser consumes the lead |
| `created_at` | `createdAt` | timestamptz | yes | now() | |

**Indexes:** UNIQUE (`email`); UNIQUE (`converted_user_id`); (`created_at`).

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

## Ecosystem layer (Fase 1)

Additive tables. `occurrences` stay. Case is the institutional work item ([cases.md](../domains/cases.md) · [overview.md](../domains/overview.md)). `organization_profiles` / `veterinary_profiles` remain 1:1 on `users.id` — not reparented to `organizations.id` in this pass.

---

## `organizations`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `owner_user_id` | `ownerUserId` | uuid | no | null | Creating user; team lives in `organization_members` |
| `organization_type` | `organizationType` | `organization_type` | yes | — | Subtype catalog |
| `trade_name` | `tradeName` | varchar | yes | — | |
| `legal_name` | `legalName` | varchar | no | null | |
| `description` | `description` | text | no | null | |
| `company_tax_id` | `companyTaxId` | varchar | no | null | **PII** |
| `email` | `email` | varchar | no | null | **PII** |
| `phone` | `phone` | varchar | no | null | **PII** |
| `website` | `website` | varchar | no | null | |
| `social_links` | `socialLinks` | jsonb | no | null | |
| `city` | `city` | varchar | no | null | |
| `state` | `state` | varchar | no | null | |
| `country` | `country` | varchar | no | `BR` | |
| `verified` | `verified` | boolean | yes | false | Privileged org actions after verify |
| `deleted_at` | `deletedAt` | timestamptz | no | null | Soft delete |
| `created_at` / `updated_at` | | timestamptz | yes | | |

**Indexes:** (`organization_type`); (`verified`).

Wave 2 `organization_profiles` / `veterinary_profiles` are **not** moved here yet.

---

## `organization_members`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `organization_id` | `organizationId` | uuid | yes | — | FK → `organizations.id` |
| `user_id` | `userId` | uuid | yes | — | FK → `users.id` |
| `role_id` | `roleId` | uuid | yes | — | FK → `roles.id` (scope `organization`) |
| `status` | `status` | `membership_status` | yes | `active` | |
| `created_at` / `updated_at` | | timestamptz | yes | | |

**Indexes:** UNIQUE (`organization_id`, `user_id`); (`user_id`).

---

## `institution_types`

Lookup — add **rows**, not enum migrations. Seed ids: [database.md](./overview.md).

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | varchar | yes | — | Slug PK (`city_hall`, …) |
| `label_key` | `labelKey` | varchar | yes | — | i18n key |
| `sort_order` | `sortOrder` | int | yes | 0 | |
| `active` | `active` | boolean | yes | true | |
| `created_at` | `createdAt` | timestamptz | yes | now() | |

Labels are i18n, not columns.

---

## `institutions`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `institution_type_id` | `institutionTypeId` | varchar | yes | — | FK → `institution_types.id` |
| `official_name` | `officialName` | varchar | yes | — | Legal / gazette name |
| `public_name` | `publicName` | varchar | yes | — | Citizen-facing |
| `description` | `description` | text | no | null | |
| `city` / `state` | | varchar | no | null | Seat |
| `country` | `country` | varchar | no | `BR` | |
| `email` | `email` | varchar | no | null | **PII** · institutional mailbox, not a shared login |
| `email_domain` | `emailDomain` | varchar | no | null | Verification hint |
| `phone` | `phone` | varchar | no | null | **PII** |
| `website` | `website` | varchar | no | null | |
| `social_links` | `socialLinks` | jsonb | no | null | |
| `address` | `address` | text | no | null | **PII** |
| `responsible_department` | `responsibleDepartment` | varchar | no | null | |
| `data_responsible_area` | `dataResponsibleArea` | varchar | no | null | Data steward area |
| `verification_status` | `verificationStatus` | `institution_verification_status` | yes | `draft` | Privileged tools only after `approved` |
| `verified_at` | `verifiedAt` | timestamptz | no | null | Set on `approved` |
| `deleted_at` | `deletedAt` | timestamptz | no | null | Soft delete |
| `created_at` / `updated_at` | | timestamptz | yes | | |

**Indexes:** (`institution_type_id`); (`verification_status`).

---

## `institution_departments`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `institution_id` | `institutionId` | uuid | yes | — | FK |
| `parent_department_id` | `parentDepartmentId` | uuid | no | null | Self-FK tree |
| `name` | `name` | varchar | yes | — | |
| `description` | `description` | text | no | null | |
| `created_at` / `updated_at` | | timestamptz | yes | | |

**Indexes:** (`institution_id`).

---

## `institution_teams`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `institution_id` | `institutionId` | uuid | yes | — | FK |
| `department_id` | `departmentId` | uuid | no | null | FK → `institution_departments.id` |
| `name` | `name` | varchar | yes | — | |
| `description` | `description` | text | no | null | |
| `created_at` / `updated_at` | | timestamptz | yes | | |

**Indexes:** (`institution_id`).

---

## `institution_members`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `institution_id` | `institutionId` | uuid | yes | — | FK |
| `user_id` | `userId` | uuid | yes | — | FK → `users.id` |
| `role_id` | `roleId` | uuid | yes | — | FK → `roles.id` (scope `institution`) |
| `department_id` | `departmentId` | uuid | no | null | |
| `team_id` | `teamId` | uuid | no | null | |
| `status` | `status` | `membership_status` | yes | `active` | |
| `created_at` / `updated_at` | | timestamptz | yes | | |

**Indexes:** UNIQUE (`institution_id`, `user_id`); (`user_id`).

---

## `institution_jurisdictions`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `institution_id` | `institutionId` | uuid | yes | — | FK |
| `jurisdiction_type` | `jurisdictionType` | `jurisdiction_type` | yes | — | |
| `value` | `value` | varchar | yes | — | City name, IBGE code, UF, etc. |
| `country` | `country` | varchar | no | `BR` | |
| `created_at` | `createdAt` | timestamptz | yes | now() | |

**Indexes:** (`institution_id`, `jurisdiction_type`); (`value`).

---

## `institution_capabilities`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `institution_id` | `institutionId` | uuid | yes | — | FK |
| `case_type_id` | `caseTypeId` | varchar | yes | — | FK → `case_types.id` |
| `accepts` | `accepts` | boolean | yes | true | Routing input |
| `created_at` | `createdAt` | timestamptz | yes | now() | |

**Indexes:** UNIQUE (`institution_id`, `case_type_id`).

---

## `institution_report_policies`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `institution_id` | `institutionId` | uuid | yes | — | PK, FK → `institutions.id` |
| `anonymous_reports` | `anonymousReports` | boolean | yes | true | |
| `required_fields` | `requiredFields` | jsonb | no | null | |
| `accepted_case_type_ids` | `acceptedCaseTypeIds` | varchar[] | no | {} | |
| `routing_rules` | `routingRules` | jsonb | no | null | |
| `response_visibility` | `responseVisibility` | varchar | no | null | |
| `updated_at` | `updatedAt` | timestamptz | yes | — | |

---

## `roles`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `key` | `key` | varchar | yes | — | UNIQUE · stable (`INSTITUTION_ADMIN`, …) |
| `scope` | `scope` | `role_scope` | yes | — | |
| `description` | `description` | text | no | null | |
| `created_at` | `createdAt` | timestamptz | yes | now() | |

**Indexes:** UNIQUE (`key`); (`scope`). Seed: [roles-and-permissions.md](../domains/roles-and-permissions.md).

---

## `permissions`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `key` | `key` | varchar | yes | — | UNIQUE · stable (`VIEW_INCOMING_REPORTS`, …) |
| `domain` | `domain` | varchar | yes | — | e.g. `case`, `org`, `identity` |
| `description` | `description` | text | no | null | |
| `created_at` | `createdAt` | timestamptz | yes | now() | |

**Indexes:** UNIQUE (`key`); (`domain`).

---

## `role_permissions`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `role_id` | `roleId` | uuid | yes | PK part · FK → `roles.id` |
| `permission_id` | `permissionId` | uuid | yes | PK part · FK → `permissions.id` |

**Indexes:** PK (`role_id`, `permission_id`).

---

## `user_platform_roles`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `user_id` | `userId` | uuid | yes | PK part · FK |
| `role_id` | `roleId` | uuid | yes | PK part · FK · `roles.scope = platform` |
| `created_at` | `createdAt` | timestamptz | yes | |

**Indexes:** PK (`user_id`, `role_id`). `SUPER_ADMIN` / `PLATFORM_ADMIN` only — not a substitute for institution membership.

---

## `locations`

Shared case location (not `user_locations`). Prefer approx + city on public surfaces.

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `latitude` | `latitude` | decimal(10,7) | no | null | **PII** if exact |
| `longitude` | `longitude` | decimal(10,7) | no | null | **PII** if exact |
| `city` | `city` | varchar | no | null | |
| `state` | `state` | varchar | no | null | |
| `country` | `country` | varchar | no | `BR` | |
| `neighborhood` | `neighborhood` | varchar | no | null | |
| `postal_code` | `postalCode` | varchar | no | null | |
| `formatted_address` | `formattedAddress` | varchar | no | null | **PII** |
| `precision` | `precision` | `location_precision` | yes | `approximate` | |
| `privacy_level` | `privacyLevel` | `data_classification` | yes | `restricted` | |
| `created_at` / `updated_at` | | timestamptz | yes | | |

**Indexes:** (`city`, `state`).

---

## `case_types`

Lookup — not a hard Postgres enum. Seed: [database.md](./overview.md) · [cases.md](../domains/cases.md).

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | varchar | yes | — | Slug PK (`animal_abuse`, …) |
| `label_key` | `labelKey` | varchar | yes | — | i18n key |
| `sort_order` | `sortOrder` | int | yes | 0 | |
| `active` | `active` | boolean | yes | true | |
| `created_at` | `createdAt` | timestamptz | yes | now() | |

---

## `cases`

Institutional work item. Supersedes `occurrences` for routing; occurrence rows stay for the Wave 2 map.

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `reference_number` | `referenceNumber` | varchar | yes | — | UNIQUE · public-friendly id |
| `case_type_id` | `caseTypeId` | varchar | yes | — | FK → `case_types.id` |
| `status` | `status` | `case_status` | yes | `new` | Internal machine |
| `citizen_status` | `citizenStatus` | `case_citizen_status` | yes | `registered_on_platform` | Never claim agency delivery without `case_routing` |
| `priority` | `priority` | `case_priority` | yes | `medium` | |
| `source` | `source` | `case_source` | yes | — | |
| `title` | `title` | varchar | no | null | |
| `description` | `description` | text | no | null | |
| `location_id` | `locationId` | uuid | no | null | FK → `locations.id` |
| `reporter_id` | `reporterId` | uuid | no | null | null = anonymous · **PII** if set |
| `organization_id` | `organizationId` | uuid | no | null | Origin org |
| `institution_id` | `institutionId` | uuid | no | null | Current responsible body; null if awaiting routing |
| `assigned_user_id` | `assignedUserId` | uuid | no | null | |
| `assigned_team_id` | `assignedTeamId` | uuid | no | null | |
| `reporter_visibility` | `reporterVisibility` | `reporter_visibility` | yes | `restricted` | What the institution may see about the reporter |
| `classification` | `classification` | `data_classification` | yes | `internal` | |
| `claim_token_hash` | — | varchar | no | null | UNIQUE · hash only · anonymous claim |
| `geo_consent_at` | `geoConsentAt` | timestamptz | no | null | |
| `closed_at` | `closedAt` | timestamptz | no | null | |
| `created_at` / `updated_at` | | timestamptz | yes | | |

**Indexes:** UNIQUE (`reference_number`); UNIQUE (`claim_token_hash`); (`status`, `priority`); (`citizen_status`); (`case_type_id`); (`institution_id`, `status`); (`created_at`).

---

## `case_status_history`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `id` | `id` | uuid | yes | PK |
| `case_id` | `caseId` | uuid | yes | FK |
| `from_status` | `fromStatus` | `case_status` | no | |
| `to_status` | `toStatus` | `case_status` | yes | |
| `from_citizen_status` | `fromCitizenStatus` | `case_citizen_status` | no | |
| `to_citizen_status` | `toCitizenStatus` | `case_citizen_status` | no | |
| `actor_id` | `actorId` | uuid | no | FK; null = system |
| `note` | `note` | text | no | |
| `created_at` | `createdAt` | timestamptz | yes | Append-only |

**Indexes:** (`case_id`, `created_at`).

---

## `case_assignments`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `id` | `id` | uuid | yes | PK |
| `case_id` | `caseId` | uuid | yes | FK |
| `user_id` | `userId` | uuid | no | Assignee |
| `team_id` | `teamId` | uuid | no | FK → `institution_teams.id` |
| `assigned_by` | `assignedBy` | uuid | no | Actor |
| `note` | `note` | text | no | |
| `created_at` | `createdAt` | timestamptz | yes | |
| `ended_at` | `endedAt` | timestamptz | no | Set when superseded |

**Indexes:** (`case_id`, `created_at`).

---

## `case_routing`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `case_id` | `caseId` | uuid | yes | — | FK |
| `from_institution_id` | `fromInstitutionId` | uuid | no | null | |
| `to_institution_id` | `toInstitutionId` | uuid | no | null | Match required before citizen `routed` |
| `reason` | `reason` | `case_routing_reason` | yes | `initial` | |
| `note` | `note` | text | no | null | |
| `created_at` | `createdAt` | timestamptz | yes | now() | |

**Indexes:** (`case_id`, `created_at`).

---

## `case_comments`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `case_id` | `caseId` | uuid | yes | — | FK |
| `author_id` | `authorId` | uuid | no | null | |
| `body` | `body` | text | yes | — | Internal notes must not leak to citizen status |
| `visibility` | `visibility` | `case_comment_visibility` | yes | `internal` | |
| `created_at` / `updated_at` | | timestamptz | yes | | |

**Indexes:** (`case_id`, `created_at`).

---

## `case_attachments`

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `case_id` | `caseId` | uuid | yes | — | FK |
| `url` | `url` | varchar | yes | — | Object-storage URL · private by default |
| `mime_type` | `mimeType` | varchar | no | null | |
| `kind` | `kind` | varchar | no | `photo` | |
| `created_at` | `createdAt` | timestamptz | yes | now() | |

**Indexes:** (`case_id`).

---

## `case_participants`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `id` | `id` | uuid | yes | PK |
| `case_id` | `caseId` | uuid | yes | FK |
| `user_id` | `userId` | uuid | no | |
| `role` | `role` | `case_participant_role` | yes | |
| `created_at` | `createdAt` | timestamptz | yes | |

**Indexes:** (`case_id`).

---

## `data_exports`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `id` | `id` | uuid | yes | PK |
| `requested_by_id` | `requestedById` | uuid | no | Actor · audit companion |
| `institution_id` | `institutionId` | uuid | no | Scope |
| `format` | `format` | varchar | yes | e.g. `csv`, `xlsx`, `pdf` |
| `purpose` | `purpose` | varchar | no | |
| `filters` | `filters` | jsonb | no | No secrets / full PII |
| `created_at` | `createdAt` | timestamptz | yes | |

**Indexes:** (`created_at`). Pair with `audit_logs` `data_exported`.

---

## `integration_connections`

Prepared later-wave surface — do not implement a named government API now ([integrations.md](../features/integrations.md)).

| DB | API | Type | Req | Default | Notes |
|---|---|---|---|---|---|
| `id` | `id` | uuid | yes | gen | PK |
| `institution_id` | `institutionId` | uuid | no | null | Null = platform-level |
| `name` | `name` | varchar | yes | — | |
| `provider` | `provider` | varchar | no | null | Stable slug · not a vendor-specific table |
| `status` | `status` | `integration_sync_status` | yes | `pending` | |
| `config` | `config` | jsonb | no | null | Non-secret only · secrets in vault |
| `created_at` / `updated_at` | | timestamptz | yes | | |

---

## `integration_logs`

| DB | API | Type | Req | Notes |
|---|---|---|---|---|
| `id` | `id` | uuid | yes | PK |
| `connection_id` | `connectionId` | uuid | yes | FK |
| `status` | `status` | `integration_sync_status` | yes | |
| `message` | `message` | text | no | |
| `payload` | `payload` | jsonb | no | No secrets / full PII |
| `created_at` | `createdAt` | timestamptz | yes | |

**Indexes:** (`connection_id`, `created_at`). Failed remote sync must **not** set citizen status to routed/delivered.

---

## Indexes (summary)

| Table | Index | Why |
|---|---|---|
| `users` | UNIQUE `email`; UNIQUE `username`; `deleted_at`; `account_type` | Login · handle · soft delete · ecosystem axis |
| `occurrences` | GIST `location`; (`city`, `neighborhood`) | `ST_DWithin` · aggregates |
| `adoptions` | UNIQUE (`animal_id`, `person_id`) | One request per pair |
| `animal_favorites` | PK (`user_id`, `animal_id`) | Saves |
| `user_intentions` | PK (`user_id`, `intention`) | Multi-select |
| `auth_identities` | UNIQUE (`provider`, `provider_subject`) | OAuth |
| `device_push_tokens` | UNIQUE `token` | Push delivery |
| `waitlist_entries` | UNIQUE `email`; UNIQUE `converted_user_id` | Lead dedupe · conversion |
| Token tables | UNIQUE `token_hash` | Auth |
| `organizations` | (`organization_type`); (`verified`) | Org lists |
| `organization_members` | UNIQUE (`organization_id`, `user_id`); (`user_id`) | One membership per user–org |
| `institutions` | (`institution_type_id`); (`verification_status`) | Lookup · gate privileged tools |
| `institution_members` | UNIQUE (`institution_id`, `user_id`); (`user_id`) | One membership per user–institution |
| `institution_jurisdictions` | (`institution_id`, `jurisdiction_type`); (`value`) | Routing match |
| `institution_capabilities` | UNIQUE (`institution_id`, `case_type_id`) | Accepted types |
| `roles` | UNIQUE `key`; (`scope`) | RBAC seed |
| `permissions` | UNIQUE `key`; (`domain`) | RBAC seed |
| `role_permissions` | PK (`role_id`, `permission_id`) | Configurable join |
| `user_platform_roles` | PK (`user_id`, `role_id`) | Platform grants |
| `locations` | (`city`, `state`) | Case geo filter |
| `cases` | UNIQUE `reference_number`; UNIQUE `claim_token_hash`; (`status`, `priority`); (`citizen_status`); (`case_type_id`); (`institution_id`, `status`); (`created_at`) | Inbox · claim · routing |
| `case_status_history` | (`case_id`, `created_at`) | Timeline |
| `case_assignments` / `case_routing` / `case_comments` | (`case_id`, `created_at`) | History |
| `case_attachments` / `case_participants` | (`case_id`) | Case payload |
| `data_exports` | (`created_at`) | Audit trail |
| `integration_logs` | (`connection_id`, `created_at`) | Sync history |

**Token rule:** store **hashes only** (refresh, email verify, password reset) — never plaintext.

**PostGIS:** `CREATE EXTENSION IF NOT EXISTS postgis;` + `CREATE INDEX ... USING GIST (location)` in migration SQL (Prisma does not auto-GIST `Unsupported`).
