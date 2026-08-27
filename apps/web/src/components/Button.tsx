"use client";

import {
  useCallback,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  variant?: "pink" | "orange" | "blue" | "green" | "white";
  magnetic?: boolean;
};

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

export function Button({
  children,
  href,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "pink",
  magnetic = true,
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);
  const skin = FILL[variant];

  const handleMove = useCallback(
    (e: MouseEvent) => {
      if (!magnetic || reduced) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    },
    [magnetic, reduced],
  );

  const handleEnter = useCallback(
    (e: MouseEvent) => {
      setHovered(true);
      const fill = fillRef.current;
      if (!fill || reduced) return;
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
    [reduced],
  );

  const handleLeave = useCallback(() => {
    setHovered(false);
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
    const fill = fillRef.current;
    if (!fill || reduced) return;
    gsap.to(fill, {
      clipPath: "circle(0% at 50% 50%)",
      duration: 0.35,
      ease: "power2.in",
    });
  }, [reduced]);

  const base = `group relative inline-flex min-h-12 min-w-[13.5rem] items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-base font-semibold shadow-md transition-transform duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:opacity-60 ${skin.base} ${className}`;

  const content = (
    <>
      <span
        ref={fillRef}
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 ${skin.fill}`}
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      />
      <span
        className={`relative z-10 inline-flex items-center gap-2 ${
          variant === "white" && hovered ? "text-white" : ""
        } ${skin.textHover}`}
      >
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        className={base}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={base}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
