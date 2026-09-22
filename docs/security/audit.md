# ANIMAPS — Audit

Audit is **cross-cutting**, not a bounded context of its own ([bounded-contexts.md](../architecture/bounded-contexts.md)). Reuse `audit_logs`. Case workflow uses **append-only** `case_status_history` and `case_assignments` for timelines.

Related: [government.md](../domains/government.md) · [cases.md](../domains/cases.md) · [security.md](security.md) · [privacy.md](privacy.md) · [lgpd-checklist.md](lgpd-checklist.md) · [data-dictionary.md](../database/data-dictionary.md) · [schema-evolution.md](../database/schema-evolution.md).

---

## Reuse `audit_logs`

Wave 2 model ([schema.prisma](../database/schema.prisma) / dictionary):

| Column | Role |
|---|---|
| `actor_id` | User; null = system |
| `action` | `audit_action` enum |
| `target_type` / `target_id` | e.g. `user`, `occurrence`, later `case`, `institution` |
| `metadata` | jsonb — **no secrets / full PII** |
| `created_at` | Append-only |

Do **not** create a parallel `institution_audit_logs` table. Scope queries with `target_type` + metadata `institution_id` (id only).

Existing actions: `organization_verified`, `veterinary_verified`, `user_type_changed`, `account_deleted`, `data_exported`, `occurrence_validated`.

**Additive** enum values (when persist wave allows — do not silently rewrite the freeze list until schema docs are updated in the same PR): e.g. `institution_verified`, `institution_suspended`, `case_routed`, `case_assigned`, `membership_role_changed`, `integration_toggled`. Until then, use existing `action` plus `target_type` / metadata keys.

Minimum events already required by LGPD checklist: verify org/vet, role/`verified`/`isRescuer` changes, `DeleteAccount`, `ExportAnonymizedData`, `ValidateOccurrence`.

---

## Append-only case tables

These are **not** substitutes for `audit_logs`; they are the case timeline.

### `case_status_history`

| Field | Notes |
|---|---|
| `case_id` | |
| `from_status` / `to_status` | Internal machine |
| `actor_id` | Nullable system |
| `note` | Non-PII, optional |
| `created_at` | Never update/delete rows |

### `case_assignments`

| Field | Notes |
|---|---|
| `case_id` | |
| `from_user_id` / `to_user_id` | Nullable |
| `from_team_id` / `to_team_id` | Nullable |
| `actor_id` | Who assigned |
| `created_at` | Append-only |

`case_routing` is the same idea for institution hops ([case-routing.md](../domains/case-routing.md)).

**No UPDATE** of historical rows. Corrections = new row + optional `audit_logs` note.

---

## What to log

| Event class | Where | What to store |
|---|---|---|
| Auth-sensitive | `audit_logs` | Password reset requested (not the token), account delete |
| Verification | `audit_logs` | Org/clinic/institution status transitions |
| Authorization | `audit_logs` | Role/membership/`verified`/`is_rescuer` changes |
| Occurrence validate | `audit_logs` | As today |
| Case status | `case_status_history` + optional `audit_logs` for unusual jumps | from/to, actor, case id |
| Assignment | `case_assignments` | ids only |
| Routing / forward | `case_routing` | institution ids, reason enum |
| Export | `audit_logs` `data_exported` | purpose, period, classification, row count — not the CSV |
| Integration toggle | `audit_logs` | connection id, new status |

Pattern: **who** → **action** → **resource** → **timestamp** → previous/new **status ids** → **institution id**.

---

## What never to log

| Forbidden in `metadata`, history notes, notification payloads |
|---|
| Passwords, password hashes |
| Access/refresh tokens, OTP codes, `claimToken` plaintext |
| Full tax ids / CNPJ in combination with name+address |
| Full exact coordinates + identity |
| Verification document binaries or data-URLs |
| Internal comment **bodies** that include reporter PII (store comment id instead) |
| API keys, webhook secrets |

[schema-evolution.md](../database/schema-evolution.md): “No secrets / full PII in `AuditLog.metadata` or `Notification.payload`”.

---

## Retention

- `audit_logs` and case history are **append-only** and outlive a user’s soft-delete for accountability, but must not keep leftover login PII in metadata.
- After `DeleteAccount`, actor display becomes “deleted user” / null actor; target user PII purged at T+90d per checklist.
- Integration logs may be shorter (operational). Do not use them as the legal audit trail.

---

## Institutional UI

Future `AuditLog` viewer in [institution-dashboard.md](../features/institution-dashboard.md) settings: filter by actor, action, case, period. `READ_ONLY` may view if permitted; never show raw metadata that violates the forbid list.

---

## Current vs future

| Current | Future |
|---|---|
| `audit_logs` + occurrence validate / verify org | Same table + case/institution actions |
| No case history tables | Append-only status + assignment + routing |
| Docs-only Prisma | Nest writes from identity / case / analytics |

---

## Decision log

- Reuse `audit_logs`; do not split a second audit store.
- Case status and assignment history are append-only operational logs that feed the timeline.
- Never log passwords, tokens, or full PII in metadata or notes.
- Export and verification remain first-class audit actions as in the LGPD checklist.
