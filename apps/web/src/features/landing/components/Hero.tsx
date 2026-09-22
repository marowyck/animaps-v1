"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDown, MapPin, PawPrint } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/Button";
import { AnimatedHeading, Blob } from "@/components/bits";
import { BoneDoodle, HeartDoodle, PawDoodle } from "@/components/illustrations/Doodles";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useT } from "@/i18n";
import { SectionDivider } from "./SectionDivider";

/** Percentage polygon so the mask survives CSS transforms (url(#clip) often doesn't). */
const HERO_MASK =
  "polygon(58% 2%, 74% 0%, 88% 7%, 98% 20%, 100% 40%, 97% 58%, 92% 76%, 80% 92%, 62% 99%, 44% 100%, 26% 94%, 12% 82%, 2% 64%, 0% 44%, 4% 26%, 16% 12%, 34% 4%)";

export function Hero() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || reduced) return;

      const floats = section.querySelectorAll<HTMLElement>("[data-float]");
      floats.forEach((el, index) => {
        gsap.to(el, {
          y: index % 2 === 0 ? -10 : 8,
          rotation: index % 2 === 0 ? 6 : -5,
          duration: 3.2 + index * 0.35,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      const layers = [...section.querySelectorAll<HTMLElement>("[data-depth]")].map(
        (el) => ({
          depth: Number(el.dataset.depth ?? 1),
          x: gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" }),
        }),
      );

      const onMove = (event: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        const cx = (event.clientX - rect.left) / rect.width - 0.5;
        const cy = (event.clientY - rect.top) / rect.height - 0.5;
        layers.forEach((layer) => {
          layer.x(cx * 18 * layer.depth);
          layer.y(cy * 12 * layer.depth);
        });
      };

      section.addEventListener("mousemove", onMove);
      return () => section.removeEventListener("mousemove", onMove);
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-svh items-center overflow-hidden px-5 pt-24 pb-20 sm:px-8 sm:pt-28"
    >
      <div className="pointer-events-none absolute inset-0 map-grid opacity-30" aria-hidden />
      <Blob
        variant={1}
        className="absolute -top-16 -left-16 size-72 text-primary/20 sm:size-96"
      />
      <Blob
        variant={2}
        className="absolute top-24 -right-20 size-80 text-secondary/20 sm:size-[28rem]"
      />

      <div
        data-depth="1.4"
        className="pointer-events-none absolute top-32 left-[5%] hidden lg:block"
      >
        <div data-float>
          <PawDoodle className="size-14 rotate-12 text-primary/35" />
        </div>
      </div>
      <div
        data-depth="1"
        className="pointer-events-none absolute top-36 right-[6%] hidden lg:block"
      >
        <div data-float>
          <HeartDoodle className="size-10 -rotate-12 text-secondary/45" />
        </div>
      </div>
      <div
        data-depth="0.6"
        className="pointer-events-none absolute bottom-24 left-[16%] hidden lg:block"
      >
        <div data-float>
          <BoneDoodle className="size-12 rotate-6 text-honey-600/70" />
        </div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="max-w-xl">
          <p className="text-label mb-5 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-(--pink-700)">
            <PawPrint size={14} aria-hidden />
            {t.brand}
          </p>
          <AnimatedHeading
            as="h1"
            className="text-display text-text"
            parts={[
              { text: t.hero.titleLine1 },
              { text: t.hero.titleHighlight, className: "text-primary" },
            ]}
          />
          <p className="text-body-lg mt-4 max-w-md text-text-secondary">{t.hero.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/register" variant="primary">
              <PawPrint size={18} aria-hidden />
              {t.hero.ctaAccount}
            </Button>
            <Button href="/#how-it-works" variant="ghost" size="sm">
              <ArrowDown size={16} aria-hidden />
              {t.hero.ctaHow}
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div data-depth="0.45" data-float className="relative">
            <Blob
              className="absolute -top-10 -left-8 size-44 text-warning/45 sm:size-56"
              variant={0}
            />
            <div className="relative w-full rotate-[-2.5deg]">
              <div
                className="relative aspect-[4/5] w-full bg-surface-accent shadow-lg lg:aspect-[5/6] lg:min-h-[32rem]"
                style={{ clipPath: HERO_MASK }}
              >
                <Image
                  src="/images/auth/adoption.png"
                  alt={t.hero.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40rem"
                  className="object-cover"
                />
              </div>

              <span className="text-caption absolute top-3 right-3 z-10 inline-flex rotate-6 items-center gap-1 rounded-full bg-surface px-2.5 py-1 font-display text-text shadow-md">
                <MapPin size={12} className="text-primary" aria-hidden />
                2.4 km
              </span>

              <span className="text-caption absolute bottom-4 left-3 z-10 inline-flex -rotate-6 items-center gap-1.5 rounded-full bg-honey-600 px-2.5 py-1 font-display text-text shadow-md">
                <HeartDoodle className="size-4 text-(--pink-700)" />
                {t.solution.pillars.match.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      <SectionDivider fill="var(--surface)" />
    </section>
  );
}
