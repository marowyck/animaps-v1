"use client";

import { useRef } from "react";
import {
  Sparkles,
  Building2,
  Stethoscope,
  MapPinned,
  BarChart3,
  UserPlus,
} from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/Button";
import { AnimatedContent, Blob } from "@/components/bits";
import { useT } from "@/i18n";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SectionDivider } from "./SectionDivider";

const PILLAR_META = [
  {
    icon: Sparkles,
    key: "match" as const,
    span: "md:col-span-7",
    minH: "md:min-h-[200px]",
    tone: "bg-pastel-pink shadow-[var(--shadow-glow-primary)]",
    iconTone: "bg-white text-brand-pink",
    tilt: "md:hover:rotate-1",
  },
  {
    icon: Building2,
    key: "ngo" as const,
    span: "md:col-span-5",
    minH: "md:min-h-[200px]",
    tone: "bg-pastel-green shadow-[var(--shadow-glow-secondary)]",
    iconTone: "bg-white text-brand-green",
    tilt: "md:hover:-rotate-1",
  },
  {
    icon: Stethoscope,
    key: "marketplace" as const,
    span: "md:col-span-4",
    minH: "md:min-h-[160px]",
    tone: "border border-brand-pink/15 bg-white shadow-[var(--shadow-glow-primary)]",
    iconTone: "bg-pastel-pink text-brand-pink",
    tilt: "md:hover:-rotate-1",
  },
  {
    icon: MapPinned,
    key: "geo" as const,
    span: "md:col-span-3",
    minH: "md:min-h-[160px]",
    tone: "border border-brand-green/15 bg-white shadow-[var(--shadow-glow-secondary)]",
    iconTone: "bg-pastel-sky text-brand-green",
    tilt: "md:hover:rotate-1",
  },
  {
    icon: BarChart3,
    key: "indicators" as const,
    span: "md:col-span-5",
    minH: "md:min-h-[160px]",
    tone: "bg-pastel-sky shadow-[var(--shadow-glow-secondary)]",
    iconTone: "bg-white text-brand-green",
    tilt: "md:hover:rotate-0",
  },
];

export function SolutionSection() {
  const t = useT();
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pillars = PILLAR_META.map((item) => ({
    ...item,
    title: t.solution.pillars[item.key].title,
    body: t.solution.pillars[item.key].body,
  }));

  const sparkle = (el: HTMLElement) => {
    if (reduced) return;
    gsap.fromTo(
      el.querySelector(".sol-icon"),
      { scale: 1, rotate: 0 },
      {
        scale: 1.2,
        rotate: 10,
        duration: 0.25,
        yoyo: true,
        repeat: 1,
        ease: "back.out(2)",
      },
    );
  };

  return (
    <section
      id="solution"
      ref={sectionRef}
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-x-clip bg-white px-5 py-24 sm:px-8 md:py-32"
    >
      <SectionDivider fill="var(--background)" />

      <Blob
        variant={1}
        className="absolute -right-16 top-20 size-72 text-success/30 sm:size-80"
      />
      <Blob
        variant={2}
        className="absolute -left-16 bottom-16 size-80 text-primary/25 sm:size-96"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <div className="text-label mb-4 inline-block rounded-full bg-pastel-green/80 px-4 py-1.5 text-(--mint-700)">
            {t.solution.eyebrow}
          </div>
          <h2 className="text-h1 text-text">
            {t.solution.titleBefore}{" "}
            <span className="text-(--mint-700)">{t.solution.titleHighlight}</span>
          </h2>
          <p className="text-body mt-4 max-w-2xl text-text-secondary">
            {t.solution.bodyBefore}{" "}
            <span className="font-semibold text-brand-pink">{t.solution.adopters}</span>,{" "}
            <span className="font-semibold text-brand-green">{t.solution.ngos}</span>,{" "}
            <span className="font-semibold text-brand-blue">{t.solution.vets}</span>{" "}
            {t.solution.conjunction}{" "}
            <span className="font-semibold text-brand-green">{t.solution.agencies}</span>
            {t.solution.bodyAfter}
          </p>
        </div>

        <ul className="mb-10 grid auto-rows-fr gap-4 sm:grid-cols-2 md:grid-cols-12 md:gap-5">
          {pillars.map((item, i) => (
            <li key={item.key} className={`h-full ${item.span}`}>
              <AnimatedContent delay={i * 0.06} distance={24} className="h-full">
                <button
                  type="button"
                  className={`group flex h-full w-full cursor-pointer flex-col rounded-[2rem] p-6 text-left transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink md:p-7 ${item.minH} ${item.tone} ${item.tilt}`}
                  onClick={(e) => sparkle(e.currentTarget)}
                >
                  <div
                    className={`sol-icon mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${item.iconTone} shadow-sm transition-transform duration-300 group-hover:scale-110`}
                  >
                    <item.icon size={26} strokeWidth={2.25} aria-hidden />
                  </div>
                  <span className="text-h3 mb-1.5 text-text">{item.title}</span>
                  <span className="text-body-sm text-text-secondary md:text-body">
                    {item.body}
                  </span>
                </button>
              </AnimatedContent>
            </li>
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
