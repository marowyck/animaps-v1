"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  tone?: "default" | "muted" | "danger";
};

const TONE: Record<NonNullable<IconButtonProps["tone"]>, string> = {
  default: "text-text hover:bg-primary-soft",
  muted: "text-text-muted hover:bg-surface-hover",
  danger: "text-danger hover:bg-danger-soft",
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
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
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
