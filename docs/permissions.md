# ANIMAPS — UI permissions

Frontend capability catalog for **navigation and control visibility only**. This is not a security boundary. Real authorization lives in NestJS guards using [permissions-matrix.md](permissions-matrix.md).

Related: [user-types.md](user-types.md) · [dashboard.md](dashboard.md) · [conventions.md](conventions.md) · [permissions-matrix.md](permissions-matrix.md).

**Source:** `apps/web/src/features/permissions/`

---

## Design

```text
PERMISSIONS_BY_USER_TYPE[userType] → Permission[]
hasPermission(userType, permission) → boolean
filterNavByPermissions(nav, userType) → DashboardNavItem[]
```

- Coarse flags (nav / feature shells), not 1:1 with every domain action.
- Missing `userType` ⇒ deny (`false` / empty list).
- Admin-only types (`PUBLIC_AGENCY`, `BIOLOGIST`) are out of this map — see the action matrix.

---

## Catalog

| Permission | UI intent |
|---|---|
| `CREATE_PROFILE` | Personal / optional profile editors |
| `VIEW_ANIMALS` | Browse listings |
| `ADOPT` | Adoption / matches surfaces |
| `REPORT` | Occurrence / report actions |
| `MESSAGE` | Messaging |
| `CREATE_ANIMAL` | Register animals |
| `MANAGE_ANIMALS` | Edit / archive animals |
| `VIEW_ADOPTION_REQUESTS` | Incoming adoption inbox |
| `MANAGE_VOLUNTEERS` | Volunteer roster |
| `MANAGE_ORGANIZATION` | NGO settings |
| `MANAGE_SERVICES` | Clinic services catalog |
| `MANAGE_LOCATION` | Clinic location / hours |
| `MANAGE_PROFILE` | Clinic institutional profile |

---

## By public `UserType`

| UserType | Permissions |
|---|---|
| `PERSON` | `CREATE_PROFILE`, `VIEW_ANIMALS`, `ADOPT`, `REPORT`, `MESSAGE` |
| `ONG` | `CREATE_ANIMAL`, `MANAGE_ANIMALS`, `VIEW_ADOPTION_REQUESTS`, `MANAGE_VOLUNTEERS`, `MANAGE_ORGANIZATION`, `MESSAGE` |
| `VETERINARY_CLINIC` | `MANAGE_SERVICES`, `MANAGE_LOCATION`, `MANAGE_PROFILE`, `MESSAGE`, `VIEW_ANIMALS` |
| `OTHER` | `CREATE_PROFILE`, `MESSAGE`, `VIEW_ANIMALS` |

Nav items declare optional `permission` on `DashboardNavItem`. `RoleBasedNavigation` / `MobileNav` call `filterNavByPermissions`.

---

## How to extend

1. Add the permission string to `PERMISSIONS` + assign it in `PERMISSIONS_BY_USER_TYPE`.
2. Attach `permission` on the relevant `DASHBOARD_CONFIGS` nav item (or gate a button).
3. Mirror the **domain** rule in [permissions-matrix.md](permissions-matrix.md) when the API ships.
4. Update this doc’s tables.

Do not sprinkle `userType === "ONG"` checks in JSX when a permission flag would suffice.

---

## Current vs future

| Current | Future |
|---|---|
| Client-side hide/show | Nest `RolesGuard` + resource-owner + `verified` / `isRescuer` |
| Static `catalog.ts` | Same keys enforced server-side (or generated from shared package) |

---

## Decision log

- UI catalog is intentionally smaller than the action matrix — product shells, not every use case.
- One module shared by dashboard (and future feature shells) to avoid duplicate type switches.
