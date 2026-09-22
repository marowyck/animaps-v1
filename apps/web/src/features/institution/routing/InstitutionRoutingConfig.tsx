"use client";

import { FormEvent, useEffect, useState } from "react";
import { MapPinned, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { CASE_TYPE_IDS } from "@/features/cases/types";
import { hasPermission } from "@/features/permissions";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { SoftGateBanner } from "../SoftGateBanner";
import { isInstitutionOperational } from "../metrics";
import { useRoutingCatalog } from "./useRoutingCatalog";
import {
  JURISDICTION_TYPES,
  type JurisdictionType,
} from "./types";

const LOCAL_INSTITUTION_ID = "local-institution";

/**
 * Configure jurisdictions, capabilities, and anonymous policy for matching.
 */
export function InstitutionRoutingConfig() {
  const t = useT();
  const { toast } = useToast();
  const { draft, userType } = useOnboarding();
  const {
    catalog,
    ensureInstitution,
    createJurisdiction,
    deleteJurisdiction,
    toggleCapability,
    patchAnonymous,
  } = useRoutingCatalog();

  const verified = isInstitutionOperational(
    draft.institutionalVerificationStatus,
  );
  const canManage =
    verified &&
    (hasPermission(userType, "MANAGE_JURISDICTION") ||
      hasPermission(userType, "MANAGE_INSTITUTION"));

  const [jurType, setJurType] = useState<JurisdictionType>("municipal");
  const [jurValue, setJurValue] = useState("");

  const label =
    draft.institution.publicName?.trim() ||
    draft.institution.officialName?.trim() ||
    draft.displayName ||
    t.institution.overview.unnamed;

  const verificationStatus =
    draft.institutionalVerificationStatus === "approved"
      ? "approved"
      : draft.institutionalVerificationStatus === "rejected"
        ? "rejected"
        : draft.institutionalVerificationStatus === "pending"
          ? "pending"
          : "pending";

  useEffect(() => {
    ensureInstitution({
      id: LOCAL_INSTITUTION_ID,
      label,
      verificationStatus,
      institutionTypeKey: draft.institutionTypeId,
    });
  }, [
    ensureInstitution,
    label,
    verificationStatus,
    draft.institutionTypeId,
  ]);

  const institution =
    catalog.institutions.find((i) => i.id === LOCAL_INSTITUTION_ID) ?? null;

  function onAddJurisdiction(e: FormEvent) {
    e.preventDefault();
    if (!canManage || !institution || !jurValue.trim()) return;
    createJurisdiction(institution.id, jurType, jurValue.trim());
    setJurValue("");
    toast({ message: t.institution.routing.jurAdded, tone: "success" });
  }

  return (
    <div className="space-y-4">
      {!verified ? <SoftGateBanner /> : null}
      {!verified ? (
        <p className="text-sm text-ink-muted">
          {t.institution.routing.readOnlyHint}
        </p>
      ) : null}

      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <MapPinned className="size-4 text-brand-green" aria-hidden />
          <h2 className="text-sm font-bold text-ink">
            {t.institution.routing.jurisdictionsTitle}
          </h2>
        </div>
        <p className="text-xs text-ink-muted">
          {t.institution.routing.jurisdictionsHint}
        </p>

        {canManage ? (
          <form onSubmit={onAddJurisdiction} className="grid gap-2 sm:grid-cols-3">
            <label className="block space-y-1">
              <span className="text-xs font-bold text-ink">
                {t.institution.routing.jurType}
              </span>
              <select
                className="w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm outline-none focus-visible:border-brand-green"
                value={jurType}
                onChange={(e) =>
                  setJurType(e.target.value as JurisdictionType)
                }
              >
                {JURISDICTION_TYPES.map((jt) => (
                  <option key={jt} value={jt}>
                    {t.institution.routing.jurTypes[jt]}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label={t.institution.routing.jurValue}
              value={jurValue}
              onChange={(e) => setJurValue(e.target.value)}
              className="sm:col-span-1"
            />
            <div className="flex items-end">
              <Button type="submit" size="sm" variant="pink">
                {t.institution.routing.addJur}
              </Button>
            </div>
          </form>
        ) : null}

        {!institution || institution.jurisdictions.length === 0 ? (
          <p className="text-xs text-ink-muted">
            {t.institution.routing.noJurs}
          </p>
        ) : (
          <ul className="divide-y divide-border-soft text-sm">
            {institution.jurisdictions.map((j) => (
              <li
                key={j.id}
                className="flex items-center justify-between gap-2 py-2"
              >
                <span>
                  <span className="font-semibold text-ink">{j.value}</span>
                  <span className="ml-2 text-xs text-ink-muted">
                    {t.institution.routing.jurTypes[j.jurisdictionType]}
                  </span>
                </span>
                {canManage ? (
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-ink-muted hover:bg-pastel-pink/40 hover:text-brand-pink"
                    aria-label={t.institution.routing.remove}
                    onClick={() => {
                      deleteJurisdiction(institution.id, j.id);
                      toast({
                        message: t.institution.routing.jurRemoved,
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

      <Card className="space-y-3 p-4">
        <h2 className="text-sm font-bold text-ink">
          {t.institution.routing.capabilitiesTitle}
        </h2>
        <p className="text-xs text-ink-muted">
          {t.institution.routing.capabilitiesHint}
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {CASE_TYPE_IDS.map((typeId) => {
            const accepted =
              institution?.capabilities.find((c) => c.caseTypeId === typeId)
                ?.accepts ?? false;
            return (
              <li key={typeId}>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={accepted}
                    disabled={!canManage || !institution}
                    onChange={(e) => {
                      if (!institution) return;
                      toggleCapability(institution.id, typeId, e.target.checked);
                    }}
                  />
                  <span>{t.cases.types[typeId].title}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="space-y-3 p-4">
        <h2 className="text-sm font-bold text-ink">
          {t.institution.routing.policyTitle}
        </h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={institution?.anonymousReports ?? true}
            disabled={!canManage || !institution}
            onChange={(e) => {
              if (!institution) return;
              patchAnonymous(institution.id, e.target.checked);
              toast({
                message: t.institution.routing.policySaved,
                tone: "success",
              });
            }}
          />
          <span>{t.institution.routing.anonymousReports}</span>
        </label>
        <p className="text-xs text-ink-muted">
          {t.institution.routing.policyHint}
        </p>
      </Card>
    </div>
  );
}
