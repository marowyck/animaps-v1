"use client";

import type { ReactNode } from "react";

type InterestTagProps = {
  label: string;
  icon?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function InterestTag({
  label,
  icon,
  selected = false,
  disabled = false,
  onClick,
}: InterestTagProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 px-3.5 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.96]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink",
        selected
          ? "border-brand-pink bg-brand-pink text-white shadow-sm"
          : "border-border-soft bg-white text-ink hover:border-brand-pink/40 hover:bg-pastel-pink/10",
        disabled && !selected ? "cursor-not-allowed opacity-40 hover:scale-100 hover:shadow-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      {label}
    </button>
  );
}
