# ANIMAPS — Government / institutional environment

Public institutions work in a **government workspace**: cases, maps, triage, teams, analytics, audit. It is not Discover, not matching, and not the PERSON or ONG/clinic social dashboard.

Related: [overview.md](overview.md) · [institutions.md](institutions.md) · [cases.md](cases.md) · [case-routing.md](case-routing.md) · [institution-dashboard.md](../features/institution-dashboard.md) · [roles-and-permissions.md](roles-and-permissions.md) · [privacy.md](../security/privacy.md) · [audit.md](../security/audit.md) · [integrations.md](../features/integrations.md) · [dashboard.md](../features/dashboard.md).

**Status:** Fase 4 web workspace mock (`features/institution`). Nest institutions API still future. Wave 2 `PUBLIC_AGENCY` remains admin-assigned with no extra profile table.

---

## Objective

Give verified public bodies a place to:

- Receive **cases** that routing actually assigned to them
- Triage, assign, update, close
- See **aggregates** for their jurisdiction (not the whole country’s raw PII)
- Manage members, departments, capabilities, and report policy
- Export under permission + audit
- Prepare for **future** official-system integrations — without pretending those pipes exist today

ANIMAPS is **not** an official government system of record unless a configured integration says so.

---

## Distinct from social / match dashboards

| Government workspace | PERSON / ONG / clinic ([dashboard.md](../features/dashboard.md)) |
|---|---|
| Overview counts, case queues, maps, analytics | Discover cards, matches, favorites, adoption inbox, clinic services |
| Internal comments vs public citizen updates | Messaging placeholders, interest tags |
| Jurisdiction + capability | Area of operation / service radius |

**Do not** render match cards, animal swipe stacks, or personal interest catalogs in the institution shell ([institution-dashboard.md](../features/institution-dashboard.md)).

Reuse `DashboardShell` + `RoleBasedNavigation` — swap **modules**, do not fork the whole app.

---

## Jurisdiction

Every institution declares one or more [institution_jurisdictions](institutions.md). Dashboards and routing filter by:

- Jurisdiction type (`NATIONAL` … `LOCAL`)
- City / state / country (and later IBGE + geometry)

Analysts see cases **in scope**. Wide aggregates (`GetWideAggregateDashboard` in [permissions-matrix.md](../security/permissions-matrix.md)) stay a **permission**, not a default for every city hall.

---

## Verification

Institutional users do not get the inbox because they selected “prefeitura”. Flow:

```text
Registration → institution data → responsible person → optional email domain
  → verification documents → review → APPROVED → activation
```

States: `DRAFT` → `PENDING_VERIFICATION` → `UNDER_REVIEW` → `APPROVED` | `REJECTED`; `APPROVED` ↔ `SUSPENDED` ([institutions.md](institutions.md)).

Until `APPROVED`, show a limited “pending institution” state — not fake operational KPIs.

---

## Institutional users and roles

- Individual logins only ([security.md](../security/security.md))
- Membership + `role_id` ([roles-and-permissions.md](roles-and-permissions.md))
- Typical ladder: `INSTITUTION_ADMIN` → `INSTITUTION_MANAGER` → `ANALYST` / `OPERATOR` / `INSPECTOR` → `MODERATOR` / `READ_ONLY`

Same person may still be a PERSON on Discover in another session context.

Wave 2 occurrence validation for `public_agency` continues to apply until guards read `VALIDATE_CASE` (or equivalent) on the membership.

---

## Cases intake

Institutions receive **Cases**, not a dump of every occurrence on the planet.

| Intake path | `source` | Condition |
|---|---|---|
| Citizen report routed | `CITIZEN` | Routing match on location + type + jurisdiction + capability |
| NGO / clinic share | `NGO` / `VETERINARY` | Explicit share / `institution_access` |
| Another institution forwards | `INSTITUTION` | Routing history + reason |
| Manual / import / API (future) | `SYSTEM` / `IMPORT` / `API` / `PARTNER` | Configured connection ([integrations.md](../features/integrations.md)) |

If routing finds **no** institution, the case stays `AWAITING_ROUTING` for the citizen. **Never** copy that says the report was delivered to a public agency.

Wave 2 `occurrences` remain the freeze geo entity; Case is the operational inbox for this environment ([cases.md](cases.md)).

---

## Triage

Triage queue (future module):

- Classify / confirm `case_type`
- Set priority (`LOW` · `MEDIUM` · `HIGH` · `CRITICAL`)
- Request information from the reporter (public channel)
- Mark duplicate / invalid
- Assign user or team
- Forward to another institution
- Reject according to policy (not the same as citizen “we sent this to the city”)

---

## Assignment

A case may be unassigned, assigned to a **user**, assigned to a **team**, transferred, or forwarded. Each change appends `case_assignments` ([cases.md](cases.md) · [audit.md](../security/audit.md)).

---

## Routing

Location + type + jurisdiction + capability → destination. Forwarding between institutions records reasons (`no_competence`, `out_of_region`, `out_of_type`, `partnership`, `specialization`, `other`). Details: [case-routing.md](case-routing.md).

No automatic write into a real government protocol system without an enabled [integration](../features/integrations.md).

---

## Dashboard modules

Proposed (not built): Overview, Cases, Map, Analytics, Team, Institutions, Routing, Reports, Settings. Sidebar and shared components: [institution-dashboard.md](../features/institution-dashboard.md).

Maps use precision / privacy rules ([privacy.md](../security/privacy.md)) — never exact reporter pin on public or loosely authorized views.

---

## Analytics

Architecture (not screens): time series, filters, aggregations, comparisons, exports, future alerts.

Example insights (illustrative, not live data):

- Abandonment +25% in 30 days
- Highest volume region: Zona Norte
- Top type: abandonment
- Mean time to first action: 48h

Exports: permission `EXPORT_DATA`, purpose, period, classification filters, [audit](../security/audit.md) `data_exported`. Neighborhood/city aggregates for public-interest extracts — same LGPD posture as [lgpd-checklist.md](../security/lgpd-checklist.md) (no raw lat/lng in export).

Future alerts (prepared, not implemented): unusual regional spike, cluster of similar cases, priority waiting, unassigned case, SLA breach, possible lost/found match.

SLA targets are **per institution** (`institution_report_policies`), not a global ANIMAPS SLA.

---

## Privacy

- Reporter visibility: `PUBLIC` · `RESTRICTED` · `CONFIDENTIAL` · `ANONYMOUS` ([privacy.md](../security/privacy.md))
- Anonymous intake only if `institution_report_policies.anonymous_reports`
- Internal comments never leak to the citizen
- Citizens see a **coarse** public status, not analyst names or investigation notes ([cases.md](cases.md))

Architecture is prepared for LGPD; **legal review is required** before go-live. Controller is still TBD ([lgpd-checklist.md](../security/lgpd-checklist.md)).

---

## Audit

Reuse `audit_logs`. Append-only `case_status_history` / `case_assignments`. Never log passwords, tokens, or full PII ([audit.md](../security/audit.md)).

---

## Future integrations

API, webhooks, import/export, sync states — [integrations.md](../features/integrations.md). **Do not implement** a named prefeitura, SIS, or protocol API in this pass.

---

## Non-goals (explicit)

| Never | Instead |
|---|---|
| Promise “enviado ao órgão público” without routing | Citizen status `AWAITING_ROUTING` / `REGISTERED_ON_PLATFORM` |
| Auto-integrate with real government systems | Configured `integration_connections` |
| Treat every case as an official denunciation | Configurable `case_types` |
| Mix match UX into this shell | Institution modules only |
| Shared agency passwords | Individual members |

---

## Current vs future

| Current | Future |
|---|---|
| Admin `public_agency` + occurrence validate | Verified institution + case inbox |
| `GetRegionalDashboard` / wide aggregates in matrix | Same actions gated by RBAC + jurisdiction |
| No government UI | Proposed modules in [institution-dashboard.md](../features/institution-dashboard.md) |

---

## Decision log

- Government environment is a distinct dashboard composition, not a second monorepo app.
- Delivery to a public body is a **routing fact**, never marketing copy.
- Analytics and maps inherit Wave 2 aggregate/geo privacy (city/neighborhood for public extracts; precision levels on case locations).
- Integrations stay future-facing; sync tables exist so we do not improvise when a city asks for an API.
