# Landing Page — Content Brief (Phase 1)

Content and strategy for the ANIMAPS institutional landing.  
Sources: Phase 1 alignment decisions + [`ANIMAPS_Roadmap.md`](../ANIMAPS_Roadmap.md) §1.1–1.2 + [`personas.md`](personas.md).

**Status:** decisions closed; public landing uses **account-first** CTAs (“Criar conta”) while the form still posts to the **waitlist** backend until auth ships.

---

## 1. Primary goal

**Lead capture** focused on guardians/adopters (`guardian`), with **balanced** messaging for NGOs (`ngo`).

- Hero primary CTA: **"Criar conta"** / create account (maps to waitlist form `#lista`)
- Out of scope this phase: sponsorship, paid traffic, Meta Pixel, investor pages
- Geographic framing: **national** (do not lock copy to a pilot city)
- **No Problem section** on the public page — sell solutions/benefits only

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

- **Emotional with real data**, not melodramatic.
- Direct, human, responsible — avoid tech jargon.
- Canonical matching term: **"Ideal Match"** / PT **"Match ideal"** (not “algorithm”, not “smart compatibility” in external copy).
- Languages: **Portuguese + English** from launch (i18n strings; PT default).

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

1. **Hero** — emotional line (*“O seu melhor amigo espera.”*) + CTAs “Criar conta” / “Ver como funciona” + pet photo; decorative filled paw prints in background.
2. **The Solution** — product benefits / Ideal Match + occurrence map; plain language (**no Problem section above**).
3. **How it works** — steps: create account → profile → match/map → adopt; section surface **pastel green** (feeds green CurvedLoop bridge).
4. **CurvedLoop (green)** — marquee; `bridgeAbove` continues green into the wave.
5. **Who it’s for** — cards: Guardian, NGO, Clinic, Public agency / research.
6. **Differentiators** — ANIMAPS features only (no competitor comparison table required).
7. **FAQ** — launch, free?, Ideal Match, NGOs/clinics, urgency/map, LGPD, coverage, mobile app; surface **pastel pink**.
8. **CurvedLoop (pink)** — marquee; `bridgeAbove` continues pink into the wave.
9. **Final CTA** — create-account / waitlist form + privacy link.

**Footer:** brand blurb, platform/account/legal columns, social links (name + icon), language pill, oversized ANIMAPS wordmark. No newsletter CTA card.

---

## 7. Form (microcopy)

### Fields

| Field | Required | Notes |
|---|---|---|
| Name | Yes | |
| Email | Yes | Format validation |
| Profile type | Yes | `guardian` / `ngo` / `clinic` / `other` |
| City / State | Optional (recommended) | Helps national segmentation |
| LGPD consent | Yes | Checkbox + link to policy |

### Microcopy guidelines

- User-language labels (“I’m a guardian / Want to adopt”, “I’m an NGO”, etc.).
- Errors: specific and actionable (“Enter a valid email”).
- Success: immediate confirmation (account/waitlist framing).
- No password or documents (`taxId`) this phase — interest only.
- UI may say **create account**; backend remains waitlist until auth.

---

## 8. Privacy policy and terms

- Adapt draft: [`privacy-policy-draft.md`](privacy-policy-draft.md). Final BR consumer copy may later need PT.
- Publish a **minimum** landing version covering: waitlist fields (name, email, profile type, city), consent basis, retention, LGPD rights.
- Controller remains **TBD** until pre-launch ([`lgpd-checklist.md`](lgpd-checklist.md)).
- Minimum terms for site use / waitlist capture.
- Footer keeps `#privacidade` and `#termos` anchors.

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

- [ ] Hero headline + subheadline (PT and EN)
- [ ] Section copy with consistent “Ideal Match” / “Match ideal”
- [ ] No Problem-section scare copy on public `/`
- [ ] Form microcopy (labels, errors, success) PT and EN — account-facing where appropriate
- [ ] Adapted privacy policy + minimum terms
- [ ] Official social profile URLs in Footer
- [ ] Tone review (emotional ≠ melodramatic)

---

## References

- Roadmap §1.1–1.2, §1.7
- [`personas.md`](personas.md)
- [`privacy-policy-draft.md`](privacy-policy-draft.md)
- [`landing-design-brief.md`](landing-design-brief.md)
- [`landing-tech-plan.md`](landing-tech-plan.md)
