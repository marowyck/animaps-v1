# Landing Page — Tech Plan (Phase 1)

Technical plan for the ANIMAPS institutional landing.  
Sources: Phase 1 decisions + visual design round + [architecture.md](../../architecture.md) + content/design briefs.

**Status:** Pink/green friendly landing in [`apps/web`](../../../apps/web) (Bagel Fat One + Nunito, clay mascots, BubbleMenu, shared `Button` / `LocaleSwitcher` / `Toast`, waves, React Bits, GSAP, client i18n PT/EN/ES). Public `/` is product-only **fullscreen sections**. Account capture on **`/register`** (two-step UI → waitlist API); **`/login`** split UI (email/password + Google CTA UI-only). Header exposes **Log in** + **Create account**.

---

## 1. Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js** (App Router) + **TypeScript** |
| Style | **Tailwind CSS v4** (tokens in `app/globals.css` via `@theme`) — **pink + green** brand |
| Smooth scroll | **`lenis`** (`lenis/react`) — `autoRaf: false` + sync on `gsap.ticker` + **`anchors`** |
| Animation | **GSAP** + `@gsap/react` + `ScrollTrigger` + **`SplitText`** — easings `back.out` / `elastic.out` |
| Icons | **`lucide-react`** (+ small inline SVGs for social brands in Footer) |
| UI bits | **React Bits–style** copy in `components/bits/` (ClickSpark, CurvedLoop, AnimatedContent, …) |
| WebGL (optional) | **`ogl`** — used by `Aurora` (not composed on `/` today) |
| Imagery | Clay mascots via `next/image` (`public/images/clay/`, WebP + PNG) |
| Fonts | **Bagel Fat One** (display) + **Nunito** (body) via `next/font/google` |
| Monorepo app | `apps/web` (`@animaps/web`) |
| Hosting | **Vercel** |
| Analytics | **Google Analytics 4** (after cookie consent — to wire) |
| Ads pixel | **No** |

Dark mode: out of scope.  
Custom cursor: out of scope.

### Lenis + GSAP (confirmed pattern)

Implementation: [`apps/web/src/app/providers.tsx`](../../../apps/web/src/app/providers.tsx)

- Package: `lenis` → `import { ReactLenis, useLenis } from "lenis/react"`
- Sync: `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker.add((t) => lenis.raf(t * 1000))` with `autoRaf: false`
- If `prefers-reduced-motion: reduce` → **do not** init Lenis; use `NativeAnchorScroll` fallback
- Body: prefer `overflow-x-clip` (not `overflow-x-hidden`) so Lenis root scroll stays healthy

**Tuned options (easy page travel — avoid heavy “lag behind” feel):**

| Option | Value | Why |
|---|---|---|
| `lerp` | `~0.1` | Heavier smooth follow than a snappy lerp |
| `duration` | `~1.1` | Anchor animations |
| `syncTouch` | `false` | Native touch/trackpad feels lighter |
| `wheelMultiplier` | `~1` | Match native wheel distance |
| `touchMultiplier` | `~1.2` | Slightly easier touch travel |
| `anchors` | `{ offset: -96, duration: ~1.05, easing }` | Smooth hash navigation matching `scroll-padding-top: 6rem` |

### GSAP — plugins / patterns

| Item | Use |
|---|---|
| `ScrollTrigger` | Bounce/pop entry for cards/steps/FAQ (`once`); Hero scroll fade (`scrub: 0.4`); How-it-works leash draw; Lenis sync |
| Hero timeline | GSAP `SplitText` (words) + body/CTAs/clay `back.out`; pointer parallax via RAF |
| BubbleMenu | Open/close with `back.out`; pastel link hover |
| CurvedLoop | Infinite `x` marquee; per-glyph `translateY(sin)`; optional `bridgeAbove` / `bridgeBelow` |

### React Bits (`components/bits/`)

Copy-paste style components, brand-reskinned. Always respect `prefers-reduced-motion` where motion is involved.

Notable: **`CurvedLoop`** — continuous ribbon + **`bridgeAbove`** (section color meets the wave) + **`bridgeBelow`** (pink ribbon paints into footer `#1a1214`). **`AnimatedContent`** defaults to an elastic pop and plays **once** (avoids Lenis leaving nodes at `opacity: 0`). **`ScrollReveal`** has a simple fade and an optional cinematic word-unblur mode.

**Performance note:** avoid `will-change-transform` on every marquee character (hundreds of layers) — keep it on the track only. Clay idle motion is CSS (`clay-float`), not a GSAP loop. Large figures go through `next/image` (AVIF/WebP, extra device widths); the family PNG uses `unoptimized` for fidelity. `experimental.optimizePackageImports` covers `lucide-react`, `gsap`, `@gsap/react`.

---

## 2. Frontend architecture (MVC on the View)

Align with roadmap §0.6 (MVC on web):

| Layer | Landing responsibility |
|---|---|
| **View** | React components (`Hero`, cards, form, footer) + Tailwind |
| **Controller** | Next.js Server Actions / Route Handlers (waitlist submit) |
| **Model** | Waitlist TypeScript types + minimal HTTP client until API |

### Components (`apps/web/src`)

```
components/                    # design system (app-wide reuse)
  Button.tsx                   # shared CTAs + chrome (variants/sizes; cursor-pointer)
  LocaleSwitcher.tsx           # pills or menu (“Language” + icon); Footer/Header/auth
  Toast.tsx                    # bottom-right outcome alerts (see ui-patterns.md)
  Input.tsx                    # pill field; optional password reveal (Eye / EyeOff)
  Select.tsx                   # trigger composes Button field
  Checkbox.tsx
  AccordionItem.tsx            # question row composes Button ghost
  bits/                        # React Bits–style motion/décor
    CurvedLoop.tsx             # bridgeAbove + bridgeBelow
    ClickSpark.tsx
    AnimatedContent.tsx        # elastic pop, once
    ScrollReveal.tsx
    DotGrid.tsx
    TiltedCard.tsx
    Aurora.tsx                 # ogl; not on `/` today
    …

i18n/                          # client locale (no path prefixes)
  LocaleProvider.tsx
  locales.ts                   # LOCALES, LOCALE_NAMES, storage key, detectBrowserLocale
  messages/{pt,en,es}.ts
  types.ts
  index.ts

app/
  providers.tsx                # LocaleProvider + ToastProvider outside Lenis; SmoothScrollProvider
  page.tsx                     # Landing composition (no waitlist section)
  register/page.tsx            # Auth split: carousel + two-step register card
  login/page.tsx               # Auth split: carousel + login card (Google UI-only)
  api/waitlist/                # temporary Route Handler → Nest marketing Wave 2

public/images/clay/            # mascot WebP + PNG (family PNG unoptimized)

features/auth/                 # shared auth chrome (no landing Header/Footer)
  AuthSplitLayout.tsx
  AuthImageCarousel.tsx
  GoogleAuthButton.tsx
  LoginForm.tsx
  RegisterForm.tsx             # step 1 WaitlistForm onContinue → step 2 password
  passwordValidation.ts        # strong password rules (client)

features/landing/components/
  Header.tsx                   # Log in + Create account + BubbleMenu + LocaleSwitcher
  Hero.tsx                     # 100svh white; clay puppy + cat; SplitText + parallax
  ClayFigure.tsx               # mascot catalog (webp/png) + wiggle + clay-float
  ClayStage.tsx                # framed podium; not on `/` today
  SolutionSection.tsx          # bento pillars; AnimatedContent
  HowItWorks.tsx               # bg-pastel-green; leash SVG; critter clay
  AudienceCards.tsx            # polaroid cards + family clay
  Differentials.tsx            # bg-pastel-yellow; monkey clay
  FAQ.tsx                      # bg-pastel-pink (feeds pink CurvedLoop bridge)
  WaitlistSection.tsx          # optional section chrome; form embeds in RegisterForm
  Footer.tsx                   # showDivider={false} on `/`; columns + locale + wordmark
  OrganicBlob.tsx
  SectionDivider.tsx
  PortalScene.tsx              # SVG portal layers; not on `/` today
  FloatingDecor.tsx            # parallax décor; not on `/` today

features/waitlist/
  WaitlistForm.tsx             # profile fields; optional onContinue for multi-step
  validation.ts
  submitWaitlist.ts
  …

features/consent/
```

**Not in public page flow:** `ProblemSection`, `SocialProofCarousel`.

**Button rule:** feature code must not hardcode styled `<button>` / CTA `<a>` — use `Button` or `LocaleSwitcher`. See design brief § Header / Button system.

**Toast rule:** any outcome the user must notice uses `useToast` — never permanent inline status under forms. See [`ui-patterns.md`](../ui-patterns.md).

Visual specs: [`landing-design-brief.md`](landing-design-brief.md).

### Motion and performance

- Prefer `transform` / `opacity` (compositor-friendly)
- Check `prefers-reduced-motion` on Hero (no parallax / scroll fade / clay-float), BubbleMenu, Select, Accordion, Lenis, CurvedLoop, Button fill, AnimatedContent
- Disable Lenis under reduced motion; anchors still land with header offset
- Global custom scrollbar (transparent track, pink thumb); `scroll-padding-top` for fixed header chrome
- `Button`: `magnetic` does **not** gate fill hover — fill stays on for `md` fill variants; `white` has CSS green hover; compact `pink` uses color/shadow hover **without scale**
- Toast enter/exit: CSS swipe (translate + opacity)
- Clay: CSS `clay-float` only; click wiggle is a short GSAP tween
- Next image: AVIF/WebP, extended `deviceSizes` / `imageSizes` for ~560–720 CSS px figures

---

## 3. Form and persistence

### Register flow (UI)

1. **Step 1 — profile:** `WaitlistForm` with `onContinue` (client validation only; no API call).
2. **Step 2 — password:** client strong-password check (`passwordValidation.ts`), then `submitWaitlist(profile)`.
   - Password is **not** sent to `/api/waitlist` yet (waitlist lead only until auth).
   - Show/hide via `Input` `revealable`.

### Profile fields (aligned with content brief)

- `name` (string, required)
- `email` (string, required, validated)
- `profileType` (enum: `person` | `ong` | `veterinary_clinic` | `other`, required)
- `city` / `state` (optional)
- `lgpdConsent` (boolean, required = true)

### Password rules (client — register step 2)

- Min **8** characters
- At least one **uppercase** letter
- At least one **special** character (non-alphanumeric)
- Confirm must match

Failures → **error toast**. Live checklist stays in the form.

### Persistence

**Own endpoint** (no Mailchimp/Typeform in MVP):

1. **Route Handler in `apps/web`** + light `waitlist_entries` — preferred if API not ready  
2. **Minimal Nest endpoint in `apps/api`** — better once API is scaffolded  

Requirements: server-side validation, basic rate limit, waitlist lead only (`WaitlistEntry`), LGPD consent + timestamp.

UI copy uses **account** language (“Criar conta”); storage remains waitlist until auth ships.

Field/code names: **English** (`camelCase` API / `snake_case` DB); UI in **PT / EN / ES**.

---

## 4. Internationalization (PT + EN + ES)

- Default: **Portuguese** (`pt`)
- Also: **English** (`en`), **Spanish** (`es`)
- **No locale path prefixes** (`/en`, `/es`) — same app routes; English path names: `/`, `/register`, `/login`, and section hashes `/#top`, `/#solution`, `/#how-it-works`, `/#audience`, `/#faq`, `/#privacy`, `/#terms`
- Implementation: [`apps/web/src/i18n/`](../../../apps/web/src/i18n/) — typed message dictionaries + `LocaleProvider` / `useT()` / `useLocale()`
- Preference: `localStorage` key `animaps-locale`; first visit falls back to `navigator.language`
- Language UI: **`LocaleSwitcher`** (`variant="menu"` — Language label + icon dropdown) in Header, Footer, and auth; see [`ui-patterns.md`](../ui-patterns.md)
- Provider wraps the app **outside** Lenis so locale works with reduced motion; `ToastProvider` sits inside `LocaleProvider`
- SSR metadata in `layout.tsx` stays PT default; client syncs title after hydrate
- Nav keys include `language` / `languageAria`; auth includes `showPassword` / `hidePassword`

---

## 5. Analytics and consent

| Item | Decision |
|---|---|
| GA4 | **Yes** — measure origin and conversion |
| Meta Pixel | **No** |
| Minimum events | `cta_click`, `waitlist_submit`, (optional) `scroll_depth` |
| Cookie banner | **Yes**, simple (accept / reject non-essential) via `Button` |
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
| Staging | Prefer `develop` → Vercel preview (see [`git-and-ci.md`](../../infrastructure/git-and-ci.md)) |
| Production | Branch `main` |

---

## 8. Pre–go-live tests (§1.6)

- [ ] Cross-browser: Chrome, Safari, Firefox
- [ ] Real mobile devices
- [ ] Form submit (success, validation, rate limit) — feedback via **toasts**
- [ ] PT ↔ EN ↔ ES switch from **Header menu**, **Footer**, and **auth** language menu (no URL change; preference persists)
- [ ] Header shows **Log in** + **Create account** beside the menu toggle from `md` up; on small screens CTAs are menu-only (no chrome overflow)
- [ ] Auth forms scroll on mobile (`safe-area` bottom padding); no overlapping LGPD / Google / Continuar controls
- [ ] `/register` two-step signup (profile → strong password + reveal toggle) + waitlist submit; `/login` UI (Google CTA UI-only until OAuth)
- [ ] Auth split layout: carousel (rescue/adoption/wildlife) + form column; step pill `n/2`; no logo in form chrome; no landing Header/Footer on auth routes
- [ ] Landing CTAs navigate to `/register` (no in-page waitlist block)
- [ ] English hashes: `/#top`, `/#solution`, `/#how-it-works`, `/#audience`, `/#faq`, `/#privacy`, `/#terms`
- [ ] Bubble menu: opens below CTA cluster; closes via toggle / outside / Escape / nav click
- [ ] Soft menu toggle: green when closed, pink when open
- [ ] `Button` hovers (esp. `white` secondary CTA green fill; compact pink without scale ghost)
- [ ] Cookie banner + GA4 only post-consent
- [ ] Smooth hash scroll (buttons/menu → sections) feels continuous under Lenis
- [ ] CurvedLoop bridges: no white gap under FAQ (pink) / HowItWorks (green); pink ribbon **`bridgeBelow`** meets footer (no double wave)
- [ ] Clay mascots: puppy + cat in Hero; critter / family / monkey in later sections; crisp on retina; `clay-float` off under reduced motion
- [ ] Full-viewport sections (`min-h-[100svh]`) read as one scene per scroll on desktop
- [ ] `prefers-reduced-motion`: usable without animation
- [ ] Design-brief anti-generic checklist (visual review)

---

## 9. Suggested implementation order

1. ~~Scaffold monorepo~~ — **done**
2. ~~Design tokens + fonts + `SmoothScrollProvider`~~ — **done** (Bagel Fat One + Nunito; Lenis anchors tuned)
3. ~~Header + Hero + bits + section flow~~ — **done**
4. ~~WaitlistForm + `/api/waitlist` placeholder~~ — **done**
5. ~~Client i18n PT/EN/ES + LocaleSwitcher~~ — **done**
6. ~~Shared `Button` / Header chrome polish~~ — **done**
7. ~~`/register` + `/login`; English section hashes; waitlist off landing~~ — **done**
8. ~~Auth split UI, two-step register, toasts, language menu, Header Log in~~ — **done**
9. ~~Clay mascots + fullscreen landing restyle~~ — **done**
10. Final copy polish + assets (logo, social URLs); i18n alts for all clay figures
11. Real waitlist persistence + real auth for `/login` (persist password / OAuth)
12. Cookie banner → GA4 post-consent + events
13. SEO + Lighthouse >90
14. Domain + Vercel production deploy

**Run locally:** from root, `pnpm dev` (filters `@animaps/web`).

---

## 10. Out of scope (Phase 1)

- Full auth / JWT / profiles (Phase 2) — password is validated in UI only today
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
- [`ui-patterns.md`](../ui-patterns.md) — toasts, language menu, password rules, reveal toggle
- [`git-and-ci.md`](../../infrastructure/git-and-ci.md)
- [`lgpd-checklist.md`](../../security/lgpd-checklist.md)
- [`privacy-policy-draft.md`](../../security/privacy-policy-draft.md)
- [`architecture.md`](../../architecture.md)
