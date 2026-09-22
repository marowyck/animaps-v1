# ANIMAPS — HTTP API contract (Wave 2)

Target surface for `apps/api` (NestJS). Clients (`apps/web`, later mobile) never talk to Postgres.

Related: [architecture.md](../architecture.md) · [database.md](../database/overview.md) · [bounded-contexts.md](../architecture/bounded-contexts.md) · [authentication.md](../features/authentication.md) · [permissions-matrix.md](../security/permissions-matrix.md) · [overview.md](../domains/overview.md) · [cases.md](../domains/cases.md).

**Status:** Wave 2 scaffold started — Nest `apps/api` exposes `GET /health` and `POST /marketing/waitlist` (Prisma). Identity auth routes below are still contract-only until implemented. Adoption / occurrence routes land later.

See also: [`apps/api/README.md`](../../apps/api/README.md).

---

## Conventions

| Item | Rule |
|---|---|
| Base URL | `NEXT_PUBLIC_API_BASE_URL` (web) / `EXPO_PUBLIC_API_BASE_URL` (mobile) |
| Format | JSON, `camelCase` keys |
| Errors | `{ "error": { "code": "string", "message": "string" } }` — `message` is a stable code or English; UI maps via i18n |
| Auth header | `Authorization: Bearer <accessToken>` |
| Access token | ~15 min JWT in **memory** (web and mobile) |
| Refresh token | **Web:** httpOnly cookie `animaps_refresh` (Secure, SameSite=Lax, path `/auth`). **Mobile:** Secure Store; sent as `POST /auth/refresh` body `{ refreshToken }` |
| CORS | Web origin only; `credentials: true` for cookie refresh |
| IDs | UUID strings |
| Pagination | Cursor: `?cursor=&limit=` (default 20, max 50) |

Do not put the refresh token in `localStorage`.

---

## Waitlist vs register (phased)

| Phase | `POST /marketing/waitlist` | `POST /auth/register` |
|---|---|---|
| **Now (Phase 1 web)** | Lead only. Next `POST /api/waitlist` still present (cutover pending). | Does not exist |
| **Wave 2 API** | Nest `marketing` + Prisma `WaitlistEntry` (live when DB migrated). Rate-limit TBD. | Not implemented yet (`GET /auth/status` stub) |

`/register` UI copy stays “criar conta”; storage stays waitlist until `POST /auth/register` ships.

---

## Marketing

### `POST /marketing/waitlist`

Public. Rate limit by IP.

**Body**

```json
{
  "name": "string",
  "email": "string",
  "profileType": "person | ong | veterinary_clinic | other",
  "city": "string | null",
  "state": "string | null",
  "lgpdConsent": true,
  "privacyPolicyVersion": "v1-draft"
}
```

**201** `{ "ok": true }`  
**409** email already on waitlist (idempotent success is also acceptable — pick one in implementation and keep it).

Never accept `password`.

---

## Identity — auth

### `POST /auth/register`

Public. Rate limit by IP.

**Body:** name, email, password, `userType` (`person` \| `ong` \| `veterinary_clinic` \| `other`), `lgpdConsent: true`, `privacyPolicyVersion`.

**201:** `{ "user": PublicUser, "accessToken": "string" }` + Set-Cookie refresh (web).  
Sends verify-email (hashed token). `status` starts `pending_verification` until `emailVerifiedAt` is set.

### `POST /auth/login`

**Body:** `{ "email", "password" }`  
**200:** `{ "user": PublicUser, "accessToken" }` + refresh cookie.

### `POST /auth/refresh`

Cookie (web) or `{ "refreshToken" }` (mobile). Rotates refresh (hash new, revoke old).  
**200:** `{ "accessToken" }`.

### `POST /auth/logout`

Revokes current refresh. Clears cookie.

### `POST /auth/verify-email`

**Body:** `{ "email", "code" }` (or token). Consumes `email_verification_tokens`. Sets `emailVerifiedAt`, `status = active`.

### `POST /auth/verify-email/resend`

Rate limited. Cooldown ~45s.

### `POST /auth/password/forgot` · `POST /auth/password/reset`

Hash-only tokens. Forgot always returns 204 (no email enumeration).

### `GET /auth/me`

Bearer required. **200:** `PublicUser` + type-specific profile summary + onboarding completion flag.

### `POST /auth/google`

UI exists; implement when OAuth is enabled. Creates/links `auth_identities` (`provider = google`). App rule: `passwordHash` **or** ≥1 `auth_identities` row.

---

## Identity — onboarding

Bearer required. Partial upserts; skippable fields stay null / empty arrays.

### `PUT /me/onboarding`

Idempotent snapshot of the draft. Server validates against `userType` (ignore org blob on PERSON, etc.).

Maps 1:1 with [database.md](../database/overview.md) OnboardingDraft table. Suggested body groups:

```json
{
  "guidelinesAcceptedAt": "iso | null",
  "intentions": ["adopt"],
  "otherRole": "volunteer | null",
  "animalPreference": { "species": [], "sizes": [], "ages": [], "sex": [], "vaccination": [], "neutered": [], "specialNeeds": [], "compatibility": [], "energyLevel": [], "environment": [] },
  "interestIds": ["dogs"],
  "profileFields": [{ "fieldKey": "housing_type", "value": "apartment", "visibility": "matches" }],
  "organization": {},
  "veterinary": {},
  "location": { "permission": "granted | denied | not_requested", "city": null, "state": null }
}
```

**200:** `{ "ok": true, "next": "onboarding step id | done" }`.

### `POST /me/verification/selfie`

Multipart or `{ "mediaUrl" }` after client uploads to signed URL. Creates `verification_requests` `kind = selfie`.

### `POST /me/verification/institutional`

Placeholder metadata / document URLs. Does **not** set `verified` on the profile.

### `POST /me/verification/upload-url`

Returns a short-lived PUT URL for private object storage.

---

## `PublicUser` (never include)

Omit: `passwordHash`, all `tokenHash`, `claimTokenHash`, `taxId` / `companyTaxId` on **other** users’ public payloads, raw `location` on public occurrence lists (use city/neighborhood or fuzzed geo).

Include: `id`, `name`, `username`, `userType`, `avatarUrl`, `status`, `emailVerifiedAt`, `city`, `state` (own profile may include `email`).

---

## Later waves (not this freeze)

| Area | Examples |
|---|---|
| Adoption | `POST /animals`, `GET /animals`, `POST /animals/:id/adoptions`, favorites |
| Occurrence | `POST /occurrences` (anon allowed), `POST /occurrences/:id/claim`, `GET /occurrences/nearby` |
| Notifications | `GET /notifications`, `PATCH /notifications/:id/read` |

Anonymous occurrence: response includes **one-time** `claimToken` (plaintext). Store hash only. Client keeps the token to call `ClaimOccurrence` after login.

---

## Later: ecosystem (placeholders — not this freeze)

Do **not** implement these Nest routes now. Fase 3 ships a **web localStorage mock** (`/cases`, `/cases/new`, `/cases/[id]`, `/cases/claim`) aligned to this contract. Wave 2 identity + marketing + onboarding persist stays the freeze. Occurrence routes above remain a later API wave and are **not** deleted by Case.

| Area | Placeholder examples |
|---|---|
| Organizations | `GET/POST /organizations`, `GET/PATCH /organizations/:id`, `POST /organizations/:id/members` |
| Institutions | `GET/POST /institutions`, `GET/PATCH /institutions/:id`, departments / teams / members / jurisdictions |
| Cases | `POST /cases` (anon allowed), `GET /cases/:id`, `GET /me/cases`, `POST /cases/:id/claim` |
| Routing | `POST /cases/:id/route`, `GET /institutions/:id/inbox` |
| RBAC | `GET /roles`, membership role changes via org/institution member endpoints |
| Integrations | `GET/POST /institutions/:id/integrations` — generic only; no named government API |

Citizen-facing status must never claim delivery to a public agency unless a `case_routing` row exists ([case-routing.md](../domains/case-routing.md)). Contract details: [overview.md](../domains/overview.md) · [cases.md](../domains/cases.md) · [integrations.md](../features/integrations.md).

---

## Implementation notes

- Guards: `RolesGuard` + resource-owner + `verified` / `isRescuer` from [permissions-matrix.md](../security/permissions-matrix.md).
- Domain events (in-process): `UserRegistered`, `OrganizationVerified`, `VeterinaryVerified` — see [bounded-contexts.md](../architecture/bounded-contexts.md).
- Email: identity **publishes**; notifications/infra **sends**.
- Local DB: [docker-compose.yml](../../docker-compose.yml) (Postgres + PostGIS).

---

## Decision log

- Refresh cookie name `animaps_refresh`; access token never in a cookie (CSRF surface on mutations stays on refresh rotation + SameSite).
- Waitlist and register stay separate endpoints so Phase 1 can persist leads without pretending accounts exist.
- Onboarding is one upsert document, not a micro-endpoint per step — steps are a UI concern.
- Ecosystem org / institution / case / routing routes are **placeholders only** — not part of the Wave 2 freeze. Occurrence later-wave routes stay.
