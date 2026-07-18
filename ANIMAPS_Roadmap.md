# ANIMAPS — Roadmap de Desenvolvimento (Detalhado)

> Plataforma de adoção responsável e monitoramento georreferenciado de ocorrências relacionadas à fauna.

---

## Fase 0 — Definição, Planejamento e Arquitetura

**Objetivo:** ter clareza total do escopo, das entidades de dados e da arquitetura de código antes de escrever qualquer linha de produto. Esta é a fase que mais economiza retrabalho lá na frente — vale investir tempo real aqui.

### 0.1 Levantamento de requisitos funcionais (por perfil)

**Tutor / Adotante** (`guardian`)
- [x] Cadastrar-se e criar perfil de preferências (espaço, tempo, experiência, tipo de moradia) — modelado em `GuardianProfile`
- [x] Buscar animais disponíveis com filtros — `ListAvailableAnimals`
- [x] Ver nível de compatibilidade com cada animal — `CalculateCompatibility` / score em `Adoption`
- [x] Solicitar adoção e acompanhar status — `RequestAdoption` + status enums
- [x] Registrar ocorrências (abandono, atropelamento, avistamento) — `RegisterOccurrence`
- [x] Receber notificações de animais compatíveis e ocorrências próximas — eventos `AnimalRegisteredForMatching` / `OccurrenceCreated` → `notifications`

**ONG** (`ngo` + `verified`)
- [x] Cadastrar-se com dados institucionais (CNPJ/`companyTaxId`, área de atuação, capacidade de atendimento) — `NgoProfile`
- [x] Cadastrar animais para adoção (com fotos, histórico de saúde, temperamento) — `RegisterAnimal`
- [x] Gerenciar solicitações de adoção recebidas — `ReviewAdoption`
- [x] Visualizar ocorrências na sua região de atuação — `ListOccurrencesNearby` + `FollowOccurrence`
- [x] Acessar dashboard com indicadores da região — `analytics` / `GetRegionalDashboard` (implementação Fase 5)

**Clínica Veterinária** (`clinic` + `verified`)
- [x] Cadastrar-se e divulgar serviços (vacinação, castração, atendimento emergencial) — `ClinicProfile.servicesOffered`
- [ ] Receber solicitações de agendamento vindas de tutores/ONGs — **detalhamento na Fase 6**
- [ ] Emitir laudo/atestado de saúde vinculado ao animal — **`HealthReport` na Fase 3** (hoje: `health_history` textual)

**Órgão Público / Biólogo / Pesquisador**
- [x] Acessar dashboard de indicadores agregados (sem dados pessoais dos tutores) — `analytics`
- [x] Exportar dados anonimizados — `ExportAnonymizedDataset` (bairro/cidade; ver LGPD)
- [x] Sinalizar/validar ocorrências de fauna silvestre — `ValidateOccurrence` (`biologist` só `wildlife_sighting`; `public_agency` geral)

### 0.2 Requisitos não funcionais
- [x] **Performance**: consultas geoespaciais num raio devem mirar resposta em menos de 500ms — **estratégia definida**: índice GIST em `occurrences.location` (ver dicionário/`schema.prisma`); medição real pós-implementação
- [x] **Disponibilidade**: SLA mínimo **99% uptime**; backup diário do banco com **retenção de 30 dias**
- [x] **Escalabilidade**: upload de imagens em object storage (S3/R2), não no banco — decidido na stack 0.4
- [x] **Segurança** (política mínima): rate limit padrão **10 req/min** para criação anônima de ocorrência (por IP); uploads aceitos **jpg/png/webp**, máx. **5MB**; sanitização/EXIF na implementação (Fase 4)
- [ ] **Privacidade/LGPD**:
- [x] Mapear quais dados são pessoais — ver [`docs/lgpd-checklist.md`](docs/lgpd-checklist.md) + dicionário
- [x] Definir política de retenção e exclusão (conta ativa + **90 dias** após exclusão)
- [x] Anonimizar localização em exportações — **agregação por bairro/cidade** (sem coordenadas)
- [x] Termo de consentimento explícito — microcopy no checklist; rascunho em [`docs/politica-privacidade-rascunho.md`](docs/politica-privacidade-rascunho.md)
- [ ] Nomear responsável pelo tratamento de dados — **A DEFINIR** (bloqueante para lançamento público)

### 0.3 Personas (para orientar decisões de UX)

Documento completo: [`docs/personas.md`](docs/personas.md) (**7 personas**).

- [x] **"Ana, tutora de primeira viagem"** — apartamento pequeno, pouco tempo; matching evita porte/energia incompatíveis
- [x] **"ONG Patas Unidas"** — equipe pequena; cadastro de animal rápido (poucos campos obrigatórios)
- [x] **"Dr. Marcos, biólogo"** — dados agregados de fauna silvestre; sem PII de quem registrou
- [x] **+4 personas:** Dra. Helena (clínica), Ricardo (resgatista `isRescuer`), Carla (órgão público), João (ocorrência anônima) — ver [`docs/personas.md`](docs/personas.md)

### 0.4 Escolha de stack tecnológica

**Status:** decisões principais **fechadas**. TypeScript em todas as camadas de aplicação. Entrega inicial é **web**; Android/iOS vêm depois, reaproveitando a mesma API e os contratos do monorepo.

| Camada | Decisão | Alternativas | Motivo / notas |
|---|---|---|---|
| Backend | Node.js + NestJS + TypeScript | Django, Laravel | Módulos NestJS mapeiam bem para bounded contexts (DDD) |
| Frontend | React + Next.js + TypeScript | Vue + Nuxt | SSR/SSG para SEO da landing e carregamento inicial do mapa |
| Banco de dados | PostgreSQL + PostGIS | MongoDB + geoindex | Padrão de mercado para consultas geoespaciais (raio, polígonos, clusterização) |
| ORM | Prisma | TypeORM | Boa DX e migrations; PostGIS via `Unsupported()` + `$queryRaw` para funções espaciais |
| Estrutura do repo | Monorepo (`apps/` + `packages/`) | Repos separados | Compartilha tipos/DTOs entre web, API e futuro mobile |
| Mapas | Mapbox GL JS *(pendente validação de custo)* | Leaflet, Google Maps API | Bom custo-benefício e heatmaps; validar tier gratuito |
| Armazenamento de arquivos | AWS S3 ou Cloudflare R2 *(pendente)* | Cloudinary | Object storage separado do banco; Cloudinary é mais simples, mas tende a sair mais caro em escala |
| Autenticação | JWT + refresh token (API própria) | Auth0, Firebase Auth | Controle total e alinhado ao domínio; terceirizar só se o MVP exigir velocidade extra |
| Hospedagem backend | Railway ou Render | AWS EC2/ECS | Menor complexidade operacional no início |
| Hospedagem frontend | Vercel | Netlify | Integração nativa com Next.js |
| Filas/jobs assíncronos | BullMQ (Redis) *(pendente)* | AWS SQS | Notificações e processamento de imagem em background |

- [x] Definir stack principal (NestJS + Next.js + PostgreSQL/PostGIS + TypeScript) e monorepo
- [x] Definir autenticação inicial (JWT + refresh token na própria API)
- [x] Definir estratégia de entrega: web primeiro; mobile depois na mesma API
- [x] Definir ORM (Prisma) e estratégia de mapeamento PostGIS (`Unsupported` + raw SQL; índice GIST via migration SQL manual)
- [ ] Validar custo estimado mensal da stack escolhida (importante para um projeto social/ONG com orçamento provavelmente limitado)
- [ ] Verificar se há créditos gratuitos disponíveis (AWS Activate, Google for Nonprofits, Mapbox tem tier gratuito generoso)
- [ ] Confirmar provedor de object storage (S3 vs R2) e de mapas (Mapbox vs alternativa) antes da Fase 4

### 0.5 Modelagem de dados (Model) — detalhada

**Convenção de nomenclatura (código/schema):** inglês, com `snake_case` no banco e `camelCase` na API/TypeScript (Prisma faz o mapeamento via `@map` / `@@map`). Prosa do roadmap, comentários e textos ao usuário permanecem em português.

**Vocabulário de domínio:** `guardian` (ex-tutor), `ngo` (ex-ong), `clinic` (ex-clinica), `public_agency` (ex-orgao_publico), `biologist` (ex-biologo).

**Documentos:** `taxId` (pessoa física) / `companyTaxId` (pessoa jurídica) — genéricos, sem acoplar o schema a CPF/CNPJ.

**Entidades principais e seus atributos:**

```
User
- id (uuid)
- name
- email (unique)
- passwordHash
- role (enum: guardian, ngo, clinic, public_agency, biologist)
- phone
- city / state
- createdAt, updatedAt
- lgpdConsent (boolean + date)

GuardianProfile (1:1 with User, when role = guardian)
- availableSpace (enum: small_apartment, large_apartment, house_with_yard, farm)
- availableTime (enum: low, moderate, high)
- hasPreviousExperience (boolean)
- hasOtherPets (boolean)
- preferredSize (enum: small, medium, large, any)
- preferredSpecies (enum: dog, cat, other, any)
- isRescuer (boolean — allows guardian to register animals)
- taxId (optional individual tax id)

NgoProfile (1:1 with User, when role = ngo)
- companyTaxId
- tradeName
- serviceArea (radius in km or geographic polygon)
- serviceCapacity (numeric)
- verified (boolean — manual document validation)

ClinicProfile (1:1 with User, when role = clinic)
- companyTaxId
- servicesOffered (array: vaccination, neutering, emergency_care, grooming)
- businessHours
- verified (boolean — manual document validation, same as NGO)

Animal
- id (uuid)
- ngoId / guardianId / clinicId (who registered it — see ownership rules below)
- name
- species (enum: dog, cat, other)
- breed
- estimatedAge
- size (enum: small, medium, large)
- temperament (array: docile, playful, independent, needs_space, etc.)
- healthHistory (text, or relation to a Clinic report)
- photos (array of URLs)
- status (enum: available, in_process, adopted)
- createdAt

**Animal ownership (who may register):** verified `ngo`, verified `clinic`, or `guardian` with `isRescuer = true`.

**Adoption:** multiple parallel requests on the same animal are allowed; origin chooses. Animal status becomes `in_process` on the first `approved` (not on `requested`). Guardian `taxId` is required at `RequestAdoption`.

Adoption
- id (uuid)
- animalId
- guardianId
- ngoId (animal's origin)
- compatibilityScore (calculated at request time)
- status (enum: requested, under_review, approved, rejected, completed, cancelled)
- requestedAt, completedAt

Occurrence
- id (uuid)
- userId (optional — null = anonymous report; claim later via ClaimOccurrence)
- type (enum: abandonment, mistreatment, vehicle_collision, wildlife_sighting, lost_animal, found_animal)
- description
- location (geography(Point, 4326) — native PostGIS type; Unsupported("geography(Point, 4326)") in Prisma)
- photos (array of URLs)
- status (enum: open, in_progress, resolved, invalid)
- validatedBy (reference to the NGO/public agency that confirmed authenticity, optional)
- createdAt

Notification
- id, userId, type, message, read (boolean), createdAt
```

- [x] Desenhar o DER visualmente — artefato: [`docs/der.dbml`](docs/der.dbml) (importar em [dbdiagram.io](https://dbdiagram.io))
- [x] Definir relacionamentos N:N onde necessário — `occurrence_followers` (Occurrence × User)
- [x] Criar dicionário de dados completo — [`docs/dicionario-de-dados.md`](docs/dicionario-de-dados.md) · rascunho [`docs/schema.prisma`](docs/schema.prisma)
- [x] Definir estratégia de índices (GIST em `location`, compostos `status + type`, etc.) — ver dicionário

**Artefatos de domínio:** [`docs/bounded-contexts.md`](docs/bounded-contexts.md) · [`docs/der.dbml`](docs/der.dbml) · [`docs/dicionario-de-dados.md`](docs/dicionario-de-dados.md) · [`docs/schema.prisma`](docs/schema.prisma) · [`docs/matriz-permissoes.md`](docs/matriz-permissoes.md) · [`docs/lgpd-checklist.md`](docs/lgpd-checklist.md) · [`docs/politica-privacidade-rascunho.md`](docs/politica-privacidade-rascunho.md) · [`docs/git-e-ci.md`](docs/git-e-ci.md) · [`docs/ong-piloto.md`](docs/ong-piloto.md) · [`docs/personas.md`](docs/personas.md)

### 0.6 Arquitetura — monorepo, DDD (API) e MVC (web)

**Status:** decisões de arquitetura **fechadas**. Backend em DDD; frontend web em MVC; um único monorepo TypeScript.

#### Estrutura do monorepo

```
/
  apps/
    api/                 → NestJS (DDD)
    web/                 → Next.js (MVC)
    # mobile/            → futuro (Android/iOS); consome a mesma API
  packages/
    shared/              → tipos, DTOs, enums e contratos compartilhados
  docs/                  → arquitetura, DER, dicionário de dados, ADRs
```

#### Backend (`apps/api`) — DDD por bounded context

Contextos iniciais: `identity`, `adoption`, `occurrence`, `notifications`, `analytics`.  
Detalhamento: [`docs/bounded-contexts.md`](docs/bounded-contexts.md).

**Integração entre módulos:** eventos de domínio **in-process** (pub/sub NestJS). Contextos não importam classes de domínio uns dos outros; `notifications` e `analytics` só consomem eventos no MVP. BullMQ/Redis permanece para jobs pesados depois — não é o barramento padrão entre contextos nesta fase.

```
apps/api/src/
  modules/<context>/
    domain/              → entidades, value objects, regras de negócio, ports (interfaces)
    application/         → use cases / application services
    infrastructure/      → ORM/PostGIS, object storage, Redis, e-mail, filas
    interfaces/http/     → controllers, DTOs de entrada/saída, guards
```

Regras de negócio ficam no `domain` / `application`. Controllers HTTP só adaptam a requisição e devolvem resposta — não concentram lógica de domínio.

#### Frontend (`apps/web`) — MVC

```
apps/web/src/
  models/                → tipos, mappers, acesso à API (camada de dados)
  controllers/           → hooks, handlers, orquestração do fluxo da aplicação
  views/                 → pages, components, layouts
  app/                   → roteamento Next.js (App Router); entry points que ligam Controller → View
```

- **Model:** estado e dados (contratos de `packages/shared` + clientes HTTP).
- **Controller:** orquestra ações do usuário e chama a API.
- **View:** apresentação pura (UI), sem regra de negócio de domínio.

#### Decisões e checklist de engenharia

- [x] Adotar **monolito modular** (NestJS por contexto DDD) — microsserviços ficam fora do escopo inicial
- [x] Separar responsabilidades: DDD na API, MVC no web
- [x] Usar monorepo com `packages/shared` para contratos TypeScript
- [x] Documentar bounded contexts e boundaries entre módulos em `docs/bounded-contexts.md`
- [x] Definir integração entre contextos via eventos de domínio in-process (NestJS)
- [ ] Definir padrão de API REST versionada: `/api/v1/users`, `/api/v1/animals`, `/api/v1/occurrences`, `/api/v1/adoptions`
- [ ] Documentar API com Swagger/OpenAPI desde o início (base para o app mobile e parceiros)
- [x] Configurar repositório Git com convenção de branches (`main`, `develop`, `feature/*`, `hotfix/*`) e conventional commits — [`docs/git-e-ci.md`](docs/git-e-ci.md)
- [x] Definir CI/CD básico (GitHub Actions): lint + typecheck + test + build por app (`api` / `web`) — doc pronto; YAML no scaffold
- [x] Definir ambiente de staging (`develop`) separado do de produção (`main`)

### 0.7 Estratégia mobile (futuro)

Documentação apenas nesta fase — **sem implementação** na Fase 0.

- O app Android/iOS consome a **mesma API** NestJS (`apps/api`), via REST/OpenAPI.
- Contratos TypeScript (enums, DTOs, tipos de domínio compartilháveis) vivem em `packages/shared`.
- Pasta reservada no monorepo: `apps/mobile/` (quando for a hora).
- Escolha do framework mobile (ex.: Expo / React Native vs outra opção) fica **fora da Fase 0**; decidir só quando a API e o web estiverem estáveis o suficiente para extrair valor do app nativo.

### 0.8 Governança do projeto
- [x] Definir ferramenta de gestão de tarefas — [`KANBAN.md`](KANBAN.md) (oficial no repo)
- [x] Definir cadência — fluxo contínuo Kanban + **review semanal** do board (WIP sugerido: 1 épico em Doing)
- [ ] Confirmar ONG piloto real para Fases 3/4 — processo em [`docs/ong-piloto.md`](docs/ong-piloto.md); parceira **A DEFINIR**

### 0.9 Épicos sugeridos para o Kanban (Fase 0)

Ordem sugerida de cards (copiar para o board quando a ferramenta de gestão estiver escolhida):

1. **Atualizar roadmap 0.4 / 0.6–0.7** — stack, monorepo, DDD e MVC *(feito)*
2. **Documentar bounded contexts** — [`docs/bounded-contexts.md`](docs/bounded-contexts.md) *(feito)*
3. **Desenhar DER** — [`docs/der.dbml`](docs/der.dbml) *(feito)*
4. **Dicionário de dados** — [`docs/dicionario-de-dados.md`](docs/dicionario-de-dados.md) · [`docs/schema.prisma`](docs/schema.prisma) *(feito)*
5. **Matriz de permissões** — [`docs/matriz-permissoes.md`](docs/matriz-permissoes.md) *(feito)*
6. **Checklist LGPD mínimo** — [`docs/lgpd-checklist.md`](docs/lgpd-checklist.md) · [`docs/politica-privacidade-rascunho.md`](docs/politica-privacidade-rascunho.md) *(feito; controlador A DEFINIR)*
7. **Convenções Git + CI** — [`docs/git-e-ci.md`](docs/git-e-ci.md) *(feito; YAML no scaffold)*
8. **Escolher ferramenta Kanban + cadência** — `KANBAN.md` + fluxo contínuo + review semanal *(feito)*
9. **ONG piloto** — processo/template em [`docs/ong-piloto.md`](docs/ong-piloto.md) *(feito; parceira A DEFINIR)*

**Ainda em aberto na Fase 0 (além dos épicos acima):** Controlador LGPD e ONG nomeada continuam bloqueantes de go-live / piloto real. *(Objetivo primário da landing fechado na Fase 1: lista de espera — ver [`docs/landing-content-brief.md`](docs/landing-content-brief.md).)*

**Entregável da Fase 0:** documento de arquitetura, DER completo, dicionário de dados, convenções Git/CI (YAML no scaffold), governança no `KANBAN.md`, e ao menos uma ONG parceira **identificada** para pilotar o produto *(processo pronto; identificação pendente)*.

---

## Fase 1 — Landing Page e Institucional

**Objetivo:** validar a proposta de valor, captar early adopters (tutores e ONGs) e começar a construir credibilidade institucional antes mesmo da plataforma completa existir.

**Documentação de decisões (Fase 1):**
- Conteúdo/estratégia → [`docs/landing-content-brief.md`](docs/landing-content-brief.md)
- Design → [`docs/landing-design-brief.md`](docs/landing-design-brief.md)
- Tech/SEO/publicação → [`docs/landing-tech-plan.md`](docs/landing-tech-plan.md)

### 1.1 Estratégia antes do conteúdo

> Decisões fechadas em [`docs/landing-content-brief.md`](docs/landing-content-brief.md): objetivo = lista de espera; métrica primária = conversão visitante→cadastro; tráfego só orgânico; escopo nacional; comunicação equilibrada tutor/ONG.

- [x] Definir o objetivo primário da landing page: **captação de lista de espera** (tutores/adotantes), com CTAs hierarquizados e voz equilibrada para ONGs
- [x] Definir métricas de sucesso: **primária** = taxa de conversão visitante → cadastro; secundárias = mix de perfis, bounce, scroll depth (GA4)
- [ ] Mapear canais de divulgação inicial (Instagram de proteção animal, grupos de WhatsApp de ONGs, comunidades de veterinários) — execução ainda pendente (só orgânico)

### 1.2 Conteúdo e copywriting

> Estrutura, tom, "Match ideal", PT+EN, clínicas dedicadas e prova social transparente documentados em [`docs/landing-content-brief.md`](docs/landing-content-brief.md). Textos finais e fontes das estatísticas ainda a produzir.

- [x] Definir tom: emocional com dados reais, sem apelação; termo canônico **"Match ideal"**
- [x] Estruturar seções da página (ordem canônica no content brief):
  1. **Hero**: frase de impacto + CTA "Entrar na lista de espera" + **foto** (sem vídeo)
  2. **O Problema**: dados sobre abandono (com fonte), dispersão de informação, dificuldade das ONGs
  3. **A Solução**: Match ideal + mapa de ocorrências
  4. **Como Funciona**: passo a passo visual
  5. **Para Quem É**: Tutor, ONG, **Clínica (dedicada)**, Órgão Público (**menção institucional**)
  6. **Diferenciais**: vs. grupos de Facebook/Instagram/WhatsApp
  7. **Prova social**: números projetados com transparência (sem depoimentos falsos)
  8. **CTA final** reforçado + formulário segmentado
- [x] Definir campos/microcopy-diretrizes do formulário (segmentação tutor/ONG/clínica/outro)
- [x] Estratégia de política: **adaptar** [`docs/politica-privacidade-rascunho.md`](docs/politica-privacidade-rascunho.md) + termos mínimos
- [ ] Escrever copy final (dor, solução, seções) em **PT e EN**
- [ ] Pesquisar e citar estatísticas de abandono com fonte validada
- [ ] Escrever microcopy final dos formulários (labels, erros, confirmação) PT/EN
- [ ] Publicar versão adaptada da política de privacidade + termos mínimos na landing

### 1.3 Design (View)

> Brief em [`docs/landing-design-brief.md`](docs/landing-design-brief.md): identidade a criar do zero; moderno/acolhedor; fotos stock; sem dark mode; acessibilidade desde o MVP; mobile-first.

- [x] Definir diretrizes de identidade visual: paleta tons naturais + destaque vibrante; tipografia séria (corpo) + amigável (títulos)
- [x] Decidir imagery: fotos reais (stock); sem vídeo no Hero; sem dark mode
- [x] Aceitar acessibilidade básica como obrigatória no MVP (contraste, alt, labels, `prefers-reduced-motion`)
- [ ] Criar paleta, tipografia e logo (ainda inexistentes)
- [ ] Wireframe de baixa fidelidade (papel ou Figma)
- [ ] Protótipo de alta fidelidade no Figma, com componentes reutilizáveis (base do design system)
- [ ] Design mobile-first — validar em telas pequenas primeiro
- [ ] Exportar assets (WebP, SVG logo, favicon, OG image)

### 1.4 Desenvolvimento

> Stack e plano em [`docs/landing-tech-plan.md`](docs/landing-tech-plan.md): Next.js + TypeScript + Tailwind + React Bits + GSAP em `apps/web`; endpoint próprio; GA4 sem Meta Pixel; cookie banner.

- [x] Definir stack: **Next.js + TypeScript + Tailwind CSS + React Bits + GSAP** no monorepo (`apps/web`)
- [x] Definir componentização (Hero, cards, WaitlistForm, Footer, CookieBanner)
- [x] Definir formulário segmentado (tutor / ONG / clínica / outro) + validação
- [x] Definir persistência: **endpoint próprio** (não ferramenta externa)
- [x] Definir analytics: **GA4** + eventos de conversão; **sem Meta Pixel**; cookie banner simples
- [ ] Scaffold monorepo / `apps/web` (se ainda não existir) e implementar landing
- [ ] Implementar i18n PT + EN
- [ ] Implementar formulário + endpoint + persistência da waitlist
- [ ] Integrar cookie banner + GA4 pós-consentimento + eventos (`cta_click`, `waitlist_submit`)

### 1.5 SEO e performance

> Requisitos fechados em [`docs/landing-tech-plan.md`](docs/landing-tech-plan.md) §6 — execução no deploy.

- [x] Definir SEO como prioridade no lançamento (meta tags, OG, sitemap, robots, Lighthouse >90)
- [ ] Meta tags (title, description) otimizadas
- [ ] Open Graph tags + imagem de preview
- [ ] Sitemap.xml e robots.txt
- [ ] Otimização de imagens (WebP, lazy loading / `next/image`)
- [ ] Teste Lighthouse / PageSpeed (mirar pontuação >90)

### 1.6 Publicação e testes

> Hospedagem **Vercel** já decidida; domínio ainda a registrar — ver [`docs/landing-tech-plan.md`](docs/landing-tech-plan.md) §7–8.

- [x] Definir hospedagem: **Vercel** + HTTPS
- [ ] Registrar domínio próprio
- [ ] Deploy em Vercel com HTTPS (staging via `develop` / produção via `main`)
- [ ] Testes cross-browser (Chrome, Safari, Firefox) e dispositivos móveis reais
- [ ] Teste de carga leve (pico de redes sociais)

### 1.7 Divulgação e validação
- [ ] Plano de lançamento inicial (postagem em redes sociais, contato direto com ONGs conhecidas, grupos de WhatsApp/Telegram do setor) — **só orgânico**
- [ ] Acompanhar métricas nas primeiras 2 semanas e ajustar copy/CTA conforme taxa de conversão
- [ ] Fazer 3–5 entrevistas rápidas com pessoas da lista de espera (tutores e ONGs) para validar hipóteses do produto antes de construir a Fase 2 em diante

**Entregável da Fase 1:** landing page no ar, lista segmentada de interessados (tutores/ONGs/clínicas), métricas iniciais de interesse e ao menos um punhado de conversas de validação com usuários reais.

---

ais.

---

## Fase 2 — Autenticação e Perfis de Usuário

**Objetivo:** ter uma base sólida de contas, com autorização correta por tipo de perfil, já que cada perfil vê e pode fazer coisas bem diferentes na plataforma.

### 2.1 Backend — Model
- [ ] Criar model `Usuario` com tipos de perfil (enum: tutor, ong, clinica, orgao_publico, biologo)
- [ ] Criar tabelas de perfil estendido (1:1), conforme detalhado na Fase 0 (`PerfilTutor`, `InstituicaoONG`, `Clinica`)
- [ ] Definir estratégia de senha: hash com bcrypt ou argon2 (nunca armazenar em texto plano, nem com hash fraco tipo MD5/SHA1 puro)
- [ ] Definir campos de verificação: `email_verificado` (boolean), `documento_verificado` (para ONGs/clínicas, com processo manual de aprovação)

### 2.2 Backend — Cadastro e validações
- [ ] Endpoint de cadastro com validação de:
  - E-mail único e formato válido
  - CPF (tutor) ou CNPJ (ONG/clínica) com validação de dígito verificador
  - Senha forte (mínimo de caracteres, não permitir senhas óbvias)
- [ ] Envio de e-mail de confirmação de cadastro (usar fila assíncrona — não travar a resposta da API esperando o envio de e-mail)
- [ ] Fluxo de verificação de ONG/Clínica: upload de documento (ex: estatuto social, CNPJ ativo) para análise manual antes de liberar o cadastro de animais — isso evita fraudes e golpes de "adoção falsa"

### 2.3 Backend — Autenticação
- [ ] Implementar login com JWT (access token de curta duração + refresh token de longa duração)
- [ ] Implementar blacklist/revogação de refresh token no logout
- [ ] Implementar fluxo de "esqueci minha senha" (token temporário enviado por e-mail, com expiração)
- [ ] Considerar login social (Google) para reduzir fricção no cadastro de tutores — avaliar custo-benefício vs. complexidade adicional
- [ ] Rate limiting no endpoint de login (proteção contra força bruta)

### 2.4 Backend — Autorização (Controller/Middleware)
- [ ] Middleware de verificação de tipo de perfil por rota (ex: `POST /animais` só aceita usuários tipo `ong` ou `tutor` verificado como "resgatista")
- [ ] Middleware de verificação de "dono do recurso" (ex: só a ONG que cadastrou o animal pode editá-lo)
- [ ] Definir matriz de permissões clara (tabela: perfil x ação permitida) documentada antes de implementar, para evitar buracos de segurança

### 2.5 Frontend (View)
- [ ] Tela de escolha de tipo de perfil no cadastro (primeira pergunta: "Você é tutor, ONG, clínica ou representa um órgão público?")
- [ ] Formulário de cadastro dinâmico — campos mudam conforme o tipo escolhido
- [ ] Tela de login com opção de recuperação de senha
- [ ] Tela de verificação pendente para ONGs/clínicas (comunicar claramente que o cadastro está em análise, com prazo estimado)
- [ ] Onboarding pós-cadastro: tutorial rápido específico por perfil (ex: tutor é guiado a preencher preferências; ONG é guiada a cadastrar o primeiro animal)

### 2.6 Perfil e preferências (fundamental para a Fase 3)
- [ ] Formulário de preferências do tutor:
  - Tipo de moradia (apartamento pequeno/grande, casa com/sem quintal, sítio)
  - Tempo disponível por dia (pouco / moderado / muito)
  - Experiência prévia com animais (sim/não, e com qual tipo)
  - Presença de outros animais ou crianças em casa
  - Preferência de porte e espécie
  - Disponibilidade financeira aproximada para cuidados (opcional, mas ajuda a evitar devoluções por questão de custo veterinário)
- [ ] Formulário de dados institucionais da ONG:
  - Área de atuação (raio de atendimento ou lista de bairros/cidades)
  - Capacidade de atendimento simultâneo
  - Espécies com que trabalha
- [ ] Validação: tornar campos-chave obrigatórios para liberar o uso completo da plataforma, mas permitir cadastro básico rápido (reduzir fricção) com complementação depois

### 2.7 Segurança e conformidade
- [ ] Página de política de privacidade acessível e o que exatamente é feito com os dados de perfil/preferências
- [ ] Opção de exclusão de conta e dados (atendendo à LGPD)
- [ ] Logs de auditoria para ações sensíveis (aprovação de ONG, mudança de permissão)

**Entregável da Fase 2:** sistema de contas funcional, com verificação de identidade institucional, matriz de permissões implementada e formulários de preferência prontos para alimentar o algoritmo de compatibilidade.

---

## Fase 3 — Módulo de Adoção

**Objetivo:** entregar o core do produto — a experiência que resolve diretamente o problema de adoções malsucedidas e devoluções de animais.

### 3.1 Cadastro de animais (Model + Controller)
- [ ] CRUD completo de animais (espécie, raça, idade estimada, porte, sexo, castrado ou não, vacinado ou não)
- [ ] Campo de temperamento como múltipla escolha estruturada (não texto livre) para poder ser usado no algoritmo de compatibilidade — ex: dócil, brincalhão, independente, medroso, sociável com outros animais, sociável com crianças
- [ ] Campo de "nível de energia" (baixo, médio, alto) — muito relevante para o matching
- [ ] Histórico de saúde: texto livre + possibilidade de anexar laudo emitido por Clínica parceira (link com a entidade `Clinica`)
- [ ] Upload múltiplo de imagens, com validação de tamanho/formato e redimensionamento automático (thumbnail para listagem, imagem maior para página de detalhe)
- [ ] Status do animal (disponível, em_processo, adotado) com regra de negócio: um animal "em processo" não deve aparecer em novas buscas até ser liberado novamente
- [ ] Campo de "motivo de resgate/histórico" (opcional) — humaniza o perfil e ajuda na conexão emocional com o adotante

### 3.2 Algoritmo de compatibilidade — detalhamento técnico

**V1 (regras ponderadas — sem ML):**
- [ ] Definir tabela de pesos por critério, por exemplo:
  - Porte do animal x espaço disponível do tutor (peso alto)
  - Nível de energia do animal x tempo disponível do tutor (peso alto)
  - Temperamento "sociável com crianças" x tutor que informou ter crianças em casa (peso alto, é praticamente eliminatório se incompatível)
  - Experiência prévia do tutor x nível de cuidado exigido pelo animal, ex: animais com necessidades especiais pontuam menos para tutores sem experiência (peso médio)
  - Presença de outros animais x sociabilidade do animal com outros animais (peso médio)
- [ ] Calcular um score de 0 a 100% combinando os critérios (ex: média ponderada simples para começar)
- [ ] Definir critérios "eliminatórios" — ex: se o tutor mora em apartamento pequeno e o animal precisa de muito espaço, não eliminar totalmente mas sinalizar um alerta visível ("Este animal pode não se adaptar bem ao seu espaço")
- [ ] Implementar como serviço isolado (`MatchingService`), desacoplado do controller — assim é possível trocar a lógica interna no futuro (ex: para um modelo estatístico ou ML) sem alterar a API pública
- [ ] Escrever testes unitários para o `MatchingService` cobrindo casos variados (isso é crítico, pois é a lógica mais sensível do produto)

**V2 (evolução futura, não é obrigatório no MVP):**
- [ ] Coletar dados de adoções concluídas com sucesso vs. devolvidas, para treinar um modelo simples de recomendação no futuro
- [ ] Considerar ajuste dos pesos com base em feedback real (ONGs podem sinalizar quando uma adoção "compatível" mesmo assim não deu certo, retroalimentando o sistema)

### 3.3 Fluxo de adoção — detalhado
- [ ] Tutor visualiza o animal e o score de compatibilidade, com detalhamento de quais critérios pesaram (transparência gera confiança — evitar ser uma "caixa preta")
- [ ] Tutor solicita interesse em adotar, preenchendo um formulário curto (por que quer adotar esse animal específico, disponibilidade para visita/entrevista)
- [ ] ONG/tutor original recebe notificação e visualiza o perfil completo do solicitante (incluindo preferências e, se aplicável, histórico de adoções anteriores na plataforma)
- [ ] ONG pode aprovar, recusar ou solicitar mais informações/agendar entrevista
- [ ] Canal de contato entre as partes: no MVP pode ser simples (revelar contato/WhatsApp após aprovação inicial), evoluindo depois para chat interno na plataforma (mais seguro e permite auditoria em caso de problema)
- [ ] Registro de status da adoção: solicitada → em_analise → aprovada → concluída (ou recusada/cancelada em qualquer ponto)
- [ ] Ao concluir, o animal muda de status para "adotado" automaticamente e sai das buscas
- [ ] Pós-adoção (opcional na v1, mas valioso): espaço para o tutor postar atualizações/fotos do animal adotado — gera conteúdo orgânico positivo pra plataforma e permite à ONG fazer acompanhamento

### 3.4 Regras de negócio e casos de borda
- [ ] O que acontece se dois tutores solicitarem o mesmo animal ao mesmo tempo? (definir se é ordem de chegada, ou se a ONG escolhe entre os candidatos)
- [ ] Tempo limite para a ONG responder a uma solicitação (ex: se não responder em X dias, notificar novamente ou permitir que o tutor cancele)
- [ ] Política para "devolução" de animal já adotado — precisa voltar ao sistema com status e histórico visível (importante para dados/indicadores da Fase 5)

### 3.5 Frontend (View)
- [ ] Vitrine de animais disponíveis com filtros (espécie, porte, faixa etária, localização/distância, nível de energia)
- [ ] Ordenação por compatibilidade quando o tutor está logado com perfil preenchido
- [ ] Página de detalhes do animal: galeria de fotos, informações completas, score de compatibilidade com explicação, botão de solicitar adoção
- [ ] Painel de solicitações para a ONG (lista de candidatos por animal, com dados relevantes de cada um)
- [ ] Painel de acompanhamento para o tutor (status da solicitação, histórico)
- [ ] Estado vazio bem cuidado (ex: "nenhum animal compatível encontrado" com sugestão de ampliar filtros, em vez de tela em branco)

### 3.6 Testes com usuários reais
- [ ] Testar o fluxo completo com a ONG parceira piloto (da Fase 0) usando animais reais
- [ ] Coletar feedback qualitativo sobre a precisão percebida do score de compatibilidade
- [ ] Ajustar pesos do algoritmo com base no feedback antes de abrir para mais usuários

**Entregável da Fase 3:** módulo de adoção funcional ponta a ponta, testado com pelo menos uma ONG parceira e um pequeno grupo de tutores reais.

---

## Fase 4 — Módulo de Ocorrências Georreferenciadas

**Objetivo:** dar à sociedade civil, ONGs e órgãos públicos uma ferramenta confiável de registro e visualização territorial de situações que envolvem fauna — o pilar de "inteligência territorial" do ANIMAPS.

### 4.1 Modelagem detalhada
- [ ] Model `Ocorrencia` com campo `localizacao` do tipo `geography(Point, 4326)` (padrão WGS84, compatível com GPS)
- [ ] Tipos de ocorrência bem definidos (evitar categoria genérica "outro" sem estrutura):
  - Abandono de animal doméstico
  - Maus-tratos
  - Atropelamento
  - Animal perdido (o tutor está procurando)
  - Animal encontrado (alguém achou um animal sem tutor aparente)
  - Avistamento de fauna silvestre em área urbana ou de risco
- [ ] Campo de severidade/urgência (ex: emergência médica do animal x situação que pode esperar) — ajuda a priorizar notificações
- [ ] Campo de status com fluxo claro: aberta → em_atendimento → resolvida (ou invalida, se for identificada como falsa/duplicada)
- [ ] Campo `validada_por` — referência a ONG ou órgão público que confirmou a veracidade da ocorrência, dando um selo de confiabilidade ao dado (importante para os indicadores da Fase 5 não virarem "fake news geográfico")

### 4.2 Backend
- [ ] Endpoint de criação de ocorrência: captura de geolocalização via GPS do dispositivo (com fallback para o usuário marcar manualmente no mapa, caso a permissão de localização seja negada ou o registro seja feito a partir de uma foto antiga)
- [ ] Upload de fotos com extração opcional de metadados EXIF (a foto pode já conter geolocalização e data, o que ajuda a preencher automaticamente e também a auditar a veracidade do registro)
- [ ] Endpoint de listagem com filtros geoespaciais usando funções nativas do PostGIS (`ST_DWithin` para busca por raio, `ST_Contains` se quiser delimitar por polígono de bairro/cidade)
- [ ] Paginação e clusterização no backend para não sobrecarregar o mapa com milhares de pins simultâneos em zoom baixo (agrupar por região quando o zoom estiver afastado)
- [ ] Cache de consultas geoespaciais mais pesadas (Redis), já que o mapa provavelmente será a tela mais acessada da plataforma

### 4.3 Moderação e combate a fraudes/spam
- [ ] Definir se o registro de ocorrência exige login ou pode ser anônimo (trade-off: anônimo aumenta volume de denúncias mas facilita spam e denúncias falsas/maliciosas — ex: denúncia falsa contra vizinho)
- [ ] Rate limiting por usuário/IP para criação de ocorrências
- [ ] Fluxo de denúncia de ocorrência falsa/duplicada (outros usuários podem sinalizar)
- [ ] Painel de moderação para ONGs/órgãos públicos verificados validarem ou invalidarem ocorrências na sua região
- [ ] Regra para evitar duplicidade: alertar se já existe uma ocorrência muito próxima (raio curto) e do mesmo tipo, registrada recentemente — sugerir ao usuário que "adicione informação" à existente em vez de criar uma nova

### 4.4 Frontend (View)
- [ ] Formulário de registro simples e rápido (o ideal é levar menos de 1 minuto para registrar — pessoas normalmente estão numa situação de urgência/emoção ao ver uma ocorrência)
- [ ] Captura de foto direto da câmera do celular (não só upload de galeria)
- [ ] Mapa interativo (Mapbox/Leaflet) com:
  - Pins coloridos e com ícones diferentes por tipo de ocorrência
  - Clusterização visual em zoom afastado
  - Popup com resumo ao clicar no pin, e link para tela de detalhe completa
- [ ] Filtros no mapa: por tipo de ocorrência, por status, por período (últimas 24h, semana, mês), e busca por endereço/CEP para centralizar o mapa numa região específica
- [ ] Tela de detalhe da ocorrência: fotos, descrição, status, e botão de "Eu posso ajudar" (conecta com ONGs/voluntários próximos)
- [ ] Versão mobile-first é essencial aqui — a maioria dos registros vai acontecer na rua, pelo celular, no momento em que a pessoa avista a situação

### 4.5 Notificações e engajamento territorial
- [ ] Notificar automaticamente ONGs e órgãos públicos cadastrados cuja área de atuação cobre a localização da nova ocorrência
- [ ] Notificar o autor da ocorrência sobre mudanças de status (alguém está cuidando / foi resolvida)
- [ ] Considerar um sistema de "voluntários da região" — pessoas comuns que quiserem ser notificadas de ocorrências próximas mesmo sem serem ONG (aumenta capilaridade, mas exige mais cuidado com moderação)

### 4.6 Casos especiais: fauna silvestre
- [ ] Para avistamento de fauna silvestre, considerar campos adicionais (espécie identificada ou "não sei identificar" com sugestão de IA/consulta a especialista futuramente)
- [ ] Fluxo diferenciado: esse tipo de ocorrência deveria notificar prioritariamente órgãos ambientais/biólogos cadastrados, não ONGs de adoção
- [ ] Avaliar parceria com órgãos ambientais (IBAMA, secretarias estaduais de meio ambiente) para validação oficial desses registros no futuro

**Entregável da Fase 4:** sistema de registro e visualização de ocorrências no mapa, com moderação básica funcionando e notificação automática para ONGs/órgãos da região.

---

## Fase 5 — Painel de Dados e Indicadores

**Objetivo:** transformar os dados brutos coletados em inteligência acionável para ONGs, pesquisadores e poder público — este é o diferencial que aproxima o ANIMAPS de uma ferramenta de "planejamento ambiental", não só de um app de adoção.

### 5.1 Definição de indicadores-chave (KPIs)
- [ ] Indicadores de adoção: nº de adoções concluídas por período, taxa de sucesso (adoções que não retornaram como devolução), tempo médio entre cadastro do animal e adoção, score médio de compatibilidade das adoções concluídas
- [ ] Indicadores de ocorrências: nº de ocorrências por tipo/região/período, taxa de resolução, tempo médio de resposta desde o registro até o atendimento, regiões com maior concentração (hotspots)
- [ ] Indicadores institucionais: nº de ONGs ativas por região, capacidade de atendimento vs. demanda de ocorrências na área
- [ ] Indicadores de fauna silvestre: espécies mais avistadas por região, sazonalidade de avistamentos (pode revelar padrões relevantes para conservação)

### 5.2 Agregação de dados (backend)
- [ ] Criar queries agregadas otimizadas (considerar materialized views no PostgreSQL para dashboards que não precisam ser em tempo real absoluto, reduzindo carga no banco principal)
- [ ] Job agendado (cron) para recalcular indicadores pesados periodicamente, em vez de calcular a cada requisição
- [ ] Agregação geoespacial por unidade administrativa (bairro, cidade, estado) — pode exigir integração com shapefiles do IBGE para cruzar coordenadas com divisões territoriais oficiais

### 5.3 Visualização (View)
- [ ] Dashboard com gráficos (Recharts, Chart.js ou D3, dependendo da complexidade visual desejada)
- [ ] Mapa de calor (heatmap) de ocorrências, com opção de segmentar por tipo
- [ ] Gráfico de série temporal (evolução de ocorrências/adoções ao longo do tempo)
- [ ] Ranking de regiões por indicador selecionado
- [ ] Filtros cruzados: período, tipo de ocorrência, região — devem ser combináveis
- [ ] Diferenciação de visão por perfil: ONG vê dados da sua região de atuação; órgão público/pesquisador vê dados agregados mais amplos (cidade/estado), sempre anonimizados

### 5.4 Exportação e dados abertos
- [ ] Exportação de dados em CSV/JSON, sempre com dados pessoais removidos/anonimizados
- [ ] Considerar um portal de "dados abertos" público (sem necessidade de login) com indicadores agregados básicos — reforça o papel institucional/social do ANIMAPS e pode atrair parcerias com universidades e governo
- [ ] Documentar a API pública de dados (se for disponibilizada) para que pesquisadores possam integrar diretamente

### 5.5 Governança de dados
- [ ] Revisar novamente critérios de anonimização antes de liberar qualquer exportação (nunca expor coordenada exata + horário + identificação em conjunto, mesmo que cada um isoladamente pareça inofensivo — a combinação pode reidentificar uma pessoa)
- [ ] Definir política clara de uso dos dados agregados por terceiros (ex: licença Creative Commons para dados abertos)

**Entregável da Fase 5:** dashboard de indicadores funcional para ONGs, pesquisadores e poder público, com exportação de dados anonimizados e (idealmente) um portal básico de dados abertos.

---

## Fase 6 — Integrações e Refinamento

**Objetivo:** amadurecer o produto, aumentar engajamento e preparar a plataforma para escalar com segurança e qualidade.

### 6.1 Notificações e engajamento
- [ ] Notificações push (web push ou app mobile, se houver) e por e-mail: novos animais compatíveis, ocorrências próximas, atualizações de status de adoção/ocorrência
- [ ] Central de notificações dentro da plataforma (histórico, não só notificação instantânea)
- [ ] Preferências de notificação configuráveis pelo usuário (evitar excesso de notificação, que gera descadastro/desengajamento)
- [ ] Gamificação leve (opcional): selos para tutores ativos ("Adotante responsável"), ranking de ONGs mais atuantes, contador de "vidas impactadas" — reforça o aspecto de impacto social e pode ser usado em campanhas de divulgação

### 6.2 Parcerias e integrações externas
- [ ] Módulo de agendamento com clínicas veterinárias parceiras (vacinação, castração, check-up pós-adoção)
- [ ] Possível integração com sistemas já usados por ONGs grandes (importação de planilhas/CSV de animais já cadastrados em outros sistemas, para reduzir fricção de migração)
- [ ] Avaliar parceria com órgãos ambientais oficiais para validação de ocorrências de fauna silvestre (dá peso institucional aos dados)
- [ ] Avaliar integração com redes sociais para compartilhamento fácil de animais disponíveis para adoção (aumenta alcance orgânico)

### 6.3 Testes de usabilidade e qualidade
- [ ] Testes de usabilidade estruturados com usuários reais de cada perfil (tutor, ONG, clínica, órgão público) — idealmente com tarefas específicas cronometradas (ex: "cadastre um animal para adoção" e medir tempo/erros)
- [ ] Ajuste fino do algoritmo de compatibilidade com base em dados reais de devolução de animais coletados desde a Fase 3
- [ ] Testes de carga especificamente no módulo de mapa/ocorrências, simulando picos de uso (ex: após uma campanha de divulgação ou matéria na mídia)
- [ ] Testes de acessibilidade (leitores de tela, navegação por teclado) — relevante para um produto de impacto social que deve ser inclusivo

### 6.4 Segurança e conformidade final
- [ ] Auditoria de segurança antes do lançamento público (revisão de autenticação, autorização, exposição de dados sensíveis em endpoints)
- [ ] Pentest básico ou checklist OWASP Top 10 aplicado à aplicação
- [ ] Revisão final de conformidade LGPD com um checklist formal (base legal para cada tipo de dado coletado, mecanismo de exclusão funcionando de fato, política de privacidade atualizada e acessível)
- [ ] Plano de resposta a incidentes (o que fazer em caso de vazamento de dados, mesmo que pequeno)

### 6.5 Preparação para escala
- [ ] Monitoramento e observabilidade (logs centralizados, alertas de erro — ex: Sentry para erros de frontend/backend)
- [ ] Definir estratégia de crescimento geográfico (lançar primeiro numa cidade/região piloto antes de nacional, para conseguir dar suporte de qualidade)
- [ ] Documentar processos internos (como aprovar uma ONG, como moderar uma ocorrência denunciada) para que o time possa crescer sem perder consistência

**Entregável da Fase 6:** plataforma refinada, testada com usuários reais, auditada em segurança/LGPD, e com plano de lançamento regional definido.

---

## Resumo de Prioridade (para MVP)

Se o objetivo é lançar um MVP rápido, a ordem sugerida de prioridade seria:

1. Fase 0 (arquitetura mínima)
2. Fase 1 (landing page — para validar interesse)
3. Fase 2 (autenticação básica)
4. Fase 3 (adoção — o core do produto)
5. Fase 4 (ocorrências — pode ser versão simplificada no MVP)
6. Fase 5 e 6 ficam para depois da validação inicial
