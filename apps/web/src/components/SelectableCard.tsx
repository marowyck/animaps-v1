"use client";

import type { ReactNode } from "react";

type SelectableCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
  /** `radio` inside a radiogroup; `toggle` keeps aria-pressed. */
  selection?: "toggle" | "radio";
  tabIndex?: number;
};

export function SelectableCard({
  title,
  description,
  icon,
  selected = false,
  disabled = false,
  onClick,
  className = "",
  compact = false,
  selection = "toggle",
  tabIndex,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      role={selection === "radio" ? "radio" : undefined}
      aria-pressed={selection === "toggle" ? selected : undefined}
      aria-checked={selection === "radio" ? selected : undefined}
      tabIndex={tabIndex}
      onClick={onClick}
      className={[
        "group flex w-full cursor-pointer flex-col text-left transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 active:scale-[0.98]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        compact ? "gap-1 rounded-[1.25rem] border p-2.5 sm:p-3" : "gap-2 rounded-[1.5rem] border p-4",
        selected
          ? "border-transparent bg-primary-soft shadow-sm"
          : "border-transparent bg-surface hover:bg-surface-hover",
        disabled ? "cursor-not-allowed opacity-50 hover:border-border-soft hover:bg-white" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon ? (
        <span
          className={[
            "inline-flex items-center justify-center rounded-full",
            compact ? "size-8 text-base" : "size-11 text-xl",
            selected ? "bg-surface text-(--pink-700)" : "bg-background text-text",
          ].join(" ")}
          aria-hidden
        >
          {icon}
        </span>
      ) : null}
      <span className={["font-bold text-ink", compact ? "text-sm" : "text-base"].join(" ")}>
        {title}
      </span>
      {description ? (
        <span
          className={[
            "leading-snug text-ink-muted",
            compact ? "text-xs line-clamp-2" : "text-sm",
          ].join(" ")}
        >
          {description}
        </span>
      ) : null}
    </button>
  );
}
