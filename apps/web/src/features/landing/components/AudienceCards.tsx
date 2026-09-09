"use client";

import { useRef } from "react";
import { Heart, Building2, Stethoscope, Landmark } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useT } from "@/i18n";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ClayFigure } from "./ClayFigure";

gsap.registerPlugin(ScrollTrigger);

const AUDIENCE_META = [
  {
    key: "guardians" as const,
    icon: Heart,
    tone: "bg-pastel-pink",
    iconColor: "text-brand-pink",
    rotateClass: "-rotate-3",
  },
  {
    key: "ngos" as const,
    icon: Building2,
    tone: "bg-pastel-green",
    iconColor: "text-brand-green",
    rotateClass: "rotate-2",
  },
  {
    key: "clinics" as const,
    icon: Stethoscope,
    tone: "bg-pastel-sky",
    iconColor: "text-brand-green",
    rotateClass: "-rotate-2",
  },
  {
    key: "agencies" as const,
    icon: Landmark,
    tone: "bg-white",
    iconColor: "text-brand-pink",
    rotateClass: "rotate-3",
  },
];

export function AudienceCards() {
  const t = useT();
  const wrapRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const audiences = AUDIENCE_META.map((a) => ({
    ...a,
    title: t.audience.cards[a.key].title,
    body: t.audience.cards[a.key].body,
  }));

  useGSAP(
    () => {
      if (reduced || !wrapRef.current) return;
      const cards = wrapRef.current.querySelectorAll<HTMLElement>(".polaroid-card");

      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: "back.out(1.6)",
          immediateRender: false,
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    },
    { scope: wrapRef, dependencies: [reduced] },
  );

  const flipCaption = (el: HTMLElement) => {
    const cap = el.querySelector(".polaroid-cap");
    if (!cap) return;
    gsap.fromTo(
      cap,
      { scale: 1 },
      {
        scale: 1.15,
        color: "#e07a96",
        duration: 0.25,
        yoyo: true,
        repeat: 1,
        ease: "back.out(2)",
      },
    );
  };

  return (
    <section
      id="audience"
      ref={wrapRef}
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden bg-gray-soft px-4 py-16 md:py-20"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-6 lg:grid-cols-12 lg:gap-6 xl:max-w-[90rem] xl:gap-8">
        <div className="min-w-0 lg:col-span-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-green">
            {t.audience.eyebrow}
          </p>
          <h2 className="font-display mb-3 text-4xl leading-tight tracking-tight text-ink md:text-5xl">
            {t.audience.titleBefore}{" "}
            <span className="text-brand-green">{t.audience.titleHighlight}</span>
          </h2>
          <p className="mb-8 max-w-lg text-sm text-ink-muted md:text-base">
            {t.audience.body}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {audiences.map((a) => (
              <article
                key={a.key}
                className={`polaroid-card group cursor-pointer rounded-[1.5rem] p-3 shadow-[0_14px_32px_-12px_rgba(224,122,150,0.3)] transition-transform duration-300 hover:z-10 hover:!rotate-0 hover:scale-105 ${a.tone} ${a.rotateClass}`}
                onClick={(e) => flipCaption(e.currentTarget)}
              >
                <div className="rounded-[1.1rem] bg-white/85 px-5 py-4">
                  <div
                    className={`mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ${a.iconColor}`}
                  >
                    <a.icon size={18} strokeWidth={2.25} />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-ink md:text-base">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted md:text-sm">
                    {a.body}
                  </p>
                </div>
                <p className="polaroid-cap mt-1.5 px-2 pb-0.5 text-center font-display text-xs text-ink/45">
                  ANIMAPS
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative flex w-full items-center justify-center lg:col-span-7 lg:justify-end">
          <ClayFigure
            name="family"
            size={720}
            priority
            className="relative z-10 w-[min(100%,560px)] sm:w-[min(100%,640px)] lg:w-[min(100%,720px)]"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 640px, 720px"
          />
        </div>
      </div>
    </section>
  );
}
