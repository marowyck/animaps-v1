# Landing Page — Design Brief (Fase 1)

Brief de identidade visual e UX da landing institucional do ANIMAPS.  
Fonte: decisões das 30 perguntas da Fase 1 + rodada de design visual + **pivot pós-feedback** (base: projeto `animaps-web/src`) + [`ANIMAPS_Roadmap.md`](../ANIMAPS_Roadmap.md) §1.3 + [`docs/landing-content-brief.md`](landing-content-brief.md).

**Status:** direção **amigável / orgânica / multi-pastel** implementada em `apps/web` (sem Figma).

---

## Pivot — direção amigável/orgânica (pós-feedback)

**Motivo:** a primeira implementação (editorial + Fraunces serifada) foi percebida como “newspaper” demais. Feedback do usuário: amigável, cores pastéis, mais animações, mais modernidade — usar como base o projeto em `animaps-web/src`.

| Antes (editorial) | Depois (amigável — referência `animaps-web`) |
|---|---|
| Fraunces + DM Sans | **Sour Gummy** (corpo) + **Oi** (display) |
| Pastel único terracota | Paleta **multi-pastel** (laranja, azul, amarelo, verde, roxo) + versões saturadas para CTA/texto |
| Header sticky minimalista | **BubbleMenu** (logo pill + botão redondo + painel bolha) |
| Split-text sóbrio | Timelines GSAP com `elastic.out` / `back.out` |
| Divisores diagonais | **Waves** SVG orgânicas |
| Ícones de linha exclusivos | **`lucide-react`** em badges coloridos (composição customizada — não genérico solto) |
| Grain/noise | Padrão SVG sutil temático (traços/pontos a 3%) |

**Personalidade atualizada:** acolhedora / humana + divertida / moderna (mantém confiável, perde o tom “jornal”).

---

## 1. Objetivo visual

Transmitir **confiança, acolhimento e leveza** — moderno, redondo e colorido em pastel; humano sem ser infantil; sem parecer site gerado por IA.

**Direção geral:** **amigável-orgânica** — tipografia arredondada (Sour Gummy + Oi), blobs via `border-radius`, waves, multi-pastel, motion bounce/elastic.

Público principal: tutores e ONGs (comunicação equilibrada). Clínicas com card dedicado; órgãos públicos em menção leve.

**Referência direta de implementação:** projeto `animaps-web/src` (layout, motion, BubbleMenu, waves).

---

## 2. Identidade visual

Logo final ainda **não existe**. Tokens em [`apps/web/app/globals.css`](../apps/web/app/globals.css).

### Diretrizes de paleta

| Papel | Tokens | Uso |
|---|---|---|
| Neutro | `#F4F4F4` (`gray-soft`), `#333` (`ink`) | Fundo geral, tipografia |
| Brand saturado | orange `#F89D1C`, blue `#00A0E3`, yellow `#FFD400`, green `#68BC45`, purple `#92278F` | CTAs, ícones, texto de destaque |
| Pastel (tints) | `pastel-orange/blue/yellow/green/purple/sky` | Blobs, badges, fundos de seção/cards |
| Escuro (ritmo) | `#333` / `#1a1a1a` | Problem / SocialProof / Footer |

**Contraste AA:** saturado em texto/CTA; pastel só em superfície. Sem dark mode toggle.

### Tipografia

| Uso | Fonte | Notas |
|---|---|---|
| Display / títulos de seção | **Oi** (`--font-display`) | **Somente** em `h1`/`h2` de seção — nunca em perguntas FAQ, labels, cards ou números |
| Corpo / UI / FAQ / stats | **Sour Gummy** (`--font-sour-gummy`) | Pesos 100–900; família única amigável e legível |

### Logo

- [ ] Conceito (ANIMAPS + símbolo mapa/animal — sem literalidade excessiva de pata isolada; preferir interação humano+animal quando ilustrar)
- [ ] Variantes: horizontal (header pill), ícone (favicon / OG)
- Sem dark mode nesta fase

---

## 3. Estilo e imagery

| Decisão | Escolha |
|---|---|
| Estilo geral | Amigável-orgânico (redondo, colorido, bounce) |
| Imagery | Fotos reais (stock); moldura **blob** (`border-radius` orgânico + borda branca + sombra) |
| Vídeo no Hero | Não |
| Sombras | Suaves em cards/CTAs (não flat puro) |
| Border-radius | `2rem`–`3rem` em cards; pills em botões |
| Textura de fundo | SVG sutil (não grain) |
| Elementos decorativos | Blobs pastel sólidos (blur/mix-blend no Hero) |
| Divisores | **Wave** SVG (padrão) |
| Iconografia | `lucide-react` em círculos/badges coloridos |

---

## 4. Layout e fluxo (mobile-first)

Sem Figma. Fonte de verdade: este brief + código em `apps/web`.

### Header (BubbleMenu)

- Logo em pill flutuante + botão redondo (menu/X)
- Painel bolha com links grandes, rotação leve, hover troca cor pastel

### Footer

- Escuro + wave no topo; newsletter; colunas de link em cores pastel distintas

---

## 5. Componentes visuais

### Design system (`apps/web/components/ui/`)

Primitivas reutilizáveis em toda a plataforma (não só na landing):

| Componente | Papel |
|---|---|
| `Button` | CTA pill; variantes `orange`/`blue`/`green`/`white`; prop `magnetic` (default `true`) |
| `Input` | Campo pill (`rounded-full`, borda soft, foco brand-orange) + label |
| `Select` | Dropdown **customizado** (trigger + painel flutuante GSAP `back.out`, opções pastel, check, teclado/a11y) |
| `Checkbox` | Caixa customizada (borda → preenchimento brand-orange + ícone Check animado); input nativo `sr-only` |
| `AccordionItem` | Disclosure reutilizável (FAQ / ajuda futura) |

### Páginas / marketing (`apps/web/components/landing/`)

`Header` (BubbleMenu), `Hero`, `ProblemSection`, `SolutionSection`, `HowItWorks`, `AudienceCards`, `Differentials`, `SocialProofCarousel`, `FAQ`, `WaitlistForm`, `CookieBanner`, `Footer`, `OrganicBlob`, `SectionDivider` (wave).

### Padrões de formulário

- **Dropdown:** nunca usar `<select>` nativo estilizado como UI final — usar `ui/Select` (listbox customizado, animações alinhadas ao BubbleMenu).
- **Checkbox:** nunca `accent-*` nativo sozinho — usar `ui/Checkbox`.
- **Botões:** sempre `ui/Button`; `magnetic={false}` em contextos compactos (cookie banner, submit de form).

### Scrollbar

- Global: thumb `brand-orange`, track `gray-soft`, fino (`scrollbar-width: thin` + webkit).
- Utilitário `.scrollbar-clean` para overflow horizontal (ex.: carrossel de prova social).
- `scroll-padding-top: 6rem` no `html` para compensar o BubbleMenu fixo em âncoras.

---

## 6. Motion system

Intensidade: **expressiva e divertida** (easings `back.out` / `elastic.out`), sem competir com a leitura. Cursor: padrão do navegador. Lenis mantido.

| Efeito | Onde | Ferramenta |
|---|---|---|
| Timeline entrada | Hero (texto, blob pop, foto, CTA) | GSAP |
| Bubble menu open/close | Header | GSAP `back.out` |
| Scroll-in bounce | Cards / steps / stats / FAQ | ScrollTrigger + `back.out` |
| Select open/close | `ui/Select` painel | GSAP `back.out` |
| Accordion height | `ui/AccordionItem` / FAQ | GSAP height |
| Hover lift / scale | Cards, botões menu | CSS + GSAP |
| Parallax leve | Blob do Hero | ScrollTrigger scrub |
| Magnetic CTA | `ui/Button` (quando `magnetic`) | transform no pointer |

Obrigatório: `prefers-reduced-motion` (Lenis off + timelines skip).

---

## 7. Checklist do que evitar (anti “genérico de IA”)

- [ ] Não usar blobs de **gradiente** roxo/azul clichê SaaS — blobs em cor **sólida** pastel da paleta
- [ ] Não usar ilustrações 3D genéricas
- [ ] Não usar Inter/Roboto como face principal
- [ ] Não repetir cards brancos flutuantes idênticos sem hierarquia / cor
- [ ] Lucide ok **desde que** em badges coloridos e composição própria (não ícone cinza solto)

---

## 8. Acessibilidade mínima (obrigatória no MVP)

- [ ] Contraste WCAG AA (saturado em texto/CTA)
- [ ] `alt` em fotos; foco visível; labels em inputs
- [ ] `prefers-reduced-motion`
- [ ] `lang` correto; target de toque ≥44px

---

## 9. Entregáveis de design

| Artefato | Status |
|---|---|
| Pivot amigável + referência `animaps-web` | Feito |
| Paleta multi-pastel + tipografia Sour Gummy/Oi | Feito em código |
| Motion bounce/elastic + BubbleMenu + waves | Feito em código |
| Design system `ui/` (Button, Input, Select, Checkbox, Accordion) | Feito |
| FAQ + scrollbar customizado + scroll-padding âncoras | Feito |
| Logo + favicon | Pendente |
| Fotos stock | Pendente (placeholder no Hero) |
| Protótipo Figma | Cancelado |

---

## Referências

- Projeto base: `animaps-web/src`
- [`docs/landing-content-brief.md`](landing-content-brief.md)
- [`docs/landing-tech-plan.md`](landing-tech-plan.md)
- [`docs/personas.md`](personas.md)
