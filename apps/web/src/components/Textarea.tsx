"use client";

import type { TextareaHTMLAttributes } from "react";

type TextareaProps = {
  label: string;
  error?: string;
  className?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;

export function Textarea({ label, error, className = "", id, ...props }: TextareaProps) {
  const fieldId = id ?? props.name;
  return (
    <label className={`block ${className}`} htmlFor={fieldId}>
      <span className="mb-1.5 block text-body-sm font-semibold text-text">{label}</span>
      <textarea
        id={fieldId}
        className="min-h-28 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-body text-text outline-none transition-[border-color,box-shadow] duration-150 focus:border-primary focus:bg-surface focus:shadow-[0_0_0_4px_var(--primary-soft)] disabled:opacity-50 aria-[invalid=true]:border-danger"
        aria-invalid={!!error}
        {...props}
      />
      {error ? (
        <span className="mt-1.5 block text-caption font-semibold text-danger" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
