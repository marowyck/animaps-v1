"use client";

import {
  Building2,
  HelpCircle,
  Landmark,
  PawPrint,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SelectableCard } from "@/components/SelectableCard";
import { useT } from "@/i18n";
import { ACCOUNT_TYPES, type AccountType } from "@/features/account-types";

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
    <div
      className={[
        "grid gap-2",
        compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2",
        className,
      ].join(" ")}
      role="radiogroup"
      aria-label={t.form.accountType}
    >
      {SIGNUP_ACCOUNT_OPTIONS.map((id) => {
        const Icon = ICONS[id];
        return (
          <SelectableCard
            key={id}
            compact={compact}
            title={t.form.accountTypes[id]}
            description={t.form.accountTypeHints[id]}
            icon={<Icon className="size-4" />}
            selected={value === id}
            onClick={() => onChange(id)}
          />
        );
      })}
    </div>
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
