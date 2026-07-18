<div align="center">

# 🐾 ANIMAPS

**Plataforma de adoção responsável e mapa de ocorrências animal.**

Match ideal entre tutores e animais + denúncias georreferenciadas — tecnologia e cuidado no mesmo lugar.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![NestJS](https://img.shields.io/badge/NestJS-planned-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%2B PostGIS-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License](https://img.shields.io/badge/license-TBD-lightgrey)](#licença)

</div>

---

## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Status atual](#status-atual)
- [Arquitetura](#arquitetura)
- [Stack técnica](#stack-técnica)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Como começar](#como-começar)
- [Scripts](#scripts)
- [Design system](#design-system)
- [Documentação](#documentação)
- [Convenções de contribuição](#convenções-de-contribuição)
- [Licença](#licença)

---

## Sobre o projeto

O **ANIMAPS** organiza o caminho até uma adoção consciente e dá visibilidade a denúncias de maus-tratos/abandono, conectando quem cuida:

| Público | Papel na plataforma |
|---|---|
| 🧑‍🤝‍🧑 **Tutores / adotantes** | Perfil + **Match ideal** — compatibilidade real com animais disponíveis |
| 🐾 **ONGs** | Cadastro de animais e gestão de solicitações sem planilha nem WhatsApp |
| 🏥 **Clínicas** | Parceria verificada no fluxo de adoção responsável |
| 🏛️ **Órgãos públicos / pesquisa** | Indicadores agregados e menção institucional |
| 🌍 **Comunidade** | Mapa de ocorrências georreferenciadas, com ou sem conta |

**Diferenciais**

- 🎯 Match ideal — não é feed infinito, é compatibilidade com a rotina do tutor
- 🗺️ Mapa de ocorrências para denúncias, com apoio a denúncia anônima
- ✅ Perfis verificados para ONGs e clínicas
- 🔒 LGPD e consentimento desde o design

---

## Status atual

Projeto em construção por fases, do institucional ao produto completo:

| Fase | Escopo | Status |
|---|---|---|
| **Fase 0** | Arquitetura, modelagem de dados, permissões, LGPD, governança | ✅ Concluída |
| **Fase 1** | Landing page institucional + lista de espera (`apps/web`) | 🚧 Em andamento |
| **Fase 2** | API NestJS (DDD) + autenticação + persistência real | ⏳ Planejada |
| **Fase 3** | Produto web completo (matching, mapa, painéis) | ⏳ Planejada |
| **Fase 4** | Apps mobile (Android/iOS) consumindo a mesma API | ⏳ Planejada |

---

## Arquitetura

Backend em **DDD** (Domain-Driven Design), frontend em **MVC** na camada de View, monorepo com **pnpm workspaces**. Web primeiro; mobile depois, reaproveitando a mesma API.

```mermaid
flowchart LR
    subgraph clients ["Clientes"]
        web["apps/web (Next.js)"]
        mobile["Mobile — Android/iOS (futuro)"]
    end

    subgraph api ["apps/api — NestJS (DDD, futuro)"]
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

Bounded contexts detalhados em [`docs/bounded-contexts.md`](docs/bounded-contexts.md). Modelo de dados em [`docs/der.dbml`](docs/der.dbml) e [`docs/schema.prisma`](docs/schema.prisma).

**Convenção de nomenclatura:** inglês em todo o sistema e banco (`camelCase` na API / `snake_case` no banco); UI em português com i18n (PT + EN) planejado.

---

## Stack técnica

### Frontend (`apps/web`)

| Categoria | Tecnologia |
|---|---|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) 5 |
| UI | [React](https://react.dev/) 19 |
| Estilo | [Tailwind CSS](https://tailwindcss.com/) 4 (design tokens via `@theme`) |
| Animação | [GSAP](https://gsap.com/) + [`@gsap/react`](https://gsap.com/resources/React) (`ScrollTrigger`) |
| Smooth scroll | [Lenis](https://github.com/darkroomengineering/lenis) |
| Ícones | [lucide-react](https://lucide.dev/) |
| Lint | ESLint (`eslint-config-next`) |

### Backend & dados (planejado)

| Categoria | Tecnologia |
|---|---|
| Framework | [NestJS](https://nestjs.com/) (arquitetura DDD) |
| ORM | [Prisma](https://www.prisma.io/) |
| Banco | [PostgreSQL](https://www.postgresql.org/) + [PostGIS](https://postgis.net/) (dados geoespaciais) |
| Auth | JWT + refresh token (na própria API) |

### Infraestrutura

| Categoria | Tecnologia |
|---|---|
| Monorepo | [pnpm](https://pnpm.io/) workspaces |
| Deploy web | [Vercel](https://vercel.com/) |
| CI | GitHub Actions (lint · typecheck · test · build) |
| Analytics | Google Analytics 4 (pós-consentimento de cookies) |

---

## Estrutura do repositório

```text
animaps/
├── apps/
│   └── web/                    # @animaps/web — Next.js
│       ├── app/                 # App Router: pages, layout, API routes
│       │   └── api/waitlist/    # Route Handler da lista de espera
│       ├── components/
│       │   ├── landing/         # Seções da landing (Hero, FAQ, Footer…)
│       │   ├── ui/               # Design system (Button, Input, Select…)
│       │   └── providers/        # SmoothScrollProvider (Lenis + GSAP)
│       └── public/
├── packages/                    # (futuro) tipos e utilitários compartilhados
├── docs/                        # Documentação de domínio, design, LGPD e processo
├── package.json                 # Scripts do monorepo
└── pnpm-workspace.yaml
```

---

## Como começar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/installation) 10+ (`corepack enable` ativa a versão do `package.json`)

### Instalação

```bash
git clone <url-do-repositorio>
cd animaps
pnpm install
```

### Ambiente de desenvolvimento

```bash
pnpm dev
```

App disponível em [http://localhost:3000](http://localhost:3000).

### Variáveis de ambiente

Nenhuma variável obrigatória na Fase 1 (waitlist roda com placeholder de persistência). Quando a API/GA4 forem plugados, `apps/web/.env.local` receberá as chaves necessárias — ver [`docs/landing-tech-plan.md`](docs/landing-tech-plan.md).

---

## Scripts

Executados a partir da **raiz** do monorepo:

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia `@animaps/web` em modo desenvolvimento |
| `pnpm build` | Build de produção de `@animaps/web` |
| `pnpm lint` | Executa o ESLint |
| `pnpm typecheck` | Verifica tipos com `tsc --noEmit` |

---

## Design system

Primitivas reutilizáveis em `apps/web/components/ui/`, pensadas para reaparecer em outras telas do produto (não só na landing):

| Componente | Descrição |
|---|---|
| `Button` | CTA em pílula, variantes de cor, efeito magnético opcional |
| `Input` | Campo de texto com label e slot de erro integrados |
| `Select` | Dropdown totalmente customizado (painel animado, teclado, acessível) |
| `Checkbox` | Caixa de seleção customizada com animação de check |
| `AccordionItem` | Disclosure reutilizável (base do FAQ) |

Tokens de cor, tipografia, raios e scrollbar customizado: [`apps/web/app/globals.css`](apps/web/app/globals.css). Racional visual completo: [`docs/landing-design-brief.md`](docs/landing-design-brief.md).

---

## Documentação

Toda a documentação de produto, domínio e processo vive em [`docs/`](docs/).

<details>
<summary><strong>Domínio e dados</strong></summary>

| Documento | Conteúdo |
|---|---|
| [bounded-contexts.md](docs/bounded-contexts.md) | Contextos DDD (`identity`, `adoption`, `occurrence`, `notifications`, `analytics`) |
| [der.dbml](docs/der.dbml) | Diagrama entidade-relacionamento ([dbdiagram.io](https://dbdiagram.io)) |
| [dicionario-de-dados.md](docs/dicionario-de-dados.md) | Especificação de campos, tipos e regras |
| [schema.prisma](docs/schema.prisma) | Schema Prisma de referência |
| [matriz-permissoes.md](docs/matriz-permissoes.md) | Papéis e permissões por contexto |
| [personas.md](docs/personas.md) | Personas do produto |

</details>

<details>
<summary><strong>Landing page (Fase 1)</strong></summary>

| Documento | Conteúdo |
|---|---|
| [landing-content-brief.md](docs/landing-content-brief.md) | Objetivo, públicos, tom de voz, estrutura de seções |
| [landing-design-brief.md](docs/landing-design-brief.md) | Paleta, tipografia, motion, design system |
| [landing-tech-plan.md](docs/landing-tech-plan.md) | Stack, formulário/persistência, SEO, deploy |

</details>

<details>
<summary><strong>LGPD e processo</strong></summary>

| Documento | Conteúdo |
|---|---|
| [lgpd-checklist.md](docs/lgpd-checklist.md) | Checklist LGPD mínimo para o MVP |
| [politica-privacidade-rascunho.md](docs/politica-privacidade-rascunho.md) | Rascunho de política de privacidade |
| [git-e-ci.md](docs/git-e-ci.md) | Branches, Conventional Commits, pipeline de CI |
| [ong-piloto.md](docs/ong-piloto.md) | Processo de seleção/onboarding da ONG piloto |

</details>

> Planejamento operacional (roadmap detalhado e board Kanban) é mantido localmente e não faz parte deste repositório.

---

## Convenções de contribuição

Resumo — detalhes completos em [`docs/git-e-ci.md`](docs/git-e-ci.md):

- **Branches:** `main` (produção) · `develop` (staging) · `feature/<slug>` · `hotfix/<slug>`
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) — `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`
- **Package manager:** apenas `pnpm` (não commitar lockfiles de npm/yarn)
- **CI:** PR só integra com `lint` + `typecheck` + `build` verdes

```text
feat(adoption): add RequestAdoption use case
fix(occurrence): allow null userId for anonymous reports
docs: update LGPD checklist
```

---

## Licença

Projeto privado — licença a definir.
