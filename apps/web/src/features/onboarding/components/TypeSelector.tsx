"use client";

import type { ReactNode } from "react";
import { SelectableCard } from "@/components/SelectableCard";

export type TypeOption<T extends string> = {
  id: T;
  title: string;
  description?: string;
  icon?: ReactNode;
};

type TypeSelectorProps<T extends string> = {
  options: TypeOption<T>[];
  /** Single selection. Ignored when `multi` is true. */
  value?: T | "" | null;
  onChange?: (value: T) => void;
  /** Multi selection. */
  selected?: readonly T[];
  onToggle?: (id: T) => void;
  multi?: boolean;
  ariaLabel?: string;
  compact?: boolean;
  className?: string;
  /** `pair` is two columns from `sm`. `dense` is the intention grid. */
  layout?: "pair" | "dense";
};

export function TypeSelector<T extends string>({
  options,
  value,
  onChange,
  selected,
  onToggle,
  multi = false,
  ariaLabel,
  compact = false,
  className = "",
  layout = "pair",
}: TypeSelectorProps<T>) {
  const grid =
    layout === "dense"
      ? "grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-2.5"
      : "grid grid-cols-1 gap-2 sm:grid-cols-2";

  const move = (delta: number) => {
    if (multi || options.length === 0) return;
    const ids = options.map((option) => option.id);
    const current = ids.indexOf((value ?? "") as T);
    const nextIndex = current < 0 ? 0 : (current + delta + ids.length) % ids.length;
    onChange?.(ids[nextIndex]!);
  };

  return (
    <div
      className={[grid, className].filter(Boolean).join(" ")}
      role={multi ? "group" : "radiogroup"}
      aria-label={ariaLabel}
      onKeyDown={(event) => {
        if (multi) return;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          move(1);
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          move(-1);
        }
      }}
    >
      {options.map((option, index) => {
        const isSelected = multi
          ? (selected ?? []).includes(option.id)
          : value === option.id;
        const tabIndex = multi ? undefined : isSelected || (!value && index === 0) ? 0 : -1;
        return (
          <SelectableCard
            key={option.id}
            compact={compact}
            title={option.title}
            description={option.description}
            icon={option.icon}
            selected={isSelected}
            selection={multi ? "toggle" : "radio"}
            tabIndex={tabIndex}
            onClick={() => {
              if (multi) onToggle?.(option.id);
              else onChange?.(option.id);
            }}
          />
        );
      })}
    </div>
  );
}
