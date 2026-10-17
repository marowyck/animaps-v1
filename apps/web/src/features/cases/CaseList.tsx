"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/StateBlocks";
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
      <EmptyState
        illustration="bird"
        title={emptyTitle ?? t.cases.list.emptyTitle}
        description={
          emptyDescription ??
          (mode === "institution"
            ? t.cases.list.emptyInstitution
            : t.cases.list.emptyCitizen)
        }
        action={
          canCreate ? (
            <Button href="/cases/new" variant="primary" size="sm">
              {t.cases.list.createCta}
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
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
            id: "title",
            header: t.cases.create.typeLabel,
            cell: (row) =>
              row.title && row.title !== row.caseTypeId
                ? row.title
                : t.cases.types[row.caseTypeId].title,
            className: "font-semibold",
          },
          {
            id: "ref",
            header: "#",
            cell: (row) => row.referenceNumber,
            className: "text-text-muted tabular-nums",
          },
          {
            id: "place",
            header: t.cases.create.city,
            cell: (row) =>
              row.location.city
                ? `${row.location.city}/${row.location.state}`
                : "—",
          },
          {
            id: "status",
            header: t.cases.detail.citizenStatus,
            cell: (row) => (
              <Badge
                tone={
                  row.citizenStatus === "resolved"
                    ? "success"
                    : row.citizenStatus === "in_progress" ||
                        row.citizenStatus === "under_analysis"
                      ? "primary"
                      : "info"
                }
              >
                {t.cases.citizenStatus[row.citizenStatus]}
              </Badge>
            ),
          },
        ]}
      />

      <p className="pt-2 text-center text-caption font-semibold text-text-muted">
        <Link href="/cases/claim" className="text-primary-ink underline underline-offset-2">
          {t.cases.claim.link}
        </Link>
      </p>
    </div>
  );
}
