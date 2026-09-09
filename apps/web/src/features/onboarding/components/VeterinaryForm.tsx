"use client";

import { Checkbox } from "@/components/Checkbox";
import { Input } from "@/components/Input";
import { SelectableCard } from "@/components/SelectableCard";
import { useT } from "@/i18n";
import { ANIMAL_TYPE_IDS, CLINIC_SERVICE_IDS } from "../data";
import type { AnimalTypePreference, VeterinaryDraft } from "../types";

type VeterinaryFormProps = {
  value: VeterinaryDraft;
  onChange: (patch: Partial<VeterinaryDraft>) => void;
  mode: "info" | "location" | "services" | "animals-served";
};

export function VeterinaryForm({
  value,
  onChange,
  mode,
}: VeterinaryFormProps) {
  const t = useT();
  const c = t.onboarding.clinic;

  if (mode === "info") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          className="col-span-2"
          compact
          label={c.tradeName}
          value={value.tradeName}
          onChange={(e) => onChange({ tradeName: e.target.value })}
        />
        <Input
          className="col-span-2"
          compact
          label={c.description}
          value={value.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
        <Input
          compact
          label={c.phone}
          value={value.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
        <Input
          compact
          label={c.email}
          type="email"
          value={value.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
        <Input
          className="col-span-2"
          compact
          label={c.website}
          value={value.website}
          onChange={(e) => onChange({ website: e.target.value })}
        />
      </div>
    );
  }

  if (mode === "location") {
    return (
      <div className="grid gap-3">
        <Input
          compact
          label={c.address}
          value={value.address}
          onChange={(e) => onChange({ address: e.target.value })}
        />
        <Input
          compact
          label={c.businessHours}
          value={value.businessHours}
          onChange={(e) => onChange({ businessHours: e.target.value })}
        />
        <Checkbox
          checked={value.is24h}
          onChange={(e) => onChange({ is24h: e.target.checked })}
          label={c.is24h}
        />
        <Checkbox
          checked={value.emergencyCare}
          onChange={(e) => onChange({ emergencyCare: e.target.checked })}
          label={c.emergencyCare}
        />
        <Checkbox
          checked={value.homeService}
          onChange={(e) => onChange({ homeService: e.target.checked })}
          label={c.homeService}
        />
      </div>
    );
  }

  if (mode === "services") {
    const toggle = (id: string) => {
      const list = value.servicesOffered;
      const next = list.includes(id)
        ? list.filter((x) => x !== id)
        : [...list, id];
      onChange({ servicesOffered: next });
    };
    return (
      <div className="grid grid-cols-2 gap-2">
        {CLINIC_SERVICE_IDS.map((id) => (
          <SelectableCard
            key={id}
            compact
            title={c.services[id]}
            selected={value.servicesOffered.includes(id)}
            onClick={() => toggle(id)}
          />
        ))}
      </div>
    );
  }

  const toggleAnimal = (id: AnimalTypePreference) => {
    const list = value.animalsServed;
    const next = list.includes(id)
      ? list.filter((x) => x !== id)
      : [...list, id];
    onChange({ animalsServed: next });
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {ANIMAL_TYPE_IDS.filter((id) => id !== "any").map((id) => (
        <SelectableCard
          key={id}
          compact
          title={t.onboarding.animalType.items[id]}
          selected={value.animalsServed.includes(id)}
          onClick={() => toggleAnimal(id)}
        />
      ))}
    </div>
  );
}
