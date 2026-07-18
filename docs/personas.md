# ANIMAPS — Personas

Personas para orientar decisões de UX e regras de produto.  
Fonte original: roadmap §0.3 (+ expansões da validação Fase 0).

---

## 1. Ana — tutora de primeira viagem

| | |
|---|---|
| **Perfil** | `guardian` |
| **Contexto** | Mora em apartamento pequeno, pouco tempo livre, quer um animal de baixa manutenção |
| **Objetivo** | Adotar com segurança, sem arrependimento |
| **Frustração** | Anúncios em redes sociais sem filtro de compatibilidade; risco de devolução |
| **O que a plataforma resolve** | Score de compatibilidade e alertas quando o animal exige mais espaço/energia do que ela tem |
| **Implicação** | Matching com pesos altos em porte × espaço e energia × tempo; UX clara do “por quê” do score |

---

## 2. ONG Patas Unidas

| | |
|---|---|
| **Perfil** | `ngo` (precisa `verified`) |
| **Contexto** | Equipe pequena, voluntários sem tempo para cadastros longos |
| **Objetivo** | Colocar animais em lares responsáveis e gerir solicitações |
| **Frustração** | Planilhas/grupos de WhatsApp; cadastros demorados; perda de follow-up |
| **O que a plataforma resolve** | Cadastro rápido (obrigatórios mínimos), painel de solicitações, área de ocorrências |
| **Implicação** | Formulário de animal enxuto; mobile-first; notificação de `AdoptionRequested` |

---

## 3. Dr. Marcos — biólogo / pesquisador

| | |
|---|---|
| **Perfil** | `biologist` |
| **Contexto** | Precisa de dados agregados de fauna silvestre por região |
| **Objetivo** | Relatórios ambientais, sazonalidade, hotspots |
| **Frustração** | Dados espalhados e pessoais misturados a interesses de pesquisa |
| **O que a plataforma resolve** | Dashboard agregado + export sem PII (bairro/cidade); validação de `wildlife_sighting` |
| **Implicação** | Sem acesso a dados de tutors; foco em `wildlife_sighting` e analytics |

---

## 4. Dra. Helena — clínica veterinária parceira

| | |
|---|---|
| **Perfil** | `clinic` (precisa `verified`) |
| **Contexto** | Clínica de bairro que atende castrações/vacinas e eventualmente resgata animais |
| **Objetivo** | Divulgar serviços, cadastrar animais resgatados, emitir histórico de saúde confiável |
| **Frustração** | Sem canal estruturado com ONGs/tutores; laudos perdidos em WhatsApp |
| **O que a plataforma resolve** | Perfil de serviços, `RegisterAnimal` (quando verified), base para laudo na Fase 3 (`HealthReport`) |
| **Implicação** | Fluxo de verificação institucional igual à NGO; UI de serviços claros |

---

## 5. Ricardo — guardian resgatista independente

| | |
|---|---|
| **Perfil** | `guardian` com `isRescuer = true` |
| **Contexto** | Resgata animais por conta própria, sem ONG formal |
| **Objetivo** | Divulgar animais para adoção responsável sem burocracia de CNPJ |
| **Frustração** | Plataformas só aceitam ONG; grupos informais sem rastreio de interesse |
| **O que a plataforma resolve** | Flag `isRescuer` autoriza `CreateAnimal`; gerencia solicitações como origem |
| **Implicação** | Onboarding claro sobre o que é “resgatista”; limites de confiança vs ONG verificada |

---

## 6. Carla — representante de órgão público

| | |
|---|---|
| **Perfil** | `public_agency` |
| **Contexto** | Secretaria municipal / fiscalização de bem-estar animal |
| **Objetivo** | Monitorar denúncias (maus-tratos, abandono), validar ocorrências, apoiar política pública |
| **Frustração** | Denúncias só por telefone/email; sem mapa operacional; dados não anonimizados para compartilhar |
| **O que a plataforma resolve** | Validar/seguir ocorrências; dashboard amplo; export agregado |
| **Implicação** | Distinta do biólogo: prioriza denúncias operacionais e fiscalização, não só fauna silvestre |

---

## 7. João — cidadão anônimo que registra ocorrência

| | |
|---|---|
| **Perfil** | Anônimo (`occurrences.user_id` null) ou depois `ClaimOccurrence` |
| **Contexto** | Vê animal atropelado/abandonado na rua e quer avisar rápido |
| **Objetivo** | Registrar em menos de 1 minuto com foto + pin no mapa |
| **Frustração** | Apps que exigem cadastro longo no momento da urgência |
| **O que a plataforma resolve** | `RegisterOccurrence` sem login; rate limit por IP; opção de vincular conta depois |
| **Implicação** | UX mobile-first extrema; consentimento geo/fotos no ato; sem PII obrigatória |

---

## Mapa persona × perfil técnico

| Persona | Role / flag |
|---|---|
| Ana | `guardian` |
| ONG Patas Unidas | `ngo` + `verified` |
| Dr. Marcos | `biologist` |
| Dra. Helena | `clinic` + `verified` |
| Ricardo | `guardian` + `isRescuer` |
| Carla | `public_agency` |
| João | anônimo / optional claim |
