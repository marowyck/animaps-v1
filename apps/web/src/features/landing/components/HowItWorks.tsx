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
import { AnimatedContent } from "@/components/bits";
import { useT } from "@/i18n";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-background px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-10 flex flex-col items-center gap-4 md:flex-row md:items-end md:justify-center md:gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-h1 text-text">
              {t.howItWorks.titleBefore}{" "}
              <span className="text-brand-pink">{t.howItWorks.titleHighlight}</span>
            </h2>
            <p className="text-body mt-4 text-text-secondary md:text-body-lg">{t.howItWorks.subtitle}</p>
          </div>
        </div>

        <div className="relative mb-8">
          <ol className="mb-4 flex items-center justify-center gap-2 md:hidden" aria-hidden>
            {steps.map((step, index) => (
              <li key={step.key} className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-primary" />
                {index < steps.length - 1 ? (
                  <span className="h-0.5 w-6 bg-primary/40" />
                ) : null}
              </li>
            ))}
          </ol>
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
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <AnimatedContent key={step.key} delay={idx * 0.08} distance={24}>
                <button
                  type="button"
                  className={`how-card group relative flex h-full w-full cursor-pointer flex-col items-start rounded-2xl border border-border-subtle ${step.border} bg-surface p-5 text-left transition-colors duration-200 hover:border-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
                >
                  <span
                    className={`absolute -top-2.5 left-4 flex h-8 w-8 items-center justify-center rounded-full font-display text-sm shadow-sm ${step.badge}`}
                  >
                    {idx + 1}
                  </span>
                  <div
                    className={`how-icon-wrap mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${step.color}`}
                  >
                    <step.icon size={26} strokeWidth={2.25} aria-hidden />
                  </div>
                  <span className="text-h4 mb-1.5 text-text">{step.title}</span>
                  <span className="text-caption text-text-secondary md:text-body-sm">
                    {step.desc}
                  </span>
                </button>
              </AnimatedContent>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
