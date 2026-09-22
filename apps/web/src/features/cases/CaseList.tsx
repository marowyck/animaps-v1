"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { DataTable } from "@/components/DataTable";
import { PawPrint } from "lucide-react";
import { useT } from "@/i18n";
import type { CaseRecord } from "./types";

type CaseListProps = {
  cases: CaseRecord[];
  mode: "citizen" | "institution";
  canCreate?: boolean;
  showHeading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function CaseList({
  cases,
  mode,
  canCreate = true,
  showHeading = true,
  emptyTitle,
  emptyDescription,
}: CaseListProps) {
  const t = useT();
  const router = useRouter();

  if (cases.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary-soft text-(--lilac-700)">
          <PawPrint className="size-6" aria-hidden />
        </span>
        <div>
          <h1 className="text-h2 text-text">{emptyTitle ?? t.cases.list.emptyTitle}</h1>
          <p className="mt-2 max-w-sm text-body-sm text-text-secondary">
            {emptyDescription ??
              (mode === "institution"
                ? t.cases.list.emptyInstitution
                : t.cases.list.emptyCitizen)}
          </p>
          {canCreate ? (
            <Button href="/cases/new" variant="primary" size="sm" className="mt-4">
              {t.cases.list.createCta}
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {showHeading ? (
          <div>
            <h1 className="text-h1 text-text">
              {mode === "institution"
                ? t.cases.list.institutionTitle
                : t.cases.list.citizenTitle}
            </h1>
            <p className="mt-2 max-w-xl text-body-sm text-text-secondary">
              {mode === "institution"
                ? t.cases.list.institutionSubtitle
                : t.cases.list.citizenSubtitle}
            </p>
          </div>
        ) : null}
        {canCreate ? (
          <Button href="/cases/new" variant="primary" size="sm">
            {t.cases.list.createCta}
          </Button>
        ) : null}
      </div>

      <DataTable
        caption={
          mode === "institution"
            ? t.cases.list.institutionTitle
            : t.cases.list.citizenTitle
        }
        rows={cases}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/cases/${row.id}`)}
        columns={[
          {
            id: "ref",
            header: t.cases.list.institutionTitle,
            cell: (row) => row.referenceNumber,
            className: "text-text-muted",
          },
          {
            id: "title",
            header: t.cases.list.citizenTitle,
            cell: (row) =>
              row.title && row.title !== row.caseTypeId
                ? row.title
                : t.cases.types[row.caseTypeId].title,
          },
          {
            id: "place",
            header: t.dashboard.nav.location ?? t.dashboard.nav.map ?? "",
            cell: (row) =>
              row.location.city
                ? `${row.location.city}/${row.location.state}`
                : "—",
          },
          {
            id: "status",
            header: t.cases.detail.citizenStatus,
            cell: (row) => t.cases.citizenStatus[row.citizenStatus],
          },
        ]}
      />

      <p className="text-center text-xs font-semibold text-ink-muted">
        <Link href="/cases/claim" className="underline underline-offset-2">
          {t.cases.claim.link}
        </Link>
      </p>
    </div>
  );
}
