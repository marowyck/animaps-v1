"use client";

import { Building2, HelpCircle, Landmark, PawPrint, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "@/i18n";
import { TypeSelector } from "./TypeSelector";
import {
  PUBLIC_USER_TYPES,
  type PublicUserType,
} from "@/features/user-types";

const ICONS: Record<PublicUserType, LucideIcon> = {
  PERSON: PawPrint,
  ONG: Building2,
  VETERINARY_CLINIC: Stethoscope,
  OTHER: HelpCircle,
  INSTITUTION: Landmark,
};

const PROFILE_I18N_KEY: Record<
  PublicUserType,
  "person" | "ong" | "veterinary_clinic" | "other" | "institution"
> = {
  PERSON: "person",
  ONG: "ong",
  VETERINARY_CLINIC: "veterinary_clinic",
  OTHER: "other",
  INSTITUTION: "institution",
};

type UserTypeSelectorProps = {
  value: PublicUserType | "" | null;
  onChange: (value: PublicUserType) => void;
  compact?: boolean;
  className?: string;
};

/** Legacy Wave 2 selector — prefer `AccountTypeSelector` for new signup UI. */
export function UserTypeSelector({
  value,
  onChange,
  compact = false,
  className = "",
}: UserTypeSelectorProps) {
  const t = useT();

  return (
    <TypeSelector
      compact={compact}
      className={className}
      ariaLabel={t.form.profileType}
      value={value}
      onChange={onChange}
      options={PUBLIC_USER_TYPES.map((id) => {
        const Icon = ICONS[id];
        return {
          id,
          title: t.form.profiles[PROFILE_I18N_KEY[id]],
          icon: <Icon className="size-4" />,
        };
      })}
    />
  );
}
