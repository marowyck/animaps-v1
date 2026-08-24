# ANIMAPS — LGPD checklist (minimum)

Phase 0 artifact. Cross-check [`data-dictionary.md`](data-dictionary.md) and [`privacy-policy-draft.md`](privacy-policy-draft.md).

**Status:** product decisions closed; **controller not yet named** (blocking for public launch).

---

## 1. Controller / data controller

| Field | Value |
|---|---|
| Controller | **TBD** |
| Legal name | TBD |
| Contact email (data subjects) | TBD |
| DPO (if any) | TBD (may be same person initially) |

- [ ] Fill before go-live (landing email capture or real signup)
- [ ] Publish contact in privacy policy

---

## 2. Personal data inventory (PII)

| Data | Where | Sensitive? | Notes |
|---|---|---|---|
| `name` | `users` | yes | |
| `email` | `users` | yes | unique; login |
| `passwordHash` | `users` | yes | never expose via API |
| `phone` | `users` | yes | |
| `taxId` | `guardian_profiles` | yes | required only for adoption |
| `companyTaxId` | `ngo_profiles` / `clinic_profiles` | yes | |
| `location` (lat/lng) | `occurrences` | yes* | *geo needed — do not export raw |
| Photos (URL + EXIF) | object storage + refs | yes if identifiable | strip EXIF on upload (Phase 4) |
| IP / user-agent | anon occurrence rate-limit logs | yes | short log retention |
| Guardian preferences | `guardian_profiles` | yes | light behavioral profile |
| Waitlist lead | `WaitlistEntry` | yes | name, email, profile type, city |

Not personal by themselves: species, animal status, neighborhood aggregates.

---

## 3. Purposes × legal basis (product hypothesis)

| Purpose | Data | Basis (hypothesis) | Legal review? |
|---|---|---|---|
| Account & auth | identity | Contract / pre-contract + `lgpdConsent` | yes |
| Adoption matching | preferences + animal | Contract | yes |
| Geo occurrences + photos | location, photos, description | **Explicit consent** on submit | yes |
| Operational notifications | email / inbox | Legitimate interest or contract | yes |
| Analytics / aggregate export | neighborhood/city aggregates only | Public interest / legitimate interest (hypothesis) | **yes — required** |
| NGO/clinic verification | institutional docs | Contract / legal duty when applicable | yes |
| Waitlist | `WaitlistEntry` | Consent | yes |

---

## 4. Consent

Fields: `users.lgpdConsent` (boolean) + `users.lgpdConsentAt` (timestamp). Waitlist: consent + timestamp on `WaitlistEntry`.

**Signup (suggested microcopy):**

> By creating your account, you agree to processing of your data to operate ANIMAPS (account, adoption, and occurrence reports if you use them), per the Privacy Policy.

**Occurrence submit (suggested microcopy):**

> By submitting this occurrence, you authorize use of location and photos for response and map display. Photos may remain public in anonymized form if the occurrence is of collective interest.

- [ ] Require checkbox on signup (`lgpdConsent = true`)
- [ ] Specific consent on occurrence form (geo + photos)
- [ ] Store accepted policy version/date (future; MVP: timestamp)

---

## 5. Retention

| Situation | Policy |
|---|---|
| Active account | Keep while account exists |
| After `DeleteAccount` | **90 days** to full PII purge in DB + backups |
| Backups | Aligned: after 90 days, backups must not trivially restore deleted subject PII |
| Rate-limit / IP logs | Short (e.g. 30 days) — detail in implementation |
| Soft delete | Immediate `User.deletedAt` (account inaccessible); hard purge at T+90d |

---

## 6. Right to be forgotten (`DeleteAccount`)

### Remove / anonymize (PII)

- Account: email, name, phone, `passwordHash`, refresh tokens, `DevicePushToken`
- Profiles: `taxId`, `companyTaxId`, identifiable preferences
- User notifications
- Links: `occurrences.user_id` → `null` if occurrence remains
- Sessions / refresh tokens revoked immediately

### May remain (public interest / operations)

- Historical `Animal` / `Adoption` needed for platform ops (no deleted guardian PII in listings)
- Collective-interest `Occurrence`: record + photos in object storage
  - **Keep photos** if still relevant
  - **Strip author metadata** and identifiable EXIF; never list author name/email

### Purge job (Phase 2+)

- Soft-delete immediately (inaccessible)
- Hard purge PII at T+90 days

---

## 7. Anonymization in export / analytics / open data

**Closed rule:** public exports and dashboards use **neighborhood or city aggregation only** (plus type/period).

- Never export raw `location` (lat/lng)
- Never combine precise geo + time + identity
- Researchers (`public_agency` / `biologist`): same aggregates in MVP

---

## 8. Audit logs (minimum)

| Event | Why |
|---|---|
| `VerifyNgo` / `VerifyClinic` | Institutional decision |
| Role / `verified` / `isRescuer` changes | Authorization |
| `DeleteAccount` | Data-subject rights |
| `ExportAnonymizedData` | Data egress trail |
| `ValidateOccurrence` | Moderation |

Do not log password bodies, tokens, or full verification documents after processing.

---

## 9. Go-live blockers

- [ ] Controller and contact **named** (replace TBD)
- [ ] Privacy policy published and linked at signup / waitlist
- [ ] LGPD consent checkbox on signup
- [ ] Geo/photo consent on occurrence flow
- [ ] `DeleteAccount` flow tested
- [ ] 90-day purge job documented or implemented
- [ ] Export/analytics without lat/lng (neighborhood/city only)
- [ ] EXIF strip on image upload (Phase 4 — at least security checklist)
- [ ] Legal review of draft (recommended before scale)

---

## 10. Closed decisions (E0.6)

| Topic | Decision |
|---|---|
| Controller | Placeholder until pre-launch |
| Post-deletion retention | 90 days |
| Geo in export | Neighborhood/city aggregate only |
| Photos after deletion | Kept if public interest; no author metadata |
