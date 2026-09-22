"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/i18n";
import { CaseAssignmentPanel } from "../CaseAssignmentPanel";
import { CaseRoutingPanel } from "../CaseRoutingPanel";
import { publicComments } from "../status";
import type { CaseRecord } from "../types";
import { CaseDetailAttachments } from "./CaseDetailAttachments";
import { CaseDetailCitizenCommentForm } from "./CaseDetailCitizenCommentForm";
import { CaseDetailClaimBanner } from "./CaseDetailClaimBanner";
import { CaseDetailHeader } from "./CaseDetailHeader";
import { CaseDetailInstitutionPanel } from "./CaseDetailInstitutionPanel";
import { CaseDetailParticipants } from "./CaseDetailParticipants";
import { CaseDetailSummary } from "./CaseDetailSummary";
import { CaseDetailTimeline } from "./CaseDetailTimeline";
import {
  translateAuthorLabel,
  translateSystemText,
} from "../systemMessages";

type CaseDetailProps = {
  record: CaseRecord;
  mode: "citizen" | "institution";
  verifiedInstitution?: boolean;
};

export function CaseDetail({
  record,
  mode,
  verifiedInstitution = false,
}: CaseDetailProps) {
  const t = useT();
  const [body, setBody] = useState("");
  const [issuedToken, setIssuedToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(`animaps-claim-${record.id}`);
    } catch {
      return null;
    }
  });

  const publics = publicComments(record);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <CaseDetailHeader record={record} />

      {issuedToken ? (
        <CaseDetailClaimBanner
          caseId={record.id}
          token={issuedToken}
          onDismiss={() => setIssuedToken(null)}
        />
      ) : null}

      <CaseDetailSummary record={record} mode={mode} />
      <CaseDetailAttachments attachments={record.attachments} />

      <section>
        <h2 className="mb-2 text-sm font-bold text-ink">
          {t.cases.detail.publicUpdates}
        </h2>
        <CaseDetailTimeline
          items={publics.map((c) => ({
            id: c.id,
            title: translateAuthorLabel(c.authorLabel, t),
            body: translateSystemText(c.body, t),
            at: c.createdAt,
          }))}
          empty={t.cases.detail.noUpdates}
        />
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold text-ink">
          {t.cases.detail.timeline}
        </h2>
        <CaseDetailTimeline
          items={record.history.map((h) => ({
            id: h.id,
            title: h.toCitizen
              ? t.cases.citizenStatus[h.toCitizen]
              : t.cases.internalStatus[h.toStatus],
            body: translateSystemText(h.note, t),
            at: h.createdAt,
          }))}
          empty={t.cases.detail.noUpdates}
        />
      </section>

      <CaseDetailParticipants participants={record.participants} />

      {mode === "institution" ? (
        <>
          <CaseRoutingPanel
            record={record}
            verified={verifiedInstitution}
          />
          <CaseAssignmentPanel
            record={record}
            verified={verifiedInstitution}
          />
          <CaseDetailInstitutionPanel
            record={record}
            verified={verifiedInstitution}
            body={body}
            onBodyChange={setBody}
          />
        </>
      ) : (
        <CaseDetailCitizenCommentForm
          caseId={record.id}
          body={body}
          onBodyChange={setBody}
        />
      )}

      <p className="text-center text-xs text-ink-muted">
        <Link href="/cases/claim" className="underline underline-offset-2">
          {t.cases.claim.link}
        </Link>
      </p>
    </div>
  );
}
