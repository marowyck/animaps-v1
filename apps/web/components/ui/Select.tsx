"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Check, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
};

const HOVER_COLORS = [
  { bg: "#FFE4C4", text: "#F89D1C" },
  { bg: "#D4EEF9", text: "#00A0E3" },
  { bg: "#D8F0C8", text: "#68BC45" },
  { bg: "#F0D4EE", text: "#92278F" },
  { bg: "#FFF4B8", text: "#333333" },
];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecione…",
  name,
  required = false,
  disabled = false,
  className = "",
  error,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const uid = useId();
  const labelId = `${uid}-label`;
  const listboxId = `${uid}-listbox`;
  const buttonId = `${uid}-button`;

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected?.label ?? placeholder;

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;

      if (prefersReducedMotion()) {
        gsap.set(list, {
          opacity: open ? 1 : 0,
          scale: open ? 1 : 0.9,
          pointerEvents: open ? "auto" : "none",
        });
        return;
      }

      if (open) {
        gsap.fromTo(
          list,
          { opacity: 0, scale: 0.9, y: -8 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.35,
            ease: "back.out(1.5)",
            pointerEvents: "auto",
          },
        );
        gsap.fromTo(
          optionRefs.current.filter(Boolean),
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.05,
          },
        );
      } else {
        gsap.to(list, {
          opacity: 0,
          scale: 0.9,
          y: -8,
          duration: 0.2,
          ease: "power2.in",
          pointerEvents: "none",
        });
      }
    },
    { dependencies: [open] },
  );

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === value);
      setHighlight(idx >= 0 ? idx : 0);
    } else {
      setHighlight(-1);
    }
  }, [open, options, value]);

  const selectOption = useCallback(
    (optValue: string) => {
      onChange(optValue);
      setOpen(false);
    },
    [onChange],
  );

  function onTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
      case "Enter":
      case " ":
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else if (e.key === "Enter" || e.key === " ") {
          if (highlight >= 0 && options[highlight]) {
            selectOption(options[highlight].value);
          }
        } else if (e.key === "ArrowDown") {
          setHighlight((h) => Math.min(h + 1, options.length - 1));
        } else if (e.key === "ArrowUp") {
          setHighlight((h) => Math.max(h - 1, 0));
        }
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setHighlight(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setHighlight(options.length - 1);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (open && highlight >= 0) {
      optionRefs.current[highlight]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlight, open]);

  return (
    <div ref={rootRef} className={`relative block ${className}`}>
      <span id={labelId} className="mb-1.5 block text-sm font-bold text-ink">
        {label}
        {required ? <span className="sr-only"> (obrigatório)</span> : null}
      </span>

      {/* Hidden native input for form semantics / required validation */}
      {name ? (
        <input
          type="hidden"
          name={name}
          value={value}
          required={required}
          readOnly
        />
      ) : null}

      <button
        id={buttonId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby={labelId}
        aria-required={required}
        aria-invalid={!!error}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        className={`flex w-full items-center justify-between gap-3 rounded-full border-2 bg-gray-soft px-5 py-3.5 text-left font-bold outline-none transition-colors focus:border-brand-orange focus:bg-white disabled:opacity-60 ${
          open ? "border-brand-orange bg-white" : "border-border-soft"
        } ${error ? "border-red-400" : ""} ${
          selected ? "text-ink" : "text-ink-muted"
        }`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          size={20}
          strokeWidth={2.5}
          className={`shrink-0 text-brand-orange transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      <ul
        id={listboxId}
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
          const colors = HOVER_COLORS[index % HOVER_COLORS.length];

          return (
            <li
              key={opt.value}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              role="option"
              aria-selected={isSelected}
              id={`${uid}-option-${index}`}
              onClick={() => selectOption(opt.value)}
              onMouseEnter={() => setHighlight(index)}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-full px-4 py-3 text-sm font-bold transition-colors"
              style={{
                backgroundColor: isHighlighted
                  ? colors.bg
                  : isSelected
                    ? "var(--pastel-orange)"
                    : "transparent",
                color: isHighlighted
                  ? colors.text
                  : isSelected
                    ? "var(--brand-orange)"
                    : "var(--ink)",
              }}
            >
              <span>{opt.label}</span>
              {isSelected ? (
                <Check size={18} strokeWidth={2.5} aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ul>

      {error ? (
        <span className="mt-1.5 block text-sm font-bold text-red-500" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
