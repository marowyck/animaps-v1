"use client";

import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { hasPermission } from "@/features/permissions";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { SoftGateBanner } from "./SoftGateBanner";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { isInstitutionOperational } from "./metrics";
import { TeamDepartmentsCard } from "./team/TeamDepartmentsCard";
import { TeamMembersCard } from "./team/TeamMembersCard";
import { TeamTeamsCard } from "./team/TeamTeamsCard";
import { useInstitutionOrg } from "./team/useInstitutionOrg";
import type { InstitutionMemberRole } from "./team/types";

/**
 * Departments, teams, memberships (Fase 6).
 * Individual logins only — invites are per-email, never a shared institutional account.
 */
export function InstitutionTeamShell() {
  const t = useT();
  const { toast } = useToast();
  const { draft, userType } = useOnboarding();
  const {
    org,
    ensureAdmin,
    createDepartment,
    deleteDepartment,
    createTeam,
    deleteTeam,
    invite,
    patchMember,
    changeStatus,
  } = useInstitutionOrg();

  const verified = isInstitutionOperational(
    draft.institutionalVerificationStatus,
  );
  const canManage = verified && hasPermission(userType, "MANAGE_TEAM");

  const [deptName, setDeptName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamDeptId, setTeamDeptId] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] =
    useState<InstitutionMemberRole>("ANALYST");
  const [inviteDeptId, setInviteDeptId] = useState("");
  const [inviteTeamId, setInviteTeamId] = useState("");

  useEffect(() => {
    ensureAdmin(draft.email, draft.displayName);
  }, [draft.email, draft.displayName, ensureAdmin]);

  const deptById = new Map(org.departments.map((d) => [d.id, d.name]));
  const teamById = new Map(org.teams.map((tm) => [tm.id, tm.name]));
  const activeMembers = org.members.filter((m) => m.status !== "left");

  function onAddDepartment(e: FormEvent) {
    e.preventDefault();
    if (!canManage || !deptName.trim()) return;
    createDepartment(deptName.trim());
    setDeptName("");
    toast({ message: t.institution.team.deptAdded, tone: "success" });
  }

  function onAddTeam(e: FormEvent) {
    e.preventDefault();
    if (!canManage || !teamName.trim()) return;
    createTeam(teamName.trim(), undefined, teamDeptId || null);
    setTeamName("");
    setTeamDeptId("");
    toast({ message: t.institution.team.teamAdded, tone: "success" });
  }

  function onInvite(e: FormEvent) {
    e.preventDefault();
    if (!canManage) return;
    const result = invite({
      email: inviteEmail,
      displayName: inviteName || undefined,
      role: inviteRole,
      departmentId: inviteDeptId || null,
      teamId: inviteTeamId || null,
    });
    if ("error" in result) {
      toast({
        message:
          result.error === "duplicate"
            ? t.institution.team.inviteDuplicate
            : t.institution.team.inviteInvalid,
        tone: "error",
      });
      return;
    }
    setInviteEmail("");
    setInviteName("");
    setInviteRole("ANALYST");
    setInviteDeptId("");
    setInviteTeamId("");
    toast({ message: t.institution.team.inviteSent, tone: "success" });
  }

  return (
    <div className="space-y-5">
      <WorkspaceHeader
        title={t.institution.team.title}
        subtitle={t.institution.team.subtitle}
        note={t.institution.team.individualOnly}
      />

      {!verified ? <SoftGateBanner /> : null}
      {verified && !canManage ? (
        <p className="text-sm text-ink-muted">{t.institution.team.noPermission}</p>
      ) : null}
      {!verified ? (
        <p className="text-sm text-ink-muted">
          {t.institution.team.readOnlyHint}
        </p>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <TeamDepartmentsCard
          canManage={canManage}
          departments={org.departments}
          deptName={deptName}
          onDeptNameChange={setDeptName}
          onAdd={onAddDepartment}
          onDelete={deleteDepartment}
        />
        <TeamTeamsCard
          canManage={canManage}
          teams={org.teams}
          departments={org.departments}
          deptById={deptById}
          teamName={teamName}
          teamDeptId={teamDeptId}
          onTeamNameChange={setTeamName}
          onTeamDeptIdChange={setTeamDeptId}
          onAdd={onAddTeam}
          onDelete={deleteTeam}
        />
      </section>

      <TeamMembersCard
        canManage={canManage}
        members={activeMembers}
        departments={org.departments}
        teams={org.teams}
        deptById={deptById}
        teamById={teamById}
        inviteEmail={inviteEmail}
        inviteName={inviteName}
        inviteRole={inviteRole}
        inviteDeptId={inviteDeptId}
        inviteTeamId={inviteTeamId}
        onInviteEmailChange={setInviteEmail}
        onInviteNameChange={setInviteName}
        onInviteRoleChange={setInviteRole}
        onInviteDeptIdChange={setInviteDeptId}
        onInviteTeamIdChange={setInviteTeamId}
        onInvite={onInvite}
        onChangeStatus={changeStatus}
        onPatchRole={(id, role) => patchMember(id, { role })}
      />
    </div>
  );
}
