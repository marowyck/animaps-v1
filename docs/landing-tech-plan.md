# Landing Page — Tech Plan (Phase 1)

Technical plan for the ANIMAPS institutional landing.  
Sources: Phase 1 decisions + visual design round + [`ANIMAPS_Roadmap.md`](../ANIMAPS_Roadmap.md) §1.4–1.6 + content/design briefs.

**Status:** Pink/green friendly landing in [`apps/web`](../apps/web) (Bagel Fat One + Nunito, BubbleMenu, waves, React Bits, GSAP). Waitlist still placeholder (no Postgres). Public `/` only.

---

## 1. Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js** (App Router) + **TypeScript** |
| Style | **Tailwind CSS v4** (tokens in `app/globals.css` via `@theme`) — **pink + green** brand |
| Smooth scroll | **`lenis`** (`lenis/react`) — `autoRaf: false` + sync on `gsap.ticker` + **`anchors`** |
| Animation | **GSAP** + `@gsap/react` + `ScrollTrigger` — easings `back.out` / `elastic.out` |
| Icons | **`lucide-react`** (+ small inline SVGs for social brands in Footer) |
| UI bits | **React Bits–style** copy in `components/bits/` (ClickSpark, CurvedLoop, DotGrid, TiltedCard, …) |
| Fonts | **Bagel Fat One** (display) + **Nunito** (body) via `next/font/google` |
| Monorepo app | `apps/web` (`@animaps/web`) |
| Hosting | **Vercel** |
| Analytics | **Google Analytics 4** (after cookie consent — to wire) |
| Ads pixel | **No** |

Dark mode: out of scope.  
Custom cursor: out of scope.

### Lenis + GSAP (confirmed pattern)

Implementation: [`apps/web/src/app/providers.tsx`](../apps/web/src/app/providers.tsx)

- Package: `lenis` → `import { ReactLenis, useLenis } from "lenis/react"`
- Sync: `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker.add((t) => lenis.raf(t * 1000))` with `autoRaf: false`
- If `prefers-reduced-motion: reduce` → **do not** init Lenis; use `NativeAnchorScroll` fallback
- Body: prefer `overflow-x-clip` (not `overflow-x-hidden`) so Lenis root scroll stays healthy

**Tuned options (easy page travel — avoid heavy “lag behind” feel):**

| Option | Value | Why |
|---|---|---|
| `lerp` | `~0.16` | Snappier follow than very low lerp |
| `duration` | `~1` | Anchor animations |
| `syncTouch` | `false` | Native touch/trackpad feels lighter |
| `wheelMultiplier` | `~1.2` | Slightly easier vertical travel |
| `touchMultiplier` | `~1.4` | Same for touch |
| `anchors` | `{ offset: -96, duration: ~1.05, easing }` | Smooth hash navigation matching `scroll-padding-top: 6rem` |

### GSAP — plugins / patterns

| Item | Use |
|---|---|
| `ScrollTrigger` | Bounce entry for cards/steps/FAQ; soft Hero parallax (`scrub: 0.6`); Lenis sync |
| Hero timeline | Text + blob `elastic.out` + photo `back.out` + CTAs |
| BubbleMenu | Open/close with `back.out`; pastel link hover |
| CurvedLoop | Infinite `x` marquee; per-glyph `translateY(sin)` |

### React Bits (`components/bits/`)

Copy-paste style components, brand-reskinned. Always respect `prefers-reduced-motion` where motion is involved.

Notable: **`CurvedLoop`** — continuous ribbon + optional **`bridgeAbove`** fill so section color meets the wave (no white seam under FAQ / HowItWorks).

**Performance note:** avoid `will-change-transform` on every marquee character (hundreds of layers) — keep it on the track only.

---

## 2. Frontend architecture (MVC on the View)

Align with roadmap §0.6 (MVC on web):

| Layer | Landing responsibility |
|---|---|
| **View** | React components (`Hero`, cards, form, footer) + Tailwind |
| **Controller** | Next.js Server Actions / Route Handlers (waitlist submit, i18n routing) |
| **Model** | Waitlist TypeScript types + minimal HTTP client until API |

### Components (`apps/web/src`)

```
components/                    # design system (app-wide reuse)
  Button.tsx
  Input.tsx
  Select.tsx
  Checkbox.tsx
  AccordionItem.tsx
  bits/                        # React Bits–style motion/décor
    CurvedLoop.tsx
    ClickSpark.tsx
    DotGrid.tsx
    TiltedCard.tsx
    …

app/
  providers.tsx                # SmoothScrollProvider (Lenis + anchors + GSAP sync)
  page.tsx                     # Landing composition
  api/waitlist/                # temporary Route Handler → Nest marketing Wave 2

features/landing/components/
  Header.tsx                   # BubbleMenu
  Hero.tsx                     # taller viewport + filled PawPrint field
  SolutionSection.tsx
  HowItWorks.tsx               # bg-pastel-green (feeds green CurvedLoop bridge)
  AudienceCards.tsx
  Differentials.tsx
  FAQ.tsx                      # bg-pastel-pink (feeds pink CurvedLoop bridge)
  WaitlistSection.tsx
  Footer.tsx                   # clean columns + social + wordmark
  OrganicBlob.tsx
  SectionDivider.tsx

features/waitlist/
features/consent/
```

**Not in public page flow:** `ProblemSection`, `SocialProofCarousel`.

Visual specs: [`landing-design-brief.md`](landing-design-brief.md).

### Motion and performance

- Prefer `transform` / `opacity` (compositor-friendly)
- Check `prefers-reduced-motion` on Hero, BubbleMenu, Select, Accordion, Lenis, CurvedLoop
- Soft Hero parallax only
- Disable Lenis under reduced motion; anchors still land with header offset
- Global custom scrollbar; `scroll-padding-top` for fixed BubbleMenu

---

## 3. Form and persistence

### Fields (aligned with content brief)

- `name` (string, required)
- `email` (string, required, validated)
- `profileType` (enum: `guardian` | `ngo` | `clinic` | `other`, required)
- `city` / `state` (optional)
- `lgpdConsent` (boolean, required = true)

### Persistence

**Own endpoint** (no Mailchimp/Typeform in MVP):

1. **Route Handler in `apps/web`** + light `waitlist_entries` — preferred if API not ready  
2. **Minimal Nest endpoint in `apps/api`** — better once API is scaffolded  

Requirements: server-side validation, basic rate limit, waitlist lead only (`WaitlistEntry`), LGPD consent + timestamp.

UI copy uses **account** language (“Criar conta”); storage remains waitlist until auth ships.

Field/code names: **English** (`camelCase` API / `snake_case` DB); UI in PT/EN.

---

## 4. Internationalization (PT + EN)

- Default: **Portuguese**
- Footer shows a disabled language pill (`português`) until i18n ships
- Landing strings in dictionaries (`pt`, `en`) — to implement

---

## 5. Analytics and consent

| Item | Decision |
|---|---|
| GA4 | **Yes** — measure origin and conversion |
| Meta Pixel | **No** |
| Minimum events | `cta_click`, `waitlist_submit`, (optional) `scroll_depth` |
| Cookie banner | **Yes**, simple (accept / reject non-essential) |
| GA4 load | **After** consent for non-essential cookies |

---

## 6. SEO and performance

Required at launch:

- [ ] Optimized `title` + `description`
- [ ] Open Graph + Twitter cards
- [ ] `sitemap.xml` + `robots.txt`
- [ ] WebP + `next/image` + lazy loading
- [ ] Lighthouse / PageSpeed target **> 90**
- [ ] Semantic HTML + single `h1` in Hero
- [ ] Motion must not tank Lighthouse (`prefers-reduced-motion`; avoid excess compositor layers)

---

## 7. Domain, HTTPS, and publish

| Item | Status |
|---|---|
| Own domain | **Pending** |
| Vercel deploy + HTTPS | Planned |
| Staging | Prefer `develop` → Vercel preview (see [`git-and-ci.md`](git-and-ci.md)) |
| Production | Branch `main` |

---

## 8. Pre–go-live tests (§1.6)

- [ ] Cross-browser: Chrome, Safari, Firefox
- [ ] Real mobile devices
- [ ] Form submit (success, validation, rate limit)
- [ ] PT ↔ EN switch
- [ ] Cookie banner + GA4 only post-consent
- [ ] Smooth hash scroll (buttons/menu → sections) feels continuous under Lenis
- [ ] CurvedLoop bridges: no white gap under FAQ (pink) / HowItWorks (green)
- [ ] `prefers-reduced-motion`: usable without animation
- [ ] Design-brief anti-generic checklist (visual review)

---

## 9. Suggested implementation order

1. ~~Scaffold monorepo~~ — **done**
2. ~~Design tokens + fonts + `SmoothScrollProvider`~~ — **done** (Bagel Fat One + Nunito; Lenis anchors tuned)
3. ~~Header + Hero + bits + section flow~~ — **done**
4. ~~WaitlistForm + `/api/waitlist` placeholder~~ — **done**
5. Final PT/EN copy + assets (logo, social URLs)
6. Real waitlist persistence + i18n
7. Cookie banner → GA4 post-consent + events
8. SEO + Lighthouse >90
9. Domain + Vercel production deploy

**Run locally:** from root, `pnpm dev` (filters `@animaps/web`).

---

## 10. Out of scope (Phase 1)

- Full auth / JWT / profiles (Phase 2)
- PostGIS map / real occurrences (later phases)
- Meta Pixel / paid ads
- Dark mode / custom cursor
- Figma prototype
- Mobile app
- Investor / TAM-SAM-SOM public pages

---

## References

- Roadmap §1.4–1.6
- [`landing-content-brief.md`](landing-content-brief.md)
- [`landing-design-brief.md`](landing-design-brief.md)
- [`git-and-ci.md`](git-and-ci.md)
- [`lgpd-checklist.md`](lgpd-checklist.md)
- [`privacy-policy-draft.md`](privacy-policy-draft.md)
- [`architecture.md`](architecture.md)
