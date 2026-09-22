"use client";

import {
  Building,
  Building2,
  HelpCircle,
  Landmark,
  Leaf,
  PawPrint,
  Shield,
  Stethoscope,
  Trees,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SelectableCard } from "@/components/SelectableCard";
import { useT } from "@/i18n";
import {
  INSTITUTION_TYPE_IDS,
  type InstitutionTypeId,
} from "@/features/account-types";

const ICONS: Record<InstitutionTypeId, LucideIcon> = {
  city_hall: Landmark,
  municipal_department: Building2,
  animal_welfare_department: PawPrint,
  environmental_department: Trees,
  health_department: Stethoscope,
  zoonoses_center: Shield,
  environmental_agency: Leaf,
  public_inspection: Building,
  public_partner: Building2,
  other: HelpCircle,
};

type InstitutionTypeSelectorProps = {
  value: InstitutionTypeId | "" | null;
  onChange: (value: InstitutionTypeId) => void;
  compact?: boolean;
  className?: string;
};

export function InstitutionTypeSelector({
  value,
  onChange,
  compact = false,
  className = "",
}: InstitutionTypeSelectorProps) {
  const t = useT();

  return (
    <div
      className={["grid gap-2 sm:grid-cols-2", className].join(" ")}
      role="radiogroup"
      aria-label={t.onboarding.institutionType.title}
    >
      {INSTITUTION_TYPE_IDS.map((id) => {
        const Icon = ICONS[id];
        return (
          <SelectableCard
            key={id}
            compact={compact}
            title={t.onboarding.institutionType.items[id].title}
            description={t.onboarding.institutionType.items[id].description}
            icon={<Icon className="size-4" />}
            selected={value === id}
            onClick={() => onChange(id)}
          />
        );
      })}
    </div>
  );
}
