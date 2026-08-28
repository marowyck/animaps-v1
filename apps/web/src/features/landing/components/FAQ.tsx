"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HelpCircle } from "lucide-react";
import { AccordionItem } from "@/components/AccordionItem";
import { useT } from "@/i18n";
import { SectionDivider } from "./SectionDivider";

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
  const items = FAQ_KEYS.map((key) => t.faq.items[key]);

  useGSAP(
    () => {
      gsap.from(".faq-item", {
        scrollTrigger: { trigger: container.current, start: "top 75%" },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(1.5)",
      });
    },
    { scope: container, dependencies: [t.faq.title] },
  );

  return (
    <section
      id="faq"
      ref={container}
      className="relative z-10 bg-pastel-pink px-4 pt-20 pb-10 md:pt-24 md:pb-12"
    >
      <SectionDivider fill="#ffffff" position="top" />

      <div className="relative z-10 mx-auto max-w-3xl pt-10 md:pt-12">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-pink">
            <HelpCircle size={14} /> {t.faq.eyebrow}
          </div>
          <h2 className="font-display text-3xl tracking-tight text-ink md:text-4xl">
            {t.faq.title}
          </h2>
          <p className="mt-2 text-base text-ink-muted">{t.faq.subtitle}</p>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.q} className="faq-item">
              <AccordionItem question={item.q}>{item.a}</AccordionItem>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
