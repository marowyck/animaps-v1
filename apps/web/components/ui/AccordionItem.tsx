"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type AccordionItemProps = {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AccordionItem({
  question,
  children,
  defaultOpen = false,
  className = "",
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const buttonId = `${uid}-button`;
  const panelId = `${uid}-panel`;

  useGSAP(
    () => {
      const panel = panelRef.current;
      const inner = innerRef.current;
      if (!panel || !inner) return;

      if (prefersReducedMotion()) {
        panel.style.height = open ? "auto" : "0px";
        return;
      }

      if (open) {
        gsap.fromTo(
          panel,
          { height: 0 },
          {
            height: inner.offsetHeight,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              panel.style.height = "auto";
            },
          },
        );
      } else {
        const current = panel.offsetHeight || inner.offsetHeight;
        gsap.fromTo(
          panel,
          { height: current },
          { height: 0, duration: 0.3, ease: "power2.in" },
        );
      }
    },
    { dependencies: [open] },
  );

  return (
    <div
      className={`overflow-hidden rounded-[2rem] border-2 border-border-soft bg-white shadow-sm transition-colors ${
        open ? "border-brand-orange/40" : ""
      } ${className}`}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
      >
        <span className="text-base font-black leading-snug text-ink md:text-lg">
          {question}
        </span>
        <span
          aria-hidden
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pastel-orange text-brand-orange transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={22} strokeWidth={2.5} />
        </span>
      </button>
      <div
        id={panelId}
        ref={panelRef}
        role="region"
        aria-labelledby={buttonId}
        className="h-0 overflow-hidden"
      >
        <div
          ref={innerRef}
          className="px-6 pb-6 text-base font-bold leading-relaxed text-ink-muted"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
