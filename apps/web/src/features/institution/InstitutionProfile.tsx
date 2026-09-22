"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
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
  const [city, setCity] = useState(inst.city);
  const [stateName, setStateName] = useState(inst.state);

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
        city,
        state: stateName,
      },
    });
    toast({ message: copy.saved, tone: "success" });
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h1 text-text">
            {mode === "settings" ? copy.settingsTitle : copy.title}
          </h1>
          <p className="mt-2 max-w-xl text-body-sm text-text-secondary">
            {mode === "settings" ? copy.settingsSubtitle : copy.subtitle}
          </p>
        </div>
        <VerificationStatusBadge
          status={status}
          label={t.onboarding.verification.status[status]}
        />
      </header>

      {!verified ? <SoftGateBanner /> : null}

      <p className="text-body-sm text-text-secondary">
        <span className="font-semibold text-text">{copy.typeLabel}: </span>
        {draft.institutionTypeId
          ? t.onboarding.institutionType.items[draft.institutionTypeId].title
          : copy.typeUnknown}
      </p>

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
          <Input
            label={copy.city}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Input
            label={copy.state}
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
          />
          <Button href="/routing" size="sm" variant="ghost">
            {t.institution.routing.openConfig}
          </Button>
        </fieldset>

        <Button type="submit" variant="primary">
          {copy.save}
        </Button>
      </form>

      {mode === "settings" ? (
        <section className="space-y-2 border-t border-border-subtle pt-5">
          <h2 className="text-h4 text-text">{copy.policyTitle}</h2>
          <p className="max-w-xl text-body-sm text-text-secondary">{copy.policyBody}</p>
        </section>
      ) : null}
    </div>
  );
}
