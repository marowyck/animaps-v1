"use client";

import { ChevronRight } from "lucide-react";

type FormSectionProps = {
  label: string;
  value?: string | null;
  placeholder?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function FormSection({
  label,
  value,
  placeholder = "Select",
  onClick,
  disabled = false,
}: FormSectionProps) {
  const display = value?.trim() ? value : placeholder;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 text-left transition-[background-color,border-color] duration-(--duration-fast) ease-(--ease-out)",
        "hover:border-primary/40 hover:bg-surface-hover",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
      ].join(" ")}
    >
      <span className="min-w-0">
        <span className="block text-body-sm font-semibold text-text">{label}</span>
        <span
          className={[
            "mt-0.5 block truncate text-body-sm",
            value?.trim() ? "text-text-secondary" : "text-text-muted",
          ].join(" ")}
        >
          {display}
        </span>
      </span>
      <ChevronRight
        className="size-5 shrink-0 text-text-muted transition-[translate] duration-(--duration-fast) ease-(--ease-out) group-hover:translate-x-0.5"
        aria-hidden
      />
    </button>
  );
}
