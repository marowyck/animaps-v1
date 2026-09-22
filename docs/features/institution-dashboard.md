# ANIMAPS — Institution dashboard

Government workspace for public institutions: overview, cases inbox, map aggregates, analytics shell, team shell, and institution settings. **Not** Discover / match.

Related: [government.md](../domains/government.md) · [dashboard.md](dashboard.md) · [roles-and-permissions.md](../domains/roles-and-permissions.md) · [cases.md](../domains/cases.md) · [components.md](components.md) · [conventions.md](../architecture/conventions.md) · [privacy.md](../security/privacy.md).

**Status:** Fase 4–6 web mock (`apps/web/src/features/institution/` + routes). Nest persistence still future.

**Source:** `apps/web/src/features/institution/`

---

## Composition (reuse, do not fork)

```text
DashboardShell
  → RoleBasedNavigation (INSTITUTION config)
    → InstitutionDashboard | Cases | Map | Analytics | Team | Profile/Settings
```

| Reuse | Do not |
|---|---|
| `DashboardShell`, `RoleBasedNavigation`, `MobileNav` | A second app or layout system |
| Case mock from Fase 3 | Match / Discover card stack |
| Soft-gate on `institutionalVerificationStatus` | Fake “sent to city hall” KPIs while pending |

When `userType === INSTITUTION`, `/dashboard` renders **InstitutionDashboard** (not `DynamicDashboard`). Overview metrics use `MetricTile` (neutral surface, tabular numbers). Team, routing, integrations, and analytics share `WorkspaceHeader`. Analytics charts are SVG bars in `BarList` plus a data table. One `SoftGateBanner` per screen.

---

## Guardrail: not a social dashboard

Institution modules **must not** include match cards, swipe, personal interest catalogs, or favorites-as-dating. Those stay on PERSON / ONG surfaces.

---

## Modules (Fase 4)

| Module | Route | Status |
|---|---|---|
| Overview | `/dashboard` | Live KPIs from local case store when verified; pending panel when not |
| Cases inbox | `/cases` | Filters + soft-gate read-only triage |
| Map | `/map` | City intensity grid + period filter (no exact pins) |
| Analytics | `/analytics` | Aggregates by type/status/priority/city/week + CSV export |
| Team | `/team` | Departments, teams, invites, memberships (soft-gated) |
| Routing | `/routing` | Jurisdiction/capability config + awaiting queue + matcher |
| Integrations | `/integrations` | Generic connections, sync logs, aggregate CSV export history |
| Institution | `/institution` | Profile edit (onboarding draft) |
| Settings | `/settings` | Same profile + policy stub |
| Messages | `/messages` | Still placeholder |

Case detail (institution mode) can assign member/team when verified (`ASSIGN_REPORT` / `MANAGE_TEAM`). Assignment is **not** official routing.

Routing (`ROUTE_CASE` / `FORWARD_CASE`): append-only `case_routing` hops; citizen `routed` only when `toInstitutionLabel` is set. Matcher prefers LOCAL > MUNICIPAL > … and specialized types over city hall; ties stay `awaiting_routing`.

---

## Soft-gate

Until `institutionalVerificationStatus === approved`:

- Overview shows pending workspace (no operational KPI claims)
- Cases inbox is **read-only** (no create / mark review / official replies)
- Map / analytics / team still visible with banner
- Institution profile + settings remain editable

---

## Permissions

Nav gates: `VIEW_INCOMING_REPORTS`, `ASSIGN_REPORT`, `ROUTE_CASE`, `FORWARD_CASE`, `MANAGE_JURISDICTION`, `VIEW_MAP`, `VIEW_ANALYTICS`, `VIEW_STATISTICS`, `MANAGE_TEAM`, `MANAGE_INSTITUTION`, `EXPORT_DATA`, `MANAGE_INTEGRATION`.

---

## Current vs future

| Current | Future |
|---|---|
| Institution workspace mock in web | Nest institutions + RBAC memberships |
| Leaflet + OpenStreetMap city centroids + aggregate CSV (no reporter pins) | Server-side privacy-aware heatmap / PostGIS |
| Team mock (depts / teams / invites / assignment) | Nest membership + invite emails |
| Routing mock (jurisdictions / capabilities / matcher) | Nest Case routing engine + IBGE/geometry |
| Integrations mock (generic connections / logs / aggregate export) | Nest integrations + vault + real connectors |
| No named government APIs | Contracted gov adapters only |

---

## Decision log

- Reuse `DashboardShell` + swap modules; zero match cards in government shell.
- Soft-gate matches [government.md](../domains/government.md): unverified → settings/status, not live triage.
- Fase 5 analytics never combine identity + precise geo; exports are aggregates only ([privacy.md](../security/privacy.md)).
- Fase 6 team mock: individual invites only; assignment does not invent routing rows.
- Fase 7 routing mock: never citizen `routed` without a hop; ambiguous ties stay awaiting ([case-routing.md](../domains/case-routing.md)).
- Fase 8 integrations mock: generic providers only; sync failure never means delivered to agency ([integrations.md](integrations.md)).
