"use client";

import { useRef } from "react";
import Image from "next/image";
import { Heart, Building2, Stethoscope, Landmark } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useT } from "@/i18n";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Blob } from "@/components/bits";
import { SectionDivider } from "./SectionDivider";

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

const PHOTO_MASK =
  "polygon(58% 2%, 74% 0%, 88% 7%, 98% 20%, 100% 40%, 97% 58%, 92% 76%, 80% 92%, 62% 99%, 44% 100%, 26% 94%, 12% 82%, 2% 64%, 0% 44%, 4% 26%, 16% 12%, 34% 4%)";

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
      const photo = wrapRef.current.querySelector<HTMLElement>("[data-float]");
      if (photo) {
        gsap.to(photo, {
          y: -10,
          duration: 3.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
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
    if (reduced) return;
    const cap = el.querySelector(".polaroid-cap");
    if (!cap) return;
    gsap.fromTo(
      cap,
      { scale: 1 },
      {
        scale: 1.15,
        color: getComputedStyle(document.documentElement)
          .getPropertyValue("--primary")
          .trim(),
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
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden bg-gray-soft px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-green">
            {t.audience.eyebrow}
          </p>
          <h2 className="text-h1 text-text">
            {t.audience.titleBefore}{" "}
            <span className="text-(--mint-700)">{t.audience.titleHighlight}</span>
          </h2>
          <p className="text-body mt-4 mb-10 max-w-lg text-text-secondary">
            {t.audience.body}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {audiences.map((a) => (
              <button
                key={a.key}
                id={`audience-${a.key}`}
                type="button"
                className={`polaroid-card group cursor-pointer rounded-2xl border border-border-subtle p-3 text-left transition-colors duration-200 hover:border-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${a.tone}`}
                onClick={(e) => flipCaption(e.currentTarget)}
              >
                <div className="rounded-[1.1rem] bg-white/85 px-5 py-4">
                  <div
                    className={`mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ${a.iconColor}`}
                  >
                    <a.icon size={18} strokeWidth={2.25} aria-hidden />
                  </div>
                  <span className="text-h4 block text-text">{a.title}</span>
                  <span className="text-caption mt-1 block text-text-secondary md:text-body-sm">
                    {a.body}
                  </span>
                </div>
                <span className="polaroid-cap text-caption mt-1.5 block px-2 pb-0.5 text-center font-display text-text/45">
                  {t.brand}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex w-full items-center justify-center lg:col-span-7 lg:justify-end">
          <div data-float className="relative w-full max-w-xl">
            <Blob
              variant={0}
              className="absolute -top-8 -left-8 size-28 text-primary/25 sm:size-36"
            />
            <Blob
              variant={2}
              className="absolute -right-6 -bottom-8 size-36 text-secondary/30"
            />
            <div
              className="relative aspect-[5/4] w-full bg-surface-accent shadow-lg"
              style={{ clipPath: PHOTO_MASK }}
            >
              <Image
                src="/images/hero-pet.jpg"
                alt={t.hero.imageAlt}
                fill
                sizes="(max-width: 1024px) 90vw, 36rem"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <SectionDivider fill="var(--pastel-yellow)" />
    </section>
  );
}
