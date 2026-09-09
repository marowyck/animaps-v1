"use client";

import { useRef } from "react";
import {
  UserPlus,
  UserRound,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/Button";
import { AnimatedContent } from "@/components/bits";
import { useT } from "@/i18n";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SectionDivider } from "./SectionDivider";
import { ClayFigure } from "./ClayFigure";

gsap.registerPlugin(ScrollTrigger);

const STEP_META = [
  {
    key: "account" as const,
    icon: UserPlus,
    color: "bg-pastel-pink text-brand-pink",
    border: "border-brand-pink/30",
    badge: "bg-brand-pink text-white",
  },
  {
    key: "profile" as const,
    icon: UserRound,
    color: "bg-pastel-green text-brand-green",
    border: "border-brand-green/30",
    badge: "bg-brand-green text-white",
  },
  {
    key: "match" as const,
    icon: Sparkles,
    color: "bg-pastel-pink text-brand-pink",
    border: "border-brand-pink/30",
    badge: "bg-brand-pink text-white",
  },
  {
    key: "adopt" as const,
    icon: HeartHandshake,
    color: "bg-pastel-green text-brand-green",
    border: "border-brand-green/30",
    badge: "bg-brand-green text-white",
  },
];

export function HowItWorks() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const leashRef = useRef<SVGPathElement>(null);
  const reduced = usePrefersReducedMotion();

  const steps = STEP_META.map((step) => ({
    ...step,
    title: t.howItWorks.steps[step.key].title,
    desc: t.howItWorks.steps[step.key].desc,
  }));

  useGSAP(
    () => {
      const section = sectionRef.current;
      const leash = leashRef.current;
      if (!section || reduced) return;

      if (leash) {
        const length = leash.getTotalLength();
        gsap.set(leash, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(leash, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "top 25%",
            scrub: 0.5,
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [reduced, t.howItWorks.titleBefore] },
  );

  const wiggle = (el: HTMLElement) => {
    gsap.fromTo(
      el,
      { rotate: 0 },
      {
        rotate: 8,
        duration: 0.12,
        yoyo: true,
        repeat: 5,
        ease: "power1.inOut",
        onComplete: () => gsap.set(el, { rotate: 0 }),
      },
    );
  };

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden bg-pastel-green py-20 md:py-24"
    >
      <SectionDivider fill="#ffffff" position="top" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-10 md:pt-12">
        <div className="mb-8 flex flex-col items-center gap-4 md:mb-10 md:flex-row md:items-end md:justify-center md:gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="font-display mb-2 text-4xl tracking-tight text-ink md:text-5xl">
              {t.howItWorks.titleBefore}{" "}
              <span className="text-brand-pink">{t.howItWorks.titleHighlight}</span>
            </h2>
            <p className="text-base text-ink-muted md:text-lg">{t.howItWorks.subtitle}</p>
          </div>
          <ClayFigure
            name="critter"
            size={160}
            className="w-[120px] shrink-0 rotate-[-6deg] md:w-[150px]"
            sizes="(max-width: 768px) 240px, 300px"
          />
        </div>

        <div className="relative mb-8">
          <svg
            className="pointer-events-none absolute inset-x-8 top-1/2 hidden h-16 -translate-y-1/2 opacity-50 md:block"
            viewBox="0 0 800 80"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              ref={leashRef}
              d="M20 40 C 140 10, 260 70, 400 40 C 540 10, 660 70, 780 40"
              stroke="#e07a96"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <AnimatedContent key={step.key} delay={idx * 0.08} distance={24}>
                <article
                  className={`how-card group relative flex h-full flex-col items-center rounded-[1.75rem] border-2 ${step.border} bg-white p-5 text-center shadow-[0_12px_32px_-10px_rgba(224,122,150,0.3)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-1`}
                  onClick={(e) => wiggle(e.currentTarget)}
                >
                  <span
                    className={`absolute -top-2.5 left-4 flex h-8 w-8 items-center justify-center rounded-full font-display text-sm shadow-sm ${step.badge}`}
                  >
                    {idx + 1}
                  </span>
                  <div
                    className={`how-icon-wrap mb-4 flex h-14 w-14 items-center justify-center rounded-full ${step.color} shadow-sm ring-4 ring-white`}
                  >
                    <step.icon size={26} strokeWidth={2.25} />
                  </div>
                  <h3 className="mb-1.5 text-base font-bold tracking-tight text-ink md:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-ink-muted md:text-sm">
                    {step.desc}
                  </p>
                </article>
              </AnimatedContent>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button href="/register" variant="pink">
            <UserPlus size={18} />
            {t.howItWorks.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
