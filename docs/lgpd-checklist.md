# ANIMAPS — Checklist LGPD (mínimo)

Artefato da Fase 0. Cruzar com [`dicionario-de-dados.md`](dicionario-de-dados.md) e [`politica-privacidade-rascunho.md`](politica-privacidade-rascunho.md).

**Status:** decisões de produto fechadas; **controlador ainda não nomeado** (bloqueante para lançamento público).

---

## 1. Controlador / responsável pelo tratamento

| Campo | Valor |
|---|---|
| Controlador | **A DEFINIR** |
| Nome / razão social | A DEFINIR |
| E-mail de contato (titulares) | A DEFINIR |
| Encarregado (DPO) se houver | A DEFINIR (pode ser a mesma pessoa no início) |

- [ ] Preencher antes do go-live (landing com coleta de e-mail ou cadastro real)
- [ ] Publicar contato na política de privacidade

---

## 2. Inventário de dados pessoais (PII)

| Dado | Onde | Sensível? | Notas |
|---|---|---|---|
| `name` | `users` | sim | |
| `email` | `users` | sim | único; login |
| `passwordHash` | `users` | sim | nunca expor na API |
| `phone` | `users` | sim | |
| `taxId` | `guardian_profiles` | sim | obrigatório só em adoção |
| `companyTaxId` | `ngo_profiles` / `clinic_profiles` | sim | |
| `location` (lat/lng) | `occurrences` | sim* | *geo precisa — não exportar cru |
| Fotos (URL + EXIF) | object storage + refs | sim se identificáveis | strip EXIF no upload (Fase 4) |
| IP / user-agent | logs rate-limit ocorrência anônima | sim | retenção curta de logs |
| Preferências do guardian | `guardian_profiles` | sim | perfil comportamental leve |

Campos **não** pessoais em si: species, status de animal, contagens agregadas por bairro.

---

## 3. Finalidades × base legal (hipótese de produto)

| Finalidade | Dados | Base (hipótese) | Validar com jurídico? |
|---|---|---|---|
| Conta e autenticação | identity | Execução de contrato / procedimentos preliminares + `lgpdConsent` | sim |
| Matching de adoção | preferências + animal | Execução de contrato | sim |
| Ocorrências geo + fotos | location, photos, description | **Consentimento explícito** no registro | sim |
| Notificações operacionais | email / inbox | Legítimo interesse ou contrato | sim |
| Analytics / export agregados | só agregados bairro/cidade | Interesse público / legítimo interesse (hipótese) | **sim — obrigatório** |
| Verificação NGO/clinic | documentos institucionais | Contrato / obrigação legal (quando couber) | sim |

---

## 4. Consentimento

Campos: `users.lgpdConsent` (boolean) + `users.lgpdConsentAt` (timestamp).

**Cadastro (microcopy mínima sugerida):**

> Ao criar sua conta, você concorda com o tratamento dos seus dados para operar o ANIMAPS (conta, adoção e, se usar, registro de ocorrências), conforme a Política de Privacidade.

**Registro de ocorrência (microcopy mínima sugerida):**

> Ao enviar esta ocorrência, você autoriza o uso da localização e das fotos para atendimento e visualização no mapa. Fotos podem permanecer públicas de forma anonimizada se a ocorrência for de interesse coletivo.

- [ ] Exigir checkbox no cadastro (`lgpdConsent = true`)
- [ ] Exibir consentimento específico no formulário de ocorrência (geo + fotos)
- [ ] Guardar versão/data da política aceita (evolução futura; MVP: timestamp)

---

## 5. Retenção

| Situação | Política |
|---|---|
| Conta ativa | Dados mantidos enquanto a conta existir |
| Após `DeleteAccount` | **90 dias** para purge completo de PII em banco + backups |
| Backups | Retenção alinhada: após 90 dias, backups não devem permitir restauração trivial de PII do titular excluído |
| Logs de rate-limit / IP | Retenção curta (ex.: 30 dias) — detalhar na implementação |

---

## 6. Direito ao esquecimento (`DeleteAccount`)

### Remover / anonimizar (PII)

- Conta: e-mail, nome, telefone, `passwordHash`, tokens de refresh
- Perfis: `taxId`, `companyTaxId`, preferências identificáveis
- Notificações do usuário
- Vínculos: `occurrences.user_id` → `null` se a ocorrência permanecer
- Sessões / refresh tokens revogados na hora

### Podem permanecer (interesse público / operação)

- `Animal` e `Adoption` históricos necessários à operação da plataforma (sem expor PII do guardian excluído nas listagens)
- `Occurrence` de interesse coletivo: registro + fotos no object storage
  - **Manter fotos** se a ocorrência/animal ainda for relevante
  - **Remover metadados do autor** e EXIF identificável; não listar nome/e-mail do autor

### Job de purge (Fase 2+)

- Soft-delete imediato (conta inacessível)
- Hard purge PII em T+90 dias

---

## 7. Anonimização em export / analytics / dados abertos

**Regra fechada:** exportações e dashboards públicos usam **apenas agregação por bairro ou cidade** (e tipo/período).

- Nunca exportar `location` (lat/lng) cru
- Nunca combinar geo precisa + horário + identidade
- Pesquisadores (`public_agency` / `biologist`): mesmos agregados no MVP (sem coordenadas arredondadas neste ciclo)

---

## 8. Logs de auditoria (mínimo)

Registrar (quem, quando, o quê), com retenção definida na implementação:

| Evento | Motivo |
|---|---|
| `VerifyNgo` / `VerifyClinic` | Decisão institucional |
| Mudança de `role` / flags `verified` / `isRescuer` | Autorização |
| `DeleteAccount` | Direitos do titular |
| `ExportAnonymizedData` | Rastreio de saídas de dados |
| `ValidateOccurrence` | Moderação |

Evitar logar corpo de senha, tokens ou conteúdo completo de documentos de verificação após o processamento.

---

## 9. Checklist go-live (bloqueantes)

- [ ] Controlador e contato **nomeados** (substituir A DEFINIR)
- [ ] Política de privacidade publicada e linkada no cadastro
- [ ] Checkbox de consentimento LGPD no cadastro
- [ ] Consentimento geo/fotos no fluxo de ocorrência
- [ ] Endpoint/fluxo `DeleteAccount` testado
- [ ] Job/processo de purge em 90 dias documentado ou implementado
- [ ] Export/analytics sem lat/lng (só bairro/cidade)
- [ ] Strip de EXIF no upload de imagens (Fase 4 — no mínimo checklist de segurança)
- [ ] Revisão jurídica do rascunho (recomendado antes de escala)

---

## 10. Decisões fechadas (E0.6)

| Tema | Decisão |
|---|---|
| Controlador | Placeholder até pré-lançamento |
| Retenção pós-exclusão | 90 dias |
| Geo em export | Agregado bairro/cidade apenas |
| Fotos pós-exclusão | Mantidas se interesse público; sem metadados do autor |
