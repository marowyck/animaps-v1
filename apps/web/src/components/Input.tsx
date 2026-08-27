import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = {
  label: string;
  error?: string;
  className?: string;
  /** Extra content after the label (e.g. hint) */
  hint?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

const fieldClass =
  "w-full rounded-full border-2 border-border-soft bg-gray-soft px-5 py-3.5 font-bold text-ink outline-none transition-colors focus:border-brand-pink focus:bg-white disabled:opacity-60";

export function Input({
  label,
  error,
  hint,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className={`block ${className}`} htmlFor={inputId}>
      <span className="mb-1.5 block text-sm font-bold text-ink">{label}</span>
      {hint ? (
        <span className="mb-1.5 block text-xs font-medium text-ink-muted">
          {hint}
        </span>
      ) : null}
      <input id={inputId} className={fieldClass} aria-invalid={!!error} {...props} />
      {error ? (
        <span className="mt-1.5 block text-sm font-bold text-red-500" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export { fieldClass as inputFieldClass };
