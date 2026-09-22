# ANIMAPS — Authentication (frontend)

Email verification and relation to existing `/register` + `/login`. Backend auth design remains in [architecture.md](architecture.md) and [bounded-contexts.md](bounded-contexts.md) (`identity`).

Related: [user-flow.md](user-flow.md) · [onboarding.md](onboarding.md) · [user-types.md](user-types.md) · [ui-patterns.md](ui-patterns.md).

---

## Routes

| Route | Role |
|---|---|
| `/register` | Two-step create-account UI; step 1 collects `UserType` via `UserTypeSelector` + waitlist lead |
| `/login` | Login UI placeholder |
| `/verify-email` | 6-digit email OTP |

Query: `/verify-email?email=user@example.com` (optional; falls back to draft / placeholder).

**Single auth path for all user types** — do not fork register/login per type. `userType` only selects the post-verify onboarding flow.

---

## Screen — verify email

**Copy (intent):** “Enter your code” · “We sent a one-time code to {email}” · “Expires in 10 minutes.”

### UI

- Back + close (`IconButton`)
- Brand wordmark text (no forced logo asset yet)
- `CodeInput` (6 cells)
- Resend with cooldown counter
- Continue (enabled when 6 digits present)

### States

| State | Behavior |
|---|---|
| `idle` / awaiting | Empty or partial code |
| `incomplete` | Continue disabled |
| `validating` | Loading on continue |
| `invalid` | Toast error; fields keep value / shake optional |
| `expired` | Toast / inline; force resend |
| `resending` | Resend disabled + spinner |
| `success` | Toast + navigate to `/onboarding/guidelines` |

### CodeInput behavior

- Auto-focus next on digit
- Backspace moves to previous when empty
- Paste full 6-digit code into all cells
- `inputMode="numeric"` / pattern digits
- Accessible group label

---

## Current (mock) vs future

| Concern | Current | Future (Nest `identity`) |
|---|---|---|
| Send code | Client mock delay | Email provider + hashed token |
| Verify | Accept any 6 digits **or** demo code `123456`; reject `000000` as invalid demo | Consume `email_verification_tokens` |
| Expiry | Client timer messaging (10 min copy) | Server `expires_at` |
| Rate limit | Resend cooldown (~45s) UI-only | IP/user rate limits |
| Session | None | JWT + refresh |

---

## Security notes (design)

- Never log plaintext codes in production.
- Store only hashes server-side ([data-dictionary.md](data-dictionary.md)).
- Cooldown + CAPTCHA later for spam prevention.
- Frontend validates format only; server is source of truth.

---

## Decision log

- Flat `/verify-email` route (consistent with `/login`).
- Demo codes documented for QA without a mailer.
- Success always routes into onboarding guidelines gate.
- Register step 1 selects `UserType` (shared auth); type only affects onboarding/dashboard afterward.
