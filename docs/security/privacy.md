# ANIMAPS — Privacy (ecosystem layer)

Privacy architecture for cases, institutions, and sharing. Wave 2 location rounding, occurrence aggregates, and consent fields remain in [database.md](../database/overview.md), [lgpd-checklist.md](lgpd-checklist.md), and [privacy-policy-draft.md](privacy-policy-draft.md).

Related: [cases.md](../domains/cases.md) · [case-routing.md](../domains/case-routing.md) · [institutions.md](../domains/institutions.md) · [government.md](../domains/government.md) · [audit.md](audit.md) · [security.md](security.md) · [profile.md](../domains/profiles.md).

**LGPD posture:** the architecture is **prepared** (minimize, purpose, access control, retention, anonymization, audit). **Legal review is required** before go-live. Controller / DPO are still TBD. This document does not claim compliance and does not invent legal bases beyond the hypotheses in the LGPD checklist.

---

## Every read should ask

| Question | Stored / enforced as |
|---|---|
| Who created it? | `reporter_id` / `organization_id` / actor on audit |
| Who may view / edit? | RBAC + classification + membership |
| Which institution? | `institution_id` + `institution_access` |
| Which purpose? | Policy + consent flags |
| Which retention? | Account 90-day purge after delete; case public-interest rules |
| Which privacy level? | `data_classification`, `reporter_visibility`, location `precision` |

Privacy by default: fail closed when flags are missing.

---

## Data classification

Attaches to cases (and optionally attachments/locations):

| Level | Typical use |
|---|---|
| `PUBLIC` | Citizen-visible facts already meant for a public map (coarse) |
| `INTERNAL` | Institution staff default |
| `RESTRICTED` | Need-to-know teams |
| `CONFIDENTIAL` | Reporter identity, investigation notes |
| `SENSITIVE` | High-harm (e.g. hoarding with identifiable household, illegal activity) |

Guards: permission + classification ≥ viewer clearance. Do not rely on “hidden nav”.

PERSON profile field visibility (`public` / `matches` / `private`) stays on `user_profile_fields` ([profile.md](../domains/profiles.md)) — a different axis from case classification.

---

## Reporter visibility

What the **receiving institution** sees about the person, independent of whether ANIMAPS stored `reporter_id` internally (anti-abuse).

| Value | Institution |
|---|---|
| `PUBLIC` | Identity allowed under classification |
| `RESTRICTED` | Partial (e.g. neighborhood, not name/email) |
| `CONFIDENTIAL` | Only cleared roles |
| `ANONYMOUS` | No identity in the institution UI |

Citizens still see only coarse public status ([cases.md](../domains/cases.md)). Internal comments never follow reporter visibility outward.

---

## Location precision

| `precision` | Store / display |
|---|---|
| `EXACT` | Full coordinates — only when needed and authorized |
| `APPROXIMATE` | Same order as Wave 2 `user_locations` (~100 m / `Decimal(8,3)`) |
| `CITY` | City centroid / label only |
| `REGION` | Broader than city |
| `HIDDEN` | No map point; staff may still see city if classified internal |

Wave 2 freeze: precise GPS is **never** stored on `user_locations`; occurrences keep precise PostGIS **and** `city` / `neighborhood` for LGPD-safe aggregates. Case maps/exports must not combine precise geo + time + identity. Public heatmaps use grid/cluster/city.

---

## Anonymous reports (institution policy)

Anonymous intake is **not** global.

- Platform may allow account-less create (as occurrences do).
- Each institution sets `institution_report_policies.anonymous_reports`.
- Router skips bodies that refuse anonymous when the case is anonymous ([case-routing.md](../domains/case-routing.md)).
- Do not assume every prefeitura accepts anonymous denunciations.

---

## Minimize, purpose, access, retention, anonymization, audit

| Principle | Ecosystem application |
|---|---|
| **Minimize** | Collect registration fields listed in [institutions.md](../domains/institutions.md); do not copy clinic client charts into a case |
| **Purpose** | Case handling, routing, aggregates, security — not secondary marketing |
| **Access control** | RBAC + classification + verified institution ([roles-and-permissions.md](../domains/roles-and-permissions.md)) |
| **Consent** | Signup `lgpdConsent`; geo/photo consent on report submit (checklist); extra consent for clinic client share |
| **Retention** | Active while needed; `DeleteAccount` 90-day PII purge; collective-interest cases may remain without author PII ([lgpd-checklist.md](lgpd-checklist.md)) |
| **Anonymization** | Exports/dashboards: neighborhood/city + type/period |
| **Audit** | Sensitive views/exports/status ([audit.md](audit.md)) |
| **Removal** | Soft-delete user; unlink `reporter_id` where the case remains |
| **Privacy by default** | Public maps coarse; comments internal by default |

---

## Sharing from NGOs / clinics

No automatic share. `data_visibility` + `institution_access` + purpose. Veterinary private client data stays in the clinic context unless a lawful, consented extract exists.

---

## Public API / listings

[api.md](../api/overview.md) `PublicUser` omit list still applies (no `passwordHash`, tokens, others’ tax ids, raw location on public occurrence lists). Case public payloads follow the same spirit: reference number, public status, coarse location, no internal comments.

---

## Current vs future

| Current | Future |
|---|---|
| Profile `PrivacySelector`; occurrence public without author PII | Classification + reporter_visibility + precision on cases |
| Checklist hypotheses for legal bases | Named controller + reviewed policy (`v1-draft` bump) |

---

## Decision log

- Classification, reporter visibility, and location precision are first-class fields so reads are consistent.
- Anonymous reports are an institution policy, not a platform slogan.
- LGPD: architecture prepared; legal review required; no compliance claim.
- Wave 2 geo/export rules (city/neighborhood aggregates, no raw lat/lng in public export) extend to Case analytics.
