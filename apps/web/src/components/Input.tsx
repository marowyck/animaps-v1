"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  "w-full rounded-full border-2 border-border-soft bg-gray-soft px-5 py-3.5 font-bold text-ink outline-none transition-colors focus:border-brand-pink focus:bg-white disabled:opacity-60";

const fieldClassCompact =
  "w-full rounded-full border-2 border-border-soft bg-gray-soft px-5 py-3 text-[0.95rem] font-bold text-ink outline-none transition-colors focus:border-brand-pink focus:bg-white disabled:opacity-60";

export function Input({
  label,
  error,
  hint,
  className = "",
  compact = false,
  revealable = false,
  revealLabel = "Show password",
  hideLabel = "Hide password",
  id,
  type,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  const [revealed, setRevealed] = useState(false);
  const canReveal = revealable && type === "password";
  const inputType = canReveal && revealed ? "text" : type;

  return (
    <div className={`block ${className}`}>
      <label
        className="mb-1.5 block text-sm font-bold text-ink"
        htmlFor={inputId}
      >
        {label}
      </label>
      {hint ? (
        <span className="mb-1.5 block text-xs font-medium text-ink-muted">
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
            className="absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white/80 hover:text-ink"
            aria-label={revealed ? hideLabel : revealLabel}
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
        <span className="mt-1 block text-xs font-bold text-red-500" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export { fieldClass as inputFieldClass };
