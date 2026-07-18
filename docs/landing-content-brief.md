# Landing Page — Content Brief (Fase 1)

Brief de conteúdo e estratégia da landing institucional do ANIMAPS.  
Fonte: decisões das 30 perguntas de alinhamento da Fase 1 + [`ANIMAPS_Roadmap.md`](../ANIMAPS_Roadmap.md) §1.1–1.2 + [`docs/personas.md`](personas.md).

**Status:** decisões fechadas (execução da copy ainda pendente).

---

## 1. Objetivo primário

**Captação de lista de espera** focada em tutores/adotantes (`guardian`), com comunicação **equilibrada** para ONGs (`ngo`).

- CTA principal do Hero: **"Entrar na lista de espera"**
- Não é prioridade nesta fase: patrocínio, tráfego pago ou Meta Pixel
- Escopo geográfico da mensagem: **nacional** (não amarrar a uma cidade-piloto na copy)

---

## 2. Métrica de sucesso

| Ordem | Métrica | Como medir |
|---|---|---|
| Primária | Conversão visitante → cadastro na lista de espera | Evento GA4 `waitlist_submit` / formulário enviado |
| Secundárias (acompanhar) | Mix de perfis (tutor / ONG / clínica / outro); taxa de bounce; scroll depth até o CTA final | GA4 + campos do formulário |

Prazo de acompanhamento pós-lançamento: **2 semanas** (ver roadmap §1.7).

---

## 3. Públicos e hierarquia

| Prioridade | Público | Persona | Papel na landing |
|---|---|---|---|
| 1 (primário CTA) | Tutores / adotantes | Ana, Ricardo | Hero + fluxo “Como funciona” + formulário |
| 1 (paridade de voz) | ONGs | Patas Unidas | Card em “Para quem é” + CTA secundário no formulário |
| 2 | Clínicas | Dra. Helena | **Seção/card dedicada** |
| 3 | Órgãos públicos / pesquisadores | Carla, Dr. Marcos | **Menção institucional breve** (não CTA forte) |
| Contexto | Denunciante anônimo | João | Pode aparecer na dor do Problema / mapa de ocorrências |

---

## 4. Tom de voz

- **Emocional com dados reais**, sem apelação.
- Direto, humano, responsável — evita jargão técnico.
- Termo canônico para o matching: **"Match ideal"** (não “algoritmo”, não “compatibilidade inteligente” na copy externa).
- Idiomas: **português + inglês** desde o lançamento (i18n de strings; PT como default).

---

## 5. Estatísticas e prova social

### Estatísticas de abandono

- Incluir **números citados com fonte** na seção “O Problema”.
- Status: **fontes a pesquisar e validar antes de publicar** (não inventar).
- Preferir fontes citáveis (IBGE, OMSA/OIE, ministérios, estudos acadêmicos, relatórios de proteção animal).

### Prova social

- Ainda **sem depoimentos reais** garantidos.
- Usar **números projetados com transparência** (ex.: “Meta do piloto”, “Em construção”) — nunca apresentar como resultado comprovado.
- Quando houver ONG piloto confirmada ([`docs/ong-piloto.md`](ong-piloto.md)), atualizar esta seção.

---

## 6. Estrutura de seções

Ordem canônica:

1. **Hero** — frase de impacto + CTA “Entrar na lista de espera” + imagem (foto real; **sem vídeo**).
2. **O Problema** — abandono, informação dispersa (redes sociais), dificuldade das ONGs; dados com fonte.
3. **A Solução** — Match ideal + mapa de ocorrências; linguagem simples.
4. **Como funciona** — passo a passo visual (ex.: 1. Crie perfil → 2. Veja o Match ideal → 3. Adote com responsabilidade).
5. **Para quem é** — cards:
   - Tutor / adotante
   - ONG
   - **Clínica** (seção dedicada / card de primeiro nível)
   - Órgão público / pesquisa (**menção institucional**, card leve ou texto curto)
6. **Diferenciais** — o que muda vs. grupos de Facebook/Instagram/WhatsApp.
7. **Prova social** — números projetados com transparência / espaço para futuros parceiros.
8. **FAQ** — dúvidas frequentes (lançamento, grátis, Match ideal, ONGs/clínicas, urgência/mapa, LGPD, cobertura, app mobile).
9. **CTA final** — formulário reforçado + link para privacidade.

Footer: links institucionais, privacidade, termos, idioma (PT/EN).

---

## 7. Formulário (microcopy)

### Campos

| Campo | Obrigatório | Notas |
|---|---|---|
| Nome | Sim | |
| E-mail | Sim | Validação de formato |
| Tipo de perfil | Sim | `guardian` (tutor) / `ngo` / `clinic` / `other` |
| Cidade / Estado | Opcional recomendado | Ajuda segmentação nacional |
| Consentimento LGPD | Sim | Checkbox + link para política |

### Microcopy (diretrizes)

- Labels claros em linguagem do usuário (“Sou tutor / Quero adotar”, “Sou uma ONG”, etc.).
- Erros: específicos e acionáveis (“Informe um e-mail válido”).
- Sucesso: confirmação imediata (“Você entrou na lista. Em breve falamos com você.”).
- Não pedir senha nem documentos (`taxId`) nesta fase — só interesse.

---

## 8. Política de privacidade e termos

- Adaptar o rascunho existente: [`docs/politica-privacidade-rascunho.md`](politica-privacidade-rascunho.md).
- Na landing, publicar versão **mínima** cobrindo: o que coletamos no waitlist (nome, e-mail, tipo de perfil, cidade), base de consentimento, retenção, direitos LGPD.
- Controlador permanece **A DEFINIR** até pré-lançamento (ver [`docs/lgpd-checklist.md`](lgpd-checklist.md)).
- Termos de uso mínimos para captação (uso do site / lista de espera).

---

## 9. Canais de divulgação (ainda a mapear)

Decidido: **só orgânico** no início (sem ads).

Pendências de execução (§1.7):

- [ ] Listar Instagrams / comunidades de proteção animal alvo
- [ ] Grupos de WhatsApp/Telegram de ONGs
- [ ] Contatos diretos de ONGs conhecidas (alinhar com kit [`docs/ong-piloto.md`](ong-piloto.md))
- [ ] Plano de posts de lançamento (PT; EN se houver canal)

---

## 10. Checklist de copy antes do go-live

- [ ] Headline + subheadline do Hero (PT e EN)
- [ ] Texto de cada seção com “Match ideal” consistente
- [ ] Estatísticas com fonte validada
- [ ] Microcopy do formulário (labels, erros, sucesso) PT e EN
- [ ] Política de privacidade adaptada + termos mínimos
- [ ] Disclaimer transparente nos números projetados
- [ ] Revisão de tom (emocional ≠ apelação)

---

## Referências

- Roadmap §1.1–1.2, §1.7
- [`docs/personas.md`](personas.md)
- [`docs/politica-privacidade-rascunho.md`](politica-privacidade-rascunho.md)
- [`docs/landing-design-brief.md`](landing-design-brief.md)
- [`docs/landing-tech-plan.md`](landing-tech-plan.md)
