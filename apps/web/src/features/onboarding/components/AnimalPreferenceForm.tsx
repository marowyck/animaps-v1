"use client";

import {
  Bird,
  Cat,
  Dog,
  HelpCircle,
  PawPrint,
  Rabbit,
  Snail,
  TreePine,
  Turtle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FilterGroup } from "@/components/FilterGroup";
import { SelectableCard } from "@/components/SelectableCard";
import { useT } from "@/i18n";
import {
  ANIMAL_SIZE_IDS,
  ANIMAL_TYPE_IDS,
  FILTER_OPTION_IDS,
} from "../data";
import type {
  AnimalFilterPreferences,
  AnimalSizePreference,
  AnimalTypePreference,
} from "../types";

const TYPE_ICONS: Record<AnimalTypePreference, LucideIcon> = {
  dog: Dog,
  cat: Cat,
  rabbit: Rabbit,
  bird: Bird,
  small_pets: Snail,
  reptiles: Turtle,
  horses: TreePine,
  other: HelpCircle,
  any: PawPrint,
};

type AnimalPreferenceFormProps = {
  animalTypes: AnimalTypePreference[];
  animalSizes: AnimalSizePreference[];
  animalFilters: AnimalFilterPreferences;
  onToggleType: (id: AnimalTypePreference) => void;
  onToggleSize: (id: AnimalSizePreference) => void;
  onChangeFilters: (filters: AnimalFilterPreferences) => void;
  showFilters?: boolean;
};

export function AnimalPreferenceForm({
  animalTypes,
  animalSizes,
  animalFilters,
  onToggleType,
  onToggleSize,
  onChangeFilters,
  showFilters = true,
}: AnimalPreferenceFormProps) {
  const t = useT();

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-sm font-bold text-ink">
          {t.onboarding.animalType.title}
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {ANIMAL_TYPE_IDS.map((id) => {
            const Icon = TYPE_ICONS[id];
            return (
              <SelectableCard
                key={id}
                compact
                title={t.onboarding.animalType.items[id]}
                icon={<Icon className="size-4" />}
                selected={animalTypes.includes(id)}
                onClick={() => onToggleType(id)}
              />
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-ink">
          {t.onboarding.animalSize.title}
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ANIMAL_SIZE_IDS.map((id) => (
            <SelectableCard
              key={id}
              compact
              title={t.onboarding.animalSize.items[id]}
              selected={animalSizes.includes(id)}
              onClick={() => onToggleSize(id)}
            />
          ))}
        </div>
      </section>

      {showFilters ? (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-ink">
            {t.onboarding.preferences.title}
          </h2>
          {(
            Object.keys(FILTER_OPTION_IDS) as Array<
              keyof typeof FILTER_OPTION_IDS
            >
          ).map((group) => (
            <FilterGroup
              key={group}
              label={t.onboarding.preferences.groups[group]}
              values={animalFilters[group]}
              onChange={(next) =>
                onChangeFilters({ ...animalFilters, [group]: next })
              }
              options={FILTER_OPTION_IDS[group].map((id) => ({
                value: id,
                label: t.onboarding.preferences.options[id] ?? id,
              }))}
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}
