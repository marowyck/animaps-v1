"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Input } from "@/components/Input";
import { SelectableCard } from "@/components/SelectableCard";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import type { PublicUserType } from "@/features/user-types";
import { CASE_TYPE_CATALOG } from "./catalog";
import { useCasesStore } from "./useCases";
import type {
  CaseSource,
  CaseTypeId,
  ReporterVisibility,
} from "./types";

type CaseCreateFormProps = {
  userType: PublicUserType;
  reporterEmail: string | null;
};

function sourceFor(userType: PublicUserType): CaseSource {
  if (userType === "ONG") return "ngo";
  if (userType === "VETERINARY_CLINIC") return "veterinary";
  if (userType === "INSTITUTION") return "institution";
  return "citizen";
}

export function CaseCreateForm({
  userType,
  reporterEmail,
}: CaseCreateFormProps) {
  const t = useT();
  const { toast } = useToast();
  const router = useRouter();
  const { create } = useCasesStore();

  const [caseTypeId, setCaseTypeId] = useState<CaseTypeId | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [attachmentName, setAttachmentName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!caseTypeId || !description.trim() || !city.trim() || !state.trim()) {
      toast({ message: t.cases.errors.required, tone: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const visibility: ReporterVisibility = anonymous
        ? "anonymous"
        : "restricted";
      const { record, claimToken } = create({
        caseTypeId,
        title,
        description,
        location: { city, state, neighborhood, precision: "city" },
        reporterVisibility: visibility,
        source: sourceFor(userType),
        reporterEmail: anonymous ? null : reporterEmail,
        reporterId: anonymous ? null : reporterEmail,
        anonymous,
        attachmentNames: attachmentName.trim()
          ? [attachmentName.trim()]
          : [],
      });

      if (claimToken) {
        toast({
          message: t.cases.claim.tokenIssued.replace("{token}", claimToken),
          tone: "success",
        });
        try {
          sessionStorage.setItem(`animaps-claim-${record.id}`, claimToken);
        } catch {
          /* ignore */
        }
      } else {
        toast({ message: t.cases.create.success, tone: "success" });
      }
      router.push(`/cases/${record.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-2xl flex-col gap-5">
      <div>
        <h1 className="font-display text-3xl text-ink">{t.cases.create.title}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t.cases.create.subtitle}</p>
        <p className="mt-2 rounded-2xl border border-border-soft bg-white px-3 py-2 text-xs font-semibold text-ink-muted">
          {t.cases.create.honesty}
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-bold text-ink">
          {t.cases.create.typeLabel}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {CASE_TYPE_CATALOG.map((meta) => (
            <SelectableCard
              key={meta.id}
              compact
              title={t.cases.types[meta.id].title}
              description={t.cases.types[meta.id].description}
              selected={caseTypeId === meta.id}
              onClick={() => setCaseTypeId(meta.id)}
            />
          ))}
        </div>
      </fieldset>

      <Input
        label={t.cases.create.titleLabel}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="block space-y-1.5">
        <span className="text-xs font-bold text-ink">
          {t.cases.create.descriptionLabel}
        </span>
        <textarea
          className="min-h-28 w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:border-brand-green"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label={t.cases.create.city}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <Input
          label={t.cases.create.state}
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
        <Input
          className="sm:col-span-2"
          label={t.cases.create.neighborhood}
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
        />
      </div>

      <Input
        label={t.cases.create.attachment}
        value={attachmentName}
        onChange={(e) => setAttachmentName(e.target.value)}
        placeholder="foto-animal.jpg"
      />

      <Checkbox
        checked={anonymous}
        onChange={(e) => setAnonymous(e.target.checked)}
        label={t.cases.create.anonymous}
      />

      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="pink" disabled={submitting}>
          {submitting ? t.common.loading : t.cases.create.submit}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/cases")}
        >
          {t.cases.create.cancel}
        </Button>
      </div>
    </form>
  );
}
