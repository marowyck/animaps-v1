"use client";

import {
  Sparkles,
  Building2,
  Stethoscope,
  MapPinned,
  BarChart3,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/Button";
import {
  AnimatedContent,
  DotGrid,
  ScrollReveal,
  updateDotGridVars,
} from "@/components/bits";
import { useRef } from "react";
import { useT } from "@/i18n";
import { SectionDivider } from "./SectionDivider";

const PILLAR_META = [
  { icon: Sparkles, key: "match" as const },
  { icon: Building2, key: "ngo" as const },
  { icon: Stethoscope, key: "marketplace" as const },
  { icon: MapPinned, key: "geo" as const },
  { icon: BarChart3, key: "indicators" as const },
];

export function SolutionSection() {
  const t = useT();
  const container = useRef<HTMLElement>(null);
  const pillars = PILLAR_META.map((item) => ({
    ...item,
    title: t.solution.pillars[item.key].title,
    body: t.solution.pillars[item.key].body,
  }));

  return (
    <section
      id="solution"
      ref={container}
      className="relative z-10 overflow-x-hidden bg-pastel-sky py-20 md:py-24"
      onMouseMove={(e) => {
        if (container.current) {
          updateDotGridVars(container.current, e.clientX, e.clientY);
        }
      }}
    >
      <SectionDivider fill="var(--gray-soft)" position="top" />
      <DotGrid
        opacity={0.4}
        gap={30}
        baseColor="rgba(224, 122, 150, 0.12)"
        activeColor="rgba(95, 175, 106, 0.3)"
        proximity={110}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-10 md:pt-12">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-4 inline-block rounded-full border border-brand-green/30 bg-pastel-green px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-green">
            {t.solution.eyebrow}
          </div>
          <ScrollReveal>
            <h2 className="font-display mb-4 text-3xl leading-tight tracking-tight text-ink md:text-4xl">
              {t.solution.titleBefore}{" "}
              <span className="text-brand-green">{t.solution.titleHighlight}</span>
            </h2>
          </ScrollReveal>
          <p className="text-base leading-relaxed text-ink-muted md:text-lg">
            {t.solution.bodyBefore}{" "}
            <span className="font-semibold text-brand-pink">{t.solution.adopters}</span>,{" "}
            <span className="font-semibold text-brand-green">{t.solution.ngos}</span>,{" "}
            <span className="font-semibold text-brand-blue">{t.solution.vets}</span>{" "}
            {t.solution.conjunction}{" "}
            <span className="font-semibold text-brand-green">{t.solution.agencies}</span>
            {t.solution.bodyAfter}
          </p>
        </div>

        <ul className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((item, i) => (
            <AnimatedContent key={item.key} delay={i * 0.08} distance={28}>
              <li className="flex h-full items-start gap-4 rounded-3xl border border-transparent bg-white p-5 shadow-sm transition-colors hover:border-brand-pink/25">
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pastel-pink text-brand-pink">
                  <item.icon size={22} strokeWidth={2.25} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted md:text-base">
                    {item.body}
                  </p>
                </div>
              </li>
            </AnimatedContent>
          ))}
        </ul>

        <div className="flex justify-center">
          <Button href="/register" variant="pink">
            <UserPlus size={18} />
            {t.solution.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
