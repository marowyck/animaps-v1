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
        "flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-border-soft bg-white px-4 py-3.5 text-left transition-all duration-200 active:scale-[0.98]",
        "hover:border-brand-green/45 hover:bg-pastel-green/20 hover:shadow-sm",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none",
      ].join(" ")}
    >
      <span className="min-w-0">
        <span className="block text-sm font-bold text-ink">{label}</span>
        <span
          className={[
            "mt-0.5 block truncate text-sm",
            value?.trim() ? "text-ink-muted" : "text-ink-muted/80",
          ].join(" ")}
        >
          {display}
        </span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-ink-muted" aria-hidden />
    </button>
  );
}
