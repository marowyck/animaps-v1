"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { useCasesStore } from "./useCases";

type CaseClaimFormProps = {
  defaultEmail?: string | null;
};

export function CaseClaimForm({ defaultEmail }: CaseClaimFormProps) {
  const t = useT();
  const { toast } = useToast();
  const router = useRouter();
  const { claim } = useCasesStore();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token.trim() || !email.trim()) {
      toast({ message: t.cases.errors.required, tone: "error" });
      return;
    }
    setSubmitting(true);
    try {
      const record = claim(token, email);
      if (!record) {
        toast({ message: t.cases.claim.notFound, tone: "error" });
        return;
      }
      toast({ message: t.cases.claim.success, tone: "success" });
      router.push(`/cases/${record.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex max-w-md flex-col gap-4"
    >
      <div>
        <h1 className="text-h1 text-text">{t.cases.claim.title}</h1>
        <p className="mt-2 text-body-sm text-text-secondary">{t.cases.claim.subtitle}</p>
      </div>
      <Input
        label={t.cases.claim.token}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        autoComplete="off"
        required
      />
      <Input
        label={t.cases.claim.email}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? t.common.loading : t.cases.claim.submit}
        </Button>
        <Button type="button" variant="ghost" href="/cases">
          {t.cases.detail.back}
        </Button>
      </div>
    </form>
  );
}
