"use client";

import { Heart, Building2, Stethoscope, Landmark } from "lucide-react";
import { AnimatedContent, ScrollReveal } from "@/components/bits";
import { useT } from "@/i18n";

const AUDIENCE_META = [
  {
    key: "guardians" as const,
    icon: Heart,
    tone: "bg-pastel-pink",
    iconColor: "text-brand-pink",
  },
  {
    key: "ngos" as const,
    icon: Building2,
    tone: "bg-pastel-green",
    iconColor: "text-brand-green",
  },
  {
    key: "clinics" as const,
    icon: Stethoscope,
    tone: "bg-pastel-sky",
    iconColor: "text-brand-green",
  },
  {
    key: "agencies" as const,
    icon: Landmark,
    tone: "bg-pastel-pink",
    iconColor: "text-brand-pink",
  },
];

export function AudienceCards() {
  const t = useT();
  const audiences = AUDIENCE_META.map((a) => ({
    ...a,
    title: t.audience.cards[a.key].title,
    body: t.audience.cards[a.key].body,
  }));

  return (
    <section
      id="audience"
      className="relative z-10 bg-gray-soft px-4 py-20 md:py-24"
    >
      <div className="relative z-10 mx-auto max-w-6xl pt-4 md:pt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-green">
          {t.audience.eyebrow}
        </p>
        <ScrollReveal>
          <h2 className="font-display mb-3 max-w-xl text-3xl leading-tight tracking-tight text-ink md:text-4xl">
            {t.audience.titleBefore}{" "}
            <span className="text-brand-green">{t.audience.titleHighlight}</span>
          </h2>
        </ScrollReveal>
        <p className="mb-8 max-w-lg text-base text-ink-muted">{t.audience.body}</p>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a, i) => (
            <AnimatedContent key={a.key} delay={i * 0.07} distance={24}>
              <article
                className={`h-full rounded-3xl p-5 shadow-sm transition-transform hover:-translate-y-0.5 ${a.tone}`}
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white ${a.iconColor}`}
                >
                  <a.icon size={20} strokeWidth={2.25} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-ink">
                  {a.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {a.body}
                </p>
              </article>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
