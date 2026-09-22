# ANIMAPS — Components

Catalog of shared UI in `apps/web/src/components/` and feature-local building blocks. Import features only via their `index.ts`. Prefer extending this catalog over one-off markup.

Related: [design-system.md](design-system.md) · [ui-patterns.md](ui-patterns.md) · [conventions.md](../architecture/conventions.md) · [onboarding.md](onboarding.md).

---

## Shared primitives (`components/`)

| Component | Path | Notes |
|---|---|---|
| `Button` | `Button.tsx` | Variants: pink, green, blue, white, ink, soft, ghost, … |
| `Input` | `Input.tsx` | Optional password reveal |
| `Select` | `Select.tsx` | |
| `Checkbox` | `Checkbox.tsx` | |
| `AccordionItem` | `AccordionItem.tsx` | FAQ |
| `Toast` | `Toast.tsx` | info / success / error / warning |
| `LocaleSwitcher` | `LocaleSwitcher.tsx` | menu / pills |
| `CodeInput` | `CodeInput.tsx` | 6-digit OTP; auto-advance, paste, keyboard |
| `IconButton` | `IconButton.tsx` | Icon-only control with accessible name |
| `Modal` / `Dialog` | `Modal.tsx` | **Portals to `document.body`**; full-viewport backdrop blur; Escape closes |
| `Card` | `Card.tsx` | Surface container |
| `SelectableCard` | `SelectableCard.tsx` | Icon + title + description; selected / hover / disabled |
| `InterestTag` | `InterestTag.tsx` | Toggle chip |
| `SearchInput` | `SearchInput.tsx` | Search + clear |
| `ProgressIndicator` | `ProgressIndicator.tsx` | Step progress (`current` / `total`) |
| `FormSection` | `FormSection.tsx` | Label row + chevron (opens modal / picker) |
| `FilterGroup` | `FilterGroup.tsx` | Labeled multi/single option group |
| `PrivacySelector` | `PrivacySelector.tsx` | `public` / `matches` / `private` |
| `ProfileAvatar` | `ProfileAvatar.tsx` | Photo / initials |
| `VerificationStatusBadge` | `VerificationStatusBadge.tsx` | Verification status chip |
| `NavigationItem` | `NavigationItem.tsx` | Sidebar / list nav row |
| `EmptyState` / `LoadingState` / `ErrorState` / `SuccessState` | `StateBlocks.tsx` | Screen-level states |

Motion kit: `components/bits/AnimatedContent` and `CurvedLoop` only.

### Modal / overlay rule

`Modal` uses `createPortal(…, document.body)`. Parents that apply CSS `transform` (e.g. onboarding `animate-fade-in-up`) create a containing block; without a portal, `position: fixed` overlays only that box. Keep this portal pattern for any full-screen dimmer.

---

## Onboarding (`features/onboarding`)

| Component | Purpose |
|---|---|
| `OnboardingFlow` | Dynamic `/onboarding/[step]` router + redirects |
| `OnboardingLayout` | Progress, back, skip, continue |
| `OnboardingProgress` / `OnboardingStep` | Thin helpers / wrappers |
| `TypeSelector` | Shared single/multi card grid. Account, user, organization, institution, and intention selectors are thin catalogs on top of it |
| `UserTypeSelector` | Legacy Wave 2 type cards (kept; prefer `AccountTypeSelector` at signup) |
| `AccountTypeSelector` | Signup account cards |
| `OrganizationTypeSelector` / `InstitutionTypeSelector` | Subtype cards |
| `IntentionSelector` | Multi/single card grid (intentions, other roles) |
| `InterestSelector` | Search + tags (max 5) |
| `AnimalPreferenceForm` | Species / size / filters composite |
| `OrganizationForm` | ONG field groups by mode |
| `VeterinaryForm` | Clinic field groups by mode |
| `ProfileForm` | Optional rows + privacy + Modal |
| `VerificationFlow` | Selfie or institutional verification |

---

## Dashboard (`features/dashboard`)

| Component | Purpose |
|---|---|
| `DashboardShell` | Sidebar + mobile nav + content; reads `userType` from onboarding draft |
| `DynamicDashboard` | Type-specific summary grid |
| `RoleBasedNavigation` | Permission-filtered sidebar |
| `MobileNav` | Bottom bar from `mobileNavIds` |
| `SummaryCard` | Metric tile |
| `Sidebar` | Deprecated wrapper → `RoleBasedNavigation` |

Config: `DASHBOARD_CONFIGS` / `getDashboardConfig` / `filterNavByPermissions` in `navigation.ts`.

---

## Feature layouts (auth / other)

| Layout | Feature |
|---|---|
| `AuthSplitLayout` | Register / login |
| Discover stack | `features/discover` (domain cards; compose shared `Card` / `Button`) |
| `InstitutionGatedPage` / `useInstitutionGuard` | Institution-only routes: loading, redirect, shell |
| `CityMap` | Leaflet + OpenStreetMap city map (`ssr: false`) |
| `MapMarker` / `ReportMarker` / `AnimalMarker` / `OrganizationMarker` | Circle markers by kind |
| `LocationPopup` | Marker popup (label + count) |

Institution map pins are **city centroids**, never reporter coordinates. Unknown cities stay in the aggregate list.

---

## Rules

1. Prefer shared components over one-off styled `div`s.
2. User-visible copy via `useT()` / `Messages` — keep **pt / en / es** in sync.
3. Document non-obvious keyboard + ARIA behavior here when adding interactive primitives.
4. Do not import feature internals from other features — use each feature’s `index.ts`.
5. Domain forms that depend on `OnboardingDraft` stay under `features/onboarding`, even if visually generic.

---

## Decision log

- OTP, selectable cards, and form rows are shared so auth and onboarding stay visually consistent.
- Modal portal is mandatory after viewport blur was clipped by animated parents.
- Onboarding / dashboard building blocks stay feature-local; only true primitives graduate to `components/`.
- Type cards share `TypeSelector`. Institution routes share `InstitutionGatedPage` instead of copying the gate.
