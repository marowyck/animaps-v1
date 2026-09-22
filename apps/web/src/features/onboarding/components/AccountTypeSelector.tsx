"use client";

import {
  Building2,
  HelpCircle,
  Landmark,
  PawPrint,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "@/i18n";
import { ACCOUNT_TYPES, type AccountType } from "@/features/account-types";
import { TypeSelector } from "./TypeSelector";

/** Signup options: three ecosystem types + OTHER (folds into PERSON intentions). */
export const SIGNUP_ACCOUNT_OPTIONS = [
  ...ACCOUNT_TYPES,
  "OTHER",
] as const;

export type SignupAccountOption = (typeof SIGNUP_ACCOUNT_OPTIONS)[number];

const ICONS: Record<SignupAccountOption, LucideIcon> = {
  PERSON: PawPrint,
  ORGANIZATION: Building2,
  INSTITUTION: Landmark,
  OTHER: HelpCircle,
};

type AccountTypeSelectorProps = {
  value: SignupAccountOption | "" | null;
  onChange: (value: SignupAccountOption) => void;
  compact?: boolean;
  className?: string;
};

export function AccountTypeSelector({
  value,
  onChange,
  compact = false,
  className = "",
}: AccountTypeSelectorProps) {
  const t = useT();

  return (
    <TypeSelector
      compact={compact}
      className={className}
      ariaLabel={t.form.accountType}
      value={value}
      onChange={onChange}
      options={SIGNUP_ACCOUNT_OPTIONS.map((id) => {
        const Icon = ICONS[id];
        return {
          id,
          title: t.form.accountTypes[id],
          description: t.form.accountTypeHints[id],
          icon: <Icon className="size-4" />,
        };
      })}
    />
  );
}

/** Map signup option → accountType + userType for draft / waitlist. */
export function mapSignupOption(option: SignupAccountOption): {
  accountType: AccountType;
  userType: "PERSON" | "OTHER" | "INSTITUTION" | "ONG";
} {
  switch (option) {
    case "ORGANIZATION":
      return { accountType: "ORGANIZATION", userType: "ONG" };
    case "INSTITUTION":
      return { accountType: "INSTITUTION", userType: "INSTITUTION" };
    case "OTHER":
      return { accountType: "PERSON", userType: "OTHER" };
    case "PERSON":
    default:
      return { accountType: "PERSON", userType: "PERSON" };
  }
}
