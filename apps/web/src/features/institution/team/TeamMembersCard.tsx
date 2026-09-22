"use client";

import { FormEvent } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";
import { WorkspaceSection } from "../WorkspaceSection";
import { InviteMemberForm } from "./InviteMemberForm";
import { useT } from "@/i18n";
import {
  INSTITUTION_MEMBER_ROLES,
  type InstitutionDepartmentRecord,
  type InstitutionMemberRecord,
  type InstitutionMemberRole,
  type InstitutionTeamRecord,
  type MembershipStatus,
} from "./types";

type TeamMembersCardProps = {
  canManage: boolean;
  members: InstitutionMemberRecord[];
  departments: InstitutionDepartmentRecord[];
  teams: InstitutionTeamRecord[];
  deptById: Map<string, string>;
  teamById: Map<string, string>;
  inviteEmail: string;
  inviteName: string;
  inviteRole: InstitutionMemberRole;
  inviteDeptId: string;
  inviteTeamId: string;
  onInviteEmailChange: (value: string) => void;
  onInviteNameChange: (value: string) => void;
  onInviteRoleChange: (value: InstitutionMemberRole) => void;
  onInviteDeptIdChange: (value: string) => void;
  onInviteTeamIdChange: (value: string) => void;
  onInvite: (e: FormEvent) => void;
  onChangeStatus: (id: string, status: MembershipStatus) => void;
  onPatchRole: (id: string, role: InstitutionMemberRole) => void;
};

export function TeamMembersCard({
  canManage,
  members,
  departments,
  teams,
  deptById,
  teamById,
  inviteEmail,
  inviteName,
  inviteRole,
  inviteDeptId,
  inviteTeamId,
  onInviteEmailChange,
  onInviteNameChange,
  onInviteRoleChange,
  onInviteDeptIdChange,
  onInviteTeamIdChange,
  onInvite,
  onChangeStatus,
  onPatchRole,
}: TeamMembersCardProps) {
  const t = useT();
  const { toast } = useToast();

  const roleLabel = (role: InstitutionMemberRole) =>
    t.institution.team.roles[role];
  const statusLabel = (status: MembershipStatus) =>
    t.institution.team.statuses[status];

  return (
    <WorkspaceSection
      title={t.institution.team.membersTitle}
      icon={<UserPlus className="size-5" aria-hidden />}
      tone="primary"
    >

      {canManage ? (
        <InviteMemberForm
          departments={departments}
          teams={teams}
          inviteEmail={inviteEmail}
          inviteName={inviteName}
          inviteRole={inviteRole}
          inviteDeptId={inviteDeptId}
          inviteTeamId={inviteTeamId}
          onInviteEmailChange={onInviteEmailChange}
          onInviteNameChange={onInviteNameChange}
          onInviteRoleChange={onInviteRoleChange}
          onInviteDeptIdChange={onInviteDeptIdChange}
          onInviteTeamIdChange={onInviteTeamIdChange}
          onInvite={onInvite}
        />
      ) : null}

      {members.length === 0 ? (
        <p className="text-xs text-ink-muted">{t.institution.team.noMembers}</p>
      ) : (
        <ul className="divide-y divide-border-soft">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold text-ink">{m.displayName}</p>
                <p className="text-xs text-ink-muted">{m.email}</p>
                <p className="mt-1 text-xs font-semibold text-ink-muted">
                  {roleLabel(m.role)} · {statusLabel(m.status)}
                  {m.departmentId
                    ? ` · ${deptById.get(m.departmentId) ?? ""}`
                    : ""}
                  {m.teamId ? ` · ${teamById.get(m.teamId) ?? ""}` : ""}
                </p>
              </div>
              {canManage ? (
                <div className="flex flex-wrap gap-2">
                  {m.status === "invited" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onChangeStatus(m.id, "active");
                        toast({
                          message: t.institution.team.memberActivated,
                          tone: "success",
                        });
                      }}
                    >
                      {t.institution.team.activate}
                    </Button>
                  ) : null}
                  {m.status === "active" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onChangeStatus(m.id, "suspended");
                        toast({
                          message: t.institution.team.memberSuspended,
                          tone: "success",
                        });
                      }}
                    >
                      {t.institution.team.suspend}
                    </Button>
                  ) : null}
                  {m.status === "suspended" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onChangeStatus(m.id, "active");
                        toast({
                          message: t.institution.team.memberActivated,
                          tone: "success",
                        });
                      }}
                    >
                      {t.institution.team.activate}
                    </Button>
                  ) : null}
                  {m.role !== "INSTITUTION_ADMIN" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onChangeStatus(m.id, "left");
                        toast({
                          message: t.institution.team.memberRemoved,
                          tone: "success",
                        });
                      }}
                    >
                      {t.institution.team.removeMember}
                    </Button>
                  ) : null}
                  <label className="flex items-center gap-1 text-xs">
                    <span className="sr-only">
                      {t.institution.team.inviteRole}
                    </span>
                    <select
                      className="rounded-xl border border-border-soft bg-white px-2 py-1 text-xs"
                      value={m.role}
                      onChange={(e) => {
                        onPatchRole(
                          m.id,
                          e.target.value as InstitutionMemberRole,
                        );
                        toast({
                          message: t.institution.team.roleUpdated,
                          tone: "success",
                        });
                      }}
                    >
                      {INSTITUTION_MEMBER_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {roleLabel(r)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </WorkspaceSection>
  );
}
