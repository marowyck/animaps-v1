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
}: SelectableCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={[
        "group flex w-full cursor-pointer flex-col text-left transition-all duration-200 active:scale-[0.98]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink",
        compact ? "gap-1 rounded-2xl border-2 p-2.5 sm:p-3" : "gap-2 rounded-3xl border-2 p-4",
        selected
          ? "border-brand-pink bg-pastel-pink/70 shadow-md"
          : "border-border-soft bg-white hover:border-brand-green/50 hover:bg-pastel-green/30",
        disabled ? "cursor-not-allowed opacity-50 hover:border-border-soft hover:bg-white" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon ? (
        <span
          className={[
            "inline-flex items-center justify-center rounded-2xl",
            compact ? "size-8 text-base" : "size-11 text-xl",
            selected ? "bg-brand-pink/15 text-brand-pink" : "bg-gray-soft text-ink",
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
