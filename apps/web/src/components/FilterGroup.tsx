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
      <legend className="text-body-sm font-semibold text-text">{label}</legend>
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
                "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-body-sm font-semibold transition-[background-color,border-color,color,scale] duration-(--duration-fast) ease-(--ease-out) active:scale-[0.98]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                selected
                  ? "border-transparent bg-success-soft text-success-ink"
                  : "border-border bg-surface text-text-secondary hover:border-success/40 hover:text-text",
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
