# ANIMAPS — Dashboard

Type-aware app shell after onboarding. Navigation and home summaries come from config (`DASHBOARD_CONFIGS`), filtered by UI permissions — not from hard-coded sidebars per persona.

Related: [user-flow.md](user-flow.md) · [permissions.md](../security/permissions.md) · [user-types.md](../domains/user-types.md) · [matching.md](../domains/matching.md) · [components.md](components.md) · [conventions.md](../architecture/conventions.md) · [institution-dashboard.md](institution-dashboard.md).

**Source:** `apps/web/src/features/dashboard/`

---

## Architecture

| Piece | Role |
|---|---|
| `getDashboardConfig(userType)` | Returns `{ nav, mobileNavIds, summaryOrder }` |
| `filterNavByPermissions` | Drops items whose `permission` fails `hasPermission` |
| `RoleBasedNavigation` | Desktop sidebar |
| `MobileNav` | Bottom bar using `mobileNavIds` |
| `DynamicDashboard` | Welcome + `SummaryCard` grid |
| `DashboardShell` | Reads `userType` / display name from onboarding draft; composes chrome |

`userType` today comes from the onboarding draft (`OnboardingProvider`). Wave 2: session / identity API.

**InstitutionDashboard** is **proposed only** ([institution-dashboard.md](institution-dashboard.md)). Existing `DynamicDashboard` / `DASHBOARD_CONFIGS` for PERSON / ONG / clinic / OTHER are **unchanged**. Do not render government modules from this shell.

---

## Entry routes

| UserType | Primary home | `/dashboard` |
|---|---|---|
| `PERSON` | `/discover` | Redirect → `/discover` |
| `OTHER` | `/discover` (discover-oriented nav) | May show shell; primary CTA remains discover |
| `ONG` | `/dashboard` | Operational `DynamicDashboard` |
| `VETERINARY_CLINIC` | `/dashboard` | Clinic `DynamicDashboard` |

---

## Nav catalogs (initial)

`/profile`, `/matches`, and `/favorites` are live. Messages, animals, and other unfinished modules stay `placeholder: true` (“coming soon”). Some items also set `permission`.

### PERSON

Discover · animals\* · matches\* · messages\* · reports\* · favorites\* · profile\* · settings\*

Mobile: discover, matches, messages, favorites, profile

### ONG

Dashboard · animals\* · adoption requests\* · volunteers\* · donations\* · reports\* · messages\* · organization\*

Mobile: dashboard, animals, adoptionRequests, messages, organization

### VETERINARY_CLINIC

Dashboard · services\* · location\* · messages\* · animals\* · reviews\* · profile\*

Mobile: dashboard, services, messages, animals, profile

### OTHER

Discover · messages\* · profile\* · settings\*

Mobile: discover, messages, profile

Canonical ids and gates: `navigation.ts`.

---

## Summary cards

| UserType | `summaryOrder` |
|---|---|
| `PERSON` | nearby, matches, favorites, messages, region |
| `ONG` | requests, volunteers, donations, messages, nearby |
| `VETERINARY_CLINIC` | messages, reviews, nearby, region |
| `OTHER` | nearby, messages, region |

Values are mocks (`SUMMARY_MOCK`) until Nest queries exist.

---

## How to extend

1. Add a `DashboardNavId` (and i18n `dashboard.nav.*` in pt/en/es).
2. Append to the relevant `DASHBOARD_CONFIGS[userType].nav` / `mobileNavIds` / `summaryOrder`.
3. Set `permission` when the item is capability-gated.
4. Prefer placeholders over half-built routes.

---

## Current vs future

| Current | Future |
|---|---|
| Static mocks | Nest queries per domain |
| Permission-gated visibility only | Same rules on API |
| Placeholder hrefs | Real pages per type |
| `DynamicDashboard` by `UserType` | InstitutionDashboard proposed separately; this shell stays for PERSON / ONG / clinic |

---

## Decision log

- Config maps replace a single guardian-era `DASHBOARD_NAV`.
- PERSON keeps Discover as home; institutions get an operational dashboard first.
- Nav permissions reuse [permissions.md](../security/permissions.md) — no duplicated type switches inside chrome components.
- InstitutionDashboard remains a proposal; do not replace `DynamicDashboard` in this pass.
