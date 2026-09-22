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
        scrollTrigger: { trigger: container.current, start: "top 75%" },
        y: 20,
        opacity: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: "power2.out",
      });
    },
    { scope: container, dependencies: [t.faq.title, reduced] },
  );

  return (
    <section
      id="faq"
      ref={container}
      className="relative z-10 bg-pastel-pink px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <div className="text-label mb-4 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-(--pink-700)">
            <HelpCircle size={14} /> {t.faq.eyebrow}
          </div>
          <h2 className="text-h1 text-text">
            {t.faq.title}
          </h2>
          <p className="text-body mt-4 text-text-secondary">{t.faq.subtitle}</p>
        </div>

        <div className="space-y-4">
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
