"use client";

import Image from "next/image";
import {
  Sparkles,
  Building2,
  Stethoscope,
  MapPinned,
  BarChart3,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/Button";
import { AnimatedContent, Blob } from "@/components/bits";
import { useT } from "@/i18n";
import { SectionDivider } from "./SectionDivider";

const SUPPORTING = [
  { key: "ngo" as const, icon: Building2, tone: "bg-success-soft text-success-ink" },
  { key: "marketplace" as const, icon: Stethoscope, tone: "bg-info-soft text-info-ink" },
  { key: "geo" as const, icon: MapPinned, tone: "bg-warning-soft text-warning-ink" },
  { key: "indicators" as const, icon: BarChart3, tone: "bg-secondary-soft text-secondary-ink" },
];

export function SolutionSection() {
  const t = useT();
  const match = t.solution.pillars.match;

  return (
    <section
      id="solution"
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-x-clip bg-surface px-5 py-24 sm:px-8 md:py-32"
    >
      <SectionDivider fill="var(--success-soft)" />

      <Blob
        variant={2}
        className="absolute -left-16 bottom-16 size-80 text-primary/15 sm:size-96"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <AnimatedContent stagger className="mb-12 max-w-3xl md:mb-16">
          <p className="text-label mb-4 inline-block rounded-full bg-success-soft px-4 py-1.5 text-success-ink">
            {t.solution.eyebrow}
          </p>
          <h2 className="text-h1 text-balance text-text">
            {t.solution.titleBefore}{" "}
            <span className="text-success-ink">{t.solution.titleHighlight}</span>
          </h2>
          <p className="text-body-lg mt-5 max-w-2xl text-text-secondary">
            {t.solution.bodyBefore}{" "}
            <span className="font-semibold text-primary-ink">{t.solution.adopters}</span>,{" "}
            <span className="font-semibold text-success-ink">{t.solution.ngos}</span>,{" "}
            <span className="font-semibold text-info-ink">{t.solution.vets}</span>{" "}
            {t.solution.conjunction}{" "}
            <span className="font-semibold text-secondary-ink">{t.solution.agencies}</span>
            {t.solution.bodyAfter}
          </p>
        </AnimatedContent>

        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          <AnimatedContent className="lg:col-span-7">
            <article className="group relative flex h-full min-h-[26rem] flex-col overflow-hidden rounded-[2rem] bg-primary-soft p-7 sm:p-10">
              <span className="mb-5 flex size-12 items-center justify-center rounded-full bg-surface text-primary shadow-sm">
                <Sparkles size={22} strokeWidth={2.25} aria-hidden />
              </span>
              <h3 className="text-h2 max-w-sm text-text">{match.title}</h3>
              <p className="text-body mt-3 max-w-sm text-text-secondary">{match.body}</p>
              <div className="relative mt-8 aspect-[5/4] w-full overflow-hidden sm:mt-auto sm:-mb-4 sm:-mr-4 sm:ml-auto sm:w-[82%] sm:max-w-md">
                <div
                  className="absolute inset-0 bg-surface-accent"
                  style={{
                    clipPath:
                      "polygon(8% 6%, 28% 0%, 62% 3%, 92% 10%, 100% 34%, 96% 62%, 84% 88%, 58% 100%, 28% 96%, 6% 80%, 0% 52%, 3% 22%)",
                  }}
                >
                  <Image
                    src="/images/hero-pet.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 70vw, 28rem"
                    className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-out) motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </article>
          </AnimatedContent>

          <div className="flex flex-col lg:col-span-5">
            <AnimatedContent as="ul" stagger className="divide-y divide-border-subtle">
              {SUPPORTING.map(({ key, icon: Icon, tone }) => (
                <li key={key} className="flex gap-4 py-5 first:pt-0">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-full ${tone}`}
                  >
                    <Icon size={20} strokeWidth={2.25} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-h4 text-text">{t.solution.pillars[key].title}</h3>
                    <p className="text-body-sm mt-1 text-text-secondary">
                      {t.solution.pillars[key].body}
                    </p>
                  </div>
                </li>
              ))}
            </AnimatedContent>
            <div className="mt-8 lg:mt-auto">
              <Button href="/register" variant="primary">
                <UserPlus size={18} aria-hidden />
                {t.solution.cta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
