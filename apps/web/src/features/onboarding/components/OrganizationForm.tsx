"use client";

import { Checkbox } from "@/components/Checkbox";
import { Input } from "@/components/Input";
import { SelectableCard } from "@/components/SelectableCard";
import { useT } from "@/i18n";
import { ANIMAL_TYPE_IDS } from "../data";
import type { AnimalTypePreference, OrganizationDraft } from "../types";

type OrganizationFormProps = {
  value: OrganizationDraft;
  onChange: (patch: Partial<OrganizationDraft>) => void;
  mode: "info" | "location" | "animal-types" | "services";
};

export function OrganizationForm({
  value,
  onChange,
  mode,
}: OrganizationFormProps) {
  const t = useT();
  const o = t.onboarding.organization;

  if (mode === "info") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          className="col-span-2"
          compact
          label={o.tradeName}
          value={value.tradeName}
          onChange={(e) => onChange({ tradeName: e.target.value })}
        />
        <Input
          className="col-span-2"
          compact
          label={o.description}
          value={value.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
        <Input
          compact
          label={o.email}
          type="email"
          value={value.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
        <Input
          compact
          label={o.phone}
          value={value.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
        <Input
          className="col-span-2"
          compact
          label={o.website}
          value={value.website}
          onChange={(e) => onChange({ website: e.target.value })}
        />
        <Input
          compact
          label={o.instagram}
          value={value.socialLinks.instagram}
          onChange={(e) =>
            onChange({
              socialLinks: { ...value.socialLinks, instagram: e.target.value },
            })
          }
        />
        <Input
          compact
          label={o.facebook}
          value={value.socialLinks.facebook}
          onChange={(e) =>
            onChange({
              socialLinks: { ...value.socialLinks, facebook: e.target.value },
            })
          }
        />
      </div>
    );
  }

  if (mode === "location") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          compact
          label={o.city}
          value={value.city}
          onChange={(e) => onChange({ city: e.target.value })}
        />
        <Input
          compact
          label={o.state}
          value={value.state}
          onChange={(e) => onChange({ state: e.target.value })}
        />
        <Input
          className="col-span-2"
          compact
          label={o.areaOfOperation}
          value={value.areaOfOperation}
          onChange={(e) => onChange({ areaOfOperation: e.target.value })}
        />
      </div>
    );
  }

  if (mode === "animal-types") {
    const toggle = (id: AnimalTypePreference) => {
      const list = value.animalTypesServed;
      const next = list.includes(id)
        ? list.filter((x) => x !== id)
        : [...list, id];
      onChange({ animalTypesServed: next });
    };
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ANIMAL_TYPE_IDS.filter((id) => id !== "any").map((id) => (
          <SelectableCard
            key={id}
            compact
            title={t.onboarding.animalType.items[id]}
            selected={value.animalTypesServed.includes(id)}
            onClick={() => toggle(id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Checkbox
        checked={value.hasShelter}
        onChange={(e) => onChange({ hasShelter: e.target.checked })}
        label={o.hasShelter}
      />
      <Checkbox
        checked={value.doesAdoptions}
        onChange={(e) => onChange({ doesAdoptions: e.target.checked })}
        label={o.doesAdoptions}
      />
      <Checkbox
        checked={value.doesRescues}
        onChange={(e) => onChange({ doesRescues: e.target.checked })}
        label={o.doesRescues}
      />
      <Checkbox
        checked={value.acceptsVolunteers}
        onChange={(e) => onChange({ acceptsVolunteers: e.target.checked })}
        label={o.acceptsVolunteers}
      />
      <Checkbox
        checked={value.acceptsDonations}
        onChange={(e) => onChange({ acceptsDonations: e.target.checked })}
        label={o.acceptsDonations}
      />
    </div>
  );
}
