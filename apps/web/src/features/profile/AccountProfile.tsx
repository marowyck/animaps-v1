"use client";

import { FormEvent, useState } from "react";
import { MapPin, PawPrint } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { useToast } from "@/components/Toast";
import { Blob } from "@/components/bits";
import { InstitutionProfile } from "@/features/institution";
import { ProfileForm, useOnboarding } from "@/features/onboarding";
import type { AdditionalInfoEntry, AdditionalInfoKey } from "@/features/onboarding";
import { labelIntention, labelUserType, useT } from "@/i18n";

export function AccountProfile() {
  const { userType } = useOnboarding();
  if (userType === "INSTITUTION") {
    return <InstitutionProfile mode="profile" />;
  }
  return <UserProfile />;
}

function UserProfile() {
  const t = useT();
  const { toast } = useToast();
  const { draft, dispatch, patch, userType } = useOnboarding();
  const [name, setName] = useState(draft.displayName ?? "");
  const [tradeName, setTradeName] = useState(
    userType === "VETERINARY_CLINIC"
      ? draft.veterinary.tradeName
      : draft.organization.tradeName,
  );
  const [city, setCity] = useState(draft.organization.city);
  const [address, setAddress] = useState(draft.veterinary.address);

  function onSave(event: FormEvent) {
    event.preventDefault();
    patch({ displayName: name.trim() || null });
    if (userType === "ONG") {
      dispatch({
        type: "patchOrganization",
        patch: { tradeName, city },
      });
    }
    if (userType === "VETERINARY_CLINIC") {
      dispatch({
        type: "patchVeterinary",
        patch: { tradeName, address },
      });
    }
    toast({ message: t.profilePage.saved, tone: "success" });
  }

  const onAdditional = (key: AdditionalInfoKey, entry: AdditionalInfoEntry) => {
    dispatch({
      type: "patch",
      patch: {
        additionalInfo: { ...draft.additionalInfo, [key]: entry },
      },
    });
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <header className="relative">
        <Blob variant={0} className="absolute -top-6 -left-8 size-36 text-primary/25" />
        <div className="relative flex items-end gap-4 pt-6">
          <ProfileAvatar
            name={name || t.brand}
            size="lg"
            className="!size-20 !text-xl ring-4 ring-background"
          />
          <div className="min-w-0 pb-1">
            <h1 className="text-h1 truncate text-text">{name || t.profilePage.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-body-sm text-text-secondary">
              <MapPin className="size-4 text-(--pink-700)" aria-hidden />
              {city || address || t.profilePage.subtitle}
            </p>
          </div>
          <span className="ml-auto hidden size-14 items-center justify-center rounded-full bg-primary-soft text-(--pink-700) sm:flex">
            <PawPrint className="size-7" aria-hidden />
          </span>
        </div>
      </header>

      <form onSubmit={onSave} className="flex flex-col gap-4">
        <Input
          label={t.profilePage.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label={t.profilePage.email}
          value={draft.email ?? ""}
          readOnly
        />
        <p className="text-sm text-ink-muted">
          {t.profilePage.type}: {userType ? labelUserType(t, userType) : t.userTypes.unknown}
        </p>

        {userType === "ONG" ? (
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-ink">
              {t.profilePage.orgSection}
            </legend>
            <Input
              label={t.onboarding.organization.tradeName}
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
            />
            <Input
              label={t.onboarding.organization.city}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </fieldset>
        ) : null}

        {userType === "VETERINARY_CLINIC" ? (
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-ink">
              {t.profilePage.clinicSection}
            </legend>
            <Input
              label={t.onboarding.clinic.tradeName}
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
            />
            <Input
              label={t.onboarding.clinic.address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </fieldset>
        ) : null}

        <Button type="submit" variant="pink" size="sm">
          {t.profilePage.save}
        </Button>
      </form>

      {userType === "PERSON" || userType === "OTHER" ? (
        <section className="space-y-3">
          <h2 className="text-h4 text-text">{t.profilePage.intentions}</h2>
          {draft.intentions.length === 0 ? (
            <p className="text-body-sm text-text-secondary">{t.profilePage.emptyIntentions}</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {draft.intentions.map((id, index) => (
                <li
                  key={id}
                  className={[
                    "rounded-full px-3 py-1 text-caption font-semibold",
                    ["bg-primary-soft text-(--pink-700)", "bg-success-soft text-(--mint-700)", "bg-warning-soft text-(--honey-700)", "bg-secondary-soft text-(--lilac-700)"][
                      index % 4
                    ],
                  ].join(" ")}
                >
                  {labelIntention(t, id)}
                </li>
              ))}
            </ul>
          )}
          <ProfileForm values={draft.additionalInfo} onSave={onAdditional} />
        </section>
      ) : null}
    </div>
  );
}
