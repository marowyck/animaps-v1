"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  tone?: "default" | "muted" | "danger";
};

const TONE: Record<NonNullable<IconButtonProps["tone"]>, string> = {
  default: "text-ink hover:bg-pastel-green/60",
  muted: "text-ink-muted hover:bg-gray-soft",
  danger: "text-error hover:bg-red-50",
};

export function IconButton({
  label,
  children,
  tone = "default",
  className = "",
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={[
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink",
        "disabled:cursor-not-allowed disabled:opacity-50",
        TONE[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
