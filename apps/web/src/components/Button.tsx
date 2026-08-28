"use client";

import {
  useCallback,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export type ButtonVariant =
  | "pink"
  | "orange"
  | "blue"
  | "green"
  | "white"
  | "ink"
  | "soft"
  | "ghost"
  | "segment"
  | "field";

export type ButtonSize = "md" | "sm" | "xs" | "icon" | "stretch" | "field";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  magnetic?: boolean;
  /** Active state for `segment` (e.g. locale pills). */
  selected?: boolean;
  /** Surface behind `segment` pills. */
  tone?: "light" | "dark";
  className?: string;
  disabled?: boolean;
};

type AsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "disabled"> & {
    href?: undefined;
  };

type AsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

export type ButtonProps = AsButton | AsLink;

const FILL = {
  pink: { base: "bg-brand-pink text-white", fill: "bg-brand-pink-hover", textHover: "" },
  orange: { base: "bg-brand-pink text-white", fill: "bg-brand-pink-hover", textHover: "" },
  blue: { base: "bg-brand-blue text-white", fill: "bg-brand-blue-hover", textHover: "" },
  green: { base: "bg-brand-green text-white", fill: "bg-brand-green-hover", textHover: "" },
  white: {
    base: "bg-white border-2 border-brand-green/45 text-ink",
    fill: "bg-brand-green",
    textHover: "group-hover:text-white",
  },
} as const;

const SIZE: Record<ButtonSize, string> = {
  md: "min-h-12 min-w-[13.5rem] justify-center px-6 py-3 text-base font-semibold",
  sm: "min-h-11 justify-center px-4 py-2.5 text-sm font-bold tracking-tight sm:px-5 sm:text-[0.95rem]",
  xs: "min-h-9 justify-center px-2.5 text-xs font-bold tracking-wide",
  icon: "size-11 shrink-0 justify-center p-0",
  stretch: "w-full justify-between gap-4 px-6 py-5 text-left text-base font-black",
  field: "w-full justify-between gap-3 rounded-full border-2 px-5 py-3.5 text-left font-bold",
};

function isFillVariant(
  variant: ButtonVariant,
): variant is keyof typeof FILL {
  return variant in FILL;
}

function skinClasses(
  variant: ButtonVariant,
  selected: boolean,
  tone: "light" | "dark",
): { base: string; fill?: string; textHover?: string; useFill: boolean } {
  if (isFillVariant(variant)) {
    const skin = FILL[variant];
    return { ...skin, useFill: true };
  }

  switch (variant) {
    case "ink":
      return {
        base: "bg-ink text-white shadow-none hover:scale-105 active:scale-95",
        useFill: false,
      };
    case "soft":
      return {
        base: selected
          ? "bg-brand-green text-white shadow-none hover:bg-brand-green-hover active:scale-95"
          : "bg-pastel-green text-brand-green shadow-none hover:scale-105 hover:bg-brand-green hover:text-white active:scale-95",
        useFill: false,
      };
    case "ghost":
      return {
        base: "bg-transparent text-ink shadow-none",
        useFill: false,
      };
    case "segment":
      if (tone === "dark") {
        return {
          base: selected
            ? "bg-brand-pink text-white shadow-sm"
            : "bg-transparent text-white/55 hover:text-white/85",
          useFill: false,
        };
      }
      return {
        base: selected
          ? "bg-brand-pink text-white shadow-sm"
          : "bg-transparent text-ink-muted hover:bg-white hover:text-ink",
        useFill: false,
      };
    case "field":
      return {
        base: "border-border-soft bg-gray-soft text-ink shadow-none outline-none focus:border-brand-pink focus:bg-white",
        useFill: false,
      };
    default:
      return { base: "", useFill: false };
  }
}

export function Button({
  children,
  href,
  className = "",
  disabled = false,
  variant = "pink",
  size = "md",
  magnetic,
  selected = false,
  tone = "light",
  ...rest
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);

  const resolvedSize = variant === "field" && size === "md" ? "field" : size;
  const skin = skinClasses(variant, selected, tone);
  /** Magnetic pull is optional; fill hover stays on for fill variants. */
  const magneticOn = magnetic ?? false;
  const showFill = skin.useFill && resolvedSize === "md";

  const handleMove = useCallback(
    (e: MouseEvent) => {
      if (!magneticOn || reduced || disabled) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    },
    [magneticOn, reduced, disabled],
  );

  const handleEnter = useCallback(
    (e: MouseEvent) => {
      setHovered(true);
      if (!showFill || reduced || disabled) return;
      const fill = fillRef.current;
      if (!fill) return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      gsap.set(fill, { clipPath: `circle(0% at ${x}% ${y}%)` });
      gsap.to(fill, {
        clipPath: `circle(150% at ${x}% ${y}%)`,
        duration: 0.45,
        ease: "power2.out",
      });
    },
    [showFill, reduced, disabled],
  );

  const handleLeave = useCallback(() => {
    setHovered(false);
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
    if (!showFill || reduced) return;
    const fill = fillRef.current;
    if (!fill) return;
    gsap.to(fill, {
      clipPath: "circle(0% at 50% 50%)",
      duration: 0.35,
      ease: "power2.in",
    });
  }, [showFill, reduced]);

  const base = [
    "group relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full transition-[transform,background-color,box-shadow,color,border-color] duration-200 ease-out",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink",
    "disabled:cursor-not-allowed disabled:opacity-60",
    showFill || skin.useFill ? "shadow-md" : "",
    variant === "pink" && resolvedSize === "sm"
      ? "shadow-[0_6px_16px_-4px_rgba(224,122,150,0.55)] hover:scale-[1.03] hover:bg-brand-pink-hover hover:shadow-[0_8px_20px_-4px_rgba(224,122,150,0.65)] active:scale-[0.98]"
      : "",
    variant === "white"
      ? "hover:border-brand-green hover:bg-brand-green hover:text-white"
      : "",
    SIZE[resolvedSize],
    skin.base,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {showFill ? (
        <span
          ref={fillRef}
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-0 ${skin.fill}`}
          style={{ clipPath: "circle(0% at 50% 50%)" }}
        />
      ) : null}
      <span
        className={`relative z-10 inline-flex items-center gap-2 ${
          resolvedSize === "stretch" || resolvedSize === "field"
            ? "w-full justify-between"
            : ""
        } ${variant === "white" && hovered ? "text-white" : ""} ${skin.textHover ?? ""}`}
      >
        {children}
      </span>
    </>
  );

  const motionHandlers = {
    onMouseMove: handleMove,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
  };

  if (href) {
    const { onClick, ...anchorRest } = rest as Omit<
      AsLink,
      keyof SharedProps | "href"
    >;
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        className={base}
        aria-disabled={disabled || undefined}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
        {...motionHandlers}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as Omit<
    AsButton,
    keyof SharedProps
  >;
  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={base}
      {...motionHandlers}
      {...buttonRest}
    >
      {content}
    </button>
  );
}
