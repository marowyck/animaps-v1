"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DURATION, EASE } from "@/lib/motion";

type AccordionItemProps = {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

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
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const panel = panelRef.current;
      const inner = innerRef.current;
      if (!panel || !inner) return;

      if (reducedMotion) {
        panel.style.height = open ? "auto" : "0px";
        return;
      }

      if (open) {
        gsap.fromTo(
          panel,
          { height: 0 },
          {
            height: inner.offsetHeight,
            duration: DURATION.state + 0.16,
            ease: EASE.settle,
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
          { height: 0, duration: DURATION.state, ease: EASE.exit },
        );
      }
    },
    { dependencies: [open, reducedMotion] },
  );

  return (
    <div className={`overflow-hidden rounded-[1.6rem] bg-surface ${className}`}>
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 bg-transparent px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="text-body font-semibold leading-snug text-text md:text-body-lg">
          {question}
        </span>
        <span
          aria-hidden
          className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-ink transition-transform duration-300 ${
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
