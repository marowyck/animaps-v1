/**
 * Case domain types (Fase 3 mock) — aligned to docs/schema.prisma + cases.md.
 * Persistence is localStorage until Nest Case API ships.
 */

export const CASE_TYPE_IDS = [
  "animal_abuse",
  "animal_neglect",
  "animal_abandonment",
  "animal_at_risk",
  "injured_animal",
  "road_accident",
  "lost_animal",
  "found_animal",
  "stray_animal",
  "hoarding",
  "illegal_activity",
  "environmental_risk",
  "public_request",
  "other",
] as const;

export type CaseTypeId = (typeof CASE_TYPE_IDS)[number];

export const CASE_STATUSES = [
  "new",
  "triage",
  "under_review",
  "assigned",
  "in_progress",
  "waiting_information",
  "resolved",
  "closed",
  "cancelled",
  "duplicate",
  "invalid",
] as const;

export type CaseStatus = (typeof CASE_STATUSES)[number];

/** Citizen-facing status — never invent agency delivery without a routing row. */
export const CASE_CITIZEN_STATUSES = [
  "registered_on_platform",
  "awaiting_routing",
  "routed",
  "received",
  "under_analysis",
  "in_progress",
  "resolved",
] as const;

export type CaseCitizenStatus = (typeof CASE_CITIZEN_STATUSES)[number];

export const CASE_PRIORITIES = ["low", "medium", "high", "critical"] as const;
export type CasePriority = (typeof CASE_PRIORITIES)[number];

export const CASE_SOURCES = [
  "citizen",
  "ngo",
  "veterinary",
  "institution",
  "system",
  "import",
  "api",
  "partner",
] as const;
export type CaseSource = (typeof CASE_SOURCES)[number];

export const REPORTER_VISIBILITIES = [
  "public",
  "restricted",
  "confidential",
  "anonymous",
] as const;
export type ReporterVisibility = (typeof REPORTER_VISIBILITIES)[number];

export const LOCATION_PRECISIONS = [
  "exact",
  "approximate",
  "city",
  "region",
  "hidden",
] as const;
export type LocationPrecision = (typeof LOCATION_PRECISIONS)[number];

export const COMMENT_VISIBILITIES = ["internal", "public"] as const;
export type CaseCommentVisibility = (typeof COMMENT_VISIBILITIES)[number];

export const PARTICIPANT_ROLES = [
  "reporter",
  "assignee",
  "observer",
  "routed_institution",
  "origin_organization",
  "responder",
] as const;
export type CaseParticipantRole = (typeof PARTICIPANT_ROLES)[number];

export const ATTACHMENT_KINDS = ["photo", "video", "document"] as const;
export type AttachmentKind = (typeof ATTACHMENT_KINDS)[number];

export type CaseLocationDraft = {
  city: string;
  state: string;
  neighborhood: string;
  formattedAddress: string;
  latitude: number | null;
  longitude: number | null;
  precision: LocationPrecision;
};

export type CaseAttachmentDraft = {
  id: string;
  name: string;
  kind: AttachmentKind;
  mimeType: string | null;
  /** Stub URL / data-URL for mock only — never upload secrets. */
  url: string;
  createdAt: string;
};

export type CaseCommentDraft = {
  id: string;
  body: string;
  visibility: CaseCommentVisibility;
  authorLabel: string;
  createdAt: string;
};

export type CaseParticipantDraft = {
  id: string;
  role: CaseParticipantRole;
  userLabel: string | null;
  createdAt: string;
};

export type CaseStatusHistoryDraft = {
  id: string;
  fromStatus: CaseStatus | null;
  toStatus: CaseStatus;
  fromCitizen: CaseCitizenStatus | null;
  toCitizen: CaseCitizenStatus | null;
  note: string | null;
  createdAt: string;
};

export type CaseRoutingReason =
  | "initial"
  | "no_competence"
  | "out_of_region"
  | "out_of_type"
  | "partnership"
  | "specialization"
  | "other";

export const CASE_ROUTING_REASONS: CaseRoutingReason[] = [
  "initial",
  "no_competence",
  "out_of_region",
  "out_of_type",
  "partnership",
  "specialization",
  "other",
];

export type CaseRoutingDraft = {
  id: string;
  fromInstitutionId: string | null;
  fromInstitutionLabel: string | null;
  toInstitutionId: string | null;
  toInstitutionLabel: string | null;
  reason: CaseRoutingReason;
  note: string | null;
  createdAt: string;
};

export type CaseAssignmentDraft = {
  id: string;
  memberId: string | null;
  memberLabel: string | null;
  teamId: string | null;
  teamLabel: string | null;
  assignedByLabel: string | null;
  note: string | null;
  createdAt: string;
  endedAt: string | null;
};

export type CaseRecord = {
  id: string;
  referenceNumber: string;
  caseTypeId: CaseTypeId;
  status: CaseStatus;
  citizenStatus: CaseCitizenStatus;
  priority: CasePriority;
  source: CaseSource;
  title: string;
  description: string;
  location: CaseLocationDraft;
  reporterId: string | null;
  reporterEmail: string | null;
  reporterVisibility: ReporterVisibility;
  /** Optional link to Wave 2 occurrence (expand-contract later). */
  occurrenceId: string | null;
  /** Plain token shown once for anonymous claim (mock). Hash stored separately. */
  claimToken: string | null;
  claimTokenHash: string | null;
  claimedAt: string | null;
  assignedMemberId: string | null;
  assignedMemberLabel: string | null;
  assignedTeamId: string | null;
  assignedTeamLabel: string | null;
  history: CaseStatusHistoryDraft[];
  comments: CaseCommentDraft[];
  attachments: CaseAttachmentDraft[];
  participants: CaseParticipantDraft[];
  routings: CaseRoutingDraft[];
  assignments: CaseAssignmentDraft[];
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
};

export type CreateCaseInput = {
  caseTypeId: CaseTypeId;
  title: string;
  description: string;
  location: Partial<CaseLocationDraft>;
  reporterVisibility: ReporterVisibility;
  source: CaseSource;
  reporterId?: string | null;
  reporterEmail?: string | null;
  priority?: CasePriority;
  attachmentNames?: string[];
  anonymous?: boolean;
};
