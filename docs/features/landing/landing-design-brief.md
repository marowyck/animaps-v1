# Landing Page — Design Brief (Phase 1)

Visual identity and UX for the ANIMAPS institutional landing.  
Sources: Phase 1 decisions + visual design round + **post-feedback pivots** + [architecture.md](../../architecture.md) + [`landing-content-brief.md`](landing-content-brief.md).

**Status:** **friendly / organic / pink+green** direction implemented in `apps/web` (no Figma). Public `/` is a **fullscreen-section** landing with **clay mascots** (puppy + cat frame the Hero; family / critter / monkey appear later). Shared `Button` + `LocaleSwitcher` + `Toast`; Header CTA cluster with **Log in** + **Create account** + soft green menu. **`/register`** and **`/login`** use an immersive split layout (image carousel + form card). Google CTA is UI-only until OAuth ships.

---

## Pivot history

### 1) Editorial → friendly/organic

First implementation (editorial + Fraunces) felt too “newspaper”. Feedback: friendly, pastels, more animation — use `animaps-web/src` as base.

### 2) Multi-pastel rainbow → pink + green product brand

Landing now centers **brand pink + brand green** (with soft pastels). Display/body fonts: **Bagel Fat One** + **Nunito**. Account-first CTAs (“Criar conta”); no Problem section; no market-stats carousel.

| Earlier | Current (`apps/web`) |
|---|---|
| Sour Gummy + Oi (brief v1) | **Nunito** (body) + **Bagel Fat One** (display) |
| Multi-pastel orange/blue/yellow/purple | **Pink `#e07a96` + green `#5faf6a`** + pastels |
| Problem + SocialProof carousel | **Removed** — solutions/benefits only |
| Waitlist-first copy | **Account language**; form still waitlist |
| Newsletter-heavy footer | **Clean Tinder-inspired footer** + social text links |
| Stock pet photo + lucide paw field in Hero | **Clay mascots** framing centered copy on white |

### 3) Stock photo → clay companions

Hero no longer uses a blob-framed photograph. Custom clay figures sit as large companions (puppy left, calico cat right) on a white full-viewport stage with soft pink/green washes. Later sections host family, critter, and monkey figures.

**Personality:** welcoming / human + playful / modern (trustworthy; drop “newspaper” tone).

---

## 1. Visual goal

Convey **trust, warmth, and lightness** — modern, rounded, pastel-colored; human without childish; not AI-generic.

**Direction:** **friendly-organic** — Bagel Fat One + Nunito, clay mascots, wave dividers, pink/green, bounce/elastic motion.

Primary audience: guardians and NGOs (balanced voice). Clinics get a dedicated card; public agencies a light mention.

---

## 2. Visual identity

Final logo **does not exist yet**. Tokens in [`apps/web/src/app/globals.css`](../../../apps/web/src/app/globals.css).

### Palette guidelines

| Role | Tokens | Use |
|---|---|---|
| Neutral | mint-cream / `gray-soft`, `#243028` (`ink`) | Page background, type |
| Brand | pink `#e07a96`, green `#5faf6a` (+ hover variants) | CTAs, emphasis, icons |
| Pastel tints | `pastel-pink`, `pastel-green`, `pastel-sky`, … | Section surfaces, ribbons, badges |
| Dark (rhythm) | `#1a1214` / near-black | Footer |

**AA contrast:** saturated on text/CTA; pastel on surfaces only. No dark-mode toggle.

### Typography

| Use | Font | Notes |
|---|---|---|
| Display / section titles | **Bagel Fat One** (`--font-display`) | Hero `h1`, section `h2`, CurvedLoop text, footer wordmark |
| Body / UI / FAQ | **Nunito** (`--font-nunito` / sans) | Weights 400–800 |

### Logo

- [ ] Concept (ANIMAPS + map/animal symbol)
- [ ] Variants: horizontal (header pill), icon (favicon / OG)
- No dark mode this phase

---

## 3. Style and imagery

| Decision | Choice |
|---|---|
| Overall style | Friendly-organic (rounded, pink/green, bounce) |
| Imagery | Custom **clay mascots** in [`apps/web/public/images/clay/`](../../../apps/web/public/images/clay/) (WebP + PNG). Catalog: `ClayFigure` (`puppy`, `cat`, `family`, `critter`, `monkey`) |
| Hero video | No |
| Hero décor | Large clay companions framing centered copy on **white**; pastel pink/green washes; CSS `clay-float`; pointer parallax on layers |
| Shadows | Soft on cards/CTAs; drop-shadow on clay figures |
| Border-radius | `2rem`–`3rem` on cards; pills on buttons |
| Dividers | SVG **Wave** (`SectionDivider`); pink CurvedLoop also **`bridgeBelow`** into the footer |
| Iconography | `lucide-react` in colored circles/badges; footer social = name + icon |

---

## 4. Layout and flow (mobile-first)

No Figma. Source of truth: this brief + code in `apps/web`.

### Page order (`app/page.tsx`)

1. Header (BubbleMenu)  
2. Hero (full `100svh` white; clay puppy + cat; CTAs → `/register` + `/#how-it-works`)  
3. Solution (white; bento pillars; `min-h-[100svh]`)  
4. How it works (`bg-pastel-green`; leash draw + critter clay; `min-h-[100svh]`)  
5. **CurvedLoop** (green ribbon, `bridgeAbove`)  
6. Audience (`bg-gray-soft`; polaroid cards + family clay; `min-h-[100svh]`)  
7. Differentials (`bg-pastel-yellow`; feature grid + monkey clay; `min-h-[100svh]`)  
8. FAQ (`bg-pastel-pink`)  
9. **CurvedLoop** (pink ribbon, `bridgeAbove` + **`bridgeBelow`** into footer `#1a1214`)  
10. Footer (`showDivider={false}` — the ribbon already paints the sine join)  

**Separate routes (English paths):**

- `/register` + `/login` — shared **auth split layout** (`features/auth/`):
  - Left (~2/3 desktop / top band mobile): full-bleed carousel — rescue, adoption, wildlife images with motivational i18n lines
  - Right (~1/3): white panel; **language menu** top-right (Languages label + icon); **no brand mark / logo** in the form chrome
  - Register: **two steps** with a compact **`{n}/2` pill** beside the title
    1. Profile / waitlist fields + centered **Continue with Google** (UI-only)
    2. Password + confirm, live strength checklist, show/hide eye toggle; strong-password rules (min 8, uppercase, special)
  - Login: email/password (revealable) + Google CTA (UI-only) + link to register
  - Outcome feedback (validation, success, “coming soon”) via **toasts** — never permanent inline status under the form
  - No landing Header/Footer/ClickSpark on these pages

### Header (BubbleMenu)

- Floating logo pill (left) + frosted chrome cluster (right):
  - **Log in** — `Button` `white` / `sm` → `/login` (secondary) — **hidden below `md`** (available in bubble menu)
  - **Create account** — `Button` `pink` / `sm` → `/register` (primary) — **hidden below `md`** (available in bubble menu)
  - Icon menu toggle (always visible)
- Menu toggle uses Button variant **`soft`**: **pastel green + brand-green icon** when closed; **brand pink** when open — never solid black/ink (breaks pink+green friendliness)
- Bubble panel opens **below** the cluster (does not cover the CTAs or toggle); closes on toggle, outside click, Escape, or nav link
- Nav rows: label + **lucide icon on the right**; slight rotation on open; pastel pink/green hover fills
- Section anchors (English): `/#top`, `/#solution`, `/#how-it-works`, `/#faq` (+ `/#audience`, `/#differentials` where linked)
- Account links in menu: `/register`, `/login`
- **Language** section inside the panel: shared **`LocaleSwitcher`** (`variant="menu"`) — same control as Footer / auth

### Button system (`components/Button.tsx`)

Single reusable control for all CTAs and chrome actions — **no ad-hoc `<button>` markup** in feature files.

| Prop | Notes |
|---|---|
| `variant` | Fill CTAs: `pink` / `orange` (alias) / `blue` / `green` / `white`. Chrome: `soft`, `ink`, `ghost`, `segment`, `field` |
| `size` | `md` (default CTA), `sm` (header/auth/cookies), `xs` (locale pills), `icon`, `stretch` (FAQ), `field` (Select) |
| `magnetic` | Optional pointer pull; **independent** of fill hover (fill hover stays on for `md` fill variants) |
| `selected` / `tone` | Locale pills (`segment`) and soft toggle open state |
| Cursor | Always `cursor-pointer` (`disabled:cursor-not-allowed`) |

- `white` secondary CTA: green border at rest; hover fills brand green + white text
- Compact `pink` (`sm`): soft pink shadow + `hover:bg-brand-pink-hover` — **no scale** (avoids shadow/radius ghost on full-width auth buttons)
- FAQ questions and Select trigger compose `Button` (`ghost` / `field`) so pointer and focus stay consistent

### LocaleSwitcher (`components/LocaleSwitcher.tsx`)

- Prefer **`variant="menu"`**: localized “Language” / “Idioma” label + languages icon; dropdown lists full names (`LOCALE_NAMES`) so new locales can be added without a wider pill row
- Optional `variant="pills"` for dense PT|EN|ES segments if needed
- Used in Header, Footer, and auth form column
- Details: [`ui-patterns.md`](../ui-patterns.md)

### Toast (`components/Toast.tsx`)

- **Required** for any outcome the user must notice (error / success / warning / info)
- Bottom-right stack; Lucide tone icons (`Info`, `CircleCheck`, `CircleX`, `CircleAlert`) — **no emoji**
- Swipe in from the right / swipe out to the right
- Details: [`ui-patterns.md`](../ui-patterns.md)

### Input (`components/Input.tsx`)

- Pill fields; optional `compact` for auth panels
- `revealable` on `type="password"`: Lucide `Eye` / `EyeOff` toggle with i18n aria labels (`showPassword` / `hidePassword`)

### CurvedLoop (marquee ribbons)

- Component: [`apps/web/src/components/bits/CurvedLoop.tsx`](../../../apps/web/src/components/bits/CurvedLoop.tsx)
- Continuous sine ribbon (stroke) + upright per-letter wave
- Prop **`bridgeAbove`**: solid fill from the previous section color down to the ribbon’s lower edge (same sine) so there is **no white gap** between FAQ↔pink ribbon or HowItWorks↔green ribbon
- Prop **`bridgeBelow`**: fill from the ribbon’s lower sine **downward** (footer `#1a1214`) so marquee text rides the join into the dark footer — used on the pink ribbon; Footer then omits its own `SectionDivider`
- Phase-locked wavelength for seamless `-50%` marquee loop

### Footer

Model: clean multi-column + oversized cropped brand wordmark (Tinder-like structure, quieter ANIMAPS palette).

- Dark `#1a1214`. Top wave is **omitted** on `/` (`showDivider={false}`) because the pink CurvedLoop `bridgeBelow` already paints that sine.
- Columns: brand blurb + language menu · Platform · Account (`/register`, `/login`) · Legal · Social
- Language switcher: client-only (`localStorage`); **no** `/pt` / `/en` / `/es` routes
- Social: **text link + icon on the right** (Instagram, TikTok, LinkedIn, YouTube) — no extra CTA card / pill button row
- Giant **ANIMAPS** wordmark (Bagel Fat One, pink, cropped at bottom)
- Keep `/#privacy` / `/#terms` anchors for consent + form links

---

## 5. Visual components

### Design system (`apps/web/src/components/`)

| Component | Role |
|---|---|
| `Button` | Shared pill/icon control — see Header § Button system; all interactive buttons compose this |
| `LocaleSwitcher` | Language menu (extensible) or optional pills |
| `Toast` | Bottom-right outcome alerts via `useToast` |
| `Input` | Pill field + label; optional password reveal |
| `Select` | Custom dropdown (GSAP panel); trigger is `Button` `field` |
| `Checkbox` | Custom box + animated Check |
| `AccordionItem` | FAQ disclosures; question row is `Button` `ghost` + `cursor-pointer` |

### Bits (`apps/web/src/components/bits/`)

`ClickSpark`, `AnimatedContent` (elastic pop, `once`), `ScrollReveal` (simple or cinematic word-unblur), `Magnet`, `TiltedCard`, `DotGrid`, `CurvedLoop`, plus kit extras **not required on `/` today**: `Aurora` (WebGL via `ogl`), `SpotlightCard`, `GlareHover`, `GradualBlur`, `SplitText`, `ScrollFloat`, `ScrollStack`.

Hero title splitting uses **GSAP `SplitText`** directly (not the bits wrapper).

### Marketing (`apps/web/src/features/landing/`)

**On `/`:** `Header`, `Hero`, `SolutionSection`, `HowItWorks`, `AudienceCards`, `Differentials`, `FAQ`, `Footer`, `SectionDivider`.

**Clay:** `ClayFigure` (asset catalog + wiggle + `clay-float`) used in Hero / How it works / Audience / Differentials. `ClayStage` is a framed podium helper — exported, not composed on `/` today.

**Available, not in public flow:** `WaitlistSection`, `OrganicBlob`, `PortalScene` (hand-drawn SVG layers), `FloatingDecor` (parallax clouds/paws).

### Auth (`apps/web/src/features/auth/`)

`AuthSplitLayout`, `AuthImageCarousel`, `RegisterForm`, `LoginForm`, `GoogleAuthButton`, `passwordValidation`.

**Removed from public flow:** `ProblemSection`, `SocialProofCarousel` (files may remain unused — do not reintroduce without product ask).

### Form patterns

- Dropdown: use `Select`. Checkbox: use `Checkbox`.
- Buttons: **only** `Button` (or composites like `LocaleSwitcher`). Do not hardcode styled `<button>` / CTA `<a>` in features.
- `magnetic={false}` when pull feels heavy (Hero CTAs, compact chrome); fill/CSS hover still applies on fill variants.
- Outcome feedback: **toasts only** — see [`ui-patterns.md`](../ui-patterns.md).

### Scrollbar & anchors

- Global thin scrollbar; pink thumb on transparent track
- `scroll-padding-top: 6rem` on `html`
- In-page hash links use Lenis **`anchors`** (offset `-96`) for smooth section travel — see tech plan

---

## 6. Motion system

Intensity: **expressive and playful**, without competing with reading. Lenis kept but tuned for **light, easy page travel** (see tech plan).

| Effect | Where | Tool |
|---|---|---|
| Word intro | Hero `h1` | GSAP `SplitText` (words) + `back.out` |
| Entry timeline | Hero body / CTAs / clay | GSAP `back.out` / `power2.out` |
| Pointer parallax | Hero washes + clay + UI | RAF lerp (skipped if reduced motion) |
| Scroll fade | Whole Hero | ScrollTrigger `scrub: 0.4` |
| Idle float | Clay figures | CSS `@keyframes clay-float` |
| Click wiggle | Clay figures / How-it-works cards | GSAP rotate yoyo |
| Bubble menu | Header | GSAP `back.out`; panel below cluster |
| Scroll-in pop | Solution / How it works / Differentials cards | `AnimatedContent` (`back.out`, `once`) |
| Polaroid pop-in | Audience cards | ScrollTrigger + `back.out` |
| Accordion height | FAQ | GSAP height |
| Leash draw | How it works (desktop) | SVG `strokeDashoffset` + ScrollTrigger scrub |
| Marquee ribbons | CurvedLoop | GSAP `x` loop |
| Magnetic / fill hover | `Button` | pointer pull optional; clipPath fill on `md` fill variants; CSS hover on `white` / compact `pink` (no scale on `sm` pink) |
| Toast enter/exit | Toast stack | CSS translate + opacity swipe |
| Click sparks | Page wrapper | ClickSpark |

Required: `prefers-reduced-motion` (Lenis off + timelines skip + native anchor fallback).

---

## 7. Anti “AI-generic” checklist

- [ ] No cliché purple/indigo SaaS gradients — **pink + green** solid brand
- [ ] No generic 3D / Midjourney pet illustrations — **custom clay mascots** only
- [ ] No Inter/Roboto as primary face
- [ ] No identical floating white cards without hierarchy/color
- [ ] Lucide OK in colored badges / interactive cards; toast icons from Lucide (no emoji)
- [ ] Header chrome stays pastel pink/green — avoid heavy black icon buttons on the frosted cluster

---

## 8. Minimum a11y (MVP required)

- [ ] WCAG AA contrast (saturated on text/CTA)
- [ ] Photo / clay `alt`; visible focus; input labels
- [ ] Password reveal buttons expose show/hide aria labels
- [ ] `prefers-reduced-motion`
- [ ] Correct `lang`; touch targets ≥44px
- [ ] Interactive controls expose `cursor-pointer`; menu `aria-expanded` / Escape to close

---

## 9. Design deliverables

| Artifact | Status |
|---|---|
| Friendly pivot + pink/green + Bagel/Nunito | Done in code |
| BubbleMenu + waves + bits (CurvedLoop, etc.) | Done in code |
| Continuous ribbon bridges (`bridgeAbove`) | Done |
| Pink ribbon `bridgeBelow` into footer (no extra Footer wave) | Done |
| Header Log in + Create account + soft green menu + in-menu locale | Done |
| `/register` + `/login` split layout (carousel + Google UI CTA) | Done |
| Register two-step + password reveal + toasts | Done |
| Shared `Button` + `LocaleSwitcher` + `Toast` | Done |
| Clean footer + social links + language menu | Done |
| Full-viewport white Hero + clay companions (puppy / cat) | Done |
| Clay figures in How it works / Audience / Differentials | Done |
| Design system primitives | Done |
| Logo + favicon | Pending |
| Clay alt text | Portuguese on `ClayFigure` catalog today; `hero.imageAlt` exists in i18n (puppy) |
| Figma prototype | Cancelled |

---

## References

- [`landing-content-brief.md`](landing-content-brief.md)
- [`landing-tech-plan.md`](landing-tech-plan.md)
- [`ui-patterns.md`](../ui-patterns.md)
- [`personas.md`](../../roadmap/personas.md)
