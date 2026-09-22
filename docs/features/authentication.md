# ANIMAPS — Authentication (frontend)

Email verification and relation to existing `/register` + `/login`. Backend auth design remains in [architecture.md](../architecture.md) and [bounded-contexts.md](../architecture/bounded-contexts.md) (`identity`).

Related: [user-flow.md](user-flow.md) · [onboarding.md](onboarding.md) · [user-types.md](../domains/user-types.md) · [ui-patterns.md](ui-patterns.md).

---

## Routes

| Route | Role |
|---|---|
| `/register` | Two-step create-account UI; step 1 collects the account type via `AccountTypeSelector` + waitlist lead |
| `/login` | Login UI placeholder |
| `/verify-email` | 6-digit email OTP, inside `AuthSplitLayout` |

Query: `/verify-email?email=user@example.com`. Without an email, the form asks the person to go back to login. It does not invent an address.

**Single auth path for all user types** — do not fork register/login per type. `userType` only selects the post-verify onboarding flow.

---

## Screen — verify email

**Copy (intent):** “Enter your code” · preview for {email}, no email is sent · any 6 digits except `000000`.

### UI

Same chrome as login and register: carousel on large screens, locale menu, form column. No second header.

- Back link to `/login`
- `CodeInput` (6 cells) inside a form, so Enter submits
- Resend with cooldown counter
- Continue (enabled when 6 digits are present)
- Copy states that this is a preview: no email is sent

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
| Send code | No email. Resend only clears the field and shows an info toast | Email provider + hashed token |
| Verify | Accept any 6 digits; reject `000000` | Consume `email_verification_tokens` |
| Expiry | Copy explains the demo rule. There is no 10-minute timer | Server `expires_at` |
| Login password | Not checked. Toast says so before the code screen | Credential check |
| Rate limit | Resend cooldown (~45s) UI-only | IP/user rate limits |
| Session | None | JWT + refresh |

---

## Security notes (design)

- Never log plaintext codes in production.
- Store only hashes server-side ([data-dictionary.md](../database/data-dictionary.md)).
- Cooldown + CAPTCHA later for spam prevention.
- Frontend validates format only; server is source of truth.

---

## Decision log

- Flat `/verify-email` route (consistent with `/login`).
- Demo codes documented for QA without a mailer.
- Success always routes into onboarding guidelines gate.
- Register step 1 selects the account type (shared auth); type only affects onboarding/dashboard afterward.
