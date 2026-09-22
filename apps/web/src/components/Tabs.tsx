"use client";

import type { ReactNode } from "react";

export type TabItem<T extends string> = {
  id: T;
  label: ReactNode;
};

type TabsProps<T extends string> = {
  tabs: readonly TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
};

/**
 * Pill tab bar. Visual sibling of `Button variant="segment"`, but a real
 * tablist with arrow-key navigation so it can be reused across screens.
 */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  ariaLabel,
  className = "",
}: TabsProps<T>) {
  const move = (from: number, delta: number) => {
    const next = (from + delta + tabs.length) % tabs.length;
    onChange(tabs[next]!.id);
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={[
        "inline-flex flex-wrap gap-1 rounded-full bg-background-secondary p-1",
        className,
      ].join(" ")}
    >
      {tabs.map((tab, index) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                move(index, 1);
              } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                move(index, -1);
              }
            }}
            className={[
              "cursor-pointer rounded-full px-4 py-2 text-body-sm font-semibold transition-colors duration-150",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              selected
                ? "bg-primary text-surface-elevated shadow-sm"
                : "text-text-secondary hover:bg-surface hover:text-text",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
