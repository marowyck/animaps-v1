# ANIMAPS — Engineering conventions

Normative rules for keeping the codebase and docs consistent as multi-user-type features grow. Prefer this file over inventing parallel patterns.

Related: [architecture.md](architecture.md) · [onboarding.md](onboarding.md) · [user-types.md](user-types.md) · [components.md](components.md) · [schema-evolution.md](schema-evolution.md).

---

## Naming

| Layer | Convention | Example |
|---|---|---|
| TypeScript / React | `camelCase` values, `PascalCase` types/components | `userType`, `PersonProfile` |
| Onboarding / permission config keys | `SCREAMING_SNAKE` | `PERSON`, `CREATE_ANIMAL` |
| Postgres / Prisma enums & columns | `snake_case` | `user_type`, `veterinary_clinic` |
| Routes | kebab-case path segments | `/onboarding/animal-preferences` |
| i18n message keys | camelCase nested objects | `onboarding.intention.items.adopt` |
| Feature folders | lowercase singular domain | `features/onboarding` |

**User type dual form:** UI/config uses `PERSON` / `ONG` / `VETERINARY_CLINIC` / `OTHER`. Persistence and waitlist API use `person` / `ong` / `veterinary_clinic` / `other`. Convert only at boundaries (`USER_TYPE_TO_DB` / `normalizeUserType` in `features/user-types`).

Do **not** reintroduce `guardian` / `ngo` / `clinic` as live identifiers. Legacy aliases exist only for draft migration and docs history.

---

## Feature module rules

1. Every feature under `apps/web/src/features/<name>/` exposes a public `index.ts`.
2. Other features import **only** from that barrel — never deep-import `components/` or internal hooks of another feature.
3. Shared presentational primitives live in `apps/web/src/components/` (Button, Modal, SelectableCard, …). Domain forms and selectors that need onboarding draft types live under the owning feature (e.g. `OrganizationForm` in onboarding).
4. `app/` routes stay thin: resolve params, render a feature entry component.
5. Browser storage keys are feature-owned constants (e.g. `ONBOARDING_DRAFT_KEY`). Do not invent ad-hoc keys in pages.

---

## Multi-user-type architecture (non-negotiable)

```text
User (shared auth)
  └─ user_type
  └─ at most one type-specific profile row
  └─ intentions / other_role / prefs as related tables (Wave 2)
```

| Concern | Single system | Forbidden |
|---|---|---|
| Auth | One register/login/verify path | Per-type auth apps or duplicate OTP flows |
| Onboarding | `ONBOARDING_FLOWS[userType]` + step registry | Copy-paste route trees per type |
| Dashboard nav | `DASHBOARD_CONFIGS[userType]` + `hasPermission` | Hard-coded `if (type === …)` trees in Sidebar |
| Permissions UI | `features/permissions` catalog | Inline string permission checks scattered in JSX |
| Schema | `User.userType` + 1:1 profile tables | Embedding org/clinic blobs on `users` |

When adding a **new public user type**:

1. Add enum value (docs schema + waitlist + `PUBLIC_USER_TYPES`).
2. Add profile table / draft blob if needed.
3. Add `ONBOARDING_FLOWS` entry + step components (reuse forms).
4. Add `DASHBOARD_CONFIGS` + permission list.
5. Update i18n (`form.profiles`, onboarding copy) in **pt / en / es**.
6. Update `user-types.md`, `onboarding.md`, `dashboard.md`, `permissions.md`, dictionary/DER/Prisma in the same change set.

---

## Dynamic onboarding contract

Step definitions live in `features/onboarding/config/flows.ts`:

| Field | Meaning |
|---|---|
| `id` | URL segment under `/onboarding/[step]` |
| `required` | Blocks continue when validation fails |
| `skippable` | Shows skip CTA |
| `conditions?(draft)` | When false, step is removed from active progress |

Navigation is **computed** (`getAdjacentSteps` / `useOnboardingNavigation`) — step UIs must not hardcode `router.push("/onboarding/…")` for happy-path continue/back (legacy redirects for old URLs are the exception).

Progress totals come from `getActiveSteps(userType, draft)`, not a global constant.

**Verification modes:** `VerificationFlow` with `selfie` (PERSON) vs `institutional` (ONG / VETERINARY_CLINIC). Do not fork a second verification feature folder.

---

## UI patterns that affect layout

- **Modals** must portal to `document.body` (`createPortal`). Parents that use CSS `transform` (e.g. `animate-fade-in-up`) create a containing block; without a portal, `fixed inset-0` overlays only that box instead of the viewport.
- Overlays use a high z-index (`z-[100]` for modal) above shell chrome (`z-40` mobile nav, `z-50` landing header).
- User-visible strings go through `useT()` / `Messages`. Keep all three locales in sync when adding keys.

---

## Permissions split

| Doc / module | Audience |
|---|---|
| `features/permissions` + [permissions.md](permissions.md) | Coarse UI capability flags |
| [permissions-matrix.md](permissions-matrix.md) | Domain actions for future Nest guards |

UI `hasPermission` is **not** authorization. Never rely on hidden nav alone for sensitive actions once the API exists.

---

## Data model docs

| Artifact | Role |
|---|---|
| [schema.prisma](schema.prisma) | Machine-readable draft (docs only until `apps/api`) |
| [der.dbml](der.dbml) | dbdiagram.io ER |
| [data-dictionary.md](data-dictionary.md) | Field-level contract + LGPD |
| [database.md](database.md) | Wave 2 candidate tables not yet in Prisma |

Keep Prisma, DBML, and dictionary in lockstep. Prefer additive changes ([schema-evolution.md](schema-evolution.md)).

---

## Documentation checklist (every feature PR)

1. Update the owning product doc (onboarding / dashboard / auth / …).
2. Record **current (mock/frontend)** vs **future (API)** behavior.
3. Append a short **Decision log** entry for non-obvious choices.
4. If schema touched: Prisma + DBML + dictionary (+ this conventions file if a new pattern appears).
5. Refresh [README.md](README.md) index when adding a top-level doc.

---

## Decision log

- Conventions extracted so multi-type work does not regress into duplicated register/onboarding trees.
- SCREAMING_SNAKE config keys match product language (`PERSON`, `ONG`) while DB stays `snake_case`.
- Portal-based modals are mandatory after onboarding animation transforms trapped overlays.
