# ANIMAPS — Matching & discover

Conceptual “match” experience for **animals, people, NGOs, protectors** — not a visual Tinder clone. Algorithm deferred; frontend ships structure, types, and mocks.

Related: [dashboard.md](../features/dashboard.md) · [onboarding.md](../features/onboarding.md) · [bounded-contexts.md](../architecture/bounded-contexts.md) (`adoption`).

---

## Discover UI

Route: `/discover` is the primary home for **PERSON** and **OTHER**. `/dashboard` redirects to `/discover` **only for PERSON**; ONG / clinic (and OTHER) keep `/dashboard` as documented in [dashboard.md](../features/dashboard.md) / [user-flow.md](../features/user-flow.md).

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
