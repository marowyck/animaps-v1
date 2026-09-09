# ANIMAPS — Onboarding

Config-driven, multi-`UserType` onboarding after email verification. One dynamic route (`/onboarding/[step]`) resolves steps from registry + flow maps — never a hard-coded single-persona wizard.

Related: [conventions.md](conventions.md) · [user-flow.md](user-flow.md) · [user-types.md](user-types.md) · [profiles.md](profiles.md) · [verification.md](verification.md) · [database.md](database.md).

**Source:** `apps/web/src/features/onboarding/`

---

## Goals

- One shared auth → many type-specific data collection paths without duplicating register/login.
- Add a future user type by extending config (flow array + steps + forms), not by cloning the feature tree.
- Keep URLs deep-linkable and progress-aware; skippable steps must not break navigation or progress math.

---

## Package layout

```text
features/onboarding/
├── config/
│   └── flows.ts              # ONBOARDING_FLOWS, STEP_DEFINITIONS, getActiveSteps, …
├── components/               # Reusable selectors & forms (public via index.ts)
├── OnboardingProvider.tsx    # Draft reducer + localStorage persistence
├── OnboardingLayout.tsx      # Chrome: progress, back, skip, continue
├── OnboardingFlow.tsx        # /onboarding/[step] orchestrator
├── useOnboardingNavigation.ts
├── *Step.tsx                 # Thin step screens wired to navigation hooks
├── data.ts                   # Catalogs (intentions, interests, services, …)
├── types.ts                  # Draft + domain unions
├── storage.ts
└── index.ts                  # Public API
```

Route entry: `apps/web/src/app/onboarding/[step]/page.tsx` → `<OnboardingFlow step={…} />`.

---

## Engine API

| Export | Responsibility |
|---|---|
| `ONBOARDING_FLOWS` | Per-type ordered step ids (**without** universal first step) |
| `UNIVERSAL_FIRST_STEP` | Always `"guidelines"` — prepended by `buildFlowSteps` |
| `STEP_DEFINITIONS` | Per-id `required`, `skippable`, optional `conditions(draft)` |
| `getActiveSteps(userType, draft)` | Flow minus steps whose `conditions` return false |
| `getStepProgress` / `getAdjacentSteps` | Progress UI + prev/next resolution |
| `canonicalStepId` | Legacy aliases (`intention` → `intentions`) |
| `hrefForStep` | `/onboarding/${id}` |
| `useOnboardingNavigation(step)` | Continue / back / skip / complete → `/discover` or next |

### Step definition contract

```ts
type StepDefinition = {
  id: OnboardingStepId;
  required: boolean;
  skippable: boolean;
  conditions?: (draft: OnboardingDraft) => boolean;
};
```

`title` / `description` / copy live in i18n (`Messages.onboarding.*`), not in the registry — keeps config language-agnostic.

### Navigation rule

Step components **must** call `useOnboardingNavigation` (or receive navigation from the orchestrator). Do not hardcode happy-path `router.push("/onboarding/…")`. Legacy redirect stubs (`AnimalTypeStep` → `animal-preferences`) are allowed only to preserve old bookmarks.

---

## Flows by `UserType`

| UserType | Steps after `guidelines` |
|---|---|
| `PERSON` | `intentions` → `animal-preferences`\* → `interests` → `additional-info` → `verification` |
| `ONG` | `organization-info` → `location` → `animal-types` → `services` → `verification` |
| `VETERINARY_CLINIC` | `clinic-info` → `location` → `services` → `animals-served` → `verification` |
| `OTHER` | `role-selection` → `profile` → `additional-info` |

\* `animal-preferences` is active only when `draft.intentions.includes("adopt")`.

Shared steps (`location`, `services`) branch internally on `userType` (org vs clinic forms) instead of duplicating route ids.

---

## PERSON intentions

Catalog (`INTENTION_IDS`):

`adopt` · `pet_owner` · `help_animals` · `report` · `lost_animal` · `found_animal` · `community` · `explore`

- Multi-select via `IntentionSelector`.
- At least one intention recommended before continue (UI toast gate).
- Animal preference UI (`AnimalPreferenceForm`: species, size, filter groups) runs only for `adopt`.

---

## OTHER roles

Catalog (`OTHER_ROLE_IDS`):

`independent_protector` · `foster_home` · `volunteer` · `animal_professional` · `animal_business` · `community_member` · `other`

Single-select today; future sub-flows may branch on `otherRole` without changing the top-level `UserType`.

---

## Verification

| Mode | Who | Behavior (current) |
|---|---|---|
| `selfie` | `PERSON` | Camera capture → mock pipeline → status badge |
| `institutional` | `ONG`, `VETERINARY_CLINIC` | Placeholder submit → `pending` / `processing`; no selfie required |

Implemented by `VerificationFlow` (`mode` inferred from `userType` when omitted). Soft gate: user may finish onboarding with non-approved status.

---

## Draft persistence

| Item | Value |
|---|---|
| Storage key | `animaps-onboarding-draft` |
| Shape | `OnboardingDraft` in `types.ts` |
| Critical fields | `userType`, `intentions`, `otherRole`, `organization`, `veterinary`, prefs, interests (max 5), `additionalInfo`, verification statuses |

Hydrated on mount; written after every reducer change. Wave 2 replaces this with Nest `identity` + profile / preference tables ([database.md](database.md)).

`userType` is set at `/register` (`RegisterForm` → `patch({ userType })`), not on a separate onboarding picker.

---

## Reusable components

| Component | Role |
|---|---|
| `OnboardingFlow` | Validates step ∈ active flow; redirects if filtered/out of scope |
| `OnboardingLayout` | Progress + chrome; progress totals from active steps |
| `UserTypeSelector` | Register type cards (`SelectableCard`) |
| `IntentionSelector` | Generic multi/single card grid (intentions + other roles) |
| `OrganizationForm` / `VeterinaryForm` | Modeled field groups (`info` \| `location` \| …) |
| `AnimalPreferenceForm` | Composite PERSON adopt prefs |
| `ProfileForm` | Optional rows + `PrivacySelector` + **ported Modal** |
| `InterestSelector` | Search + tags, max 5 |
| `VerificationFlow` | Selfie / institutional |

---

## How to add a step

1. Add id to `ALL_ONBOARDING_STEP_IDS` / `STEP_DEFINITIONS`.
2. Append id to the relevant `ONBOARDING_FLOWS[userType]` array (order = UX order).
3. Implement step screen using `OnboardingLayout` + `useOnboardingNavigation`.
4. Register renderer in `OnboardingFlow` switch.
5. Add i18n in pt / en / es.
6. Document in this file’s flow table + decision log if behavior is conditional.

---

## Current vs future

| Current | Future |
|---|---|
| `localStorage` draft | Nest `identity` + profile / preference tables |
| Static catalogs in `data.ts` | DB or CMS catalogs (`interests`) |
| Mock verification | Provider + `verification_requests` (`kind`: selfie \| institutional) |

---

## Decision log

- **Config over duplication** — new types extend maps; do not fork `features/onboarding-*`.
- **Universal guidelines** — one legal/community gate before type-specific collection.
- **Conditional steps** via `conditions(draft)`, not nested routers.
- **`userType` at register** selects the flow before the first onboarding URL.
- Legacy aliases preserved so bookmarks from the guardian-only era still resolve.
- Progress is computed from **active** steps so skipping conditional steps does not strand the indicator.
