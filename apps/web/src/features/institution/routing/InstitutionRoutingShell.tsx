"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";
import { useCasesStore } from "@/features/cases";
import { hasPermission } from "@/features/permissions";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { MetricTile } from "../MetricTile";
import { SoftGateBanner } from "../SoftGateBanner";
import { WorkspaceHeader } from "../WorkspaceHeader";
import { isInstitutionOperational } from "../metrics";
import { InstitutionRoutingConfig } from "./InstitutionRoutingConfig";
import { useRoutingCatalog } from "./useRoutingCatalog";

/** Routing queue + jurisdiction/capability config (Fase 7). */
export function InstitutionRoutingShell() {
  const t = useT();
  const { toast } = useToast();
  const { draft, userType } = useOnboarding();
  const { cases, runRouting } = useCasesStore();
  const { ensureInstitution } = useRoutingCatalog();

  const verified = isInstitutionOperational(
    draft.institutionalVerificationStatus,
  );
  const canRoute =
    verified &&
    (hasPermission(userType, "ROUTE_CASE") ||
      hasPermission(userType, "MANAGE_INSTITUTION"));

  const label =
    draft.institution.publicName?.trim() ||
    draft.institution.officialName?.trim() ||
    draft.displayName ||
    t.institution.overview.unnamed;

  useEffect(() => {
    ensureInstitution({
      id: "local-institution",
      label,
      verificationStatus:
        draft.institutionalVerificationStatus === "approved"
          ? "approved"
          : "pending",
      institutionTypeKey: draft.institutionTypeId,
    });
  }, [
    ensureInstitution,
    label,
    draft.institutionalVerificationStatus,
    draft.institutionTypeId,
  ]);

  const awaiting = useMemo(
    () =>
      cases.filter(
        (c) =>
          c.citizenStatus === "awaiting_routing" ||
          (c.routings.length === 0 && c.status === "new"),
      ),
    [cases],
  );

  const routed = useMemo(
    () => cases.filter((c) => c.routings.some((r) => Boolean(r.toInstitutionLabel))),
    [cases],
  );

  return (
    <div className="space-y-5">
      <WorkspaceHeader
        title={t.institution.routing.title}
        subtitle={t.institution.routing.subtitle}
      />

      {!verified ? <SoftGateBanner /> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <MetricTile
          label={t.institution.routing.awaitingLabel}
          value={awaiting.length}
          tone={2}
        />
        <MetricTile
          label={t.institution.routing.routedLabel}
          value={routed.length}
          tone={3}
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-h4 text-text">
          {t.institution.routing.queueTitle}
        </h2>
        {awaiting.length === 0 ? (
          <p className="text-xs text-ink-muted">{t.institution.routing.queueEmpty}</p>
        ) : (
          <ul className="divide-y divide-border-soft text-sm">
            {awaiting.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2"
              >
                <div>
                  <Link
                    href={`/cases/${c.id}`}
                    className="font-bold text-ink underline-offset-2 hover:underline"
                  >
                    {c.referenceNumber}
                  </Link>
                  <p className="text-xs text-ink-muted">
                    {c.location.city || "—"}
                    {c.location.state ? ` / ${c.location.state}` : ""} ·{" "}
                    {t.cases.types[c.caseTypeId].title}
                  </p>
                </div>
                {canRoute ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const updated = runRouting(c.id);
                      const ok = updated?.routings.some((r) =>
                        Boolean(r.toInstitutionLabel),
                      );
                      toast({
                        message: ok
                          ? t.cases.routing.matched
                          : t.cases.routing.noMatch,
                        tone: ok ? "success" : "warning",
                      });
                    }}
                  >
                    {t.institution.routing.runForCase}
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <InstitutionRoutingConfig />
    </div>
  );
}
