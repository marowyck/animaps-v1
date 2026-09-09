# ANIMAPS — Database

Canonical schema: [schema.prisma](schema.prisma) · [der.dbml](der.dbml) · [data-dictionary.md](data-dictionary.md).  
This document covers **identity profile alignment**, onboarding-related **Wave 2 candidates**, and how the frontend draft maps onto tables.

Related: [user-types.md](user-types.md) · [profiles.md](profiles.md) · [onboarding.md](onboarding.md) · [verification.md](verification.md) · [schema-evolution.md](schema-evolution.md) · [conventions.md](conventions.md).

---

## Modeled today (docs Prisma / DBML)

| Table | Role |
|---|---|
| `users` | Shared account: email, `user_type`, optional `username` / `avatar_url` / `status`, soft delete |
| `person_profiles` | PERSON prefs + `is_rescuer` + `tax_id` |
| `organization_profiles` | ONG institutional data + service flags + `verified` |
| `veterinary_profiles` | Clinic services / hours / animals served + `verified` |
| `other_profiles` | `other_role` + notes |
| `waitlist_entries` | Marketing lead from `/register` (`profile_type` ∈ person/ong/veterinary_clinic/other) |
| `animals` / `adoptions` | Adoption domain (`organization_id` / `person_id` / `veterinary_id`) |
| `occurrences` (+ followers, reports) | Geo reports |
| Auth token tables | Refresh / email verify / password reset (hash only) |
| `notifications`, `audit_logs`, `device_push_tokens` | Cross-cutting |

**Rename summary (pre-launch, docs-only):** `UserRole` → `UserType`; `guardian_*` → `person_*`; `ngo_*` → `organization_*`; `clinic_*` → `veterinary_*`. See [user-types.md](user-types.md).

Frontend does **not** write Postgres yet. Draft state lives in `localStorage` (`animaps-onboarding-draft`).

---

## Wave 2 candidates (not in Prisma yet)

Promote these when scaffolding `apps/api`. Prefer additive tables over overloading `person_profiles` enums.

### `user_intentions`

Multi-select “what the user seeks” (PERSON).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK → `users.id` |
| `intention` | enum / varchar | `adopt`, `pet_owner`, `help_animals`, `report`, `lost_animal`, `found_animal`, `community`, `explore` |
| `created_at` | timestamptz | |

**UNIQUE** (`user_id`, `intention`).

### `interests` + `user_interests`

Catalog + join. App-level max **5** interests per user. UNIQUE (`user_id`, `interest_id`).

### `animal_preferences`

Richer multi-select than single `preferred_species` / `preferred_size` on `person_profiles`.

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid | PK/FK |
| `species` / `sizes` / `ages` | varchar[] | empty = any |
| `sex` / `vaccinated` / `neutered` / `special_needs` | varchar | |
| `compatibility` / `energy_level` / `environment` | varchar[] | |
| `updated_at` | timestamptz | |

### `verification_requests`

Human-presence (selfie) **and** institutional document review share one table; discriminate with `kind`.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK |
| `kind` | enum | `selfie` \| `institutional` |
| `status` | enum | `pending`, `processing`, `approved`, `rejected`, `retry_required` |
| `provider` / `provider_ref` | varchar | null until third-party |
| `media_url` | text | short-lived / private |
| `rejection_reason` | varchar | |
| `created_at` / `updated_at` | timestamptz | |

Org/clinic **privilege** gates remain `organization_profiles.verified` / `veterinary_profiles.verified` (set by admin after approved institutional requests).

### `user_locations`

Approximate location only (LGPD). Permission enum: `granted` \| `denied` \| `not_requested`.

### Optional enrichment visibility

Per-field privacy for PERSON additional-info rows: see [profile.md](profile.md). Prefer JSON map or child table with (`field_key`, `value`, `visibility`) — do not invent dating-style columns.

---

## Frontend ↔ future tables

| Draft field | Future persistence |
|---|---|
| `userType` | `users.user_type` |
| `intentions` | `user_intentions` |
| `otherRole` | `other_profiles.other_role` |
| `organization.*` | `organization_profiles` |
| `veterinary.*` | `veterinary_profiles` |
| `animalTypes` / sizes / filters | `animal_preferences` |
| `interestIds` | `user_interests` |
| `additionalInfo` | enrichment store + visibility |
| `selfieStatus` / institutional status | `verification_requests` |
| `locationPermission` | `user_locations` |

Types today: `features/onboarding/types.ts`, `features/user-types`, `features/verification`.

---

## Decision log

- Do not overload `waitlist_entries` with credentials or profile blobs — waitlist is marketing only.
- Intention / interest slugs stay English in code; UI via i18n.
- `verification_requests.kind` keeps one pipeline for selfie + institutional without splitting tables prematurely.
- Animal origin FKs renamed for vocabulary consistency before any production DB exists (safe expand).
