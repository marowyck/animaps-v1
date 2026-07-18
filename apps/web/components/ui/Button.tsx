"use client";

import {
  useCallback,
  useRef,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  variant?: "orange" | "blue" | "green" | "white";
  /** Magnetic hover effect — default true for CTAs; set false for compact UI (banners, forms). */
  magnetic?: boolean;
};

const variantClass = {
  orange:
    "bg-brand-orange text-white hover:bg-brand-orange-hover shadow-lg",
  blue: "bg-brand-blue text-white hover:bg-brand-blue-hover shadow-lg",
  green: "bg-brand-green text-white hover:bg-brand-green-hover shadow-lg",
  white:
    "bg-white border-4 border-gray-soft text-ink hover:border-brand-orange hover:text-brand-orange shadow-sm",
} as const;

export function Button({
  children,
  href,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "orange",
  magnetic = true,
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const handleMove = useCallback(
    (e: MouseEvent) => {
      if (!magnetic) return;
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    },
    [magnetic],
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  }, []);

  const base = `inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-black transition-[transform,background-color,border-color,color] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange disabled:opacity-60 ${variantClass[variant]}`;

  if (href) {
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        className={`${base} ${className}`}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={`${base} ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
