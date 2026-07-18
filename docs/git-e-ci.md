# ANIMAPS — Convenções Git e CI

Documento da Fase 0. Define o fluxo **antes** do scaffold do monorepo.  
Implementação do workflow (`.github/workflows/ci.yml`) e `pnpm-workspace.yaml` fica para o scaffold.

---

## Decisões fechadas

| Tema | Decisão |
|---|---|
| Package manager | **pnpm** workspaces |
| CI | **GitHub Actions** |
| Review humano | Solo no MVP — **sem** approve obrigatório; self-review + CI |
| Branches | `main` = produção · `develop` = staging · `feature/*` → `develop` · `hotfix/*` → `main` (+ backport `develop`) |
| CI no PR | `lint` + `typecheck` + `test` + `build` (`api` e `web`) |

---

## 1. Fluxo de branches

```text
feature/* ──PR──► develop (staging) ──release/PR──► main (production)
hotfix/*  ──PR──► main ──backport──► develop
```

| Branch | Uso |
|---|---|
| `main` | Produção. Só recebe merges estáveis (via `develop` ou `hotfix/*`). |
| `develop` | Staging. Integração contínua das features. |
| `feature/<slug>` | Trabalho isolado (ex.: `feature/identity-register`). Abre PR para `develop`. |
| `hotfix/<slug>` | Correção urgente em produção. PR para `main`; em seguida merge/cherry-pick em `develop`. |

**Regras**

- Não commit direto em `main` no dia a dia (exceto bootstrap inicial do repo).
- Preferir PR mesmo em solo: histórico claro + CI.
- Nomes de feature em inglês kebab-case, alinhados ao domínio (`feature/adoption-request`, `feature/occurrence-map`).

---

## 2. Conventional Commits

Formato: `<type>(optional-scope): <summary in English or PT — short>`

| Type | Quando |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Só documentação |
| `chore` | Manutenção, deps, configs |
| `refactor` | Mudança de código sem feat/fix |
| `test` | Testes |
| `ci` | Pipeline / Actions |

**Scopes úteis:** `identity`, `adoption`, `occurrence`, `web`, `api`, `shared`, `docs`.

**Exemplos**

```text
feat(adoption): add RequestAdoption use case
fix(occurrence): allow null userId for anonymous reports
docs: add LGPD checklist and privacy draft
chore(api): bump prisma to x.y.z
ci: define lint typecheck test build matrix
```

---

## 3. Política de Pull Request (MVP solo)

- **Reviewer humano:** não obrigatório.
- **Self-review:** autor percorre o DoD abaixo antes do merge.
- **CI:** quando o workflow existir, PR só mergeia com checks verdes (ativar branch protection no GitHub nesse momento).
- **Base padrão:** `feature/*` → `develop`. Releases `develop` → `main` com nota curta do que sobe.

### Definition of Done (copiar no PR)

```markdown
## DoD
- [ ] Escopo do PR é único e descrito
- [ ] Conventional commit(s) / título do PR claros
- [ ] Sem secrets (.env, tokens, keys) no diff
- [ ] Identificadores de código/schema em inglês
- [ ] Alinhado a docs de domínio (bounded contexts / permissões / LGPD) se tocar regras
- [ ] CI verde (lint, typecheck, test, build) — quando pipeline existir
- [ ] Self-review feito (diff relido)
```

---

## 4. Monorepo (pnpm)

Estrutura alvo:

```text
/
  apps/
    api/          # NestJS
    web/          # Next.js
  packages/
    shared/       # tipos, enums, DTOs
  docs/
  pnpm-workspace.yaml
  package.json    # scripts raiz
```

**Scripts raiz esperados** (a criar no scaffold):

| Script | Função |
|---|---|
| `pnpm lint` | ESLint nos packages/apps |
| `pnpm typecheck` | `tsc --noEmit` (api + web + shared) |
| `pnpm test` | Testes unitários/integração |
| `pnpm build` | Build `api` e `web` |

Filtros úteis: `pnpm --filter api <cmd>`, `pnpm --filter web <cmd>`.

---

## 5. CI — GitHub Actions (definição)

**Quando rodar:** push/PR para `develop` e `main` (e PRs que tenham essas bases).

**Jobs por app** (`api`, `web`), em Node LTS:

1. Checkout + setup pnpm + install (`pnpm install --frozen-lockfile`)
2. `lint`
3. `typecheck`
4. `test`
5. `build`

**Notas**

- Cache do store pnpm recomendado.
- `packages/shared` entra no typecheck/build dos consumidores.
- Workflow YAML **não** está neste épico — criar no scaffold do monorepo.
- Após o primeiro pipeline estável: ligar **branch protection** em `main` e `develop` exigindo status checks (ainda sem require approvals, conforme decisão solo).

---

## 6. Ambientes

| Ambiente | Branch típica | Hospedagem (planejado) |
|---|---|---|
| Local | qualquer | Docker/local Postgres+PostGIS |
| Staging | `develop` | Railway/Render (api) + Vercel preview/staging (web) |
| Production | `main` | mesmos provedores, projeto/prod separado |

### O que **não** entra no Git

- `.env`, `.env.local`, `.env.*.local`
- Secrets: `DATABASE_URL`, JWT keys, Mapbox, S3/R2, Trello tokens
- Credenciais de cloud e arquivos de service account
- `node_modules/`, builds (`dist/`, `.next/`)

Usar GitHub Actions secrets / variáveis do provedor de hospedagem.

---

## 7. Checklist de intenção (pós-scaffold)

- [ ] Criar `pnpm-workspace.yaml` e scripts raiz
- [ ] Adicionar `.github/workflows/ci.yml` conforme esta definição
- [ ] Proteger `main` e `develop` (required checks; approvals = 0 no MVP solo)
- [ ] Configurar staging ≠ production (URLs e secrets separados)
