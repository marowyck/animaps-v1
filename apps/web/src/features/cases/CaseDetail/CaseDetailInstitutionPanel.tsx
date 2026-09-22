"use client";

import { FormEvent } from "react";
import { SoftGateBanner } from "@/features/institution/SoftGateBanner";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { internalComments } from "../status";
import { useCasesStore } from "../useCases";
import type { CaseRecord } from "../types";
import { CaseDetailTimeline } from "./CaseDetailTimeline";
import {
  institutionAuthorId,
  translateAuthorLabel,
  translateSystemText,
} from "../systemMessages";

type CaseDetailInstitutionPanelProps = {
  record: CaseRecord;
  verified: boolean;
  body: string;
  onBodyChange: (value: string) => void;
};

export function CaseDetailInstitutionPanel({
  record,
  verified,
  body,
  onBodyChange,
}: CaseDetailInstitutionPanelProps) {
  const t = useT();
  const { toast } = useToast();
  const { comment, markReview } = useCasesStore();
  const internals = internalComments(record);

  function onInternalNote(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const updated = comment(record.id, body, "internal", institutionAuthorId());
    if (updated) {
      onBodyChange("");
      toast({ message: t.cases.detail.commentAdded, tone: "success" });
    }
  }

  return (
    <section className="space-y-3">
      {!verified ? <SoftGateBanner /> : null}
      <h2 className="text-h4 text-text">{t.cases.detail.internalNotes}</h2>
      <CaseDetailTimeline
        items={internals.map((c) => ({
          id: c.id,
          title: translateAuthorLabel(c.authorLabel, t),
          body: translateSystemText(c.body, t),
          at: c.createdAt,
        }))}
        empty={t.cases.detail.noUpdates}
      />
      {verified ? (
        <>
          <form onSubmit={onInternalNote} className="flex flex-col gap-2">
            <Input
              label={t.cases.detail.addInternal}
              value={body}
              onChange={(e) => onBodyChange(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" size="sm" variant="primary">
                {t.cases.detail.postInternal}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  const updated = markReview(record.id);
                  if (updated) {
                    toast({
                      message: t.cases.institution.markedReview,
                      tone: "success",
                    });
                  }
                }}
              >
                {t.cases.institution.markReview}
              </Button>
            </div>
          </form>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!body.trim()) return;
              comment(record.id, body, "public", institutionAuthorId());
              onBodyChange("");
              toast({
                message: t.cases.detail.commentAdded,
                tone: "success",
              });
            }}
            className="flex flex-col gap-2 pt-1"
          >
            <p className="text-body-sm text-text-secondary">
              {t.cases.detail.publicFormHint}
            </p>
            <Button type="submit" size="sm" variant="ghost">
              {t.cases.detail.postPublic}
            </Button>
          </form>
        </>
      ) : (
        <p className="text-xs text-ink-muted">
          {t.institution.inbox.readOnlyHint}
        </p>
      )}
    </section>
  );
}
