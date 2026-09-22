# ANIMAPS — Security (ecosystem layer)

Security design for multi-membership identity, institution verification, and Case. Canonical auth contract remains [authentication.md](../features/authentication.md), [architecture.md](../architecture.md), and [api.md](../api/overview.md) (Wave 2 freeze).

Related: [roles-and-permissions.md](../domains/roles-and-permissions.md) · [institutions.md](../domains/institutions.md) · [audit.md](audit.md) · [privacy.md](privacy.md) · [integrations.md](../features/integrations.md) · [lgpd-checklist.md](lgpd-checklist.md).

---

## Individual logins (no shared institutional accounts)

| Do | Do not |
|---|---|
| One `users` row per person (email/OAuth) | Password “prefeitura@…” shared by the whole department |
| `institution_members` / `organization_members` for work context | Impersonation without audit |
| Invite + own password reset | Print the org password in a SOP |

João authenticates as João, then acts as ANALYST of institution X. Revoke membership without deleting the PERSON account.

Same rule as Wave 2: one register/login/verify path for all types ([authentication.md](../features/authentication.md)).

---

## Authentication (link to auth docs)

Wave 2 freeze — do not contradict:

| Item | Rule |
|---|---|
| Access token | ~15 min JWT **in memory** (web and mobile) |
| Refresh (web) | httpOnly cookie `animaps_refresh` (Secure, SameSite=Lax, path `/auth`) |
| Refresh (mobile) | Secure Store; `POST /auth/refresh` body |
| At rest | **Hash only** for refresh, email verify, password reset ([data-dictionary.md](../database/data-dictionary.md)) |
| Passwords | `users.password_hash` only — **never** on `waitlist_entries` |
| Google | `auth_identities`; app rule: hash **or** ≥1 identity |
| OTP | Never log plaintext codes in production ([authentication.md](../features/authentication.md)) |

Forgot-password always 204 (no email enumeration). Do not put refresh in `localStorage`.

---

## RBAC

Authorization = permission keys in the **active** context (platform role ∪ org/institution membership), plus Wave 2 resource rules (`verified`, `isRescuer`, ownership). See [roles-and-permissions.md](../domains/roles-and-permissions.md) and [permissions-matrix.md](permissions-matrix.md).

UI `hasPermission` is not a security boundary.

---

## Verification gates

| Actor | Gate |
|---|---|
| Institution | `verification_status = APPROVED` before inbox, official response, being a routing target |
| ONG / clinic | `organization_profiles.verified` / `veterinary_profiles.verified` (and mirrored `organizations.verified` later) before `CreateAnimal` |
| PERSON create animal | `is_rescuer` — not set by current onboarding |
| Soft gate | Dashboard access with pending verification is allowed; privileged APIs are not |

Documents via `verification_requests`; do not store invasive biometric templates ([verification.md](../features/verification.md)).

---

## Rate limits

| Surface | Intent |
|---|---|
| Waitlist / register / login | IP rate limit ([api.md](../api/overview.md)) |
| Verify-email resend | ~45s cooldown; server-side when Nest ships |
| `CreateOccurrence` (anon) | IP limit — infrastructure, Phase 4 in matrix |
| Case create (anon) | Same class of limit when Case API exists |
| Export / analytics | Permission + audit; throttle heavy exports |
| Integration webhooks | Signed + rate-limited when built |

CAPTCHA later for spam ([authentication.md](../features/authentication.md)).

---

## Audit metadata: no secrets

`audit_logs.metadata` must **not** contain passwords, tokens, OTP codes, raw card data, or full PII dumps (tax id, exact address + name together). Store ids, status transitions, classification, institution id. Same rule as [schema-evolution.md](../database/schema-evolution.md) checklist and [audit.md](audit.md).

---

## API / integrations (future)

- Institution API keys hashed at rest (like refresh tokens)
- Least privilege per `integration_connections`
- No government credentials in frontend env (`NEXT_PUBLIC_*` stays non-secret)

---

## Current vs future

| Current | Future |
|---|---|
| Mock verify-email; waitlist without password persist | Nest identity as freeze |
| UI permissions only | Nest guards + RBAC context |
| No institution members | Individual logins + membership |

---

## Decision log

- No shared institutional accounts — membership + individual auth only.
- Token hashing and session rules stay the Wave 2 auth docs; this file does not invent a second session design.
- Verification is a hard gate for institution capabilities; soft gate for entering the app.
- Rate limits on public write paths; audit never stores secrets or full PII.
