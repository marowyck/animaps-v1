"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/Button";
import { Input, nativeSelectClass } from "@/components/Input";
import { useT } from "@/i18n";
import {
  INSTITUTION_MEMBER_ROLES,
  type InstitutionDepartmentRecord,
  type InstitutionMemberRole,
  type InstitutionTeamRecord,
} from "./types";

type InviteMemberFormProps = {
  departments: InstitutionDepartmentRecord[];
  teams: InstitutionTeamRecord[];
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
  onInvite: (event: FormEvent) => void;
};

export function InviteMemberForm({
  departments,
  teams,
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
}: InviteMemberFormProps) {
  const t = useT();

  return (
    <form onSubmit={onInvite} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <Input
        label={t.institution.team.inviteEmail}
        type="email"
        value={inviteEmail}
        onChange={(e) => onInviteEmailChange(e.target.value)}
        required
      />
      <Input
        label={t.institution.team.inviteName}
        value={inviteName}
        onChange={(e) => onInviteNameChange(e.target.value)}
      />
      <label className="block space-y-1">
        <span className="text-body-sm font-semibold text-text">
          {t.institution.team.inviteRole}
        </span>
        <select
          className={nativeSelectClass}
          value={inviteRole}
          onChange={(e) =>
            onInviteRoleChange(e.target.value as InstitutionMemberRole)
          }
        >
          {INSTITUTION_MEMBER_ROLES.map((role) => (
            <option key={role} value={role}>
              {t.institution.team.roles[role]}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1">
        <span className="text-body-sm font-semibold text-text">
          {t.institution.team.inviteDept}
        </span>
        <select
          className={nativeSelectClass}
          value={inviteDeptId}
          onChange={(e) => onInviteDeptIdChange(e.target.value)}
        >
          <option value="">{t.institution.team.none}</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1">
        <span className="text-body-sm font-semibold text-text">
          {t.institution.team.inviteTeam}
        </span>
        <select
          className={nativeSelectClass}
          value={inviteTeamId}
          onChange={(e) => onInviteTeamIdChange(e.target.value)}
        >
          <option value="">{t.institution.team.none}</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-end">
        <Button type="submit" size="sm" variant="primary">
          {t.institution.team.sendInvite}
        </Button>
      </div>
    </form>
  );
}
