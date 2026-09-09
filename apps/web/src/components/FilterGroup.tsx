"use client";

import type { ReactNode } from "react";

export type FilterOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

type FilterGroupProps = {
  label: string;
  options: FilterOption[];
  values: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  className?: string;
};

export function FilterGroup({
  label,
  options,
  values,
  onChange,
  multiple = true,
  className = "",
}: FilterGroupProps) {
  const toggle = (value: string) => {
    if (multiple) {
      onChange(
        values.includes(value)
          ? values.filter((v) => v !== value)
          : [...values, value],
      );
      return;
    }
    onChange(values.includes(value) ? [] : [value]);
  };

  return (
    <fieldset className={["space-y-3", className].filter(Boolean).join(" ")}>
      <legend className="text-sm font-bold text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = values.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(opt.value)}
              className={[
                "inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 px-3.5 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.96]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink",
                selected
                  ? "border-brand-green bg-brand-green text-white shadow-sm"
                  : "border-border-soft bg-white text-ink hover:border-brand-green/50 hover:bg-pastel-green/10",
              ].join(" ")}
            >
              {opt.icon}
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
