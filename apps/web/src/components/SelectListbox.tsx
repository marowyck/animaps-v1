"use client";

import type { RefObject } from "react";
import { Check } from "lucide-react";

type SelectListOption = {
  value: string;
  label: string;
};

type SelectListboxProps = {
  id: string;
  labelId: string;
  listRef: RefObject<HTMLUListElement | null>;
  optionRefs: RefObject<Array<HTMLLIElement | null>>;
  options: SelectListOption[];
  value: string;
  highlight: number;
  uid: string;
  onSelect: (value: string) => void;
  onHighlight: (index: number) => void;
};

export function SelectListbox({
  id,
  labelId,
  listRef,
  optionRefs,
  options,
  value,
  highlight,
  uid,
  onSelect,
  onHighlight,
}: SelectListboxProps) {
  return (
    <ul
      id={id}
      ref={listRef}
      role="listbox"
      aria-labelledby={labelId}
      tabIndex={-1}
      className="absolute left-0 right-0 z-50 mt-2 origin-top scale-[0.98] rounded-2xl border border-border bg-surface-elevated p-1.5 opacity-0 shadow-lg"
      style={{ pointerEvents: "none" }}
    >
      {options.map((opt, index) => {
        const isSelected = opt.value === value;
        const isHighlighted = index === highlight;
        return (
          <li
            key={opt.value}
            ref={(el) => {
              optionRefs.current[index] = el;
            }}
            role="option"
            aria-selected={isSelected}
            id={`${uid}-option-${index}`}
            onClick={() => onSelect(opt.value)}
            onMouseEnter={() => onHighlight(index)}
            className={[
              "flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-body-sm font-semibold transition-colors duration-(--duration-fast)",
              isHighlighted || isSelected
                ? "bg-primary-soft text-primary-ink"
                : "bg-transparent text-text",
            ].join(" ")}
          >
            <span>{opt.label}</span>
            {isSelected ? <Check size={18} strokeWidth={2.5} aria-hidden /> : null}
          </li>
        );
      })}
    </ul>
  );
}
