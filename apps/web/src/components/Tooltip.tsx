"use client";

import type { ReactNode } from "react";

type TooltipProps = {
  /** Text revealed on hover and keyboard focus. */
  label: string;
  children: ReactNode;
  className?: string;
};

/**
 * Lightweight tooltip. The label is already exposed to assistive tech through
 * the child's own accessible name, so the bubble is decorative (`aria-hidden`)
 * and only appears for pointer and keyboard users.
 */
export function Tooltip({ label, children, className = "" }: TooltipProps) {
  return (
    <span className={["group/tip relative inline-flex", className].join(" ")}>
      {children}
      <span
        role="presentation"
        aria-hidden
        className={[
          "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2",
          "rounded-xl bg-text px-2.5 py-1 text-caption font-semibold whitespace-nowrap text-surface-elevated shadow-md",
          "opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100",
          "group-focus-within/tip:opacity-100",
        ].join(" ")}
      >
        {label}
      </span>
    </span>
  );
}
