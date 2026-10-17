"use client";

import { FormEvent } from "react";
import { Building2, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { WorkspaceSection } from "../WorkspaceSection";
import type { InstitutionDepartmentRecord } from "./types";

type TeamDepartmentsCardProps = {
  canManage: boolean;
  departments: InstitutionDepartmentRecord[];
  deptName: string;
  onDeptNameChange: (value: string) => void;
  onAdd: (e: FormEvent) => void;
  onDelete: (id: string) => void;
};

export function TeamDepartmentsCard({
  canManage,
  departments,
  deptName,
  onDeptNameChange,
  onAdd,
  onDelete,
}: TeamDepartmentsCardProps) {
  const t = useT();
  const { toast } = useToast();

  return (
    <WorkspaceSection
      title={t.institution.team.departmentsTitle}
      icon={<Building2 className="size-5" aria-hidden />}
      tone="success"
    >
      {canManage ? (
        <form onSubmit={onAdd} className="flex flex-wrap gap-2">
          <Input
            label={t.institution.team.deptName}
            value={deptName}
            onChange={(e) => onDeptNameChange(e.target.value)}
            className="min-w-[12rem] flex-1"
          />
          <Button type="submit" size="sm" variant="primary" className="self-end">
            {t.institution.team.addDept}
          </Button>
        </form>
      ) : null}
      {departments.length === 0 ? (
        <p className="text-caption text-text-muted">{t.institution.team.noDepts}</p>
      ) : (
        <ul className="divide-y divide-border-subtle text-body-sm">
          {departments.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-2 py-2"
            >
              <span className="font-semibold text-text">{d.name}</span>
              {canManage ? (
                <button
                  type="button"
                  className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors duration-(--duration-fast) hover:bg-danger-soft hover:text-danger-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  aria-label={t.institution.team.remove}
                  onClick={() => {
                    onDelete(d.id);
                    toast({
                      message: t.institution.team.deptRemoved,
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
