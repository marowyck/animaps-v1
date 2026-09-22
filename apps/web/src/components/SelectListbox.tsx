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
      className="absolute left-0 right-0 z-50 mt-2 origin-top scale-90 rounded-[1.75rem] border-2 border-border-soft bg-white/95 p-2 opacity-0 shadow-xl backdrop-blur-xl"
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
              "flex cursor-pointer items-center justify-between gap-3 rounded-full px-4 py-3 text-body-sm font-bold transition-colors",
              isHighlighted || isSelected
                ? "bg-primary-soft text-primary"
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
