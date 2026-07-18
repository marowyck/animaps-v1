# ANIMAPS — Dicionário de dados

Fonte: [`der.dbml`](der.dbml) · [`bounded-contexts.md`](bounded-contexts.md) · roadmap §0.5.  
Rascunho Prisma: [`schema.prisma`](schema.prisma).

**Convenção:** coluna DB = `snake_case` · API/TypeScript = `camelCase` · enums = `snake_case`.

**Legenda LGPD:** campos marcados com **PII** são dados pessoais ou sensíveis.

---

## Regras de negócio (schema vs application)

| Regra | Onde |
|---|---|
| `tax_id` do guardian opcional no cadastro; **obrigatório** em `RequestAdoption` | Application (`adoption`) |
| Só `ngo` **verified**, `clinic` **verified** ou `guardian` com `is_rescuer` cadastram `Animal` | Application + authz |
| Várias `adoptions` em paralelo no mesmo animal; origem escolhe | Application (`adoption`) |
| Animal vai para `in_process` no **primeiro** `approved` (não no `requested`) | Application (`adoption`) |
| `occurrences.user_id` nullable (anônimo); claim depois | Schema + application |
| Ao menos um de `ngo_id` / `guardian_id` / `clinic_id` em `animals` | Application (check constraint futura) |

---

## Enums

| Enum | Valores |
|---|---|
| `user_role` | `guardian`, `ngo`, `clinic`, `public_agency`, `biologist` |
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
| `clinic_service` (valores de array) | `vaccination`, `neutering`, `emergency_care`, `grooming` |
| `temperament_tag` (valores de array) | `docile`, `playful`, `independent`, `needs_space`, … (lista aberta controlada) |
| `audit_action` | `ngo_verified`, `clinic_verified`, `role_changed`, `account_deleted`, `data_exported`, `occurrence_validated` |
| `occurrence_report_reason` | `spam`, `duplicate`, `false_information`, `inappropriate_content` |

---

## `users`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `id` | `id` | uuid | sim | gen_random_uuid() | PK |
| `name` | `name` | varchar | sim | — | |
| `email` | `email` | varchar | sim | — | UNIQUE · **PII** |
| `password_hash` | — | varchar | sim | — | Nunca expor na API · **PII** |
| `role` | `role` | `user_role` | sim | — | |
| `phone` | `phone` | varchar | não | null | **PII** |
| `city` | `city` | varchar | não | null | |
| `state` | `state` | varchar | não | null | |
| `lgpd_consent` | `lgpdConsent` | boolean | sim | false | |
| `lgpd_consent_at` | `lgpdConsentAt` | timestamptz | não | null | |
| `created_at` | `createdAt` | timestamptz | sim | now() | |
| `updated_at` | `updatedAt` | timestamptz | sim | — | |

**Índices:** UNIQUE (`email`).

---

## `guardian_profiles`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `user_id` | `userId` | uuid | sim | — | PK, FK → `users.id` |
| `available_space` | `availableSpace` | enum | não | null | |
| `available_time` | `availableTime` | enum | não | null | |
| `has_previous_experience` | `hasPreviousExperience` | boolean | sim | false | |
| `has_other_pets` | `hasOtherPets` | boolean | sim | false | |
| `preferred_size` | `preferredSize` | enum | não | null | |
| `preferred_species` | `preferredSpecies` | enum | não | null | |
| `is_rescuer` | `isRescuer` | boolean | sim | false | Autoriza `Animal.create` |
| `tax_id` | `taxId` | varchar | não* | null | **PII** · *required na aplicação em `RequestAdoption` |

---

## `ngo_profiles`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `user_id` | `userId` | uuid | sim | — | PK, FK → `users.id` |
| `company_tax_id` | `companyTaxId` | varchar | sim | — | **PII** |
| `trade_name` | `tradeName` | varchar | sim | — | |
| `service_area_radius_km` | `serviceAreaRadiusKm` | decimal | não | null | Polígono PostGIS depois |
| `service_capacity` | `serviceCapacity` | int | não | null | |
| `verified` | `verified` | boolean | sim | false | Manual |

---

## `clinic_profiles`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `user_id` | `userId` | uuid | sim | — | PK, FK → `users.id` |
| `company_tax_id` | `companyTaxId` | varchar | sim | — | **PII** |
| `services_offered` | `servicesOffered` | varchar[] | não | {} | Valores `clinic_service` |
| `business_hours` | `businessHours` | text | não | null | |
| `verified` | `verified` | boolean | sim | false | Manual — igual NGO |

---

## `animals`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `id` | `id` | uuid | sim | gen | PK |
| `ngo_id` | `ngoId` | uuid | não* | null | FK → `users.id` |
| `guardian_id` | `guardianId` | uuid | não* | null | FK → `users.id` (rescuer) |
| `clinic_id` | `clinicId` | uuid | não* | null | FK → `users.id` |
| `name` | `name` | varchar | sim | — | |
| `species` | `species` | enum | sim | — | |
| `breed` | `breed` | varchar | não | null | |
| `estimated_age` | `estimatedAge` | varchar | não | null | |
| `size` | `size` | enum | não | null | |
| `temperament` | `temperament` | varchar[] | não | {} | |
| `health_history` | `healthHistory` | text | não | null | |
| `photos` | `photos` | text[] | não | {} | URLs object storage |
| `status` | `status` | enum | sim | `available` | `in_process` no 1º approve |
| `created_at` | `createdAt` | timestamptz | sim | now() | |

\* Application: pelo menos um de `ngo_id`, `guardian_id`, `clinic_id` preenchido.

**Índices:** (`status`), (`species`, `size`).

---

## `adoptions`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `id` | `id` | uuid | sim | gen | PK |
| `animal_id` | `animalId` | uuid | sim | — | FK → `animals.id` |
| `guardian_id` | `guardianId` | uuid | sim | — | FK → `users.id` |
| `ngo_id` | `ngoId` | uuid | não | null | Origem NGO quando aplicável |
| `compatibility_score` | `compatibilityScore` | decimal | não | null | 0–100 |
| `status` | `status` | enum | sim | `requested` | |
| `requested_at` | `requestedAt` | timestamptz | sim | now() | |
| `completed_at` | `completedAt` | timestamptz | não | null | |

**Índices:** (`animal_id`, `status`), (`guardian_id`).

**Paralelismo:** várias linhas `requested` / `under_review` no mesmo `animal_id` são permitidas.

---

## `occurrences`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `id` | `id` | uuid | sim | gen | PK |
| `user_id` | `userId` | uuid | não | null | null = anônimo · **PII** se preenchido |
| `type` | `type` | enum | sim | — | |
| `description` | `description` | text | não | null | |
| `location` | `location` | geography(Point,4326) | sim | — | **PII** (geo precisa) · Prisma `Unsupported` |
| `photos` | `photos` | text[] | não | {} | |
| `status` | `status` | enum | sim | `open` | |
| `validated_by` | `validatedBy` | uuid | não | null | FK → `users.id` |
| `created_at` | `createdAt` | timestamptz | sim | now() | |

**Índices:** GIST (`location`); composto (`status`, `type`); (`created_at`).

---

## `occurrence_followers`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `occurrence_id` | `occurrenceId` | uuid | sim | — | FK → `occurrences.id` |
| `user_id` | `userId` | uuid | sim | — | FK → `users.id` |
| `created_at` | `createdAt` | timestamptz | sim | now() | |

**Índices:** UNIQUE (`occurrence_id`, `user_id`).

---

## `notifications`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `id` | `id` | uuid | sim | gen | PK |
| `user_id` | `userId` | uuid | sim | — | FK · **PII** (associação) |
| `type` | `type` | varchar | sim | — | Código do evento/tipo |
| `message` | `message` | text | sim | — | |
| `read` | `read` | boolean | sim | false | |
| `created_at` | `createdAt` | timestamptz | sim | now() | |

**Índices:** (`user_id`, `read`, `created_at`).

---

## `refresh_tokens`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `id` | `id` | uuid | sim | gen | PK |
| `user_id` | `userId` | uuid | sim | — | FK → `users.id` |
| `token_hash` | — | varchar | sim | — | UNIQUE · **nunca** valor puro · **PII**/segredo |
| `revoked` | `revoked` | boolean | sim | false | Logout / revogação |
| `expires_at` | `expiresAt` | timestamptz | sim | — | |
| `created_at` | `createdAt` | timestamptz | sim | now() | |

**Índices:** UNIQUE (`token_hash`); (`user_id`).

---

## `email_verification_tokens`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `id` | `id` | uuid | sim | gen | PK |
| `user_id` | `userId` | uuid | sim | — | FK → `users.id` |
| `token_hash` | — | varchar | sim | — | UNIQUE · só hash |
| `expires_at` | `expiresAt` | timestamptz | sim | — | |
| `used_at` | `usedAt` | timestamptz | não | null | Preenchido ao consumir |
| `created_at` | `createdAt` | timestamptz | sim | now() | |

**Índices:** UNIQUE (`token_hash`); (`user_id`).

---

## `password_reset_tokens`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `id` | `id` | uuid | sim | gen | PK |
| `user_id` | `userId` | uuid | sim | — | FK → `users.id` |
| `token_hash` | — | varchar | sim | — | UNIQUE · só hash |
| `expires_at` | `expiresAt` | timestamptz | sim | — | |
| `used_at` | `usedAt` | timestamptz | não | null | |
| `created_at` | `createdAt` | timestamptz | sim | now() | |

**Índices:** UNIQUE (`token_hash`); (`user_id`).

---

## `audit_logs`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `id` | `id` | uuid | sim | gen | PK |
| `actor_id` | `actorId` | uuid | não | null | FK → `users.id`; null = sistema |
| `action` | `action` | `audit_action` | sim | — | |
| `target_type` | `targetType` | varchar | não | null | Ex.: `user`, `occurrence`, `animal` |
| `target_id` | `targetId` | uuid | não | null | |
| `metadata` | `metadata` | jsonb | não | null | **Sem** secrets / PII completa |
| `created_at` | `createdAt` | timestamptz | sim | now() | |

**Índices:** (`actor_id`, `created_at`).

**Enums `audit_action`:** `ngo_verified`, `clinic_verified`, `role_changed`, `account_deleted`, `data_exported`, `occurrence_validated`.

---

## `occurrence_reports`

| DB | API | Tipo | Obrig. | Default | Notas |
|---|---|---|---|---|---|
| `id` | `id` | uuid | sim | gen | PK |
| `occurrence_id` | `occurrenceId` | uuid | sim | — | FK → `occurrences.id` |
| `reported_by` | `reportedBy` | uuid | não | null | FK → `users.id`; null se anônimo |
| `reason` | `reason` | `occurrence_report_reason` | sim | — | |
| `notes` | `notes` | text | não | null | |
| `created_at` | `createdAt` | timestamptz | sim | now() | |

**Índices:** (`occurrence_id`).

**Enums `occurrence_report_reason`:** `spam`, `duplicate`, `false_information`, `inappropriate_content`.

---

## Índices (resumo)

| Tabela | Índice | Motivo |
|---|---|---|
| `users` | UNIQUE `email` | Login |
| `occurrences` | GIST `location` | `ST_DWithin` |
| `occurrences` | (`status`, `type`) | Filtros dashboard |
| `occurrence_followers` | UNIQUE (`occurrence_id`, `user_id`) | N:N |
| `adoptions` | (`animal_id`, `status`) | Painel da origem |
| `animals` | (`status`) | Vitrine |
| `refresh_tokens` / email / password tokens | UNIQUE `token_hash`; (`user_id`) | Auth |
| `audit_logs` | (`actor_id`, `created_at`) | Auditoria |
| `occurrence_reports` | (`occurrence_id`) | Moderação |

**Regra de tokens:** persistir apenas **hash** do token (refresh, e-mail, reset de senha) — nunca o valor puro.

**PostGIS:** `CREATE EXTENSION IF NOT EXISTS postgis;` + `CREATE INDEX ... USING GIST (location)` via SQL na migration (Prisma não gera GIST automaticamente para `Unsupported`).
