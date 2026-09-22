"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  Building2,
  Users,
  Stethoscope,
  Leaf,
  AlertTriangle,
  TreePine,
  MapPinned,
  Landmark,
  HeartHandshake,
  UserPlus,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/Button";
import { AnimatedContent } from "@/components/bits";
import { useT } from "@/i18n";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SectionDivider } from "./SectionDivider";

const PHOTO_MASK =
  "polygon(12% 8%, 28% 0%, 48% 6%, 70% 0%, 88% 10%, 100% 28%, 96% 52%, 100% 74%, 86% 94%, 64% 100%, 40% 94%, 18% 100%, 4% 82%, 0% 58%, 4% 32%)";

const FEATURE_META = [
  {
    key: "match" as const,
    icon: Sparkles,
    tone: "bg-pastel-pink shadow-[var(--shadow-glow-primary)]",
    iconTone: "bg-white text-brand-pink",
  },
  {
    key: "ngoRegister" as const,
    icon: Building2,
    tone: "bg-white shadow-[var(--shadow-glow-secondary)]",
    iconTone: "bg-pastel-green text-brand-green",
  },
  {
    key: "animalMgmt" as const,
    icon: HeartHandshake,
    tone: "bg-white shadow-[var(--shadow-glow-primary)]",
    iconTone: "bg-pastel-pink text-brand-pink",
  },
  {
    key: "community" as const,
    icon: Users,
    tone: "bg-pastel-green shadow-[var(--shadow-glow-secondary)]",
    iconTone: "bg-white text-brand-green",
  },
  {
    key: "vets" as const,
    icon: Stethoscope,
    tone: "bg-white shadow-[var(--shadow-glow-primary)]",
    iconTone: "bg-pastel-pink text-brand-pink",
  },
  {
    key: "biologists" as const,
    icon: Leaf,
    tone: "bg-pastel-sky shadow-[var(--shadow-glow-secondary)]",
    iconTone: "bg-white text-brand-green",
  },
  {
    key: "abuse" as const,
    icon: AlertTriangle,
    tone: "bg-white shadow-[var(--shadow-glow-primary)]",
    iconTone: "bg-pastel-pink text-brand-pink",
  },
  {
    key: "wildlife" as const,
    icon: TreePine,
    tone: "bg-pastel-green shadow-[var(--shadow-glow-secondary)]",
    iconTone: "bg-white text-brand-green",
  },
  {
    key: "map" as const,
    icon: MapPinned,
    tone: "bg-pastel-pink shadow-[var(--shadow-glow-primary)]",
    iconTone: "bg-white text-brand-pink",
  },
  {
    key: "public" as const,
    icon: Landmark,
    tone: "bg-white shadow-[var(--shadow-glow-secondary)]",
    iconTone: "bg-pastel-green text-brand-green",
  },
];

export function Differentials() {
  const t = useT();
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const features = FEATURE_META.map((item) => ({
    ...item,
    title: t.differentials.features[item.key].title,
    body: t.differentials.features[item.key].body,
  }));

  useGSAP(
    () => {
      const photo = sectionRef.current?.querySelector<HTMLElement>("[data-float]");
      if (!photo || reduced) return;
      gsap.to(photo, {
        y: -8,
        rotation: 2,
        duration: 3.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const bounceIcon = (el: HTMLElement) => {
    if (reduced) return;
    const icon = el.querySelector(".diff-icon");
    if (!icon) return;
    gsap.fromTo(
      icon,
      { y: 0 },
      { y: -8, duration: 0.2, yoyo: true, repeat: 3, ease: "power1.out" },
    );
  };

  return (
    <section
      id="differentials"
      ref={sectionRef}
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-x-clip bg-pastel-yellow px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-10 flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl text-center md:text-left">
            <p className="text-label mb-4 text-(--honey-700)">
              {t.differentials.eyebrow}
            </p>
            <h2 className="text-h1 text-text">
              {t.differentials.titleBefore}{" "}
              <span className="text-primary">{t.differentials.titleHighlight}</span>
            </h2>
            <p className="text-body mt-4 text-text-secondary">
              {t.differentials.body}
            </p>
          </div>
          <div data-float className="relative w-36 shrink-0 md:w-44">
            <div
              className="relative aspect-square w-full bg-surface-accent shadow-md"
              style={{ clipPath: PHOTO_MASK }}
            >
              <Image
                src="/images/auth/rescue.png"
                alt={t.auth.slides.rescue.imageAlt}
                fill
                sizes="11rem"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((item, i) => (
            <AnimatedContent key={item.key} delay={i * 0.04} distance={20}>
              <button
                type="button"
                className={`group flex h-full w-full cursor-pointer flex-col gap-2 rounded-[1.5rem] p-4 text-left transition-transform duration-300 hover:-translate-y-1 hover:-rotate-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink ${item.tone}`}
                onClick={(e) => bounceIcon(e.currentTarget)}
              >
                <span
                  className={`diff-icon flex h-10 w-10 items-center justify-center rounded-full ${item.iconTone}`}
                >
                  <item.icon size={18} strokeWidth={2.25} aria-hidden />
                </span>
                <span className="text-h4 text-text">{item.title}</span>
                <span className="text-caption line-clamp-3 text-text-secondary">
                  {item.body}
                </span>
              </button>
            </AnimatedContent>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href="/register" variant="pink">
            <UserPlus size={18} />
            {t.differentials.cta}
          </Button>
        </div>
      </div>
      <SectionDivider fill="var(--pastel-pink)" />
    </section>
  );
}
