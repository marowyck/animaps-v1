import type { Messages } from "@/i18n";
import type { CaseRoutingReason } from "./types";

const PREFIX = "__i18n__:";

type SystemMessage =
  | { code: "registered" }
  | { code: "evaluating_match" }
  | { code: "claimed" }
  | { code: "marked_review" }
  | { code: "assignment_cleared" }
  | { code: "assigned"; member?: string; team?: string }
  | { code: "routed"; label: string; reason: string }
  | { code: "match_via"; jurisdictionType: string; value: string }
  | { code: "ambiguous_match" }
  | { code: "no_match" }
  | { code: "comment_registered" }
  | { code: "comment_routed"; label: string };

const AUTHOR_INSTITUTION = "system:institution";
const AUTHOR_REPORTER = "system:reporter";

export function encodeSystemMessage(payload: SystemMessage): string {
  return PREFIX + JSON.stringify(payload);
}

export function institutionAuthorId(): string {
  return AUTHOR_INSTITUTION;
}

export function reporterAuthorId(): string {
  return AUTHOR_REPORTER;
}

function parseSystemMessage(raw: string): SystemMessage | null {
  if (!raw.startsWith(PREFIX)) return null;
  try {
    return JSON.parse(raw.slice(PREFIX.length)) as SystemMessage;
  } catch {
    return null;
  }
}

function interpolate(
  template: string,
  vars: Record<string, string>,
): string {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
    template,
  );
}

function reasonLabel(reason: string, t: Messages): string {
  const reasons = t.cases.routing.reasons as Record<string, string>;
  return reasons[reason] ?? reason;
}

function jurTypeLabel(type: string, t: Messages): string {
  const types = t.institution.routing.jurTypes as Record<string, string>;
  return types[type] ?? type;
}

function renderMessage(msg: SystemMessage, t: Messages): string {
  const e = t.cases.events;
  switch (msg.code) {
    case "registered":
      return e.registered;
    case "evaluating_match":
      return e.evaluatingMatch;
    case "claimed":
      return e.claimed;
    case "marked_review":
      return e.markedReview;
    case "assignment_cleared":
      return e.assignmentCleared;
    case "assigned": {
      const member = msg.member?.trim() ?? "";
      const team = msg.team?.trim() ?? "";
      if (member && team) {
        return interpolate(e.assigned, { member, team });
      }
      if (member) return interpolate(e.assignedMember, { member });
      if (team) return interpolate(e.assignedTeam, { team });
      return e.assignedNone;
    }
    case "routed":
      return interpolate(e.routed, {
        label: msg.label,
        reason: reasonLabel(msg.reason, t),
      });
    case "match_via":
      return interpolate(e.matchVia, {
        type: jurTypeLabel(msg.jurisdictionType, t),
        value: msg.value,
      });
    case "ambiguous_match":
      return e.ambiguousMatch;
    case "no_match":
      return e.noMatch;
    case "comment_registered":
      return t.cases.systemComments.registered;
    case "comment_routed":
      return interpolate(t.cases.systemComments.routed, { label: msg.label });
    default:
      return "";
  }
}

const LEGACY_EXACT: Record<string, SystemMessage> = {
  "Case registered on ANIMAPS": { code: "registered" },
  "Evaluating jurisdiction + capability match": { code: "evaluating_match" },
  "Claimed by reporter": { code: "claimed" },
  "Marked under review (institution mock — not official routing)": {
    code: "marked_review",
  },
  "Assignment cleared": { code: "assignment_cleared" },
  "Multiple institutions tied — left awaiting routing (no silent pick)": {
    code: "ambiguous_match",
  },
  "No approved institution covers location + case type": { code: "no_match" },
  "Your report was registered on ANIMAPS. Status updates when a matching approved institution is found — this is not an official public-agency protocol by itself.":
    { code: "comment_registered" },
};

function parseLegacy(raw: string): SystemMessage | null {
  const exact = LEGACY_EXACT[raw];
  if (exact) return exact;

  const routed = /^Routed to (.+) \(([^)]+)\)$/.exec(raw);
  if (routed) {
    return { code: "routed", label: routed[1]!, reason: routed[2]! };
  }

  const assigned = /^Assigned(?: to (.+?))?(?: \(team (.+)\))?$/.exec(raw);
  if (assigned && raw.startsWith("Assigned")) {
    return {
      code: "assigned",
      member: assigned[1],
      team: assigned[2],
    };
  }

  const matchVia = /^Match via ([^:]+):(.+)$/.exec(raw);
  if (matchVia) {
    return {
      code: "match_via",
      jurisdictionType: matchVia[1]!,
      value: matchVia[2]!,
    };
  }

  const commentRouted =
    /^Matched to (.+) on ANIMAPS \(internal routing\)/.exec(raw);
  if (commentRouted) {
    return { code: "comment_routed", label: commentRouted[1]! };
  }

  return null;
}

export function translateSystemText(
  raw: string | null | undefined,
  t: Messages,
): string {
  if (!raw) return "";
  const encoded = parseSystemMessage(raw);
  if (encoded) return renderMessage(encoded, t);
  const legacy = parseLegacy(raw);
  if (legacy) return renderMessage(legacy, t);
  return raw;
}

export function translateAuthorLabel(label: string, t: Messages): string {
  if (
    label === AUTHOR_INSTITUTION ||
    label === "Institution (mock)"
  ) {
    return t.cases.detail.institutionAuthor;
  }
  if (label === AUTHOR_REPORTER || label === "Reporter") {
    return t.cases.roles.reporter;
  }
  return label;
}

export function encodeRoutedEvent(
  label: string,
  reason: CaseRoutingReason,
): string {
  return encodeSystemMessage({ code: "routed", label, reason });
}

export function encodeMatchVia(jurisdictionType: string, value: string): string {
  return encodeSystemMessage({
    code: "match_via",
    jurisdictionType,
    value,
  });
}
