import type { CasePriority, CaseTypeId } from "./types";
import { CASE_TYPE_IDS } from "./types";

export type CaseTypeMeta = {
  id: CaseTypeId;
  /** Default priority suggestion (manual override allowed). */
  defaultPriority: CasePriority;
  icon: string;
};

/** Seed catalog — ids match docs/database/overview.md case_types. */
export const CASE_TYPE_CATALOG: CaseTypeMeta[] = [
  { id: "animal_abuse", defaultPriority: "high", icon: "AlertTriangle" },
  { id: "animal_neglect", defaultPriority: "high", icon: "AlertTriangle" },
  { id: "animal_abandonment", defaultPriority: "high", icon: "AlertTriangle" },
  { id: "animal_at_risk", defaultPriority: "high", icon: "ShieldAlert" },
  { id: "injured_animal", defaultPriority: "critical", icon: "HeartPulse" },
  { id: "road_accident", defaultPriority: "critical", icon: "Car" },
  { id: "lost_animal", defaultPriority: "medium", icon: "Search" },
  { id: "found_animal", defaultPriority: "medium", icon: "Megaphone" },
  { id: "stray_animal", defaultPriority: "medium", icon: "PawPrint" },
  { id: "hoarding", defaultPriority: "high", icon: "Home" },
  { id: "illegal_activity", defaultPriority: "critical", icon: "Ban" },
  { id: "environmental_risk", defaultPriority: "high", icon: "Leaf" },
  { id: "public_request", defaultPriority: "low", icon: "ClipboardList" },
  { id: "other", defaultPriority: "medium", icon: "HelpCircle" },
];

export function isCaseTypeId(value: unknown): value is CaseTypeId {
  return (
    typeof value === "string" &&
    (CASE_TYPE_IDS as readonly string[]).includes(value)
  );
}

export function metaForCaseType(id: CaseTypeId): CaseTypeMeta {
  return (
    CASE_TYPE_CATALOG.find((t) => t.id === id) ??
    CASE_TYPE_CATALOG[CASE_TYPE_CATALOG.length - 1]!
  );
}
