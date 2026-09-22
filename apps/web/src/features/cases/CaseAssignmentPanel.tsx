"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useToast } from "@/components/Toast";
import { useInstitutionOrg } from "@/features/institution/team/useInstitutionOrg";
import { hasPermission } from "@/features/permissions";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import type { CaseRecord } from "./types";
import { useCasesStore } from "./useCases";

type CaseAssignmentPanelProps = {
  record: CaseRecord;
  verified: boolean;
};

/** Assign case to a member and/or team (Fase 6). Not official routing. */
export function CaseAssignmentPanel({
  record,
  verified,
}: CaseAssignmentPanelProps) {
  const t = useT();
  const { toast } = useToast();
  const { draft, userType } = useOnboarding();
  const { org } = useInstitutionOrg();
  const { assign, unassign } = useCasesStore();

  const canAssign =
    verified &&
    (hasPermission(userType, "ASSIGN_REPORT") ||
      hasPermission(userType, "MANAGE_TEAM"));

  const [memberId, setMemberId] = useState(record.assignedMemberId ?? "");
  const [teamId, setTeamId] = useState(record.assignedTeamId ?? "");

  const activeMembers = useMemo(
    () => org.members.filter((m) => m.status === "active" || m.status === "invited"),
    [org.members],
  );

  function onAssign(e: FormEvent) {
    e.preventDefault();
    if (!canAssign) return;
    if (!memberId && !teamId) {
      toast({ message: t.cases.assignment.needTarget, tone: "error" });
      return;
    }
    const member = activeMembers.find((m) => m.id === memberId);
    const team = org.teams.find((tm) => tm.id === teamId);
    const updated = assign(record.id, {
      memberId: member?.id ?? null,
      memberLabel: member
        ? `${member.displayName} <${member.email}>`
        : null,
      teamId: team?.id ?? null,
      teamLabel: team?.name ?? null,
      assignedByLabel:
        draft.displayName?.trim() || draft.email || t.cases.detail.institutionAuthor,
    });
    if (updated) {
      toast({ message: t.cases.assignment.assigned, tone: "success" });
    }
  }

  function onClear() {
    if (!canAssign) return;
    const updated = unassign(record.id);
    if (updated) {
      setMemberId("");
      setTeamId("");
      toast({ message: t.cases.assignment.cleared, tone: "success" });
    }
  }

  return (
    <Card className="space-y-3 p-4">
      <h2 className="text-sm font-bold text-ink">{t.cases.assignment.title}</h2>
      <p className="text-xs text-ink-muted">{t.cases.assignment.hint}</p>

      {record.assignedMemberLabel || record.assignedTeamLabel ? (
        <p className="rounded-2xl border border-border-soft bg-pastel-green/30 px-3 py-2 text-sm font-semibold text-ink">
          {[record.assignedMemberLabel, record.assignedTeamLabel]
            .filter(Boolean)
            .join(" · ")}
        </p>
      ) : (
        <p className="text-xs text-ink-muted">{t.cases.assignment.unassigned}</p>
      )}

      {canAssign ? (
        <form onSubmit={onAssign} className="space-y-2">
          <label className="block space-y-1">
            <span className="text-xs font-bold text-ink">
              {t.cases.assignment.member}
            </span>
            <select
              className="w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm outline-none focus-visible:border-brand-green"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            >
              <option value="">{t.cases.assignment.none}</option>
              {activeMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.displayName} ({m.email})
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold text-ink">
              {t.cases.assignment.team}
            </span>
            <select
              className="w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm outline-none focus-visible:border-brand-green"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
            >
              <option value="">{t.cases.assignment.none}</option>
              {org.teams.map((tm) => (
                <option key={tm.id} value={tm.id}>
                  {tm.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" variant="pink">
              {t.cases.assignment.assign}
            </Button>
            {record.assignedMemberId || record.assignedTeamId ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={onClear}
              >
                {t.cases.assignment.clear}
              </Button>
            ) : null}
          </div>
        </form>
      ) : !verified ? (
        <p className="text-xs text-ink-muted">{t.cases.assignment.softGate}</p>
      ) : (
        <p className="text-xs text-ink-muted">{t.cases.assignment.noPermission}</p>
      )}
    </Card>
  );
}
