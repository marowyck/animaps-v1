"use client";

import { FormEvent } from "react";
import { Trash2, Users } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
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
            <span className="text-xs font-bold text-ink">
              {t.institution.team.teamDept}
            </span>
            <select
              className="w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm outline-none focus-visible:border-brand-green"
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
          <Button type="submit" size="sm" variant="pink">
            {t.institution.team.addTeam}
          </Button>
        </form>
      ) : null}
      {teams.length === 0 ? (
        <p className="text-xs text-ink-muted">{t.institution.team.noTeams}</p>
      ) : (
        <ul className="divide-y divide-border-soft text-sm">
          {teams.map((tm) => (
            <li
              key={tm.id}
              className="flex items-center justify-between gap-2 py-2"
            >
              <div>
                <p className="font-semibold text-ink">{tm.name}</p>
                <p className="text-xs text-ink-muted">
                  {tm.departmentId
                    ? deptById.get(tm.departmentId) ?? "—"
                    : t.institution.team.noDeptLink}
                </p>
              </div>
              {canManage ? (
                <button
                  type="button"
                  className="rounded-lg p-1.5 text-ink-muted hover:bg-pastel-pink/40 hover:text-brand-pink"
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
