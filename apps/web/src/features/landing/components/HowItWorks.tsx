"use client";

import { useRef } from "react";
import { UserPlus, UserRound, Sparkles, HeartHandshake } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useT } from "@/i18n";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DISTANCE, DURATION, EASE, STAGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const STEP_META = [
  { key: "account" as const, icon: UserPlus },
  { key: "profile" as const, icon: UserRound },
  { key: "match" as const, icon: Sparkles },
  { key: "adopt" as const, icon: HeartHandshake },
];

export function HowItWorks() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const leashRef = useRef<SVGPathElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const numbers = q("[data-step-number]") as HTMLElement[];

      if (reduced) {
        numbers.forEach((n) => (n.dataset.lit = "true"));
        return;
      }

      gsap.fromTo(
        q("[data-step]"),
        { y: DISTANCE.enter, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION.enter,
          stagger: STAGGER * 2,
          ease: EASE.settle,
          clearProps: "transform",
          scrollTrigger: { trigger: q("ol")[0], start: "top 85%", once: true },
        },
      );

      numbers.forEach((n) => {
        ScrollTrigger.create({
          trigger: n,
          start: "top 65%",
          once: true,
          onEnter: () => {
            n.dataset.lit = "true";
            gsap.fromTo(n, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: EASE.celebrate });
          },
        });
      });

      const leash = leashRef.current;
      if (leash) {
        const length = leash.getTotalLength();
        gsap.set(leash, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(leash, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: q("ol")[0],
            start: "top 75%",
            end: "top 35%",
            scrub: 0.5,
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-success-soft px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-h1 text-balance text-text">
            {t.howItWorks.titleBefore}{" "}
            <span className="text-primary-ink">{t.howItWorks.titleHighlight}</span>
          </h2>
          <p className="text-body-lg mt-4 text-text-secondary">{t.howItWorks.subtitle}</p>
        </div>

        <div className="relative">
          <svg
            className="pointer-events-none absolute top-0 right-[12.5%] left-[12.5%] hidden h-10 lg:block"
            viewBox="0 0 600 40"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              ref={leashRef}
              d="M0 20 C 60 4, 130 36, 200 20 C 270 4, 330 36, 400 20 C 470 4, 540 36, 600 20"
              stroke="var(--primary)"
              strokeOpacity="0.5"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol className="relative grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEP_META.map(({ key, icon: Icon }, index) => (
              <li key={key} data-step className="flex flex-col items-center text-center">
                <span
                  data-step-number
                  className="relative z-10 flex size-10 items-center justify-center rounded-full bg-surface font-display text-body text-success-ink ring-4 ring-success-soft transition-colors duration-(--duration-base) data-[lit=true]:bg-primary data-[lit=true]:text-surface"
                >
                  {index + 1}
                </span>
                <div className="mt-5 flex w-full flex-1 flex-col items-center rounded-[1.6rem] bg-surface px-5 py-6">
                  <Icon size={22} strokeWidth={2.25} className="mb-3 text-success-ink" aria-hidden />
                  <h3 className="text-h4 text-text">{t.howItWorks.steps[key].title}</h3>
                  <p className="text-body-sm mt-1.5 text-text-secondary">
                    {t.howItWorks.steps[key].desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
