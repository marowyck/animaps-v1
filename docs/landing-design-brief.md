# Landing Page — Design Brief (Phase 1)

Visual identity and UX for the ANIMAPS institutional landing.  
Sources: Phase 1 decisions + visual design round + **post-feedback pivot** (base: `animaps-web/src`) + [`ANIMAPS_Roadmap.md`](../ANIMAPS_Roadmap.md) §1.3 + [`landing-content-brief.md`](landing-content-brief.md).

**Status:** **friendly / organic / multi-pastel** direction implemented in `apps/web` (no Figma).

---

## Pivot — friendly/organic direction (post-feedback)

**Why:** First implementation (editorial + Fraunces serif) felt too “newspaper”. Feedback: friendly, pastels, more animation, more modern — use `animaps-web/src` as base.

| Before (editorial) | After (friendly — `animaps-web` ref) |
|---|---|
| Fraunces + DM Sans | **Sour Gummy** (body) + **Oi** (display) |
| Single terracotta pastel | **Multi-pastel** palette (orange, blue, yellow, green, purple) + saturated CTAs/text |
| Sticky minimal header | **BubbleMenu** (logo pill + round button + bubble panel) |
| Sober split-text | GSAP timelines with `elastic.out` / `back.out` |
| Diagonal dividers | Organic SVG **Waves** |
| Line icons only | **`lucide-react`** in colored badges (custom composition — not loose generic) |
| Grain/noise | Subtle thematic SVG pattern (strokes/dots at 3%) |

**Personality:** welcoming / human + playful / modern (trustworthy; drop “newspaper” tone).

---

## 1. Visual goal

Convey **trust, warmth, and lightness** — modern, rounded, pastel-colored; human without childish; not AI-generic.

**Direction:** **friendly-organic** — rounded type (Sour Gummy + Oi), blob `border-radius`, waves, multi-pastel, bounce/elastic motion.

Primary audience: guardians and NGOs (balanced voice). Clinics get a dedicated card; public agencies a light mention.

**Implementation reference:** `animaps-web/src` (layout, motion, BubbleMenu, waves).

---

## 2. Visual identity

Final logo **does not exist yet**. Tokens in [`apps/web/src/app/globals.css`](../apps/web/src/app/globals.css).

### Palette guidelines

| Role | Tokens | Use |
|---|---|---|
| Neutral | `#F4F4F4` (`gray-soft`), `#333` (`ink`) | Page background, type |
| Saturated brand | orange `#F89D1C`, blue `#00A0E3`, yellow `#FFD400`, green `#68BC45`, purple `#92278F` | CTAs, icons, emphasis text |
| Pastel tints | `pastel-orange/blue/yellow/green/purple/sky` | Blobs, badges, section/card backgrounds |
| Dark (rhythm) | `#333` / `#1a1a1a` | Problem / SocialProof / Footer |

**AA contrast:** saturated on text/CTA; pastel on surfaces only. No dark-mode toggle.

### Typography

| Use | Font | Notes |
|---|---|---|
| Display / section titles | **Oi** (`--font-display`) | **Only** section `h1`/`h2` — never FAQ questions, labels, cards, or stats |
| Body / UI / FAQ / stats | **Sour Gummy** (`--font-sour-gummy`) | Weights 100–900; single friendly readable family |

### Logo

- [ ] Concept (ANIMAPS + map/animal symbol — avoid isolated paw cliché; prefer human+animal interaction when illustrating)
- [ ] Variants: horizontal (header pill), icon (favicon / OG)
- No dark mode this phase

---

## 3. Style and imagery

| Decision | Choice |
|---|---|
| Overall style | Friendly-organic (rounded, colorful, bounce) |
| Imagery | Real photos (stock); **blob** frame (organic `border-radius` + white border + soft shadow) |
| Hero video | No |
| Shadows | Soft on cards/CTAs (not pure flat) |
| Border-radius | `2rem`–`3rem` on cards; pills on buttons |
| Background texture | Subtle SVG (not grain) |
| Decor | Solid pastel blobs (blur/mix-blend on Hero) |
| Dividers | SVG **Wave** (default) |
| Iconography | `lucide-react` in colored circles/badges |

---

## 4. Layout and flow (mobile-first)

No Figma. Source of truth: this brief + code in `apps/web`.

### Header (BubbleMenu)

- Floating logo pill + round button (menu/X)
- Bubble panel with large links, slight rotation, pastel hover colors

### Footer

- Dark + wave on top; newsletter; link columns in distinct pastels

---

## 5. Visual components

### Design system (`apps/web/src/components/`)

Reusable primitives for the whole platform (not landing-only):

| Component | Role |
|---|---|
| `Button` | Pill CTA; variants `orange`/`blue`/`green`/`white`; prop `magnetic` (default `true`) |
| `Input` | Pill field (`rounded-full`, soft border, brand-orange focus) + label |
| `Select` | **Custom** dropdown (trigger + floating GSAP `back.out` panel, pastel options, check, keyboard/a11y) |
| `Checkbox` | Custom box (border → brand-orange fill + animated Check); native input `sr-only` |
| `AccordionItem` | Reusable disclosure (FAQ / future help) |

### Marketing (`apps/web/src/features/landing/`)

`Header` (BubbleMenu), `Hero`, `ProblemSection`, `SolutionSection`, `HowItWorks`, `AudienceCards`, `Differentials`, `SocialProofCarousel`, `FAQ`, `WaitlistForm`, `CookieBanner`, `Footer`, `OrganicBlob`, `SectionDivider` (wave).

### Form patterns

- **Dropdown:** never styled native `<select>` as final UI — use `Select`.
- **Checkbox:** never native `accent-*` alone — use `Checkbox`.
- **Buttons:** always `Button`; `magnetic={false}` in compact contexts (cookie banner, form submit).

### Scrollbar

- Global: thumb `brand-orange`, track `gray-soft`, thin (`scrollbar-width: thin` + webkit).
- Utility `.scrollbar-clean` for horizontal overflow (e.g. social-proof carousel).
- `scroll-padding-top: 6rem` on `html` for fixed BubbleMenu anchors.

---

## 6. Motion system

Intensity: **expressive and playful** (`back.out` / `elastic.out`), without competing with reading. Cursor: browser default. Lenis kept.

| Effect | Where | Tool |
|---|---|---|
| Entry timeline | Hero (text, blob pop, photo, CTA) | GSAP |
| Bubble menu open/close | Header | GSAP `back.out` |
| Scroll-in bounce | Cards / steps / stats / FAQ | ScrollTrigger + `back.out` |
| Select open/close | `Select` panel | GSAP `back.out` |
| Accordion height | `AccordionItem` / FAQ | GSAP height |
| Hover lift / scale | Cards, menu buttons | CSS + GSAP |
| Light parallax | Hero blob | ScrollTrigger scrub |
| Magnetic CTA | `Button` when `magnetic` | pointer transform |

Required: `prefers-reduced-motion` (Lenis off + timelines skip).

---

## 7. Anti “AI-generic” checklist

- [ ] No cliché purple/blue **gradient** SaaS blobs — **solid** pastel palette colors
- [ ] No generic 3D illustrations
- [ ] No Inter/Roboto as primary face
- [ ] No identical floating white cards without hierarchy/color
- [ ] Lucide OK **if** in colored badges with custom composition (not loose gray icons)

---

## 8. Minimum a11y (MVP required)

- [ ] WCAG AA contrast (saturated on text/CTA)
- [ ] Photo `alt`; visible focus; input labels
- [ ] `prefers-reduced-motion`
- [ ] Correct `lang`; touch targets ≥44px

---

## 9. Design deliverables

| Artifact | Status |
|---|---|
| Friendly pivot + `animaps-web` reference | Done |
| Multi-pastel palette + Sour Gummy/Oi | Done in code |
| Bounce/elastic motion + BubbleMenu + waves | Done in code |
| Design system (`Button`, `Input`, `Select`, `Checkbox`, `Accordion`) | Done |
| FAQ + custom scrollbar + anchor scroll-padding | Done |
| Logo + favicon | Pending |
| Stock photos | Pending (Hero placeholder) |
| Figma prototype | Cancelled |

---

## References

- Base project: `animaps-web/src`
- [`landing-content-brief.md`](landing-content-brief.md)
- [`landing-tech-plan.md`](landing-tech-plan.md)
- [`personas.md`](personas.md)
