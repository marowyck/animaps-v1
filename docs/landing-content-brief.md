# Landing Page — Content Brief (Phase 1)

Content and strategy for the ANIMAPS institutional landing.  
Sources: Phase 1 alignment decisions + [`ANIMAPS_Roadmap.md`](../ANIMAPS_Roadmap.md) §1.1–1.2 + [`personas.md`](personas.md).

**Status:** decisions closed; public landing uses **account-first** CTAs that navigate to **`/register`** and **`/login`**. Register is a **two-step** create-account UI (profile → strong password); backend remains **waitlist** until real auth ships. Login is a UI placeholder (email/password + Google CTA). In-page section hashes and app paths are **English**.

---

## 1. Primary goal

**Lead capture** focused on guardians/adopters (`guardian`), with **balanced** messaging for NGOs (`ngo`).

- Hero primary CTA: **"Criar conta"** / create account → **`/register`**
- Header chrome: **Log in** → **`/login`** (secondary) beside **Create account** (primary)
- Out of scope this phase: sponsorship, paid traffic, Meta Pixel, investor pages
- Geographic framing: **national** (do not lock copy to a pilot city)
- **No Problem section** on the public page — sell solutions/benefits only
- **No waitlist/create-account block on `/`** — form lives only on `/register`

---

## 2. Success metric

| Order | Metric | How to measure |
|---|---|---|
| Primary | Visitor → account/waitlist signup | GA4 `waitlist_submit` / form submit |
| Secondary | Profile mix (guardian / NGO / clinic / other); bounce; scroll depth to final CTA | GA4 + form fields |

Post-launch review window: **2 weeks** (roadmap §1.7).

---

## 3. Audiences and hierarchy

| Priority | Audience | Persona | Role on landing |
|---|---|---|---|
| 1 (primary CTA) | Guardians / adopters | Ana, Ricardo | Hero + “How it works” + form |
| 1 (voice parity) | NGOs | Patas Unidas | Card in “Who it’s for” + secondary form CTA |
| 2 | Clinics | Dr. Helena | **Dedicated section/card** |
| 3 | Public agencies / researchers | Carla, Dr. Marcos | **Brief institutional mention** (no strong CTA) |
| Context | Anonymous reporter | João | May appear via occurrence-map benefit copy (not a Problem scare section) |

---

## 4. Tone of voice

- **Warm and human**, not corporate or robotic — speak like a person who cares about animals.
- **Clear with room to breathe** — not telegram-sparse, not fluffy. Prefer a short paragraph or two over one clipped line when context helps trust.
- Direct, emotional with real care; avoid tech jargon and empty marketing adjectives.
- Address the reader as **you**; concrete outcomes.
- Canonical matching term: **"Ideal Match"** / PT **"Match ideal"** / ES **"Match ideal"** (not “algorithm”, not “smart compatibility” in external copy).
- Languages: **Portuguese (default) + English + Spanish** via client dictionaries (no `/en` or `/es` routes). Keep the three locales in sync when editing copy.

Copy source of truth: [`apps/web/src/i18n/messages/pt.ts`](../apps/web/src/i18n/messages/pt.ts) (then `en.ts`, `es.ts`).

---

## 5. Statistics and social proof

### Abandonment stats

- **Not** a dedicated “Problem” section on the public landing.
- If numbers appear later, they must be **cited with sources** (do not invent). Prefer IBGE, WOAH/OIE, ministries, academic studies, animal-protection reports.

### Social proof

- No market-stats carousel on the public page.
- No guaranteed real testimonials yet.
- Use **projected numbers with transparency** only if reintroduced — never as proven results.
- When pilot NGO is confirmed ([`pilot-ngo.md`](pilot-ngo.md)), update this section.

---

## 6. Section structure

Canonical public order (matches `apps/web/src/app/page.tsx`):

1. **Hero** — emotional line (*“O seu melhor amigo espera.”*) + CTAs “Criar conta” (`/register`) / “Ver como funciona” (`/#how-it-works`) + pet photo; decorative filled paw prints in background.
2. **The Solution** — product benefits / Ideal Match + occurrence map; plain language (**no Problem section above**).
3. **How it works** — steps: create account → profile → match/map → adopt; section surface **pastel green** (feeds green CurvedLoop bridge).
4. **CurvedLoop (green)** — marquee; `bridgeAbove` continues green into the wave.
5. **Who it’s for** — cards: Guardian, NGO, Clinic, Public agency / research.
6. **Differentiators** — ANIMAPS features only (no competitor comparison table required).
7. **FAQ** — launch, free?, Ideal Match, NGOs/clinics, urgency/map, LGPD, coverage, mobile app; surface **pastel pink**; questions use shared `Button` (`cursor-pointer`).
8. **CurvedLoop (pink)** — marquee; `bridgeAbove` continues pink into the wave.

**Auth routes (English):**

- **`/register`** — two-step create-account UI:
  1. Profile fields (name, email, profile type, city/state, LGPD) + optional **Continue with Google** (UI-only toast)
  2. Password + confirm (strong password; show/hide eye toggle) → waitlist submit + success toast
- **`/login`** — email/password UI + Google CTA (UI-only); submit and Google show info toasts until real auth; link to `/register`

**Header chrome:** frosted cluster with **Log in** (`/login`, secondary) + **Create account** (`/register`, primary) + menu (sections + register + login + language menu).

**Footer:** brand blurb, platform/account/legal columns, social links (name + icon), **language menu** (`LocaleSwitcher variant="menu"`), oversized ANIMAPS wordmark. No newsletter CTA card. No locale URL prefixes.

**Section hashes (English):** `#top`, `#solution`, `#how-it-works`, `#audience`, `#differentials`, `#faq`, `#privacy`, `#terms`.

---

## 7. Form (microcopy)

### Step 1 — profile

| Field | Required | Notes |
|---|---|---|
| Name | Yes | |
| Email | Yes | Format validation |
| Profile type | Yes | `guardian` / `ngo` / `clinic` / `other` |
| City / State | Optional (recommended) | Helps national segmentation |
| LGPD consent | Yes | Checkbox + link to policy |

Primary action label: **Continue** (advances to step 2; does not call the API yet).

### Step 2 — password

| Field | Required | Notes |
|---|---|---|
| Password | Yes | Strong: min 8 chars, one uppercase, one special character |
| Confirm password | Yes | Must match |

- Live requirement checklist stays in the form (guidance).
- Show/hide password via eye toggle (`Input` `revealable`).
- Weak / mismatch / missing password → **error toast** (not inline text).
- Final submit: waitlist API for the profile lead; password is **client-validated only** until auth persists credentials.

### Microcopy guidelines

- User-language labels (“I’m a guardian / Want to adopt”, “I’m an NGO”, etc.).
- Errors and success that the user must notice: **toasts** ([`ui-patterns.md`](ui-patterns.md)). Client validation returns **message keys** mapped through i18n.
- Success: account/waitlist framing via **success toast** after step 2.
- No documents (`taxId`) this phase.
- UI may say **create account**; storage remains waitlist until auth.

---

## 8. Privacy policy and terms

- Adapt draft: [`privacy-policy-draft.md`](privacy-policy-draft.md). Final BR consumer copy may later need PT.
- Publish a **minimum** landing version covering: waitlist fields (name, email, profile type, city), consent basis, retention, LGPD rights.
- Controller remains **TBD** until pre-launch ([`lgpd-checklist.md`](lgpd-checklist.md)).
- Minimum terms for site use / waitlist capture.
- Footer keeps `/#privacy` and `/#terms` anchors.

---

## 9. Distribution channels (still to map)

Decision: **organic only** at start (no ads).

Execution backlog (§1.7):

- [ ] List target animal-protection Instagrams / communities (align Footer social URLs when official)
- [ ] NGO WhatsApp/Telegram groups
- [ ] Direct NGO contacts (align with [`pilot-ngo.md`](pilot-ngo.md))
- [ ] Launch post plan (PT; EN if channel exists)

---

## 10. Copy checklist before go-live

- [ ] Hero headline + subheadline review (PT / EN / ES dictionaries) — warm, not sparse, not fluffy
- [ ] Section copy with consistent “Ideal Match” / “Match ideal”
- [ ] No Problem-section scare copy on public `/`
- [ ] Form microcopy (labels, toasts, password rules) across locales — account-facing where appropriate
- [ ] Adapted privacy policy + minimum terms
- [ ] Official social profile URLs in Footer
- [ ] Tone review (warm/human ≠ melodramatic; not robotic)
- [ ] Locale parity: same structure and length intent across `pt` / `en` / `es`

---

## References

- Roadmap §1.1–1.2, §1.7
- [`personas.md`](personas.md)
- [`privacy-policy-draft.md`](privacy-policy-draft.md)
- [`landing-design-brief.md`](landing-design-brief.md)
- [`landing-tech-plan.md`](landing-tech-plan.md)
- [`ui-patterns.md`](ui-patterns.md)
