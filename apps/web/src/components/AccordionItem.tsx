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
    <div className={`overflow-hidden rounded-[1.6rem] bg-surface ${className}`}>
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 bg-transparent px-5 py-4 text-left transition-colors duration-200 hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="text-body font-semibold leading-snug text-text md:text-body-lg">
          {question}
        </span>
        <span
          aria-hidden
          className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-(--pink-700) transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={20} strokeWidth={2.5} />
        </span>
      </button>
      <div
        id={panelId}
        ref={panelRef}
        role="region"
        aria-labelledby={buttonId}
        className="h-0 overflow-hidden"
      >
        <div ref={innerRef} className="text-body px-5 pb-5 leading-relaxed text-text-secondary">
          {children}
        </div>
      </div>
    </div>
  );
}
