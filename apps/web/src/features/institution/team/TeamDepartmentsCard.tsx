"use client";

import { FormEvent } from "react";
import { Building2, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
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
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <Building2 className="size-4 text-brand-green" aria-hidden />
        <h2 className="text-sm font-bold text-ink">
          {t.institution.team.departmentsTitle}
        </h2>
      </div>
      {canManage ? (
        <form onSubmit={onAdd} className="flex flex-wrap gap-2">
          <Input
            label={t.institution.team.deptName}
            value={deptName}
            onChange={(e) => onDeptNameChange(e.target.value)}
            className="min-w-[12rem] flex-1"
          />
          <Button type="submit" size="sm" variant="pink" className="self-end">
            {t.institution.team.addDept}
          </Button>
        </form>
      ) : null}
      {departments.length === 0 ? (
        <p className="text-xs text-ink-muted">{t.institution.team.noDepts}</p>
      ) : (
        <ul className="divide-y divide-border-soft text-sm">
          {departments.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-2 py-2"
            >
              <span className="font-semibold text-ink">{d.name}</span>
              {canManage ? (
                <button
                  type="button"
                  className="rounded-lg p-1.5 text-ink-muted hover:bg-pastel-pink/40 hover:text-brand-pink"
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
    </Card>
  );
}
