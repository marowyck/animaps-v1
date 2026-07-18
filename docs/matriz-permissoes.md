# ANIMAPS — Matriz de permissões

Artefato da Fase 0 (base dos guards NestJS na Fase 2).  
Perfis: `guardian`, `ngo`, `clinic`, `public_agency`, `biologist`.  
Flags: `verified` (NGO/clinic), `isRescuer` (guardian).

**Valores:** `allow` · `deny` · `cond` (ver condição).

**Auth:** `anon` = sem login · `auth` = qualquer usuário autenticado · `own` = dono do recurso.

---

## Decisões fechadas

| Tema | Regra |
|---|---|
| Criar `Animal` | NGO `verified` **OU** clinic `verified` **OU** guardian `isRescuer` |
| `RequestAdoption` | Guardian autenticado + `taxId` preenchido |
| Solicitações paralelas | Várias no mesmo animal; origem escolhe |
| Animal → `in_process` | No primeiro `approved` (não no request) |
| Criar `Occurrence` | Anônimo ou autenticado |
| Validar `Occurrence` | NGO verified / `public_agency`; `biologist` só se `wildlife_sighting` |
| Laudo clínico | Só clinic `verified` |

---

## Conta / identity

| Ação | anon | guardian | ngo | clinic | public_agency | biologist |
|---|---|---|---|---|---|---|
| `RegisterUser` | allow | deny* | deny* | deny* | deny* | deny* |
| `EditOwnProfile` | deny | allow | allow | allow | allow | allow |
| `DeleteOwnAccount` | deny | allow | allow | allow | allow | allow |
| `VerifyNgo` (admin) | deny | deny | deny | deny | cond¹ | deny |
| `VerifyClinic` (admin) | deny | deny | deny | deny | cond¹ | deny |

\* Já autenticado não “re-registra” o mesmo role no MVP (fluxo separado se precisar).  
¹ MVP: `public_agency` pode verificar instituições; ou processo manual interno — documentar operador.

---

## Animal / adoption

| Ação | anon | guardian | ngo | clinic | public_agency | biologist |
|---|---|---|---|---|---|---|
| `ListAvailableAnimals` | allow | allow | allow | allow | allow | allow |
| `GetAnimalPublic` | allow | allow | allow | allow | allow | allow |
| `CreateAnimal` | deny | cond² | cond³ | cond⁴ | deny | deny |
| `UpdateOwnAnimal` | deny | cond⁵ | cond⁵ | cond⁵ | deny | deny |
| `ArchiveOwnAnimal` | deny | cond⁵ | cond⁵ | cond⁵ | deny | deny |
| `RequestAdoption` | deny | cond⁶ | deny | deny | deny | deny |
| `ReviewAdoption` | deny | cond⁷ | cond⁷ | cond⁷ | deny | deny |
| `CompleteAdoption` | deny | cond⁷ | cond⁷ | cond⁷ | deny | deny |
| `CancelAdoption` | deny | cond⁸ | cond⁸ | cond⁸ | deny | deny |
| `ViewCompatibilityScore` | deny | allow⁹ | allow | allow | deny | deny |

² `isRescuer = true`  
³ `verified = true`  
⁴ `verified = true`  
⁵ É origem do animal (`ngoId` / `guardianId` / `clinicId` = self)  
⁶ Role guardian + `taxId` preenchido + animal `available` (ou ainda aceitando requests)  
⁷ É origem do animal ligado à adoção  
⁸ Solicitante (guardian da adoption) **ou** origem do animal  
⁹ Próprio score vs animal; origem vê scores dos candidatos

---

## Occurrence

| Ação | anon | guardian | ngo | clinic | public_agency | biologist |
|---|---|---|---|---|---|---|
| `ListOccurrencesNearby` | allow* | allow* | allow* | allow* | allow* | allow* |
| `GetOccurrencePublic` | allow* | allow* | allow* | allow* | allow* | allow* |
| `CreateOccurrence` | allow | allow | allow | allow | allow | allow |
| `ClaimOccurrence` | deny | allow¹⁰ | allow¹⁰ | allow¹⁰ | allow¹⁰ | allow¹⁰ |
| `UpdateOccurrenceStatus` | deny | deny | cond¹¹ | deny | cond¹¹ | cond¹² |
| `ValidateOccurrence` | deny | deny | cond³ | deny | allow | cond¹³ |
| `FollowOccurrence` | deny | deny | cond³ | deny | allow | cond¹³ |
| `ReportFalseOccurrence` | deny | allow | allow | allow | allow | allow |

\* Sem PII do autor; geo pode ser aproximada em listagens públicas (detalhe LGPD E0.6).  
¹⁰ Só se `userId` ainda null  
¹¹ NGO verified ou public_agency (e follower/origem do atendimento)  
¹² Só `wildlife_sighting` (status operacional limitado)  
¹³ Só se `type = wildlife_sighting`

---

## Clinic / analytics / admin

| Ação | anon | guardian | ngo | clinic | public_agency | biologist |
|---|---|---|---|---|---|---|
| `UpdateOwnClinicServices` | deny | deny | deny | allow | deny | deny |
| `IssueHealthReport` | deny | deny | deny | cond⁴ | deny | deny |
| `GetRegionalDashboard` | deny | deny | cond³ | deny | allow | allow |
| `GetWideAggregateDashboard` | deny | deny | deny | deny | allow | allow |
| `ExportAnonymizedData` | deny | deny | deny | deny | allow | allow |
| `VerifyNgo` / `VerifyClinic` | deny | deny | deny | deny | cond¹ | deny |

---

## Resumo de condições (código futuro)

```text
canCreateAnimal(user) =
  (role=ngo AND ngo.verified)
  OR (role=clinic AND clinic.verified)
  OR (role=guardian AND guardian.isRescuer)

canRequestAdoption(user) =
  role=guardian AND guardian.taxId IS NOT NULL

canValidateOccurrence(user, occurrence) =
  (role=ngo AND ngo.verified)
  OR (role=public_agency)
  OR (role=biologist AND occurrence.type = wildlife_sighting)

canReviewAdoption(user, adoption) =
  user.id IN { animal.ngoId, animal.guardianId, animal.clinicId }
```

---

## Notas para implementação (Fase 2)

- Guards NestJS: `RolesGuard` + `ResourceOwnerGuard` + checks de `verified` / `isRescuer`
- Rate limit em `CreateOccurrence` (anon por IP) — infraestrutura, Fase 4
- Listagens públicas nunca retornam `email`, `phone`, `taxId`, `passwordHash`
