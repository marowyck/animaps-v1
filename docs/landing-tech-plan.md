# Landing Page — Tech Plan (Phase 1)

Technical plan for the ANIMAPS institutional landing.  
Sources: Phase 1 decisions + visual design round + [`ANIMAPS_Roadmap.md`](../ANIMAPS_Roadmap.md) §1.4–1.6 + content/design briefs.

**Status:** Friendly visual pivot applied in [`apps/web`](../apps/web) (Sour Gummy + Oi, BubbleMenu, waves, multi-pastel, GSAP bounce). Waitlist still placeholder (no Postgres).

---

## 1. Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js** (App Router) + **TypeScript** |
| Style | **Tailwind CSS v4** (tokens in `app/globals.css` via `@theme`) — **multi-pastel** palette |
| Smooth scroll | **`lenis`** (`lenis/react`) — `autoRaf: false` + sync on `gsap.ticker` |
| Animation | **GSAP** + `@gsap/react` + `ScrollTrigger` — easings `back.out` / `elastic.out` |
| Icons | **`lucide-react`** (colored badges; social brand icons removed in v1.25 — use Share2/Globe/etc.) |
| UI bits | **React Bits** (selective copy-paste — not plugged yet; motion covered by GSAP) |
| Fonts | **Sour Gummy** (body) + **Oi** (display) via `next/font/google` |
| Monorepo app | `apps/web` (`@animaps/web`) |
| Hosting | **Vercel** |
| Analytics | **Google Analytics 4** (after cookie consent — to wire) |
| Ads pixel | **No** |

Dark mode: out of scope.  
Custom cursor: out of scope.

**Visual/code reference:** `animaps-web/src` (BubbleMenu, waves, Hero timeline).

### Lenis + GSAP (confirmed pattern)

- Package: `lenis` → `import { ReactLenis, useLenis } from "lenis/react"`
- Options: `autoRaf: false`, `syncTouch: true`
- Sync: `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker.add((t) => lenis.raf(t * 1000))`
- Implementation: [`apps/web/src/app/providers.tsx`](../apps/web/src/app/providers.tsx)
- If `prefers-reduced-motion: reduce` → **do not** init Lenis (native scroll)

### GSAP — plugins / patterns

| Item | Use |
|---|---|
| `ScrollTrigger` | Bounce entry for cards/steps/stats; light Hero parallax; Lenis sync |
| Hero timeline | Text + blob `elastic.out` + photo `back.out` + CTAs |
| BubbleMenu | Open/close with `back.out`; pastel link hover |

### React Bits

React Bits is **not** a monolithic npm package — **copy-paste**. Add components sparingly. This iteration covers motion with GSAP/Lenis.

Always behind `prefers-reduced-motion`.

---

## 2. Frontend architecture (MVC on the View)

Align with roadmap §0.6 (MVC on web):

| Layer | Landing responsibility |
|---|---|
| **View** | React components (`Hero`, cards, form, footer) + Tailwind |
| **Controller** | Next.js Server Actions / Route Handlers (waitlist submit, i18n routing) |
| **Model** | Waitlist TypeScript types + minimal HTTP client until API |

Mandatory componentization from day 1 (reuse across platform).

### Components (`apps/web/src`)

```
components/                    # design system (app-wide reuse)
  Button.tsx
  Input.tsx
  Select.tsx                   # custom dropdown (not native <select>)
  Checkbox.tsx
  AccordionItem.tsx

app/
  providers.tsx                # Lenis + GSAP (SmoothScrollProvider)
  api/waitlist/                # temporary Route Handler → Nest marketing Wave 2

features/landing/components/   # marketing sections
  Header.tsx                   # BubbleMenu
  Hero.tsx
  ProblemSection.tsx
  SolutionSection.tsx
  HowItWorks.tsx
  AudienceCards.tsx
  Differentials.tsx
  SocialProofCarousel.tsx
  FAQ.tsx
  WaitlistSection.tsx          # section chrome + WaitlistForm
  Footer.tsx
  OrganicBlob.tsx
  SectionDivider.tsx           # wave SVG

features/waitlist/             # form, types, validation, submit
features/consent/              # CookieBanner + localStorage LGPD
```

Visual specs: [`landing-design-brief.md`](landing-design-brief.md).

### Motion and performance

Intensity: **expressive and playful** (`back.out` / `elastic.out`), without competing with reading.

- Prefer `transform` / `opacity` animations (compositor-friendly)
- Check `prefers-reduced-motion` on **all** effects: Hero, BubbleMenu, Select, Accordion, Lenis
- Light Hero parallax
- Disable Lenis if `prefers-reduced-motion`
- Global custom scrollbar + `.scrollbar-clean`; `scroll-padding-top` for anchors

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

Acceptable options this phase:

1. **Route Handler in `apps/web`** + light `waitlist_entries` / `WaitlistEntry` (Postgres) — preferred if API not ready.
2. **Minimal Nest endpoint in `apps/api`** (`marketing` / temporary waitlist module) — better once API is scaffolded.

Requirements:

- Server-side validation
- Basic rate limit (abuse control)
- Do not create full `User` yet — waitlist lead only (`WaitlistEntry`)
- LGPD consent stored with timestamp

Field/code names: **English** (`camelCase` API / `snake_case` DB); UI in PT/EN.

---

## 4. Internationalization (PT + EN)

- Default: **Portuguese**
- Selector in header/footer
- Landing strings in dictionaries (`pt`, `en`) — Next.js App Router i18n or light lib
- Routes or locale prefix: decide in implementation (`/`, `/en` or cookie/header)

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

- [ ] Optimized `title` + `description` (responsible adoption, animal abandonment, NGOs, map occurrences)
- [ ] Open Graph + Twitter cards (attractive preview image)
- [ ] `sitemap.xml` + `robots.txt`
- [ ] WebP images + `next/image` + lazy loading
- [ ] Lighthouse / PageSpeed target **> 90** (Performance, Accessibility, Best Practices, SEO)
- [ ] Semantic HTML + correct headings (single h1 in Hero)
- [ ] Motion must not tank Lighthouse (lazy GSAP/Lenis if possible; `prefers-reduced-motion`)

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
- [ ] Real mobile devices (not emulator only)
- [ ] Form submit (success, validation, rate limit)
- [ ] PT ↔ EN switch
- [ ] Cookie banner + GA4 only post-consent
- [ ] Light peak smoke (social share) — Vercel/edge burst
- [ ] `prefers-reduced-motion`: usable without animation
- [ ] Design-brief anti-generic checklist (visual review)

---

## 9. Suggested implementation order

1. ~~Scaffold monorepo (`pnpm`, `apps/web`)~~ — **done** (`pnpm-workspace.yaml` + `@animaps/web`)
2. ~~Design tokens + fonts + `SmoothScrollProvider`~~ — **done** (Sour Gummy/Oi after pivot)
3. ~~Header + Hero with motion~~ — **done**
4. ~~Other sections skeleton + WaitlistForm + `/api/waitlist` placeholder~~ — **done**
5. Final PT/EN copy + assets (logo, stock photos with mask)
6. Real waitlist persistence (Postgres / `WaitlistEntry`) + i18n
7. Cookie banner → GA4 post-consent + events
8. SEO (OG, sitemap, robots) + Lighthouse >90
9. Domain + Vercel production deploy

**Run locally:** from root, `pnpm dev` (filters `@animaps/web`).

---

## 10. Out of scope (Phase 1)

- Full auth / JWT / profiles (Phase 2)
- PostGIS map / real occurrences (later phases)
- Meta Pixel / paid ads
- Dark mode
- Custom cursor
- Figma prototype (design in code)
- Mobile app

---

## References

- Roadmap §1.4–1.6
- [`landing-content-brief.md`](landing-content-brief.md)
- [`landing-design-brief.md`](landing-design-brief.md)
- [`git-and-ci.md`](git-and-ci.md)
- [`lgpd-checklist.md`](lgpd-checklist.md)
- [`privacy-policy-draft.md`](privacy-policy-draft.md)
- [`architecture.md`](architecture.md)
