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
import { Button } from "@/components/Button";
import { AnimatedContent, ScrollReveal } from "@/components/bits";
import { useT } from "@/i18n";
import { SectionDivider } from "./SectionDivider";

const FEATURE_META = [
  { key: "match" as const, icon: Sparkles, tone: "bg-pastel-pink text-brand-pink" },
  { key: "ngoRegister" as const, icon: Building2, tone: "bg-pastel-green text-brand-green" },
  { key: "animalMgmt" as const, icon: HeartHandshake, tone: "bg-pastel-pink text-brand-pink" },
  { key: "community" as const, icon: Users, tone: "bg-pastel-green text-brand-green" },
  { key: "vets" as const, icon: Stethoscope, tone: "bg-pastel-pink text-brand-pink" },
  { key: "biologists" as const, icon: Leaf, tone: "bg-pastel-green text-brand-green" },
  { key: "abuse" as const, icon: AlertTriangle, tone: "bg-pastel-pink text-brand-pink" },
  { key: "wildlife" as const, icon: TreePine, tone: "bg-pastel-green text-brand-green" },
  { key: "map" as const, icon: MapPinned, tone: "bg-pastel-pink text-brand-pink" },
  { key: "public" as const, icon: Landmark, tone: "bg-pastel-green text-brand-green" },
];

export function Differentials() {
  const t = useT();
  const features = FEATURE_META.map((item) => ({
    ...item,
    title: t.differentials.features[item.key].title,
    body: t.differentials.features[item.key].body,
  }));

  return (
    <section
      id="differentials"
      className="relative z-10 bg-white px-4 py-20 md:py-24"
    >
      <SectionDivider fill="var(--gray-soft)" position="top" />

      <div className="relative z-10 mx-auto max-w-6xl pt-10 md:pt-12">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-green">
            {t.differentials.eyebrow}
          </p>
          <ScrollReveal>
            <h2 className="font-display text-3xl tracking-tight text-ink md:text-4xl">
              {t.differentials.titleBefore}{" "}
              <span className="text-brand-pink">{t.differentials.titleHighlight}</span>
            </h2>
          </ScrollReveal>
          <p className="mt-3 text-base leading-relaxed text-ink-muted md:text-lg">
            {t.differentials.body}
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <AnimatedContent key={item.key} delay={i * 0.05} distance={22}>
              <article className="flex h-full gap-4 rounded-3xl border border-border-soft bg-gray-soft/50 p-5 shadow-sm transition-transform hover:-translate-y-0.5">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${item.tone}`}
                >
                  <item.icon size={20} strokeWidth={2.25} />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </div>
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
