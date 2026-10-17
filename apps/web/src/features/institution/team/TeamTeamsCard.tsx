"use client";

import { FormEvent } from "react";
import { Trash2, Users } from "lucide-react";
import { Button } from "@/components/Button";
import { Input, nativeSelectClass } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { WorkspaceSection } from "../WorkspaceSection";
import type {
  InstitutionDepartmentRecord,
  InstitutionTeamRecord,
} from "./types";

type TeamTeamsCardProps = {
  canManage: boolean;
  teams: InstitutionTeamRecord[];
  departments: InstitutionDepartmentRecord[];
  deptById: Map<string, string>;
  teamName: string;
  teamDeptId: string;
  onTeamNameChange: (value: string) => void;
  onTeamDeptIdChange: (value: string) => void;
  onAdd: (e: FormEvent) => void;
  onDelete: (id: string) => void;
};

export function TeamTeamsCard({
  canManage,
  teams,
  departments,
  deptById,
  teamName,
  teamDeptId,
  onTeamNameChange,
  onTeamDeptIdChange,
  onAdd,
  onDelete,
}: TeamTeamsCardProps) {
  const t = useT();
  const { toast } = useToast();

  return (
    <WorkspaceSection
      title={t.institution.team.teamsTitle}
      icon={<Users className="size-5" aria-hidden />}
      tone="info"
    >
      {canManage ? (
        <form onSubmit={onAdd} className="space-y-2">
          <Input
            label={t.institution.team.teamName}
            value={teamName}
            onChange={(e) => onTeamNameChange(e.target.value)}
          />
          <label className="block space-y-1">
            <span className="text-body-sm font-semibold text-text">
              {t.institution.team.teamDept}
            </span>
            <select
              className={nativeSelectClass}
              value={teamDeptId}
              onChange={(e) => onTeamDeptIdChange(e.target.value)}
            >
              <option value="">{t.institution.team.none}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" size="sm" variant="primary">
            {t.institution.team.addTeam}
          </Button>
        </form>
      ) : null}
      {teams.length === 0 ? (
        <p className="text-caption text-text-muted">{t.institution.team.noTeams}</p>
      ) : (
        <ul className="divide-y divide-border-subtle text-body-sm">
          {teams.map((tm) => (
            <li
              key={tm.id}
              className="flex items-center justify-between gap-2 py-2"
            >
              <div>
                <p className="font-semibold text-text">{tm.name}</p>
                <p className="text-caption text-text-muted">
                  {tm.departmentId
                    ? deptById.get(tm.departmentId) ?? "—"
                    : t.institution.team.noDeptLink}
                </p>
              </div>
              {canManage ? (
                <button
                  type="button"
                  className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors duration-(--duration-fast) hover:bg-danger-soft hover:text-danger-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  aria-label={t.institution.team.remove}
                  onClick={() => {
                    onDelete(tm.id);
                    toast({
                      message: t.institution.team.teamRemoved,
                      tone: "success",
                    });
                  }}
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </WorkspaceSection>
  );
}
