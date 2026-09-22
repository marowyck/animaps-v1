"use client";

import {
  Building2,
  HelpCircle,
  Hospital,
  PawPrint,
  Stethoscope,
  Store,
  Tent,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "@/i18n";
import { TypeSelector } from "./TypeSelector";
import {
  ORGANIZATION_TYPES,
  type OrganizationType,
} from "@/features/account-types";

const ICONS: Record<OrganizationType, LucideIcon> = {
  NGO: PawPrint,
  ANIMAL_SHELTER: Tent,
  VETERINARY_CLINIC: Stethoscope,
  VETERINARY_HOSPITAL: Hospital,
  ANIMAL_BUSINESS: Store,
  ANIMAL_SERVICE: Wrench,
  PRIVATE_INSTITUTION: Building2,
  OTHER: HelpCircle,
};

type OrganizationTypeSelectorProps = {
  value: OrganizationType | "" | null;
  onChange: (value: OrganizationType) => void;
  compact?: boolean;
  className?: string;
};

export function OrganizationTypeSelector({
  value,
  onChange,
  compact = false,
  className = "",
}: OrganizationTypeSelectorProps) {
  const t = useT();

  return (
    <TypeSelector
      compact={compact}
      className={className}
      ariaLabel={t.onboarding.organizationType.title}
      value={value}
      onChange={onChange}
      options={ORGANIZATION_TYPES.map((id) => {
        const Icon = ICONS[id];
        return {
          id,
          title: t.onboarding.organizationType.items[id].title,
          description: t.onboarding.organizationType.items[id].description,
          icon: <Icon className="size-4" />,
        };
      })}
    />
  );
}
