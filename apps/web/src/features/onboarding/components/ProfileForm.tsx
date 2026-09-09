"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { FormSection } from "@/components/FormSection";
import { Modal } from "@/components/Modal";
import {
  PrivacySelector,
  type PrivacyVisibility,
} from "@/components/PrivacySelector";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { ADDITIONAL_INFO_KEYS } from "../data";
import type { AdditionalInfoEntry, AdditionalInfoKey } from "../types";

type ProfileFormProps = {
  values: Partial<Record<AdditionalInfoKey, AdditionalInfoEntry>>;
  onSave: (key: AdditionalInfoKey, entry: AdditionalInfoEntry) => void;
  keys?: AdditionalInfoKey[];
};

export function ProfileForm({
  values,
  onSave,
  keys = ADDITIONAL_INFO_KEYS,
}: ProfileFormProps) {
  const t = useT();
  const { toast } = useToast();
  const [active, setActive] = useState<AdditionalInfoKey | null>(null);
  const [visibility, setVisibility] = useState<PrivacyVisibility>("matches");

  const open = (key: AdditionalInfoKey) => {
    setActive(key);
    setVisibility(values[key]?.visibility ?? "matches");
  };

  const saveValue = (value: string) => {
    if (!active) return;
    onSave(active, { value, visibility });
    toast({ message: t.onboarding.profile.stubSaved, tone: "success" });
    setActive(null);
  };

  const options = active
    ? (t.onboarding.profile.stubOptions[active] ?? [])
    : [];

  return (
    <>
      <div className="space-y-2">
        {keys.map((key) => (
          <FormSection
            key={key}
            label={t.onboarding.profile.sections[key]}
            value={values[key]?.value}
            placeholder={t.onboarding.select}
            onClick={() => open(key)}
          />
        ))}
      </div>

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={
          active
            ? t.onboarding.profile.sections[active]
            : t.onboarding.profile.title
        }
        footer={
          <PrivacySelector
            value={visibility}
            onChange={setVisibility}
            groupLabel={t.onboarding.profile.privacy.group}
            labels={{
              public: t.onboarding.profile.privacy.public,
              matches: t.onboarding.profile.privacy.matches,
              private: t.onboarding.profile.privacy.private,
            }}
          />
        }
      >
        <div className="flex flex-col gap-2">
          {options.map((opt) => (
            <Button
              key={opt}
              variant="soft"
              size="sm"
              className="w-full justify-center"
              onClick={() => saveValue(opt)}
            >
              {opt}
            </Button>
          ))}
        </div>
      </Modal>
    </>
  );
}
