"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HelpCircle } from "lucide-react";
import { AccordionItem } from "@/components/AccordionItem";
import { useT } from "@/i18n";
import { SectionDivider } from "./SectionDivider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DISTANCE, DURATION, EASE, STAGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const FAQ_KEYS = [
  "launch",
  "free",
  "match",
  "orgs",
  "urgent",
  "data",
  "brazil",
  "app",
] as const;

export function FAQ() {
  const t = useT();
  const container = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const items = FAQ_KEYS.map((key) => t.faq.items[key]);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".faq-item", {
        scrollTrigger: { trigger: container.current, start: "top 75%", once: true },
        y: DISTANCE.small,
        opacity: 0,
        duration: DURATION.enter,
        stagger: STAGGER,
        ease: EASE.settle,
        clearProps: "transform",
      });
    },
    { scope: container, dependencies: [t.faq.title, reduced] },
  );

  return (
    <section
      id="faq"
      ref={container}
      className="relative z-10 bg-primary-soft px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="text-label mb-4 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-primary-ink">
            <HelpCircle size={14} aria-hidden /> {t.faq.eyebrow}
          </p>
          <h2 className="text-h1 text-balance text-text">{t.faq.title}</h2>
          <p className="text-body-lg mt-4 text-text-secondary">{t.faq.subtitle}</p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.q} className="faq-item">
              <AccordionItem question={item.q}>{item.a}</AccordionItem>
            </div>
          ))}
        </div>
      </div>
      <SectionDivider fill="var(--background)" />
    </section>
  );
}
