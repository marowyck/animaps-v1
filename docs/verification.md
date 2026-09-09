# ANIMAPS — Verification

Trust signals after (or during) onboarding. v1 focuses on **human presence** (selfie) for PERSON and a **placeholder institutional** path for ONG / veterinary clinics. Not invasive facial recognition / biometric identification.

Related: [onboarding.md](onboarding.md) · [database.md](database.md) · [profiles.md](profiles.md) · [authentication.md](authentication.md) · [permissions-matrix.md](permissions-matrix.md).

**Source:** `features/onboarding/components/VerificationFlow.tsx` (primary) · `features/verification/` (mock helper + legacy export).

---

## Modes

| Mode | User types | UX (current) | Future |
|---|---|---|---|
| `selfie` | `PERSON` | Device camera (`getUserMedia`, user-facing) → mock analyze → status | Private storage + provider webhook |
| `institutional` | `ONG`, `VETERINARY_CLINIC` | Document-submit placeholder → `pending` / `processing` | Document upload + manual/admin verify → set profile `verified` |

`VerificationFlow` infers mode from `userType` when `mode` is omitted.

OTHER flow currently **omits** verification (ends after additional-info).

---

## Status enum

Shared by selfie and institutional drafts / Wave 2 `verification_requests.status`:

| Status | Meaning |
|---|---|
| `pending` | Not started or awaiting review |
| `processing` | Analyzing / under review |
| `approved` | Passed |
| `rejected` | Failed policy / quality |
| `retry_required` | Ask for a new capture / documents |

UI: `VerificationStatusBadge`.

---

## Soft gate

Users may reach dashboard / discover with non-approved status. Privileged domain actions (create animal, etc.) later require `organization_profiles.verified` / `veterinary_profiles.verified` or selfie-approved flags as defined in the permissions matrix — **not** client-only checks.

---

## Persistence (Wave 2)

Table `verification_requests` with `kind` ∈ `selfie` \| `institutional` — see [database.md](database.md). Do not store invasive biometric templates.

---

## Privacy & security

- Media private; short-lived URLs.
- Do not expose verification media on public profiles by default.
- Audit sensitive status changes ([bounded-contexts.md](bounded-contexts.md)).

---

## Decision log

- One `VerificationFlow` component with a mode prop — no second feature tree for clinics/NGOs.
- Institutional path is explicitly a stub so product/legal can plug a provider without rewriting onboarding.
- Out of scope: emotion detection, silent cross-user face matching.
