# ANIMAPS — Personas

Personas for UX and product rules. Source: roadmap §0.3 (+ Phase 0 validation expansions).

Related: [`permissions-matrix.md`](permissions-matrix.md) · [`bounded-contexts.md`](bounded-contexts.md).

---

## 1. Ana — first-time adopter

| | |
|---|---|
| **Profile** | `guardian` |
| **Context** | Small apartment, little free time, wants a low-maintenance animal |
| **Goal** | Adopt safely, without regret |
| **Pain** | Social-media listings with no compatibility filter; return risk |
| **Platform value** | Compatibility score and alerts when the animal needs more space/energy than she has |
| **Implication** | Matching weights size×space and energy×time; clear UX for “why” of the score |

---

## 2. ONG Patas Unidas

| | |
|---|---|
| **Profile** | `ngo` (needs `verified`) |
| **Context** | Small team; volunteers with no time for long forms |
| **Goal** | Place animals in responsible homes; manage requests |
| **Pain** | Spreadsheets/WhatsApp groups; slow signup; lost follow-up |
| **Platform value** | Fast listing (minimum requireds), request panel, occurrence area |
| **Implication** | Lean animal form; mobile-first; `AdoptionRequested` notification |

---

## 3. Dr. Marcos — biologist / researcher

| | |
|---|---|
| **Profile** | `biologist` |
| **Context** | Needs aggregated wildlife data by region |
| **Goal** | Environmental reports, seasonality, hotspots |
| **Pain** | Scattered data; personal data mixed with research interest |
| **Platform value** | Aggregate dashboard + export without PII (neighborhood/city); validate `wildlife_sighting` |
| **Implication** | No guardian PII access; focus on `wildlife_sighting` + analytics |

---

## 4. Dr. Helena — partner veterinary clinic

| | |
|---|---|
| **Profile** | `clinic` (needs `verified`) |
| **Context** | Neighborhood clinic for neuter/vaccines; occasional rescues |
| **Goal** | List services, register rescued animals, issue reliable health history |
| **Pain** | No structured channel with NGOs/guardians; reports lost in WhatsApp |
| **Platform value** | Services profile, `RegisterAnimal` when verified, base for Phase 3 `HealthReport` |
| **Implication** | Same institutional verification flow as NGO; clear services UI |

---

## 5. Ricardo — independent rescuer guardian

| | |
|---|---|
| **Profile** | `guardian` with `isRescuer = true` |
| **Context** | Rescues on his own, no formal NGO |
| **Goal** | List animals for responsible adoption without CNPJ bureaucracy |
| **Pain** | Platforms accept NGOs only; informal groups with no interest tracking |
| **Platform value** | `isRescuer` allows `CreateAnimal`; manages requests as origin |
| **Implication** | Clear rescuer onboarding; trust limits vs verified NGO |

---

## 6. Carla — public agency representative

| | |
|---|---|
| **Profile** | `public_agency` |
| **Context** | Municipal secretariat / animal-welfare enforcement |
| **Goal** | Monitor reports (abuse, abandonment), validate occurrences, support public policy |
| **Pain** | Phone/email-only reports; no operational map; data not anonymized for sharing |
| **Platform value** | Validate/follow occurrences; wide dashboard; aggregate export |
| **Implication** | Distinct from biologist: operational reports and enforcement, not only wildlife |

---

## 7. João — anonymous occurrence reporter

| | |
|---|---|
| **Profile** | Anonymous (`occurrences.user_id` null) or later `ClaimOccurrence` |
| **Context** | Sees hit/abandoned animal on the street; wants to report fast |
| **Goal** | Register in under 1 minute with photo + map pin |
| **Pain** | Apps that force long signup in an emergency |
| **Platform value** | `RegisterOccurrence` without login; IP rate limit; optional claim later |
| **Implication** | Extreme mobile-first UX; geo/photo consent at submit; no mandatory PII |

---

## Persona × technical profile

| Persona | Role / flag |
|---|---|
| Ana | `guardian` |
| ONG Patas Unidas | `ngo` + `verified` |
| Dr. Marcos | `biologist` |
| Dr. Helena | `clinic` + `verified` |
| Ricardo | `guardian` + `isRescuer` |
| Carla | `public_agency` |
| João | anonymous / optional claim |
