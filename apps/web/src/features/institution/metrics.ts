import type { CaseRecord } from "@/features/cases";
import type { SelfieVerificationStatus } from "@/features/onboarding";

/** Soft-gate: live operational modules require APPROVED institutional verification. */
export function isInstitutionOperational(
  status: SelfieVerificationStatus | null | undefined,
): boolean {
  return status === "approved";
}

export type InstitutionOverviewMetrics = {
  newCount: number;
  inReview: number;
  inProgress: number;
  priority: number;
  closed: number;
  total: number;
};

export function computeCaseMetrics(
  cases: CaseRecord[],
): InstitutionOverviewMetrics {
  let newCount = 0;
  let inReview = 0;
  let inProgress = 0;
  let priority = 0;
  let closed = 0;

  for (const c of cases) {
    if (c.status === "new") newCount += 1;
    if (c.status === "triage" || c.status === "under_review") inReview += 1;
    if (
      c.status === "assigned" ||
      c.status === "in_progress" ||
      c.status === "waiting_information"
    ) {
      inProgress += 1;
    }
    if (c.priority === "high" || c.priority === "critical") priority += 1;
    if (c.status === "resolved" || c.status === "closed") closed += 1;
  }

  return {
    newCount,
    inReview,
    inProgress,
    priority,
    closed,
    total: cases.length,
  };
}
