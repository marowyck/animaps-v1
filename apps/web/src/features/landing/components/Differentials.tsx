"use client";

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
import { Button } from "@/components/Button";
import { AnimatedContent } from "@/components/bits";
import { useT } from "@/i18n";
import { SectionDivider } from "./SectionDivider";
import { ClayFigure } from "./ClayFigure";

const FEATURE_META = [
  {
    key: "match" as const,
    icon: Sparkles,
    tone: "bg-pastel-pink shadow-[0_10px_28px_-8px_rgba(224,122,150,0.4)]",
    iconTone: "bg-white text-brand-pink",
  },
  {
    key: "ngoRegister" as const,
    icon: Building2,
    tone: "bg-white shadow-[0_10px_28px_-8px_rgba(95,175,106,0.28)]",
    iconTone: "bg-pastel-green text-brand-green",
  },
  {
    key: "animalMgmt" as const,
    icon: HeartHandshake,
    tone: "bg-white shadow-[0_10px_28px_-8px_rgba(224,122,150,0.28)]",
    iconTone: "bg-pastel-pink text-brand-pink",
  },
  {
    key: "community" as const,
    icon: Users,
    tone: "bg-pastel-green shadow-[0_10px_28px_-8px_rgba(95,175,106,0.35)]",
    iconTone: "bg-white text-brand-green",
  },
  {
    key: "vets" as const,
    icon: Stethoscope,
    tone: "bg-white shadow-[0_10px_28px_-8px_rgba(224,122,150,0.25)]",
    iconTone: "bg-pastel-pink text-brand-pink",
  },
  {
    key: "biologists" as const,
    icon: Leaf,
    tone: "bg-pastel-sky shadow-[0_10px_28px_-8px_rgba(95,175,106,0.3)]",
    iconTone: "bg-white text-brand-green",
  },
  {
    key: "abuse" as const,
    icon: AlertTriangle,
    tone: "bg-white shadow-[0_10px_28px_-8px_rgba(224,122,150,0.25)]",
    iconTone: "bg-pastel-pink text-brand-pink",
  },
  {
    key: "wildlife" as const,
    icon: TreePine,
    tone: "bg-pastel-green shadow-[0_10px_28px_-8px_rgba(95,175,106,0.35)]",
    iconTone: "bg-white text-brand-green",
  },
  {
    key: "map" as const,
    icon: MapPinned,
    tone: "bg-pastel-pink shadow-[0_10px_28px_-8px_rgba(224,122,150,0.4)]",
    iconTone: "bg-white text-brand-pink",
  },
  {
    key: "public" as const,
    icon: Landmark,
    tone: "bg-white shadow-[0_10px_28px_-8px_rgba(95,175,106,0.28)]",
    iconTone: "bg-pastel-green text-brand-green",
  },
];

export function Differentials() {
  const t = useT();
  const features = FEATURE_META.map((item) => ({
    ...item,
    title: t.differentials.features[item.key].title,
    body: t.differentials.features[item.key].body,
  }));

  const bounceIcon = (el: HTMLElement) => {
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
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-x-hidden bg-pastel-yellow px-4 py-16 md:py-20"
    >
      <SectionDivider fill="var(--gray-soft)" position="top" />

      <div className="relative z-10 mx-auto w-full max-w-6xl pt-10 md:pt-12">
        <div className="mb-8 flex flex-col items-center gap-4 md:mb-10 md:flex-row md:items-end md:justify-center md:gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-green">
              {t.differentials.eyebrow}
            </p>
            <h2 className="font-display text-4xl tracking-tight text-ink md:text-5xl">
              {t.differentials.titleBefore}{" "}
              <span className="text-brand-pink">{t.differentials.titleHighlight}</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
              {t.differentials.body}
            </p>
          </div>
          <ClayFigure
            name="monkey"
            size={150}
            className="w-[110px] shrink-0 rotate-6 md:w-[140px]"
            sizes="(max-width: 768px) 220px, 280px"
          />
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((item, i) => (
            <AnimatedContent key={item.key} delay={i * 0.04} distance={20}>
              <article
                className={`group flex h-full cursor-pointer flex-col gap-2 rounded-[1.5rem] p-4 transition-transform duration-300 hover:-translate-y-1 hover:-rotate-1 ${item.tone}`}
                onClick={(e) => bounceIcon(e.currentTarget)}
              >
                <span
                  className={`diff-icon flex h-10 w-10 items-center justify-center rounded-full ${item.iconTone}`}
                >
                  <item.icon size={18} strokeWidth={2.25} />
                </span>
                <h3 className="text-sm font-bold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-ink-muted line-clamp-3">
                  {item.body}
                </p>
              </article>
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
    </section>
  );
}
