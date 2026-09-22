# ANIMAPS — Design system

Source of truth for visual tokens used in `apps/web`. Implementation: [`apps/web/src/app/globals.css`](../../apps/web/src/app/globals.css). Landing brief: [landing-design-brief.md](./landing/landing-design-brief.md). Components: [components.md](components.md).

**Identity:** modern, trustworthy, animal-care — **not** childish, **not** a visual clone of dating apps.

---

## Color tokens

Brand hues stay the source of truth. Semantic names are the layer components should use, so a later dark theme can override one block without hunting hex.

| Token | Maps to | Role |
|---|---|---|
| `--primary` / `--color-primary` | `--brand-pink` | Primary action |
| `--primary-hover` | `--brand-pink-hover` | Primary hover |
| `--primary-soft` | `--pastel-pink` | Selected / soft primary surface |
| `--secondary` / `--color-secondary` | `--brand-green` | Secondary action, care, map intensity |
| `--secondary-hover` | `--brand-green-hover` | Secondary hover |
| `--secondary-soft` | `--pastel-green` | Soft secondary surface |
| `--surface` / `--color-surface` | `--white` | Cards and panels |
| `--surface-elevated` | `--white` | Same fill; elevation comes from shadow, not a new color |
| `--text` / `--color-text` | `--ink` | Primary text |
| `--text-secondary` | `--ink-muted` | Supporting text |
| `--text-muted` | mix of `--ink-muted` and `--gray-soft` | Captions |
| `--info` | `--brand-blue` | Information |
| `--success` | `--brand-green` | Success |
| `--warning` (+ `-soft`, `-border`) | amber mix on white | Warning banners (soft gate) |
| `--error` | red | Errors |

Legacy aliases still work: `--gray-soft` / `--background`, `--ink`, `--ink-muted`, `--white`, `--border-soft`, `--brand-*`, `--pastel-*`.

Tailwind utilities: `bg-primary`, `text-text`, `text-text-secondary`, `bg-surface`, `bg-warning-soft`, `border-warning-border`, `text-error`, plus the older `bg-brand-pink` / `text-ink`. Do not hardcode hex in components. GSAP color tweens should read `getComputedStyle` of these variables.

Dark mode is not implemented. `[data-theme]` is the intended override point for the semantic block only.

---

## Typography

| Use | Utility | Size token |
|---|---|---|
| Display | `.text-display` | `--font-size-display` |
| H1 | `.text-h1` | `--font-size-h1` |
| H2 | `.text-h2` | `--font-size-h2` |
| H3 | `.text-h3` | `--font-size-h3` |
| H4 | `.text-h4` | `--font-size-h4` |
| Body large | `.text-body-lg` | `--font-size-body-lg` |
| Body | `.text-body` | `--font-size-body` |
| Body small | `.text-body-sm` | `--font-size-body-sm` |
| Label | `.text-label` | `--font-size-label` |
| Caption | `.text-caption` | `--font-size-caption` |

Display, H1, and H2 use `--font-display` (Bagel Fat One). Everything else uses `--font-sans` (Nunito). Pair a size utility with a color utility (`text-text`, `text-text-secondary`). The document body uses `text-body text-text`.

Existing screens may still use raw Tailwind sizes. New and touched UI should use this scale.

---

## Radii & spacing

| Token | Value | Utility |
|---|---|---|
| `--radius-sm` | 1rem | `rounded-sm` (overrides Tailwind default) |
| `--radius-md` | 1.5rem | `rounded-md` |
| `--radius-lg` | 2.5rem | `rounded-lg` |
| `--radius-xl` | 2rem | `rounded-token-xl` |
| `--radius-2xl` | 3rem | `rounded-token-2xl` |
| `--radius-pill` | 9999px | `rounded-pill` or `rounded-full` |

`rounded-xl` / `rounded-2xl` / `rounded-3xl` keep Tailwind's default sizes on purpose. Do not remap them.

Spacing stays on the Tailwind 4px scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64…). Do not introduce one-off values like `13px`.

---

## Elevation

| Token | Use |
|---|---|
| `--shadow-sm` | Hairline lift |
| `--shadow-md` | Panels |
| `--shadow-lg` | Overlays |
| `--shadow-glow-primary` | Brand-tinted card shadow (How it works) |

Prefer these over new `rgba(...)` shadows. Keep elevation quiet: contrast, space, and surface do more than a heavy drop shadow.

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
- Shared motion kit is only `AnimatedContent` and `CurvedLoop`. Unused React Bits copies were removed.

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
- Semantic `--primary` / `--secondary` / `--surface` / `--text*` aliases sit on top of the existing pink/green brand. They do not replace it.
- Named type scale (`.text-display` … `.text-caption`) is the default for new UI.
- Unused landing leftovers (`PortalScene`, `FloatingDecor`, `OrganicBlob`) and unused `components/bits/*` were removed. `ogl` left with them.
