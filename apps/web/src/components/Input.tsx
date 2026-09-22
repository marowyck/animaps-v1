"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useT } from "@/i18n";

type InputProps = {
  label: string;
  error?: string;
  className?: string;
  /** Denser padding/labels for auth split panels. */
  compact?: boolean;
  /** Extra content after the label (e.g. hint) */
  hint?: ReactNode;
  /**
   * When `type="password"`, show an eye toggle to reveal/hide the value.
   * Requires `revealLabel` / `hideLabel` for accessibility.
   */
  revealable?: boolean;
  revealLabel?: string;
  hideLabel?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-body text-text outline-none transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-text-muted focus:border-primary focus:bg-surface focus:shadow-[0_0_0_4px_var(--primary-soft)] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger";

const fieldClassCompact =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-body-sm text-text outline-none transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-text-muted focus:border-primary focus:bg-surface focus:shadow-[0_0_0_4px_var(--primary-soft)] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger";

export function Input({
  label,
  error,
  hint,
  className = "",
  compact = false,
  revealable = false,
  revealLabel,
  hideLabel,
  id,
  type,
  ...props
}: InputProps) {
  const t = useT();
  const showLabel = revealLabel ?? t.chrome.showPassword;
  const concealLabel = hideLabel ?? t.chrome.hidePassword;
  const inputId = id ?? props.name;
  const [revealed, setRevealed] = useState(false);
  const canReveal = revealable && type === "password";
  const inputType = canReveal && revealed ? "text" : type;

  return (
    <div className={`block ${className}`}>
      <label
        className="mb-1.5 block text-body-sm font-semibold text-text"
        htmlFor={inputId}
      >
        {label}
      </label>
      {hint ? (
        <span className="mb-1.5 block text-caption text-text-muted">
          {hint}
        </span>
      ) : null}
      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          className={`${compact ? fieldClassCompact : fieldClass} ${
            canReveal ? "pr-12" : ""
          }`}
          aria-invalid={!!error}
          {...props}
        />
        {canReveal ? (
          <button
            type="button"
            className="absolute top-1/2 right-1.5 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-hover hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={revealed ? concealLabel : showLabel}
            aria-pressed={revealed}
            onClick={() => setRevealed((v) => !v)}
          >
            {revealed ? (
              <EyeOff size={18} strokeWidth={2.25} aria-hidden />
            ) : (
              <Eye size={18} strokeWidth={2.25} aria-hidden />
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <span className="mt-1.5 block text-caption font-semibold text-danger" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export { fieldClass as inputFieldClass };
