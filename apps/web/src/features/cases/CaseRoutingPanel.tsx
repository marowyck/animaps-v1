"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useToast } from "@/components/Toast";
import { useRoutingCatalog } from "@/features/institution/routing/useRoutingCatalog";
import { matchInstitutions } from "@/features/institution/routing/matcher";
import { hasPermission } from "@/features/permissions";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import type { CaseRecord, CaseRoutingReason } from "./types";
import { CASE_ROUTING_REASONS } from "./types";
import { useCasesStore } from "./useCases";
import { translateSystemText } from "./systemMessages";

type CaseRoutingPanelProps = {
  record: CaseRecord;
  verified: boolean;
};

/** Routing hops + matcher (Fase 7). Never claims external government filing. */
export function CaseRoutingPanel({ record, verified }: CaseRoutingPanelProps) {
  const t = useT();
  const { toast } = useToast();
  const { draft, userType } = useOnboarding();
  const { runRouting, forward } = useCasesStore();
  const { catalog } = useRoutingCatalog();

  const canRoute =
    verified &&
    (hasPermission(userType, "ROUTE_CASE") ||
      hasPermission(userType, "MANAGE_INSTITUTION"));
  const canForward =
    verified &&
    (hasPermission(userType, "FORWARD_CASE") ||
      hasPermission(userType, "ROUTE_CASE") ||
      hasPermission(userType, "MANAGE_INSTITUTION"));

  const [forwardToId, setForwardToId] = useState("");
  const [forwardReason, setForwardReason] =
    useState<CaseRoutingReason>("no_competence");
  const [forwardNote, setForwardNote] = useState("");

  const preview = useMemo(
    () =>
      matchInstitutions({
        location: record.location,
        caseTypeId: record.caseTypeId,
        anonymous: record.reporterVisibility === "anonymous",
        institutions: catalog.institutions,
      }),
    [record, catalog.institutions],
  );

  const otherInstitutions = catalog.institutions.filter(
    (i) =>
      i.verificationStatus === "approved" &&
      i.id !== record.routings.at(-1)?.toInstitutionId,
  );

  const currentLabel =
    draft.institution.publicName?.trim() ||
    draft.institution.officialName?.trim() ||
    draft.displayName ||
    t.institution.overview.unnamed;

  function onRunMatcher() {
    if (!canRoute) return;
    const updated = runRouting(record.id);
    if (!updated) return;
    const routed = updated.routings.some((r) => Boolean(r.toInstitutionLabel));
    toast({
      message: routed ? t.cases.routing.matched : t.cases.routing.noMatch,
      tone: routed ? "success" : "warning",
    });
  }

  function onForward(e: FormEvent) {
    e.preventDefault();
    if (!canForward || !forwardToId) return;
    const dest = catalog.institutions.find((i) => i.id === forwardToId);
    if (!dest) return;
    const updated = forward(record.id, {
      toInstitutionId: dest.id,
      toInstitutionLabel: dest.label,
      fromInstitutionId: "local-institution",
      fromInstitutionLabel: currentLabel,
      reason: forwardReason,
      note: forwardNote || null,
    });
    if (updated) {
      setForwardNote("");
      toast({ message: t.cases.routing.forwarded, tone: "success" });
    }
  }

  return (
    <Card className="space-y-3 p-4">
      <h2 className="text-sm font-bold text-ink">{t.cases.routing.title}</h2>
      <p className="text-xs text-ink-muted">{t.cases.routing.hint}</p>

      {record.routings.length === 0 ? (
        <p className="text-xs font-semibold text-ink-muted">
          {t.cases.routing.empty}
        </p>
      ) : (
        <ul className="divide-y divide-border-soft text-sm">
          {record.routings.map((r) => (
            <li key={r.id} className="py-2">
              <p className="font-semibold text-ink">
                {r.toInstitutionLabel ?? "—"}
              </p>
              <p className="text-xs text-ink-muted">
                {t.cases.routing.reasons[r.reason]}
                {r.fromInstitutionLabel
                  ? ` · ${t.cases.routing.from} ${r.fromInstitutionLabel}`
                  : ""}
                {r.note ? ` · ${translateSystemText(r.note, t)}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-2xl border border-border-soft bg-white/80 px-3 py-2 text-xs text-ink-muted">
        <p className="font-bold text-ink">{t.cases.routing.preview}</p>
        <p className="mt-1">
          {preview.status === "matched"
            ? t.cases.routing.previewMatch.replace(
                "{name}",
                preview.winner.institution.label,
              )
            : preview.status === "ambiguous"
              ? t.cases.routing.previewAmbiguous
              : t.cases.routing.previewNone}
        </p>
      </div>

      {canRoute ? (
        <Button type="button" size="sm" variant="pink" onClick={onRunMatcher}>
          {t.cases.routing.runMatcher}
        </Button>
      ) : !verified ? (
        <p className="text-xs text-ink-muted">{t.cases.routing.softGate}</p>
      ) : (
        <p className="text-xs text-ink-muted">{t.cases.routing.noPermission}</p>
      )}

      {canForward && otherInstitutions.length > 0 ? (
        <form
          onSubmit={onForward}
          className="space-y-2 border-t border-border-soft pt-3"
        >
          <p className="text-xs font-bold text-ink">
            {t.cases.routing.forwardTitle}
          </p>
          <label className="block space-y-1">
            <span className="text-xs font-bold text-ink">
              {t.cases.routing.forwardTo}
            </span>
            <select
              className="w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm outline-none focus-visible:border-brand-green"
              value={forwardToId}
              onChange={(e) => setForwardToId(e.target.value)}
            >
              <option value="">{t.cases.routing.none}</option>
              {otherInstitutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold text-ink">
              {t.cases.routing.forwardReason}
            </span>
            <select
              className="w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm outline-none focus-visible:border-brand-green"
              value={forwardReason}
              onChange={(e) =>
                setForwardReason(e.target.value as CaseRoutingReason)
              }
            >
              {CASE_ROUTING_REASONS.filter((r) => r !== "initial").map((r) => (
                <option key={r} value={r}>
                  {t.cases.routing.reasons[r]}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold text-ink">
              {t.cases.routing.forwardNote}
            </span>
            <input
              className="w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm outline-none focus-visible:border-brand-green"
              value={forwardNote}
              onChange={(e) => setForwardNote(e.target.value)}
            />
          </label>
          <Button type="submit" size="sm" variant="ghost">
            {t.cases.routing.forwardSubmit}
          </Button>
        </form>
      ) : null}
    </Card>
  );
}
