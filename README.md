# ANIMAPS

Plataforma de **adoção responsável** e **mapa de ocorrências** animal.  
Conecta tutores, ONGs, clínicas e a comunidade em um fluxo com **Match ideal** — compatibilidade real, não só feed de fotos.

> Status atual: **Fase 1** — landing page institucional com lista de espera (`apps/web`). API NestJS e mobile virão nas próximas fases.

---

## O que é

O ANIMAPS nasce para organizar o caminho até uma adoção consciente e dar visibilidade a denúncias georreferenciadas:

| Público | O que encontra |
|---|---|
| **Tutores / adotantes** | Perfil + Match ideal com animais compatíveis à rotina |
| **ONGs** | Cadastro de animais e gestão de solicitações sem planilha |
| **Clínicas** | Parceria verificada no fluxo de adoção |
| **Comunidade** | Mapa de ocorrências (com ou sem conta) |

Stack e domínio pensados como **monorepo**: web primeiro, depois Android/iOS consumindo a mesma API.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Monorepo | **pnpm** workspaces |
| Web | **Next.js** (App Router) + **React** + **TypeScript** |
| Estilo | **Tailwind CSS v4** (tokens em `globals.css`) |
| Motion | **GSAP** + `@gsap/react` + **Lenis** (smooth scroll) |
| Ícones | **lucide-react** |
| API (planejada) | **NestJS** + DDD |
| Dados (planejado) | **PostgreSQL** + **PostGIS** + **Prisma** |
| Deploy web | **Vercel** |

**Arquitetura**

- Backend: **DDD** (bounded contexts em `docs/bounded-contexts.md`)
- Frontend: **MVC** na View (componentes + Route Handlers / Server Actions)
- Variáveis de sistema e banco: **inglês** (`camelCase` na API / `snake_case` no DB)

---

## Estrutura do repositório

```text
animaps/
├── apps/
│   └── web/                 # Landing + futuro app web (@animaps/web)
│       ├── app/             # App Router (pages, layout, API routes)
│       ├── components/
│       │   ├── landing/     # Seções da landing
│       │   ├── ui/          # Design system (Button, Input, Select…)
│       │   └── providers/   # Lenis + GSAP sync
│       └── public/
├── docs/                    # Documentação de domínio, design e LGPD
├── packages/                # (futuro) shared types / utils
├── package.json             # Scripts do monorepo
└── pnpm-workspace.yaml
```

---

## Começar a desenvolver

### Pré-requisitos

- **Node.js** 20+
- **pnpm** 10+ (`corepack enable` ou [instalação oficial](https://pnpm.io/installation))

### Instalação

```bash
pnpm install
```

### Desenvolvimento (landing)

```bash
pnpm dev
```

Abre em [http://localhost:3000](http://localhost:3000).

### Outros scripts

| Comando | Descrição |
|---|---|
| `pnpm build` | Build de produção do `@animaps/web` |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |

---

## Documentação

Tudo em [`docs/`](docs/). Pontos de entrada:

### Domínio e dados

| Documento | Conteúdo |
|---|---|
| [bounded-contexts.md](docs/bounded-contexts.md) | Contextos DDD (`identity`, `adoption`, `occurrence`…) |
| [der.dbml](docs/der.dbml) | Diagrama ER ([dbdiagram.io](https://dbdiagram.io)) |
| [dicionario-de-dados.md](docs/dicionario-de-dados.md) | Campos, tipos e regras |
| [schema.prisma](docs/schema.prisma) | Schema Prisma de referência |
| [matriz-permissoes.md](docs/matriz-permissoes.md) | Papéis e permissões |
| [personas.md](docs/personas.md) | Personas do produto |

### Landing (Fase 1)

| Documento | Conteúdo |
|---|---|
| [landing-content-brief.md](docs/landing-content-brief.md) | Conteúdo, CTA, públicos |
| [landing-design-brief.md](docs/landing-design-brief.md) | Visual, tokens, motion, UI system |
| [landing-tech-plan.md](docs/landing-tech-plan.md) | Stack web, formulário, SEO, deploy |

### LGPD e processo

| Documento | Conteúdo |
|---|---|
| [lgpd-checklist.md](docs/lgpd-checklist.md) | Checklist LGPD mínimo |
| [politica-privacidade-rascunho.md](docs/politica-privacidade-rascunho.md) | Rascunho de política |
| [git-e-ci.md](docs/git-e-ci.md) | Branches, Conventional Commits, CI |
| [ong-piloto.md](docs/ong-piloto.md) | Processo de ONG piloto |

### Design system (código)

Primitivas reutilizáveis em `apps/web/components/ui/`:

- `Button` — CTAs (opção magnética)
- `Input` / `Select` / `Checkbox` — formulários no estilo pastel
- `AccordionItem` — FAQ e ajuda futura

Tokens de cor, tipografia e scrollbar: `apps/web/app/globals.css`.

---

## Convenções Git

Resumo (detalhes em [docs/git-e-ci.md](docs/git-e-ci.md)):

- Branches: `main` (prod) · `develop` (staging) · `feature/*` · `hotfix/*`
- Commits: [Conventional Commits](https://www.conventionalcommits.org/)
- Package manager: **pnpm** (não misturar com npm/yarn na raiz)

---

## Roadmap interno

Planejamento detalhado e board Kanban ficam **fora** do repositório público (arquivos locais ignorados pelo Git). A evolução do produto segue as fases documentadas em `docs/` e no código.

---

## Licença

Projeto privado / A DEFINIR.
