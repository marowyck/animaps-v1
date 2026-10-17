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
        "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-body-sm font-semibold transition-[background-color,border-color,color,scale] duration-(--duration-fast) ease-(--ease-out) active:scale-[0.98]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        selected
          ? "border-transparent bg-primary-soft text-primary-ink"
          : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-text",
        disabled && !selected ? "cursor-not-allowed opacity-40 active:scale-100" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      {label}
    </button>
  );
}
