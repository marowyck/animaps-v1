"use client";

import { FormEvent } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { useCasesStore } from "../useCases";
import { reporterAuthorId } from "../systemMessages";

type CaseDetailCitizenCommentFormProps = {
  caseId: string;
  body: string;
  onBodyChange: (value: string) => void;
};

export function CaseDetailCitizenCommentForm({
  caseId,
  body,
  onBodyChange,
}: CaseDetailCitizenCommentFormProps) {
  const t = useT();
  const { toast } = useToast();
  const { comment } = useCasesStore();

  function onPublicComment(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const updated = comment(caseId, body, "public", reporterAuthorId());
    if (updated) {
      onBodyChange("");
      toast({ message: t.cases.detail.commentAdded, tone: "success" });
    }
  }

  return (
    <form onSubmit={onPublicComment} className="flex flex-col gap-2">
      <Input
        label={t.cases.detail.addComment}
        value={body}
        onChange={(e) => onBodyChange(e.target.value)}
      />
      <Button type="submit" size="sm" variant="primary">
        {t.cases.detail.postComment}
      </Button>
    </form>
  );
}
