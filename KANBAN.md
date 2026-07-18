# ANIMAPS — Kanban (Fase 0 + Fase 1)

Board em Markdown para organizar a Fase 0 e a Fase 1. Fonte: [`ANIMAPS_Roadmap.md`](ANIMAPS_Roadmap.md) (seções 0.1–0.9 e 1.1–1.7).

**Como usar:** mova o card entre as colunas abaixo e marque as subtarefas com `[x]` conforme avançar. Um épico só vai para **Done** quando todas as subtarefas estiverem concluídas (ou explicitamente canceladas).

---

## Board

### Done

- [x] **E0.1 — Atualizar roadmap 0.4 / 0.6–0.7** (stack, monorepo, DDD, MVC)
- [x] **E0.2 — Documentar bounded contexts** → [`docs/bounded-contexts.md`](docs/bounded-contexts.md)
- [x] **E0.3 — Desenhar DER** → [`docs/der.dbml`](docs/der.dbml)
- [x] **E0.4 — Dicionário de dados** → [`docs/dicionario-de-dados.md`](docs/dicionario-de-dados.md) · [`docs/schema.prisma`](docs/schema.prisma)
- [x] **E0.5 — Matriz de permissões** → [`docs/matriz-permissoes.md`](docs/matriz-permissoes.md)
- [x] **E0.6 — Checklist LGPD mínimo** → [`docs/lgpd-checklist.md`](docs/lgpd-checklist.md) · [`docs/politica-privacidade-rascunho.md`](docs/politica-privacidade-rascunho.md)
- [x] **E0.7 — Convenções Git + CI** → [`docs/git-e-ci.md`](docs/git-e-ci.md)
- [x] **E0.8 — Escolher ferramenta Kanban + cadência** (board = este arquivo; Kanban contínuo + review semanal)
- [x] **E0.9 — ONG piloto (processo)** → [`docs/ong-piloto.md`](docs/ong-piloto.md) *(parceira A DEFINIR)*
- [x] **E1.1 — Estratégia da landing** (decisões) → [`docs/landing-content-brief.md`](docs/landing-content-brief.md)

### Doing

- [ ] **E1.4 — Desenvolvimento da landing** (`apps/web` — UI system + FAQ ok; copy/assets/persistência/GA4 pendentes)
- [ ] **Fase 1 — Landing page** (documentação das decisões fechada; execução via E1.2–E1.7)
  - Docs: [`docs/landing-content-brief.md`](docs/landing-content-brief.md) · [`docs/landing-design-brief.md`](docs/landing-design-brief.md) · [`docs/landing-tech-plan.md`](docs/landing-tech-plan.md)

### Backlog (próximas frentes)

1. **E1.2** — copy final PT/EN + estatísticas com fonte
2. **E1.3** — logo + fotos stock (WebP / máscaras)
3. **E1.4 follow-ups** — Postgres waitlist, i18n EN, GA4
4. **E1.5 → E1.7** — SEO, domínio/Vercel, divulgação orgânica
5. **Nomear controlador LGPD** + **confirmar ONG piloto** (bloqueantes de go-live / piloto real)

---

## Épicos e escopo interno

### E0.1 — Atualizar roadmap 0.4 / 0.6–0.7

**Objetivo:** registrar no roadmap as decisões de stack e arquitetura.

**Status:** Done

- [x] Stack: NestJS + Next.js + PostgreSQL/PostGIS + TypeScript
- [x] Monorepo (`apps/`, `packages/shared`, `docs/`)
- [x] Backend DDD + frontend MVC
- [x] JWT + refresh na própria API
- [x] Web primeiro; mobile depois (mesma API)
- [x] Seção de estratégia mobile documentada

**Entregável:** seções 0.4 e 0.6–0.7 atualizadas no roadmap.

---

### E0.2 — Documentar bounded contexts

**Objetivo:** delimitar o domínio da API NestJS em contextos DDD, com responsabilidades e fronteiras claras. Artefato: [`docs/bounded-contexts.md`](docs/bounded-contexts.md).

**Status:** Done

**Contextos iniciais**

| Contexto | Responsabilidade | Entidades principais |
|---|---|---|
| `identity` | Usuários, perfis, auth, verificação institucional | `User`, `GuardianProfile`, `NgoProfile`, `ClinicProfile` |
| `adoption` | Animais, matching/compatibilidade, solicitações e ciclo de vida da adoção | `Animal`, `Adoption` |
| `occurrence` | Ocorrências georreferenciadas, moderação, validação por NGO/órgão | `Occurrence`, `OccurrenceFollower` |
| `notifications` | Preferências, disparo e histórico de notificações | `Notification` |
| `analytics` | Indicadores agregados, exportação anonimizada, dashboards | (agregações; sem entidade de escrita própria no MVP) |

**Subtarefas**

- [x] Descrever cada contexto (objetivo, linguagem ubíqua, entidades principais)
- [x] Listar use cases principais por contexto (ex.: `RequestAdoption`, `RegisterOccurrence`, `ClaimOccurrence`)
- [x] Definir o que **não** pertence a cada contexto (anti-limites)
- [x] Mapear dependências entre contextos (quem chama quem; evitar acoplamento cíclico)
- [x] Definir eventos de domínio compartilhados (`AdoptionCompleted`, `OccurrenceCreated`, etc.) — in-process NestJS
- [x] Alinhar nomes de pastas `apps/api/src/modules/<context>/` com o documento
- [x] Confirmar nomenclatura em inglês (ver roadmap 0.5) antes de fechar o documento

**Entregável:** documento de bounded contexts revisado e referenciado no roadmap.

---

### E0.3 — Desenhar DER

**Objetivo:** modelo visual das entidades da seção 0.5 e seus relacionamentos. Artefato: [`docs/der.dbml`](docs/der.dbml) (abrir em [dbdiagram.io](https://dbdiagram.io)).

**Status:** Done

**Subtarefas**

- [x] Usar nomes de entidades em inglês no diagrama (`User`, `GuardianProfile`, `NgoProfile`, `ClinicProfile`, `Animal`, `Adoption`, `Occurrence`, `Notification`)
- [x] Modelar `User` e perfis 1:1 (`GuardianProfile`, `NgoProfile`, `ClinicProfile`)
- [x] Modelar `Animal`, `Adoption`, `Occurrence`, `Notification`
- [x] Definir FKs e cardinalidades (1:1, 1:N, N:N)
- [x] Incluir N:N — `occurrence_followers`
- [x] Representar `Occurrence.location` como `geography(Point, 4326)`
- [x] Incluir `guardian_profiles.is_rescuer` e `occurrences.user_id` nullable
- [x] Revisar com base nos bounded contexts (E0.2) — entidades no contexto certo
- [x] Exportar DER para `docs/` e linkar no roadmap

**Entregável:** DER visual completo e versionado em `docs/`.

---

### E0.4 — Dicionário de dados

**Objetivo:** especificação canônica de cada campo (base do schema Prisma e de `packages/shared`). Artefatos: [`docs/dicionario-de-dados.md`](docs/dicionario-de-dados.md) · [`docs/schema.prisma`](docs/schema.prisma).

**Status:** Done

**Subtarefas**

- [x] Para cada entidade: nome do campo, tipo, obrigatório/opcional, default
- [x] Nomear campos e enums em inglês (`snake_case` no banco / `camelCase` na API)
- [x] Documentar todos os enums e valores permitidos
- [x] Definir regras de unicidade (e-mail) e formatos (`taxId` / `companyTaxId`, UUID)
- [x] Documentar campos sensíveis (LGPD) — cruzar com E0.6
- [x] Definir estratégia de índices (GIST em `location`; compostos `status + type`, etc.)
- [x] Rascunhar schema Prisma com `location` como `Unsupported("geography(Point, 4326)")`
- [x] Revisar coerência com o DER (E0.3)
- [x] Registrar `clinic.verified`, `taxId` na adoção, adoptions paralelas

**Entregável:** dicionário completo + rascunho de `schema.prisma`, prontos para migrations depois.

---

### E0.5 — Matriz de permissões

**Objetivo:** tabela perfil × ação antes da Fase 2 (authz). Artefato: [`docs/matriz-permissoes.md`](docs/matriz-permissoes.md).

**Status:** Done

**Perfis:** `guardian`, `ngo`, `clinic`, `public_agency`, `biologist` (+ `verified` / `isRescuer`).

**Decisões refletidas na matriz**

- Criar `Animal`: NGO verificada, clinic verificada, ou guardian com `isRescuer`
- Criar `Occurrence`: anônimo ou autenticado; `ClaimOccurrence` depois
- `RequestAdoption`: guardian + `taxId`
- Validar Occurrence: NGO verified / public_agency; biologist só `wildlife_sighting`
- Solicitações paralelas; `in_process` no primeiro `approved`

**Subtarefas**

- [x] Montar matriz (perfil × ação → allow / deny / cond)
- [x] Documentar condições (`verified`, `isRescuer`, dono do recurso)
- [x] Marcar o que exige login vs. público / anônimo
- [x] Incluir casos de borda (rescuer, ocorrência anônima, biologist wildlife)
- [x] Alinhar com decisões E0.2–E0.4

**Entregável:** matriz documentada, base dos guards NestJS na Fase 2.

---

### E0.6 — Checklist LGPD mínimo

**Objetivo:** política mínima de privacidade antes de coletar dados reais. Artefatos: [`docs/lgpd-checklist.md`](docs/lgpd-checklist.md) · [`docs/politica-privacidade-rascunho.md`](docs/politica-privacidade-rascunho.md).

**Status:** Done (controlador permanece **A DEFINIR** até pré-lançamento)

**Subtarefas**

- [x] Mapear dados pessoais (cruzar com dicionário E0.4)
- [x] Definir base/consentimento no cadastro (geolocalização e fotos — microcopy)
- [x] Política de retenção e exclusão — 90 dias pós-`DeleteAccount`
- [x] Anonimização em exportações — só agregação bairro/cidade (sem lat/lng)
- [x] Responsável pelo tratamento — placeholder A DEFINIR (bloqueante go-live)
- [x] Logs de auditoria mínimos (VerifyNgo/Clinic, exclusão, export)
- [x] Fotos pós-exclusão: manter se interesse público, sem metadados do autor
- [x] Rascunho de política de privacidade

**Entregável:** checklist LGPD + rascunho de política (revisão jurídica fica fora deste épico).

---

### E0.7 — Convenções Git + CI

**Objetivo:** combinar fluxo de branches e pipeline **em documento** (scaffold de código fica para depois). Artefato: [`docs/git-e-ci.md`](docs/git-e-ci.md).

**Status:** Done

**Subtarefas**

- [x] Branches: `main`, `develop`, `feature/*`, `hotfix/*`
- [x] Conventional commits (tipos e exemplos do projeto)
- [x] Política de PR — solo, sem approve; self-review + CI quando existir
- [x] CI monorepo: lint + typecheck + test + build (`api` / `web`) via GitHub Actions (definição)
- [x] Ambientes: local / staging (`develop`) / production (`main`)
- [x] O que **não** entra no Git (`.env`, secrets)
- [x] Checklist de Definition of Done de PR
- [x] pnpm workspaces como padrão do monorepo

**Entregável:** convenções escritas; implementação do Actions só quando o monorepo for scaffoldado.

---

### E0.8 — Escolher ferramenta Kanban + cadência

**Objetivo:** decidir onde o board “oficial” vive no dia a dia e com que ritmo se entrega.

**Status:** Done

**Decisões**

- Board oficial: este [`KANBAN.md`](KANBAN.md)
- Cadência: fluxo contínuo (sem sprints)
- WIP sugerido: **1 épico** em Doing
- Ritual: **review semanal** (mover cards, atualizar checkboxes, puxar próximo do backlog)

**Subtarefas**

- [x] Escolher ferramenta — `KANBAN.md`
- [x] Sem board externo neste ciclo
- [x] Épicos da Fase 0 neste arquivo
- [x] Cadência contínua + review semanal
- [x] Atualizar checkbox da seção 0.8 no roadmap

**Entregável:** ferramenta + cadência registradas.

---

### E0.9 — ONG piloto (processo)

**Objetivo:** ter processo e template para fechar parceira que validará Fases 3/4.  
**Parceira nomeada:** ainda **A DEFINIR** (bloqueante do piloto real / entregável clássico da Fase 0).

**Status:** Done *(kit de processo)* — confirmação da ONG continua aberta

**Subtarefas**

- [x] Documentar critérios de seleção
- [x] Definir o que a ONG testa / esforço / ganho
- [x] Fixar canal de feedback (call quinzenal + async)
- [x] Template de mensagem de contato
- [x] Checklist “antes de confirmar”
- [x] Artefato [`docs/ong-piloto.md`](docs/ong-piloto.md) com placeholder A DEFINIR
- [ ] Preencher parceira real quando houver confirmação

**Entregável deste ciclo:** processo documentado.  
**Entregável clássico Fase 0 (ainda aberto):** ONG identificada e alinhada.

---

## Épicos Fase 1 — Landing Page e Institucional

Fonte: roadmap §1.1–1.7. Decisões iniciais consolidadas nos três briefs abaixo.

### E1.1 — Estratégia da landing

**Objetivo:** fechar objetivo primário, métricas e públicos antes de escrever copy.

**Status:** Done (decisões)

**Decisões**

- Objetivo primário: **lista de espera** (tutores/adotantes)
- CTA Hero: "Entrar na lista de espera"
- Métrica primária: conversão visitante → cadastro (GA4)
- Tráfego: **só orgânico** no início
- Escopo: **nacional**
- Comunicação: **equilibrada** tutor/ONG; clínica com seção dedicada; órgão público com menção institucional

**Subtarefas**

- [x] Definir objetivo primário e hierarquia de CTAs
- [x] Definir métricas de sucesso
- [ ] Mapear canais concretos de divulgação orgânica (passa a E1.7)

**Entregável:** [`docs/landing-content-brief.md`](docs/landing-content-brief.md) §1–3 · checkboxes §1.1 no roadmap.

---

### E1.2 — Conteúdo e copywriting

**Objetivo:** produzir a copy da landing (PT+EN) alinhada ao brief.

**Status:** Doing (estrutura decidida; textos finais pendentes)

**Artefato:** [`docs/landing-content-brief.md`](docs/landing-content-brief.md)

**Decisões**

- Tom emocional com dados reais; termo **"Match ideal"**
- Idiomas: PT + EN
- Prova social: números projetados com transparência
- Política: adaptar [`docs/politica-privacidade-rascunho.md`](docs/politica-privacidade-rascunho.md)

**Subtarefas**

- [x] Estruturar seções (Hero → CTA final)
- [x] Diretrizes de microcopy do formulário segmentado
- [ ] Escrever copy final PT + EN
- [ ] Validar estatísticas de abandono com fonte
- [ ] Microcopy final do formulário
- [ ] Adaptar/publicar política + termos mínimos

**Entregável:** textos prontos para implementação + páginas legais mínimas.

---

### E1.3 — Design (View)

**Objetivo:** identidade visual e specs implementáveis direto no código (sem Figma).

**Status:** Doing (pivot amigável aplicado; logo/assets pendentes)

**Artefato:** [`docs/landing-design-brief.md`](docs/landing-design-brief.md) · motion/stack em [`docs/landing-tech-plan.md`](docs/landing-tech-plan.md)

**Decisões**

- **Pivot pós-feedback:** direção **amigável-orgânica** (base `animaps-web/src`) — abandonou editorial/serif
- Fontes: **Sour Gummy** + **Oi**
- Paleta: multi-pastel (laranja/azul/amarelo/verde/roxo) + saturados para CTA
- Header **BubbleMenu**; divisores **wave**; blobs via `border-radius`; `lucide-react`
- Motion: GSAP `back.out` / `elastic.out` + Lenis; intensidade divertida
- Sem Figma — brief + código = fonte de verdade

**Subtarefas**

- [x] Brief de paleta, tipografia, imagery e a11y
- [x] Pivot visual amigável (tokens, fontes, BubbleMenu, waves, bounce)
- [x] Checklist do que evitar (anti genérico de IA) — atualizado pós-pivot
- [x] Cancelar protótipo Figma — design direto no código
- [ ] Criar logo + favicon + variantes
- [ ] Exportar / selecionar assets (WebP, fotos stock)

**Entregável:** specs no brief + logo/assets; implementação visual em E1.4.

---

### E1.4 — Desenvolvimento

**Objetivo:** implementar a landing em `apps/web` com formulário e analytics.

**Status:** Doing (scaffold + pivot visual + design system `ui/` + FAQ + waitlist placeholder)

**Artefato:** [`docs/landing-tech-plan.md`](docs/landing-tech-plan.md) · código em [`apps/web`](apps/web)

**Decisões**

- Stack: Next.js + TypeScript + Tailwind v4 + GSAP + **`lenis`** + **`lucide-react`**
- Fontes: Sour Gummy + Oi (pivot)
- Design system: `components/ui/` (`Button`, `Input`, `Select` custom, `Checkbox`, `AccordionItem`)
- Persistência: endpoint próprio (waitlist) — placeholder loga; Postgres na próxima iteração
- GA4 sim / Meta Pixel não / cookie banner simples (UI pronta; GA4 a ligar)
- i18n PT + EN (PT na UI agora; EN depois)

**Subtarefas**

- [x] Fechar stack e plano técnico
- [x] Scaffold monorepo / `apps/web` (`pnpm` workspaces + `@animaps/web`)
- [x] Tokens Tailwind multi-pastel + `SmoothScrollProvider`
- [x] Header BubbleMenu + Hero bounce/elastic + moldura blob
- [x] Seções repaletizadas (`ProblemSection` → `Footer`) com lucide + ScrollTrigger
- [x] Design system `ui/` (Button, Input, Select, Checkbox, AccordionItem)
- [x] Scrollbar customizado + `scroll-padding-top` (âncoras vs. header fixo)
- [x] Seção FAQ + link no Header/Footer
- [x] Revisão visual (dividers, overlaps, textos sem `TODO` visível)
- [x] `WaitlistForm` + `POST /api/waitlist` (validação; sem Postgres ainda)
- [x] Cookie banner (UI + localStorage; GA4 pendente)
- [ ] i18n PT + EN
- [ ] Persistência real da waitlist (Postgres)
- [ ] GA4 pós-consentimento + eventos (`cta_click`, `waitlist_submit`)
- [ ] Copy final + logo + fotos stock

**Entregável parcial:** landing rodável com `pnpm dev` — visual amigável + UI system documentado.  
**Entregável final:** landing funcional em preview/staging com persistência + analytics.

---

### E1.5 — SEO e performance

**Objetivo:** SEO no lançamento e Lighthouse >90.

**Status:** Backlog (requisitos Defined)

**Artefato:** [`docs/landing-tech-plan.md`](docs/landing-tech-plan.md) §6

**Subtarefas**

- [x] Definir requisitos SEO/performance
- [ ] Meta tags + Open Graph
- [ ] sitemap.xml + robots.txt
- [ ] Imagens WebP / `next/image`
- [ ] Auditoria Lighthouse >90

**Entregável:** landing indexável e performática.

---

### E1.6 — Publicação e testes

**Objetivo:** domínio, deploy Vercel e checklist de qualidade.

**Status:** Backlog

**Artefato:** [`docs/landing-tech-plan.md`](docs/landing-tech-plan.md) §7–8

**Subtarefas**

- [x] Definir hospedagem Vercel
- [ ] Registrar domínio
- [ ] Deploy staging (`develop`) + produção (`main`)
- [ ] Testes cross-browser e mobile real
- [ ] Smoke de pico leve

**Entregável:** landing no ar com HTTPS em domínio próprio.

---

### E1.7 — Divulgação e validação

**Objetivo:** atrair early adopters organicamente e validar hipóteses com entrevistas.

**Status:** Backlog

**Artefato:** [`docs/landing-content-brief.md`](docs/landing-content-brief.md) §9

**Subtarefas**

- [ ] Mapear canais orgânicos (Instagram, WhatsApp/Telegram, ONGs)
- [ ] Plano de posts de lançamento (PT; EN se houver canal)
- [ ] Acompanhar métricas por 2 semanas e iterar copy/CTA
- [ ] 3–5 entrevistas com inscritos da lista de espera

**Entregável:** lista segmentada com aprendizado qualitativo antes da Fase 2.


## Itens satélite (não são épicos, mas acompanham)

- [x] Objetivo primário da landing — **lista de espera** (E1.1 / [`docs/landing-content-brief.md`](docs/landing-content-brief.md))
- [ ] Validar custo mensal da stack / créditos gratuitos (roadmap 0.4)
- [x] Personas formalizadas — [`docs/personas.md`](docs/personas.md) (7 personas)
- [x] Requisitos 0.1/0.2 revisados no ciclo de validação Fase 0 (agendamento/laudo clínica ficam para Fases 3/6)

---

## Critério de conclusão da Fase 0

A Fase 0 fecha quando:

1. Arquitetura documentada (roadmap + bounded contexts) — feito  
2. DER + dicionário de dados prontos — feito  
3. Matriz de permissões + checklist LGPD — feito (controlador A DEFINIR no go-live)  
4. Convenções Git/CI definidas — feito ([`docs/git-e-ci.md`](docs/git-e-ci.md); workflow no scaffold)  
5. Governança (ferramenta + cadência) definida — feito (`KANBAN.md` + review semanal)  
6. ONG piloto identificada — **processo feito**; **nome A DEFINIR**

---

## Fechamento Fase 0 (documentação)

**Feito (docs E0.1–E0.9 processo):** stack/arquitetura, bounded contexts, DER, dicionário + Prisma draft, matriz de permissões, LGPD + rascunho de política, Git/CI, governança Kanban, kit ONG piloto.

### Ciclo de validação Fase 0 (lacunas fechadas)

- Novas entidades: `RefreshToken`, `EmailVerificationToken`, `PasswordResetToken`, `AuditLog`, `OccurrenceReport` (DER + dicionário + Prisma)
- Evento `AnimalRegisteredForMatching` → notificação de animais compatíveis
- SLA: 99% uptime + backup diário (retenção 30 dias)
- Segurança mínima: rate limit 10 req/min anônimo; upload jpg/png/webp até 5MB
- Personas: [`docs/personas.md`](docs/personas.md) (7 personas)
- Checkboxes 0.1 / 0.2 / 0.3 atualizados no roadmap

**Ainda bloqueia “Fase 0 completa” / go-live / piloto real:**

- Nomear **controlador LGPD**
- **Confirmar ONG piloto** (preencher [`docs/ong-piloto.md`](docs/ong-piloto.md))
- Scaffold monorepo + CI YAML (execução; não era doc)
- Agendamento clínico + `HealthReport` (Fases 3/6 — fora desta validação)

**Próximos passos naturais:**

1. Executar E1.2–E1.3 (copy + identidade/Figma) em paralelo com scaffold do monorepo  
2. Implementar E1.4–E1.6 (código landing + SEO + Vercel + domínio)  
3. E1.7 divulgação orgânica + entrevistas de validação  

Bloqueantes paralelos (não-landing): nomear controlador LGPD + confirmar ONG piloto.
