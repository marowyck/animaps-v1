# ANIMAPS — User types

`UserType` is the **single account discriminator**. Authentication is shared; type-specific data lives in 1:1 profile tables. Public signup exposes four types; two additional values are admin-assigned only.

Related: [conventions.md](conventions.md) · [profiles.md](profiles.md) · [onboarding.md](onboarding.md) · [permissions.md](permissions.md) · [database.md](database.md) · [schema.prisma](schema.prisma).

**Source (web):** `apps/web/src/features/user-types/`

---

## Catalog

| TS / config (`SCREAMING_SNAKE`) | DB / Prisma (`snake_case`) | Public signup | Profile table |
|---|---|---|---|
| `PERSON` | `person` | Yes — tutor / want to adopt | `person_profiles` |
| `ONG` | `ong` | Yes — NGO / organization | `organization_profiles` |
| `VETERINARY_CLINIC` | `veterinary_clinic` | Yes — veterinary clinic | `veterinary_profiles` |
| `OTHER` | `other` | Yes — catch-all | `other_profiles` |
| `PUBLIC_AGENCY` | `public_agency` | No (admin) | — |
| `BIOLOGIST` | `biologist` | No (admin) | — |

Helpers: `normalizeUserType`, `USER_TYPE_TO_DB`, `DB_TO_USER_TYPE`, `isPublicUserType`, `PUBLIC_USER_TYPES`.

---

## Architecture rule

```text
User
  id, email, name, username?, avatar_url?, user_type, status, …
  ├─ person_profiles          (when user_type = person)
  ├─ organization_profiles    (when user_type = ong)
  ├─ veterinary_profiles      (when user_type = veterinary_clinic)
  └─ other_profiles           (when user_type = other)
```

Application invariant (enforce in Nest later): at most one profile row; profile table must match `user_type`.

| Do | Do not |
|---|---|
| One register / login / verify-email path | Fork auth UI per type |
| Drive onboarding + nav from `userType` | Parallel `UserRole` enums in app code |
| Keep admin types on the same enum | Invent a second role system for agencies |

---

## Selection placement

Chosen on `/register` step 1 via `UserTypeSelector` inside `WaitlistForm`.

1. UI stores `PublicUserType` (`PERSON`, …) on form state.
2. `submitWaitlist` converts to DB snake_case for the waitlist payload.
3. `RegisterForm` also `patch({ userType })` into the onboarding draft so `/onboarding/*` knows which flow to run after verify-email.

There is **no** post-verify “choose your type” screen.

---

## Legacy mapping (docs / drafts only)

| Old | New |
|---|---|
| `guardian` / `GuardianProfile` | `person` / `PersonProfile` |
| `ngo` / `NgoProfile` | `ong` / `OrganizationProfile` |
| `clinic` / `ClinicProfile` | `veterinary_clinic` / `VeterinaryProfile` |
| `UserRole` | `UserType` |

`DB_TO_USER_TYPE` still accepts legacy waitlist strings so old local drafts do not break.

---

## Downstream consumers

| Consumer | How it uses `userType` |
|---|---|
| Onboarding | `ONBOARDING_FLOWS[userType]` |
| Dashboard | `DASHBOARD_CONFIGS[userType]` |
| Permissions UI | `PERMISSIONS_BY_USER_TYPE[userType]` |
| Verification | selfie vs institutional mode |

---

## Decision log

- One enum avoids `UserRole` vs waitlist `profileType` drift.
- Admin-only types share the enum so Nest guards stay uniform.
- Profile tables remain 1:1 with `users.id` for LGPD boundaries and `verified` flags (org/clinic), instead of large JSON columns on `users`.
