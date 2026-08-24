# Landing Page — Content Brief (Phase 1)

Content and strategy for the ANIMAPS institutional landing.  
Sources: Phase 1 alignment decisions + [`ANIMAPS_Roadmap.md`](../ANIMAPS_Roadmap.md) §1.1–1.2 + [`personas.md`](personas.md).

**Status:** decisions closed (copy execution still pending).

---

## 1. Primary goal

**Waitlist capture** focused on guardians/adopters (`guardian`), with **balanced** messaging for NGOs (`ngo`).

- Hero primary CTA: **"Join the waitlist"**
- Out of scope this phase: sponsorship, paid traffic, Meta Pixel
- Geographic framing: **national** (do not lock copy to a pilot city)

---

## 2. Success metric

| Order | Metric | How to measure |
|---|---|---|
| Primary | Visitor → waitlist signup | GA4 `waitlist_submit` / form submit |
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
| Context | Anonymous reporter | João | May appear in Problem pain / occurrence map |

---

## 4. Tone of voice

- **Emotional with real data**, not melodramatic.
- Direct, human, responsible — avoid tech jargon.
- Canonical matching term: **"Ideal Match"** (not “algorithm”, not “smart compatibility” in external copy).
- Languages: **Portuguese + English** from launch (i18n strings; PT default).

---

## 5. Statistics and social proof

### Abandonment stats

- Include **cited numbers with sources** in “The Problem”.
- Status: **research and validate sources before publish** (do not invent).
- Prefer citable sources (IBGE, WOAH/OIE, ministries, academic studies, animal-protection reports).

### Social proof

- No guaranteed real testimonials yet.
- Use **projected numbers with transparency** (e.g. “Pilot goal”, “In progress”) — never as proven results.
- When pilot NGO is confirmed ([`pilot-ngo.md`](pilot-ngo.md)), update this section.

---

## 6. Section structure

Canonical order:

1. **Hero** — impact line + CTA “Join the waitlist” + image (real photo; **no video**).
2. **The Problem** — abandonment, scattered info (social networks), NGO friction; sourced data.
3. **The Solution** — Ideal Match + occurrence map; plain language.
4. **How it works** — visual steps (e.g. 1. Create profile → 2. See Ideal Match → 3. Adopt responsibly).
5. **Who it’s for** — cards:
   - Guardian / adopter
   - NGO
   - **Clinic** (dedicated / first-class card)
   - Public agency / research (**institutional mention**, light card or short text)
6. **Differentiators** — vs Facebook/Instagram/WhatsApp groups.
7. **Social proof** — transparent projected numbers / space for future partners.
8. **FAQ** — launch, free?, Ideal Match, NGOs/clinics, urgency/map, LGPD, coverage, mobile app.
9. **Final CTA** — reinforced form + privacy link.

Footer: institutional links, privacy, terms, language (PT/EN).

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
- Success: immediate confirmation (“You’re on the list. We’ll be in touch soon.”).
- No password or documents (`taxId`) this phase — interest only.

---

## 8. Privacy policy and terms

- Adapt draft: [`privacy-policy-draft.md`](privacy-policy-draft.md). Final BR consumer copy may later need PT.
- Publish a **minimum** landing version covering: waitlist fields (name, email, profile type, city), consent basis, retention, LGPD rights.
- Controller remains **TBD** until pre-launch ([`lgpd-checklist.md`](lgpd-checklist.md)).
- Minimum terms for site use / waitlist capture.

---

## 9. Distribution channels (still to map)

Decision: **organic only** at start (no ads).

Execution backlog (§1.7):

- [ ] List target animal-protection Instagrams / communities
- [ ] NGO WhatsApp/Telegram groups
- [ ] Direct NGO contacts (align with [`pilot-ngo.md`](pilot-ngo.md))
- [ ] Launch post plan (PT; EN if channel exists)

---

## 10. Copy checklist before go-live

- [ ] Hero headline + subheadline (PT and EN)
- [ ] Section copy with consistent “Ideal Match”
- [ ] Stats with validated sources
- [ ] Form microcopy (labels, errors, success) PT and EN
- [ ] Adapted privacy policy + minimum terms
- [ ] Transparent disclaimer on projected numbers
- [ ] Tone review (emotional ≠ melodramatic)

---

## References

- Roadmap §1.1–1.2, §1.7
- [`personas.md`](personas.md)
- [`privacy-policy-draft.md`](privacy-policy-draft.md)
- [`landing-design-brief.md`](landing-design-brief.md)
- [`landing-tech-plan.md`](landing-tech-plan.md)
