"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { VerificationStatusBadge } from "@/components/VerificationStatusBadge";
import { useToast } from "@/components/Toast";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { SoftGateBanner } from "./SoftGateBanner";
import { isInstitutionOperational } from "./metrics";

type InstitutionProfileProps = {
  mode?: "profile" | "settings";
};

export function InstitutionProfile({
  mode = "profile",
}: InstitutionProfileProps) {
  const t = useT();
  const { toast } = useToast();
  const { draft, dispatch } = useOnboarding();
  const inst = draft.institution;
  const verified = isInstitutionOperational(
    draft.institutionalVerificationStatus,
  );
  const [officialName, setOfficialName] = useState(inst.officialName);
  const [publicName, setPublicName] = useState(inst.publicName);
  const [description, setDescription] = useState(inst.description);
  const [email, setEmail] = useState(inst.email);
  const [emailDomain, setEmailDomain] = useState(inst.emailDomain);
  const [phone, setPhone] = useState(inst.phone);
  const [website, setWebsite] = useState(inst.website);
  const [responsibleDepartment, setResponsibleDepartment] = useState(
    inst.responsibleDepartment,
  );
  const [dataResponsibleArea, setDataResponsibleArea] = useState(
    inst.dataResponsibleArea,
  );

  const status = draft.institutionalVerificationStatus;
  const copy = t.institution.profile;

  function onSave(e: FormEvent) {
    e.preventDefault();
    dispatch({
      type: "patchInstitution",
      patch: {
        officialName,
        publicName,
        description,
        email,
        emailDomain,
        phone,
        website,
        responsibleDepartment,
        dataResponsibleArea,
      },
    });
    toast({ message: copy.saved, tone: "success" });
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">
            {mode === "settings" ? copy.settingsTitle : copy.title}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {mode === "settings" ? copy.settingsSubtitle : copy.subtitle}
          </p>
        </div>
        <VerificationStatusBadge
          status={status}
          label={t.onboarding.verification.status[status]}
        />
      </header>

      {!verified ? <SoftGateBanner /> : null}

      <Card className="space-y-2 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
          {copy.typeLabel}
        </p>
        <p className="font-bold text-ink">
          {draft.institutionTypeId
            ? t.onboarding.institutionType.items[draft.institutionTypeId]
                .title
            : copy.typeUnknown}
        </p>
      </Card>

      <form onSubmit={onSave} className="flex flex-col gap-4">
        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-ink">
            {copy.sectionIdentity}
          </legend>
          <Input
            label={copy.officialName}
            value={officialName}
            onChange={(e) => setOfficialName(e.target.value)}
          />
          <Input
            label={copy.publicName}
            value={publicName}
            onChange={(e) => setPublicName(e.target.value)}
          />
          <Input
            label={copy.description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-ink">
            {copy.sectionContact}
          </legend>
          <Input
            label={copy.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label={copy.emailDomain}
            value={emailDomain}
            onChange={(e) => setEmailDomain(e.target.value)}
          />
          <Input
            label={copy.phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label={copy.website}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-ink">
            {copy.sectionOps}
          </legend>
          <Input
            label={copy.responsibleDepartment}
            value={responsibleDepartment}
            onChange={(e) => setResponsibleDepartment(e.target.value)}
          />
          <Input
            label={copy.dataResponsibleArea}
            value={dataResponsibleArea}
            onChange={(e) => setDataResponsibleArea(e.target.value)}
          />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-ink">
            {copy.sectionJurisdiction}
          </legend>
          <p className="text-xs text-ink-muted">{copy.jurisdictionHint}</p>
          <Button href="/routing" size="sm" variant="ghost">
            {t.institution.routing.openConfig}
          </Button>
        </fieldset>

        <Button type="submit" variant="pink">
          {copy.save}
        </Button>
      </form>

      {mode === "settings" ? (
        <Card className="space-y-2 p-4">
          <h2 className="text-sm font-bold text-ink">{copy.policyTitle}</h2>
          <p className="text-sm text-ink-muted">{copy.policyBody}</p>
        </Card>
      ) : null}
    </div>
  );
}
