# ANIMAPS — Profile (PERSON enrichment)

Optional enrichment rows collected during PERSON (and reused by OTHER) onboarding via `ProfileForm`. Fields are **optional** and oriented toward what NGOs / adoption flows need — not dating-style lifestyle trivia.

**Type-specific institutional schemas** (org / clinic / other role) live in [profiles.md](profiles.md). This file is only the additional-info / privacy layer.

Related: [profiles.md](profiles.md) · [onboarding.md](onboarding.md) · [database.md](database.md) · [design-system.md](design-system.md).

---

## Additional info rows (UI)

| Key | Purpose for NGOs |
|---|---|
| `animal_experience` | Prior care experience |
| `housing_type` | Apartment / house / rural |
| `has_yard` | Outdoor space |
| `other_pets` | Existing animals |
| `children_at_home` | Household with children |
| `available_time` | Capacity for daily care |
| `adoption_readiness` | Timeline to adopt |
| `foster_availability` | Temporary home capacity |
| `volunteer_interest` | Willingness to help orgs |
| `city_region` | Approximate area |

Out of scope (intentionally avoided): zodiac, love language, drinks/smoking, dating-style socials.

---

## Privacy model

Per field: `public` | `matches` | `private` via `PrivacySelector`. Defaults lean `matches` / `private`.

---

## Decision log

- Profile hub remains optional rows + stub selectors (frontend draft).
- Copy and options speak the language of responsible adoption, not social dating.
