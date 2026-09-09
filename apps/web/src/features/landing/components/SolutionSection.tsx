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
import { AnimatedContent } from "@/components/bits";
import { useT } from "@/i18n";
import { SectionDivider } from "./SectionDivider";

const PILLAR_META = [
  {
    icon: Sparkles,
    key: "match" as const,
    span: "md:col-span-7",
    minH: "md:min-h-[200px]",
    tone: "bg-pastel-pink shadow-[0_18px_48px_-14px_rgba(224,122,150,0.45)]",
    iconTone: "bg-white text-brand-pink",
    tilt: "md:hover:rotate-1",
  },
  {
    icon: Building2,
    key: "ngo" as const,
    span: "md:col-span-5",
    minH: "md:min-h-[200px]",
    tone: "bg-pastel-green shadow-[0_18px_48px_-14px_rgba(95,175,106,0.45)]",
    iconTone: "bg-white text-brand-green",
    tilt: "md:hover:-rotate-1",
  },
  {
    icon: Stethoscope,
    key: "marketplace" as const,
    span: "md:col-span-4",
    minH: "md:min-h-[160px]",
    tone: "border border-brand-pink/15 bg-white shadow-[0_18px_48px_-14px_rgba(224,122,150,0.28)]",
    iconTone: "bg-pastel-pink text-brand-pink",
    tilt: "md:hover:-rotate-1",
  },
  {
    icon: MapPinned,
    key: "geo" as const,
    span: "md:col-span-3",
    minH: "md:min-h-[160px]",
    tone: "border border-brand-green/15 bg-white shadow-[0_18px_48px_-14px_rgba(95,175,106,0.28)]",
    iconTone: "bg-pastel-sky text-brand-green",
    tilt: "md:hover:rotate-1",
  },
  {
    icon: BarChart3,
    key: "indicators" as const,
    span: "md:col-span-5",
    minH: "md:min-h-[160px]",
    tone: "bg-pastel-sky shadow-[0_18px_48px_-14px_rgba(95,175,106,0.4)]",
    iconTone: "bg-white text-brand-green",
    tilt: "md:hover:rotate-0",
  },
];

export function SolutionSection() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const pillars = PILLAR_META.map((item) => ({
    ...item,
    title: t.solution.pillars[item.key].title,
    body: t.solution.pillars[item.key].body,
  }));

  const sparkle = (el: HTMLElement) => {
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
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-x-hidden bg-white py-14 md:py-16"
    >
      <SectionDivider fill="#ffffff" position="top" />

      {/* Soft color fields so white doesn’t feel empty */}
      <div
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-pastel-green/50 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-20 h-80 w-80 rounded-full bg-pastel-pink/45 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-8 md:px-8 md:pt-10 xl:max-w-[90rem] xl:px-10">
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 inline-block rounded-full border border-brand-green/25 bg-pastel-green/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-green shadow-[0_8px_24px_-8px_rgba(95,175,106,0.4)]">
            {t.solution.eyebrow}
          </div>
          <h2 className="font-display mb-3 text-4xl leading-tight tracking-tight text-ink md:text-5xl lg:text-[3.5rem]">
            {t.solution.titleBefore}{" "}
            <span className="text-brand-green">{t.solution.titleHighlight}</span>
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
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
            <AnimatedContent
              key={item.key}
              delay={i * 0.06}
              distance={24}
              className={`h-full ${item.span}`}
            >
              <li
                className={`group flex h-full cursor-pointer flex-col rounded-[2rem] p-6 transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.015] md:p-7 ${item.minH} ${item.tone} ${item.tilt}`}
                onClick={(e) => sparkle(e.currentTarget)}
              >
                <div
                  className={`sol-icon mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${item.iconTone} shadow-sm transition-transform duration-300 group-hover:scale-110`}
                >
                  <item.icon size={26} strokeWidth={2.25} />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-1.5 text-xl font-bold tracking-tight text-ink md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-muted md:text-base">
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
