"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ChevronDown } from "lucide-react";
import { SelectListbox } from "./SelectListbox";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/Button";
import { useT } from "@/i18n";

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
  compact?: boolean;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  name,
  required = false,
  disabled = false,
  className = "",
  error,
  compact = false,
}: SelectProps) {
  const t = useT();
  const place = placeholder ?? t.chrome.selectPlaceholder;
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
  const displayLabel = selected?.label ?? place;

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
      /* eslint-disable react-hooks/set-state-in-effect -- sync keyboard highlight when panel opens */
      setHighlight(idx >= 0 ? idx : 0);
    } else {
      setHighlight(-1);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
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
      <span
        id={labelId}
        className="mb-1.5 block text-sm font-bold text-ink"
      >
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

      <Button
        id={buttonId}
        type="button"
        variant="field"
        size="field"
        magnetic={false}
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
        className={`${open ? "border-primary bg-surface" : ""} ${
          error ? "border-error" : ""
        } ${selected ? "text-text" : "text-text-secondary"} ${
          compact ? "!px-5 !py-3 !text-[0.95rem]" : ""
        }`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          size={20}
          strokeWidth={2.5}
          className={`shrink-0 text-brand-pink transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </Button>

      <SelectListbox
        id={listboxId}
        labelId={labelId}
        listRef={listRef}
        optionRefs={optionRefs}
        options={options}
        value={value}
        highlight={highlight}
        uid={uid}
        onSelect={selectOption}
        onHighlight={setHighlight}
      />

      {error ? (
        <span className="text-body-sm mt-1.5 block font-bold text-error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
