# Landing Page — Design Brief (Phase 1)

Visual identity and UX for the ANIMAPS institutional landing.  
Sources: Phase 1 decisions + visual design round + **post-feedback pivots** + [`ANIMAPS_Roadmap.md`](../ANIMAPS_Roadmap.md) §1.3 + [`landing-content-brief.md`](landing-content-brief.md).

**Status:** **friendly / organic / pink+green** direction implemented in `apps/web` (no Figma). Public `/` only — product sell + account CTA (waitlist backend).

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

**Personality:** welcoming / human + playful / modern (trustworthy; drop “newspaper” tone).

---

## 1. Visual goal

Convey **trust, warmth, and lightness** — modern, rounded, pastel-colored; human without childish; not AI-generic.

**Direction:** **friendly-organic** — Bagel Fat One + Nunito, blob frames, wave dividers, pink/green, bounce/elastic motion.

Primary audience: guardians and NGOs (balanced voice). Clinics get a dedicated card; public agencies a light mention.

---

## 2. Visual identity

Final logo **does not exist yet**. Tokens in [`apps/web/src/app/globals.css`](../apps/web/src/app/globals.css).

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
| Imagery | Real photos; **blob** frame (organic `border-radius` + white border + soft shadow) |
| Hero video | No |
| Hero décor | Filled `PawPrint` icons (lucide) scattered at low–medium opacity (pink/green); soft pastel blobs |
| Shadows | Soft on cards/CTAs |
| Border-radius | `2rem`–`3rem` on cards; pills on buttons |
| Dividers | SVG **Wave** (`SectionDivider`) |
| Iconography | `lucide-react` in colored circles/badges; footer social = name + icon |

---

## 4. Layout and flow (mobile-first)

No Figma. Source of truth: this brief + code in `apps/web`.

### Page order (`app/page.tsx`)

1. Header (BubbleMenu)  
2. Hero (taller ~88–92vh; paw field; photo + CTAs)  
3. Solution  
4. How it works (`bg-pastel-green`)  
5. **CurvedLoop** (green ribbon, `bridgeAbove`)  
6. Audience  
7. Differentials  
8. FAQ (`bg-pastel-pink`)  
9. **CurvedLoop** (pink ribbon, `bridgeAbove`)  
10. Waitlist / create-account form  
11. Footer  

### Header (BubbleMenu)

- Floating logo pill + round button (menu/X) + optional “Criar conta”
- Bubble panel with large links, slight rotation, pastel hover colors
- Anchors: `#topo`, `#solucao`, `#como-funciona`, `#faq`, `#lista`

### CurvedLoop (marquee ribbons)

- Component: [`apps/web/src/components/bits/CurvedLoop.tsx`](../apps/web/src/components/bits/CurvedLoop.tsx)
- Continuous sine ribbon (stroke) + upright per-letter wave
- Prop **`bridgeAbove`**: solid fill from the previous section color down to the ribbon’s lower edge (same sine) so there is **no white gap** between FAQ↔pink ribbon or HowItWorks↔green ribbon
- Phase-locked wavelength for seamless `-50%` marquee loop

### Footer

Model: clean multi-column + oversized cropped brand wordmark (Tinder-like structure, quieter ANIMAPS palette).

- Dark `#1a1214` + wave on top (`SectionDivider` fill `gray-soft`)
- Columns: brand blurb + language pill · Plataforma · Conta · Jurídico · Redes sociais
- Social: **text link + icon on the right** (Instagram, TikTok, LinkedIn, YouTube) — no extra CTA card / pill button row
- Giant **ANIMAPS** wordmark (Bagel Fat One, pink, cropped at bottom)
- Keep `#privacidade` / `#termos` anchors for consent + form links

---

## 5. Visual components

### Design system (`apps/web/src/components/`)

| Component | Role |
|---|---|
| `Button` | Pill CTA; variants `pink` / `orange` (alias) / `blue` / `green` / `white`; circular fill hover; `magnetic` optional |
| `Input` | Pill field + label |
| `Select` | Custom dropdown (GSAP panel) |
| `Checkbox` | Custom box + animated Check |
| `AccordionItem` | FAQ disclosures |

### Bits (`apps/web/src/components/bits/`)

`ClickSpark`, `AnimatedContent`, `ScrollReveal`, `Magnet`, `TiltedCard`, `DotGrid`, `CurvedLoop`, …

### Marketing (`apps/web/src/features/landing/`)

`Header`, `Hero`, `SolutionSection`, `HowItWorks`, `AudienceCards`, `Differentials`, `FAQ`, `WaitlistSection`, `Footer`, `OrganicBlob`, `SectionDivider`.

**Removed from public flow:** `ProblemSection`, `SocialProofCarousel` (files may remain unused — do not reintroduce without product ask).

### Form patterns

- Dropdown: use `Select`. Checkbox: use `Checkbox`. Buttons: use `Button`; `magnetic={false}` in compact contexts.

### Scrollbar & anchors

- Global thin scrollbar; thumb brand pink
- `scroll-padding-top: 6rem` on `html`
- In-page hash links use Lenis **`anchors`** (offset `-96`) for smooth section travel — see tech plan

---

## 6. Motion system

Intensity: **expressive and playful**, without competing with reading. Lenis kept but tuned for **light, easy page travel** (see tech plan).

| Effect | Where | Tool |
|---|---|---|
| Entry timeline | Hero | GSAP |
| Bubble menu | Header | GSAP `back.out` |
| Scroll-in bounce | Cards / steps / FAQ | ScrollTrigger + `back.out` |
| Accordion height | FAQ | GSAP height |
| Light parallax | Hero blobs | ScrollTrigger `scrub: 0.6` |
| Marquee ribbons | CurvedLoop | GSAP `x` loop |
| Magnetic / fill hover | `Button` | pointer + clipPath |
| Click sparks | Page wrapper | ClickSpark |

Required: `prefers-reduced-motion` (Lenis off + timelines skip + native anchor fallback).

---

## 7. Anti “AI-generic” checklist

- [ ] No cliché purple/indigo SaaS gradients — **pink + green** solid brand
- [ ] No generic 3D illustrations
- [ ] No Inter/Roboto as primary face
- [ ] No identical floating white cards without hierarchy/color
- [ ] Lucide OK in colored badges / intentional décor (filled paws in Hero)

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
| Friendly pivot + pink/green + Bagel/Nunito | Done in code |
| BubbleMenu + waves + bits (CurvedLoop, etc.) | Done in code |
| Continuous ribbon bridges (`bridgeAbove`) | Done |
| Clean footer + social links | Done |
| Hero paw field + taller viewport | Done |
| Design system primitives | Done |
| Logo + favicon | Pending |
| Final stock photos | Hero photo present; refine as needed |
| Figma prototype | Cancelled |

---

## References

- [`landing-content-brief.md`](landing-content-brief.md)
- [`landing-tech-plan.md`](landing-tech-plan.md)
- [`personas.md`](personas.md)
