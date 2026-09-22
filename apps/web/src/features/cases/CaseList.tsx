"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/StateBlocks";
import { useT } from "@/i18n";
import type { CaseRecord } from "./types";

type CaseListProps = {
  cases: CaseRecord[];
  mode: "citizen" | "institution";
  canCreate?: boolean;
};

export function CaseList({ cases, mode, canCreate = true }: CaseListProps) {
  const t = useT();

  if (cases.length === 0) {
    return (
      <EmptyState
        title={t.cases.list.emptyTitle}
        description={
          mode === "institution"
            ? t.cases.list.emptyInstitution
            : t.cases.list.emptyCitizen
        }
        action={
          canCreate ? (
            <Button href="/cases/new" variant="pink" size="sm">
              {t.cases.list.createCta}
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl text-ink">
            {mode === "institution"
              ? t.cases.list.institutionTitle
              : t.cases.list.citizenTitle}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {mode === "institution"
              ? t.cases.list.institutionSubtitle
              : t.cases.list.citizenSubtitle}
          </p>
        </div>
        {canCreate ? (
          <Button href="/cases/new" variant="pink" size="sm">
            {t.cases.list.createCta}
          </Button>
        ) : null}
      </div>

      <ul className="divide-y divide-border-soft overflow-hidden rounded-3xl border-2 border-border-soft bg-white">
        {cases.map((c) => (
          <li key={c.id}>
            <Link
              href={`/cases/${c.id}`}
              className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-pastel-green/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  {c.referenceNumber}
                </p>
                <p className="truncate font-bold text-ink">
                  {c.title && c.title !== c.caseTypeId
                    ? c.title
                    : t.cases.types[c.caseTypeId].title}
                </p>
                <p className="text-xs text-ink-muted">
                  {t.cases.types[c.caseTypeId].title}
                  {c.location.city
                    ? ` · ${c.location.city}/${c.location.state}`
                    : ""}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-border-soft bg-gray-soft px-2.5 py-1 text-[0.7rem] font-bold text-ink">
                {t.cases.citizenStatus[c.citizenStatus]}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-center text-xs font-semibold text-ink-muted">
        <Link href="/cases/claim" className="underline underline-offset-2">
          {t.cases.claim.link}
        </Link>
      </p>
    </div>
  );
}
