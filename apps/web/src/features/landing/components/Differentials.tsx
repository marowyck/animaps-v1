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
import { AnimatedContent } from "@/components/bits";
import { useT } from "@/i18n";
import { SectionDivider } from "./SectionDivider";

const FEATURE_META = [
  { key: "match" as const, icon: Sparkles, tone: "text-primary-ink" },
  { key: "ngoRegister" as const, icon: Building2, tone: "text-success-ink" },
  { key: "animalMgmt" as const, icon: HeartHandshake, tone: "text-primary-ink" },
  { key: "community" as const, icon: Users, tone: "text-secondary-ink" },
  { key: "vets" as const, icon: Stethoscope, tone: "text-info-ink" },
  { key: "biologists" as const, icon: Leaf, tone: "text-success-ink" },
  { key: "abuse" as const, icon: AlertTriangle, tone: "text-danger-ink" },
  { key: "wildlife" as const, icon: TreePine, tone: "text-success-ink" },
  { key: "map" as const, icon: MapPinned, tone: "text-warning-ink" },
  { key: "public" as const, icon: Landmark, tone: "text-secondary-ink" },
];

export function Differentials() {
  const t = useT();

  return (
    <section
      id="differentials"
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-x-clip bg-warning-soft px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <AnimatedContent stagger className="mb-14 max-w-2xl">
          <p className="text-label mb-4 text-warning-ink">{t.differentials.eyebrow}</p>
          <h2 className="text-h1 text-balance text-text">
            {t.differentials.titleBefore}{" "}
            <span className="text-primary-ink">{t.differentials.titleHighlight}</span>
          </h2>
          <p className="text-body-lg mt-5 text-text-secondary">{t.differentials.body}</p>
        </AnimatedContent>

        <AnimatedContent
          as="ul"
          stagger
          className="mb-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5"
        >
          {FEATURE_META.map(({ key, icon: Icon, tone }) => (
            <li key={key}>
              <span
                className={`mb-3 flex size-11 items-center justify-center rounded-full bg-surface ${tone}`}
              >
                <Icon size={20} strokeWidth={2.25} aria-hidden />
              </span>
              <h3 className="text-h4 text-text">{t.differentials.features[key].title}</h3>
              <p className="text-body-sm mt-1 text-text-secondary">
                {t.differentials.features[key].body}
              </p>
            </li>
          ))}
        </AnimatedContent>

        <Button href="/register" variant="primary">
          <UserPlus size={18} aria-hidden />
          {t.differentials.cta}
        </Button>
      </div>
      <SectionDivider fill="var(--primary-soft)" />
    </section>
  );
}
