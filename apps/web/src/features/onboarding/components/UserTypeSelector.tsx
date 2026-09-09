"use client";

import { Building2, HelpCircle, PawPrint, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SelectableCard } from "@/components/SelectableCard";
import { useT } from "@/i18n";
import {
  PUBLIC_USER_TYPES,
  type PublicUserType,
} from "@/features/user-types";

const ICONS: Record<PublicUserType, LucideIcon> = {
  PERSON: PawPrint,
  ONG: Building2,
  VETERINARY_CLINIC: Stethoscope,
  OTHER: HelpCircle,
};

const PROFILE_I18N_KEY: Record<PublicUserType, "person" | "ong" | "veterinary_clinic" | "other"> = {
  PERSON: "person",
  ONG: "ong",
  VETERINARY_CLINIC: "veterinary_clinic",
  OTHER: "other",
};

type UserTypeSelectorProps = {
  value: PublicUserType | "" | null;
  onChange: (value: PublicUserType) => void;
  compact?: boolean;
  className?: string;
};

export function UserTypeSelector({
  value,
  onChange,
  compact = false,
  className = "",
}: UserTypeSelectorProps) {
  const t = useT();

  return (
    <div
      className={[
        "grid gap-2",
        compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2",
        className,
      ].join(" ")}
      role="radiogroup"
      aria-label={t.form.profileType}
    >
      {PUBLIC_USER_TYPES.map((id) => {
        const Icon = ICONS[id];
        return (
          <SelectableCard
            key={id}
            compact={compact}
            title={t.form.profiles[PROFILE_I18N_KEY[id]]}
            icon={<Icon className="size-4" />}
            selected={value === id}
            onClick={() => onChange(id)}
          />
        );
      })}
    </div>
  );
}
