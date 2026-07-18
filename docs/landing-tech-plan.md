# Landing Page — Tech Plan (Fase 1)

Plano técnico da landing institucional do ANIMAPS.  
Fonte: decisões das 30 perguntas da Fase 1 + rodada de design visual + [`ANIMAPS_Roadmap.md`](../ANIMAPS_Roadmap.md) §1.4–1.6 + briefs de conteúdo/design.

**Status:** pivot visual amigável aplicado em [`apps/web`](../apps/web) (Sour Gummy + Oi, BubbleMenu, waves, multi-pastel, GSAP bounce). Waitlist ainda placeholder (sem Postgres).

---

## 1. Stack

| Camada | Escolha |
|---|---|
| Framework | **Next.js** (App Router) + **TypeScript** |
| Estilo | **Tailwind CSS v4** (tokens em `app/globals.css` via `@theme`) — paleta **multi-pastel** |
| Smooth scroll | **`lenis`** (`lenis/react`) — `autoRaf: false` + sync no `gsap.ticker` |
| Animações | **GSAP** + `@gsap/react` + `ScrollTrigger` — easings `back.out` / `elastic.out` |
| Ícones | **`lucide-react`** (badges coloridos; brand icons sociais removidos na v1.25 — usar Share2/Globe/etc.) |
| UI bits | **React Bits** (copy-paste seletivo — ainda não plugado; motion coberto por GSAP) |
| Fontes | **Sour Gummy** (corpo) + **Oi** (display) via `next/font/google` |
| App no monorepo | `apps/web` (`@animaps/web`) |
| Hospedagem | **Vercel** |
| Analytics | **Google Analytics 4** (pós cookie consent — a ligar) |
| Ads pixel | **Não** |

Dark mode: fora de escopo.  
Cursor customizado: fora de escopo.

**Referência visual/código:** projeto `animaps-web/src` (BubbleMenu, waves, timeline Hero).

### Lenis + GSAP (padrão confirmado)

- Pacote: `lenis` → `import { ReactLenis, useLenis } from "lenis/react"`
- Opções: `autoRaf: false`, `syncTouch: true`
- Sync: `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker.add((t) => lenis.raf(t * 1000))`
- Implementação: [`apps/web/components/providers/SmoothScrollProvider.tsx`](../apps/web/components/providers/SmoothScrollProvider.tsx)
- Se `prefers-reduced-motion: reduce` → **não** inicializa Lenis (scroll nativo)

### GSAP — plugins / padrões

| Item | Uso |
|---|---|
| `ScrollTrigger` | Entrada bounce de cards/steps/stats; parallax leve no Hero; sync Lenis |
| Timeline Hero | Texto + blob `elastic.out` + foto `back.out` + CTAs |
| BubbleMenu | Open/close com `back.out`; hover de cor nos links |

### React Bits

React Bits **não** é um pacote npm monolítico — é **copy-paste**. Incluir componente a componente conforme uso, com parcimônia. Nesta iteração o motion está coberto por GSAP/Lenis.

Sempre atrás de `prefers-reduced-motion`.

---

## 2. Arquitetura frontend (MVC na View)

Alinhar com o roadmap §0.6 (MVC no web):

| Camada | Responsabilidade na landing |
|---|---|
| **View** | Componentes React (`Hero`, cards, formulário, footer) + Tailwind |
| **Controller** | Server Actions / Route Handlers do Next.js (submit do waitlist, i18n routing) |
| **Model** | Tipos TypeScript do waitlist + client HTTP mínimo até a API |

Componentização obrigatória desde o dia 1 (reaproveitamento na plataforma).

### Componentes (`apps/web`)

```
components/ui/          # design system (reuso em todo o app)
  Button.tsx
  Input.tsx
  Select.tsx            # dropdown custom (não <select> nativo)
  Checkbox.tsx
  AccordionItem.tsx

components/landing/     # seções de marketing
  Header.tsx            # BubbleMenu
  Hero.tsx
  ProblemSection.tsx
  SolutionSection.tsx
  HowItWorks.tsx
  AudienceCards.tsx
  Differentials.tsx
  SocialProofCarousel.tsx
  FAQ.tsx
  WaitlistForm.tsx
  CookieBanner.tsx
  Footer.tsx
  OrganicBlob.tsx
  SectionDivider.tsx    # wave SVG
```

Specs visuais: [`docs/landing-design-brief.md`](landing-design-brief.md).

### Motion e performance

Intensidade: **expressiva e divertida** (`back.out` / `elastic.out`), sem competir com a leitura.

- Preferir animações `transform` / `opacity` (compositor-friendly)
- Checar `prefers-reduced-motion` em **todos** os efeitos: Hero, BubbleMenu, Select, Accordion, Lenis
- Parallax leve no Hero
- Smooth scroll Lenis: desabilitar se `prefers-reduced-motion`
- Scrollbar customizado global + `.scrollbar-clean`; `scroll-padding-top` para âncoras
---

## 3. Formulário e persistência

### Campos (alinhados ao content brief)

- `name` (string, required)
- `email` (string, required, validado)
- `profileType` (enum: `guardian` | `ngo` | `clinic` | `other`, required)
- `city` / `state` (opcional)
- `lgpdConsent` (boolean, required = true)

### Persistência

**Endpoint próprio** (não Mailchimp/Typeform no MVP):

Opções aceitáveis nesta fase (escolher na implementação):

1. **Route Handler em `apps/web`** + tabela leve `waitlist_entries` (Postgres) — preferível se o monorepo/API já existir.
2. **Endpoint mínimo em `apps/api`** (NestJS) no módulo `identity` ou um módulo `marketing`/`waitlist` temporário — melhor se já estiver scaffoldando a API.

Requisitos:

- Validação server-side
- Rate limit básico (reusar espírito do roadmap: limitar abusos)
- Não criar conta `User` completa ainda — só lead da lista de espera
- Consentimento LGPD registrado com timestamp

Nomes de campos/código: **inglês** (`camelCase` API / `snake_case` DB), UI em PT/EN.

---

## 4. Internacionalização (PT + EN)

- Default: **português**
- Seletor no header/footer
- Strings da landing em dicionários (`pt`, `en`) — Next.js i18n (App Router) ou lib leve
- Rotas ou locale prefix: a definir na implementação (`/`, `/en` ou cookie/header)

---

## 5. Analytics e consentimento

| Item | Decisão |
|---|---|
| GA4 | **Sim** — medir origem e conversão |
| Meta Pixel | **Não** |
| Eventos mínimos | `cta_click`, `waitlist_submit`, (opcional) `scroll_depth` |
| Cookie banner | **Sim**, banner simples (aceitar / recusar não essenciais) |
| GA4 | Carregar **após** consentimento quando cookies não essenciais |

---

## 6. SEO e performance

Obrigatório no lançamento:

- [ ] `title` + `description` otimizados (termos: adoção responsável, abandono de animais, ONGs, mapear ocorrências)
- [ ] Open Graph + Twitter cards (imagem de preview atrativa)
- [ ] `sitemap.xml` + `robots.txt`
- [ ] Imagens WebP + `next/image` + lazy loading
- [ ] Lighthouse / PageSpeed: mirar **> 90** (Performance, Accessibility, Best Practices, SEO)
- [ ] HTML semântico + headings corretos (h1 único no Hero)
- [ ] Motion não deve derrubar Lighthouse (bundle GSAP/Lenis sob demanda se possível; `prefers-reduced-motion`)

---

## 7. Domínio, HTTPS e publicação

| Item | Status |
|---|---|
| Registrar domínio próprio | **Pendente** (a registrar) |
| Deploy Vercel + HTTPS | Previsto |
| Ambiente staging | Preferir branch `develop` → preview Vercel (ver [`docs/git-e-ci.md`](git-e-ci.md)) |
| Produção | Branch `main` |

---

## 8. Testes antes do go-live (§1.6)

- [ ] Cross-browser: Chrome, Safari, Firefox
- [ ] Dispositivos móveis reais (não só emulador)
- [ ] Submit do formulário (sucesso, validação, rate limit)
- [ ] Troca PT ↔ EN
- [ ] Cookie banner + GA4 só pós-consentimento
- [ ] Smoke de pico leve (rede social) — garantir que Vercel/edge aguenta burst
- [ ] `prefers-reduced-motion`: página usável sem animações
- [ ] Checklist anti-genérico-IA do design brief (review visual)

---

## 9. Ordem técnica sugerida de implementação

1. ~~Scaffold monorepo (`pnpm`, `apps/web`)~~ — **feito** (`pnpm-workspace.yaml` + `@animaps/web`)
2. ~~Tokens de design + fontes Fraunces/DM Sans + `SmoothScrollProvider`~~ — **feito**
3. ~~Header + Hero com motion~~ — **feito**
4. ~~Esqueleto das demais seções + WaitlistForm + `/api/waitlist` placeholder~~ — **feito**
5. Copy final PT/EN + assets (logo, fotos stock com máscara)
6. Persistência real da waitlist (Postgres) + i18n
7. Cookie banner → GA4 pós-consentimento + eventos
8. SEO (OG, sitemap, robots) + Lighthouse >90
9. Domínio + deploy Vercel produção

**Rodar localmente:** na raiz, `pnpm dev` (filtra `@animaps/web`).

---

## 10. Fora de escopo (Fase 1)

- Auth completa / JWT / perfis (Fase 2)
- Mapa PostGIS / ocorrências reais (Fases posteriores)
- Meta Pixel / ads pagos
- Dark mode
- Cursor customizado
- Protótipo Figma (design direto no código)
- App mobile

---

## Referências

- Roadmap §1.4–1.6
- [`docs/landing-content-brief.md`](landing-content-brief.md)
- [`docs/landing-design-brief.md`](landing-design-brief.md)
- [`docs/git-e-ci.md`](git-e-ci.md)
- [`docs/lgpd-checklist.md`](lgpd-checklist.md)
- [`docs/politica-privacidade-rascunho.md`](politica-privacidade-rascunho.md)
