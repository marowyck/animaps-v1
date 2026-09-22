import { readRoutingCatalog, writeRoutingCatalog } from "./storage";
import type {
  CapabilityRecord,
  JurisdictionRecord,
  JurisdictionType,
  MockRoutableInstitution,
  RoutingCatalogState,
} from "./types";
import { createEmptyRoutingCatalog } from "./types";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `rt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function emitChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("animaps-routing-changed"));
}

export function getRoutingCatalog(): RoutingCatalogState {
  return readRoutingCatalog();
}

/**
 * Ensure the signed-in institution exists in the catalog (individual login).
 * Soft-gate: verificationStatus mirrors onboarding draft.
 */
export function ensureInstitutionInCatalog(input: {
  id?: string;
  label: string;
  verificationStatus: MockRoutableInstitution["verificationStatus"];
  institutionTypeKey: string | null | undefined;
}): MockRoutableInstitution {
  const state = readRoutingCatalog();
  const id = input.id?.trim() || "local-institution";
  const existing = state.institutions.find((i) => i.id === id);
  if (existing) {
    const next: MockRoutableInstitution = {
      ...existing,
      label: input.label.trim() || existing.label,
      verificationStatus: input.verificationStatus,
      institutionTypeKey:
        input.institutionTypeKey?.trim() || existing.institutionTypeKey,
    };
    if (
      next.label !== existing.label ||
      next.verificationStatus !== existing.verificationStatus ||
      next.institutionTypeKey !== existing.institutionTypeKey
    ) {
      writeRoutingCatalog({
        ...state,
        institutions: state.institutions.map((i) => (i.id === id ? next : i)),
      });
      emitChange();
    }
    return next;
  }

  const created: MockRoutableInstitution = {
    id,
    label: input.label.trim() || "Institution",
    verificationStatus: input.verificationStatus,
    institutionTypeKey: input.institutionTypeKey?.trim() || "other",
    jurisdictions: [],
    capabilities: [],
    anonymousReports: true,
  };
  writeRoutingCatalog({
    ...state,
    institutions: [...state.institutions, created],
  });
  emitChange();
  return created;
}

export function addJurisdiction(
  institutionId: string,
  input: { jurisdictionType: JurisdictionType; value: string; country?: string },
): JurisdictionRecord | null {
  const state = readRoutingCatalog();
  const idx = state.institutions.findIndex((i) => i.id === institutionId);
  if (idx < 0) return null;
  const inst = state.institutions[idx]!;
  const jur: JurisdictionRecord = {
    id: uid(),
    jurisdictionType: input.jurisdictionType,
    value: input.value.trim(),
    country: input.country?.trim() || "BR",
    createdAt: nowIso(),
  };
  const institutions = [...state.institutions];
  institutions[idx] = {
    ...inst,
    jurisdictions: [...inst.jurisdictions, jur],
  };
  writeRoutingCatalog({ institutions });
  emitChange();
  return jur;
}

export function removeJurisdiction(
  institutionId: string,
  jurisdictionId: string,
): void {
  const state = readRoutingCatalog();
  writeRoutingCatalog({
    institutions: state.institutions.map((i) =>
      i.id === institutionId
        ? {
            ...i,
            jurisdictions: i.jurisdictions.filter((j) => j.id !== jurisdictionId),
          }
        : i,
    ),
  });
  emitChange();
}

export function setCapability(
  institutionId: string,
  caseTypeId: string,
  accepts: boolean,
): CapabilityRecord | null {
  const state = readRoutingCatalog();
  const idx = state.institutions.findIndex((i) => i.id === institutionId);
  if (idx < 0) return null;
  const inst = state.institutions[idx]!;
  const existing = inst.capabilities.find((c) => c.caseTypeId === caseTypeId);
  let capabilities: CapabilityRecord[];
  let row: CapabilityRecord;
  if (existing) {
    row = { ...existing, accepts };
    capabilities = inst.capabilities.map((c) =>
      c.caseTypeId === caseTypeId ? row : c,
    );
  } else {
    row = {
      id: uid(),
      caseTypeId,
      accepts,
      createdAt: nowIso(),
    };
    capabilities = [...inst.capabilities, row];
  }
  const institutions = [...state.institutions];
  institutions[idx] = { ...inst, capabilities };
  writeRoutingCatalog({ institutions });
  emitChange();
  return row;
}

export function setAnonymousReports(
  institutionId: string,
  anonymousReports: boolean,
): void {
  const state = readRoutingCatalog();
  writeRoutingCatalog({
    institutions: state.institutions.map((i) =>
      i.id === institutionId ? { ...i, anonymousReports } : i,
    ),
  });
  emitChange();
}

export function resetRoutingCatalog(): void {
  writeRoutingCatalog(createEmptyRoutingCatalog());
  emitChange();
}

export { createEmptyRoutingCatalog };
