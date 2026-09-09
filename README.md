<div align="center">

# ANIMAPS

**Responsible adoption platform and animal occurrence map.**

Ideal match between guardians and animals + georeferenced reports — care and technology in one place.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![NestJS](https://img.shields.io/badge/NestJS-planned-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%2B PostGIS-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License](https://img.shields.io/badge/license-TBD-lightgrey)](#license)

</div>

---

## Contents

- [About](#about)
- [Current status](#current-status)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Repository structure](#repository-structure)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Design system](#design-system)
- [Documentation](#documentation)
- [Contribution](#contribution)
- [License](#license)

---

## About

ANIMAPS connects people who care for animals:

| Audience | Role |
|---|---|
| **Guardians / adopters** | Profile + **ideal match** with available animals |
| **NGOs** | Animal listings and adoption requests without spreadsheets |
| **Clinics** | Verified partners in responsible adoption |
| **Public agencies / research** | Aggregated indicators |
| **Community** | Georeferenced occurrence map (with or without an account) |

**Differentiators:** ideal match (not an infinite feed), anonymous-capable occurrence map, verified NGO/clinic profiles, LGPD consent by design.

---

## Current status

| Phase | Scope | Status |
|---|---|---|
| **Phase 0** | Architecture, data model, permissions, LGPD, governance | Done |
| **Phase 1** | Institutional landing + waitlist (`apps/web`) | In progress |
| **Phase 2** | NestJS API (DDD) + auth + real persistence | Planned |
| **Phase 3** | Full web product (matching, map, dashboards) | Planned |
| **Phase 4** | Mobile apps (Android/iOS) on the same API | Planned |

---

## Architecture

DDD backend (planned), MVC on the web view layer, **pnpm** monorepo. Web first; mobile later on the same API.

```mermaid
flowchart LR
    subgraph clients ["Clients"]
        web["apps/web (Next.js)"]
        mobile["Mobile — Android/iOS (future)"]
    end

    subgraph api ["apps/api — NestJS (DDD, future)"]
        identity["identity"]
        adoption["adoption"]
        occurrence["occurrence"]
        notifications["notifications"]
        analytics["analytics"]
    end

    db[("PostgreSQL + PostGIS")]

    web -->|"REST/HTTP"| api
    mobile -->|"REST/HTTP"| api
    identity --> db
    adoption --> db
    occurrence --> db
    notifications --> db
    analytics --> db
```

Details: [`docs/bounded-contexts.md`](docs/bounded-contexts.md) · data model: [`docs/der.dbml`](docs/der.dbml), [`docs/schema.prisma`](docs/schema.prisma) · evolution: [`docs/schema-evolution.md`](docs/schema-evolution.md).

**Naming:** English in code and DB (`camelCase` API / `snake_case` DB); UI in **Portuguese (default) + English + Spanish** via client dictionaries (no `/en` or `/es` routes).

---

## Tech stack

### Frontend (`apps/web`)

| Area | Tech |
|---|---|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) 5 |
| UI | [React](https://react.dev/) 19 |
| Style | [Tailwind CSS](https://tailwindcss.com/) 4 |
| Motion | [GSAP](https://gsap.com/) + Lenis |
| Icons | [lucide-react](https://lucide.dev/) |
| Imagery | Clay mascots (`next/image`) |

### Backend & data (planned)

| Area | Tech |
|---|---|
| Framework | [NestJS](https://nestjs.com/) (DDD) |
| ORM | [Prisma](https://www.prisma.io/) |
| DB | [PostgreSQL](https://www.postgresql.org/) + [PostGIS](https://postgis.net/) |
| Auth | JWT + hashed refresh tokens |

### Infra

| Area | Tech |
|---|---|
| Monorepo | [pnpm](https://pnpm.io/) workspaces (`apps/*`) |
| Web deploy | [Vercel](https://vercel.com/) |
| CI | GitHub Actions (planned) |
| Analytics | GA4 after cookie consent |

---

## Repository structure

```text
animaps/
├── apps/
│   └── web/                         # @animaps/web — Next.js
│       └── src/
│           ├── app/                 # routes, layout, providers, API routes
│           │   └── api/waitlist/    # temporary; moves to apps/api in Wave 2
│           ├── features/
│           │   ├── landing/         # marketing + clay mascots
│           │   ├── auth/            # /register + /login
│           │   ├── waitlist/
│           │   └── consent/
│           └── components/          # shared UI primitives + bits/
├── docs/
├── package.json
└── pnpm-workspace.yaml              # apps/* (packages/ when 2+ consumers need them)
```

---

## Getting started

**Prerequisites:** Node.js 20+, pnpm 10+ (`corepack enable`).

```bash
git clone <repo-url>
cd animaps
pnpm install
pnpm dev
```

App: [http://localhost:3000](http://localhost:3000).

No required env vars in Phase 1 (waitlist persistence is a placeholder). See [`apps/web/.env.example`](apps/web/.env.example). DB/JWT secrets belong only to future `apps/api`.

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start `@animaps/web` |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Recursive typecheck |

---

## Design system

Shared primitives in `apps/web/src/components/`: `Button`, `Input`, `Select`, `Checkbox`, `AccordionItem`, `Toast`, `LocaleSwitcher`. Motion kit in `components/bits/`. Clay mascots: `features/landing` (`ClayFigure`) + assets in `apps/web/public/images/clay/`.

Tokens: [`apps/web/src/app/globals.css`](apps/web/src/app/globals.css). Visual brief: [`docs/landing-design-brief.md`](docs/landing-design-brief.md).

---

## Documentation

All product, domain, and process docs live in [`docs/`](docs/).

<details>
<summary><strong>Domain & data</strong></summary>

| Doc | Content |
|---|---|
| [architecture.md](docs/architecture.md) | Monorepo boundaries, web/mobile/API roadmap |
| [bounded-contexts.md](docs/bounded-contexts.md) | DDD contexts |
| [schema-evolution.md](docs/schema-evolution.md) | How to change the DB safely |
| [der.dbml](docs/der.dbml) | ER diagram — paste into [dbdiagram.io](https://dbdiagram.io) (not Prisma) |
| [data-dictionary.md](docs/data-dictionary.md) | Fields, types, rules |
| [schema.prisma](docs/schema.prisma) | Prisma draft (docs only until API) |
| [permissions-matrix.md](docs/permissions-matrix.md) | Roles and actions |
| [personas.md](docs/personas.md) | Product personas |

</details>

<details>
<summary><strong>Landing (Phase 1)</strong></summary>

| Doc | Content |
|---|---|
| [landing-content-brief.md](docs/landing-content-brief.md) | Goals, audiences, tone, sections |
| [landing-design-brief.md](docs/landing-design-brief.md) | Palette, type, motion, UI |
| [landing-tech-plan.md](docs/landing-tech-plan.md) | Stack, form, SEO, deploy |

</details>

<details>
<summary><strong>Privacy & process</strong></summary>

| Doc | Content |
|---|---|
| [lgpd-checklist.md](docs/lgpd-checklist.md) | Minimum LGPD checklist for MVP |
| [privacy-policy-draft.md](docs/privacy-policy-draft.md) | Internal privacy draft (consumer PT copy may follow) |
| [git-and-ci.md](docs/git-and-ci.md) | Branches, Conventional Commits, CI |
| [pilot-ngo.md](docs/pilot-ngo.md) | Pilot NGO selection/onboarding |

</details>

> Detailed roadmap and Kanban are kept locally and are not part of this repository.

---

## Contribution

See [`docs/git-and-ci.md`](docs/git-and-ci.md):

- **Branches:** `main` · `develop` · `feature/<slug>` · `hotfix/<slug>`
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/)
- **Package manager:** `pnpm` only
- **CI:** PR needs green `lint` + `typecheck` + `build`

```text
feat(adoption): add RequestAdoption use case
fix(occurrence): allow null userId for anonymous reports
docs: update LGPD checklist
```

---

## License

Private project — license TBD.
