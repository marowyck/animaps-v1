# ANIMAPS — Matching & discover

Conceptual “match” experience for **animals, people, NGOs, protectors** — not a visual Tinder clone. Algorithm deferred; frontend ships structure, types, and mocks.

Related: [dashboard.md](dashboard.md) · [onboarding.md](onboarding.md) · [bounded-contexts.md](bounded-contexts.md) (`adoption`).

---

## Discover UI

Route: `/discover` (primary app home; `/dashboard` redirects here).

- Large full-height `DiscoverCard`
- No page title above the card
- Drag / swipe left (“Não posso”) or right (“Tenho interesse”); action buttons below
- Entity kinds: `animal` | `person` | `organization` | `protector`

No scoring engine in this phase.

---

## Types (frontend)

```ts
type DiscoverEntityKind = "animal" | "person" | "organization" | "protector";

type DiscoverItem = {
  id: string;
  kind: DiscoverEntityKind;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  tags?: string[];
  distanceKm?: number;
};
```

Mocks: `features/discover/mockDiscoverItems.ts`.

---

## Future algorithm (placeholder)

Inputs: intentions, animal preferences, interests, approximate location, verification flags.  
Output: ranked candidates + optional compatibility score (0–100) as already envisioned on `adoptions.compatibility_score`.

Wire actions to API when Phase 07 product roadmap + Wave 2/3 infra land.

---

## Decision log

- Actions are UI-complete with toasts; no persistence.
- Keep card chrome ANIMAPS-branded (rounded, pastel accents, clay-friendly imagery later).
