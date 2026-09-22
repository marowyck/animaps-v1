"use client";

import type { ReactNode } from "react";
import { PawDoodle } from "@/components/illustrations/Doodles";
import { useT } from "@/i18n";

type WorkspaceHeaderProps = {
  title: string;
  subtitle?: string;
  note?: string;
  actions?: ReactNode;
};

export function WorkspaceHeader({
  title,
  subtitle,
  note,
  actions,
}: WorkspaceHeaderProps) {
  const t = useT();
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-end gap-3">
        <PawDoodle className="mb-1 hidden size-10 shrink-0 -rotate-12 text-primary sm:block" />
        <div>
          <p className="text-label inline-flex rounded-full bg-secondary-soft px-2.5 py-1 text-(--lilac-700)">
            {t.institution.workspaceEyebrow}
          </p>
          <h1 className="text-h1 mt-2 text-text">{title}</h1>
          {subtitle ? (
            <p className="mt-2 max-w-xl text-body-sm text-text-secondary">{subtitle}</p>
          ) : null}
          {note ? (
            <p className="mt-2 max-w-xl text-caption text-text-muted">{note}</p>
          ) : null}
        </div>
      </div>
      {actions}
    </header>
  );
}
