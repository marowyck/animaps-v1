# ANIMAPS — Design system

Source of truth for visual tokens used in `apps/web`. Implementation: [`apps/web/src/app/globals.css`](../../apps/web/src/app/globals.css). Landing brief: [landing-design-brief.md](./landing/landing-design-brief.md). Components: [components.md](components.md).

**Identity:** modern, trustworthy, animal-care — **not** childish, **not** a visual clone of dating apps.

---

## Color tokens

| Token | Role |
|---|---|
| `--gray-soft` / `--background` | Page background (mint-cream) |
| `--ink` / `--foreground` | Primary text |
| `--ink-muted` | Secondary text |
| `--white` | Surfaces / cards |
| `--border-soft` | Borders |
| `--brand-pink` (+ `-hover`) | Primary CTA |
| `--brand-green` (+ `-hover`) | Secondary / success-adjacent |
| `--brand-blue` (+ `-hover`) | Accent |
| `--brand-yellow` / `--brand-purple` | Accents |
| `--pastel-*` | Soft surfaces only (not body text) |
| `--success` → `--color-success` | Success feedback (aliases brand-green) |
| `--warning` → `--color-warning` | Warning feedback |
| `--error` → `--color-error` | Error feedback |

Use Tailwind theme aliases (`bg-brand-pink`, `text-ink`, `border-border-soft`, `text-success`, …). Avoid hardcoded hex in components.

---

## Typography

| Use | Token / font |
|---|---|
| Display titles | `--font-display` (Bagel Fat One) via `.font-display` |
| Body / UI | `--font-sans` (Nunito) |

Weights 400–800 for Nunito. Prefer `text-ink` / `text-ink-muted` for contrast.

---

## Radii & spacing

| Token | Value |
|---|---|
| `--radius-sm` | 1rem |
| `--radius-md` | 1.5rem |
| `--radius-lg` | 2.5rem |

Buttons and pills are typically `rounded-full`. Cards use `rounded-3xl` / `--radius-md`–`lg`. Spacing follows Tailwind scale (4/8/12/16/24…).

---

## Elevation

Soft shadows for CTAs and cards (e.g. pink CTA shadow on `Button` `sm`). Prefer tokenized shadow utilities over ad-hoc values when adding new surfaces.

---

## Component states

Every interactive surface should consider:

| State | Guidance |
|---|---|
| Default | Brand or surface tokens |
| Hover | Darken fill / border (`*-hover`) |
| Focus | `focus-visible:outline` with brand-pink |
| Selected | Strong border + pastel fill or brand fill |
| Disabled | `opacity-60` + `cursor-not-allowed` |
| Loading | Spinner / skeleton + `aria-busy` |
| Empty | `EmptyState` with short copy + optional CTA |
| Error | `text-error` / toast `error` |
| Success | `text-success` / toast `success` |
| Pending | Neutral badge / muted copy |

---

## Motion

- GSAP + Lenis on marketing; respect `prefers-reduced-motion`.
- Product onboarding: short, purposeful transitions; no motion required for correctness.

---

## Accessibility

- AA contrast for text/CTA on solid fills; pastels for backgrounds only.
- Visible focus rings on all interactive controls.
- Labels / `aria-*` on inputs (`CodeInput`, search, etc.).
- Keyboard: tab order, Enter/Space on cards, arrow keys where natural (OTP digits).
- Toasts for transient outcomes ([ui-patterns.md](ui-patterns.md)).

---

## Responsiveness

Mobile-first. Dashboard: bottom nav on small screens; sidebar from `md`/`lg` up.

---

## Decision log

- Formalized `--color-success|warning|error` as named aliases so docs and code share vocabulary without inventing a second palette.
- Product UI reuses landing brand tokens for continuity.
