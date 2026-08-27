"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";

type CheckboxProps = {
  label: ReactNode;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className">;

export function Checkbox({
  label,
  className = "",
  id,
  checked,
  ...props
}: CheckboxProps) {
  const inputId = id ?? props.name;

  return (
    <label
      htmlFor={inputId}
      className={`group flex cursor-pointer items-start gap-3 text-sm font-medium text-ink-muted ${className}`}
    >
      <span className="relative mt-0.5 inline-flex h-6 w-6 shrink-0">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-border-soft bg-white transition-all duration-200 peer-checked:border-brand-pink peer-checked:bg-brand-pink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-pink group-hover:border-brand-pink/60"
        >
          <Check
            size={16}
            strokeWidth={3}
            className={`text-white transition-all duration-200 ${
              checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          />
        </span>
      </span>
      <span className="leading-relaxed">{label}</span>
    </label>
  );
}
