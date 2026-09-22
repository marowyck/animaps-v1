# UI patterns — toasts, language, auth forms

Shared interaction patterns for `apps/web` (English source of truth).

Keep this document aligned with:

- [`landing-content-brief.md`](./landing/landing-content-brief.md)
- [`landing-design-brief.md`](./landing/landing-design-brief.md)
- [`landing-tech-plan.md`](./landing/landing-tech-plan.md)

---

## Toasts

**Any outcome the user must notice** (error, success, warning, info) **must use a toast** — never an inline status paragraph that permanently occupies form layout.

Examples: form validation failures (“password doesn’t meet requirements”), missing required profile fields, submit success, Google sign-in coming soon, soft login-not-ready notices.

### Placement & look

- Stack in the **bottom-right** of the viewport (`fixed`, above chrome).
- Newest toasts appear nearest the corner; older ones stack upward.
- Vertically **center** icon, message, and dismiss control (`items-center`).
- Each toast shows a **Lucide icon** (not emoji) for the tone:

  | Tone | Icon | Use for |
  | --- | --- | --- |
  | `info` | `Info` | Soft notices, “coming soon” |
  | `success` | `CircleCheck` | Completed actions |
  | `error` | `CircleX` | Validation / request failures |
  | `warning` | `CircleAlert` | Caution that isn’t a hard failure |

- **Motion:** swipe in from the right on enter; swipe out to the right on dismiss (CSS transform + opacity, ~260–280ms).
- Keep messages **one short sentence**.
- Auto-dismiss after ~4s; user can dismiss early (same exit animation).
- Cap the visible stack (latest few) so the viewport stays clean.

### Rules

- Prefer **toasts** over inline alerts for submit outcomes and blocking-but-transient feedback.
- Default tone: `info`. Choose `success` / `error` / `warning` when the outcome is clear.
- Live **guidance** may stay in the form (e.g. password requirement checklist that updates as the user types). The **result** of that check on submit still goes to a toast.

### Implementation

- Provider: [`apps/web/src/components/Toast.tsx`](../../apps/web/src/components/Toast.tsx) (`ToastProvider` + `useToast`).
- Wired in [`apps/web/src/app/providers.tsx`](../../apps/web/src/app/providers.tsx) inside `LocaleProvider` so copy can use `useT()`.
- Call site example:

```ts
const { toast } = useToast();
toast({ message: t.auth.googleSoon, tone: "info" });
toast({ message: t.auth.register.errors.passwordWeak, tone: "error" });
toast({ message: t.form.success, tone: "success" });
// or
toast("Saved");
```

### Do not use toasts for

- Legal / consent copy that must remain on screen.
- Long help text (use a dedicated panel or FAQ).
- Persistent field chrome that isn’t an event (labels, placeholders, live requirement checklists).

---

## Language menu

Locale switching supports growth beyond PT / EN / ES.

- **Menu variant** (`LocaleSwitcher variant="menu"`): trigger shows localized **“Language” / “Idioma”** label + `Languages` icon; dropdown lists full names from `LOCALE_NAMES` (plus short codes). Used on auth pages, header bubble menu, and footer.
- **Pills variant** (`variant="pills"`): legacy compact `PT | EN | ES` segments — still available if a dense chrome needs it.
- Adding a locale: extend `LOCALES`, `LOCALE_LABELS`, `LOCALE_NAMES`, message catalogs, and `HTML_LANG` in [`apps/web/src/i18n/`](../../apps/web/src/i18n/). No URL prefixes.

---

## Header account CTAs

On the public landing Header frosted cluster (left → right):

1. **Log in** — `Button` `white` / `sm` → `/login`
2. **Create account** — `Button` `pink` / `sm` → `/register`
3. Soft green menu toggle (BubbleMenu)

Do not rely on the bubble menu alone for Log in / Create account — both actions stay visible in the chrome.

---

## Register password rules (client)

`/register` is **two steps**:

1. Profile + LGPD (`WaitlistForm` `onContinue`) — validation failures → error toast; Google CTA → info toast.
2. Password + confirm — then waitlist submit for the profile lead.

Step indicator: compact **`{current}/2` pill** to the right of the title (accessible label still describes “Step n of 2”).

Strong password before submit:

- Minimum **8** characters
- At least one **uppercase** letter (`A–Z`)
- At least one **special** character (any non-alphanumeric)

Show a live checklist next to the fields. On submit, weak / mismatch / missing password feedback uses an **error toast**. Implementation: [`passwordValidation.ts`](../../apps/web/src/features/auth/passwordValidation.ts).

Password is validated in the UI only today — **not** persisted by `/api/waitlist` until real auth ships.

---

## Password reveal toggle

Password fields on `/register` (step 2) and `/login` use `Input` with `revealable`:

- Lucide `Eye` / `EyeOff` (no emoji)
- i18n aria labels: `t.auth.showPassword` / `t.auth.hidePassword`
- Toggle lives outside the `<label>` control association so clicks do not double-fire

Implementation: [`apps/web/src/components/Input.tsx`](../../apps/web/src/components/Input.tsx).

---

## Auth form chrome

- Split layout: image carousel + white form column (`features/auth/`)
- **No** ANIMAPS logo / brand mark in the form column (language menu only in the top bar)
- Google button label + icon are **centered**
- Compact inputs may be slightly larger in auth (`compact` + form `max-w-lg`)

---

## Related

- [`landing-tech-plan.md`](./landing/landing-tech-plan.md)
- [`landing-design-brief.md`](./landing/landing-design-brief.md)
- [`landing-content-brief.md`](./landing/landing-content-brief.md)
