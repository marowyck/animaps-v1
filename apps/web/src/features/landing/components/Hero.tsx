"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { UserPlus, ArrowDown, PawPrint } from "lucide-react";
import { Button } from "@/components/Button";
import {
  DotGrid,
  ScrollReveal,
  TiltedCard,
  updateDotGridVars,
} from "@/components/bits";
import { OrganicBlob } from "./OrganicBlob";
import { useT } from "@/i18n";

gsap.registerPlugin(ScrollTrigger);

const PAW_MARKS = [
  { top: "8%", left: "5%", size: 34, rotate: -18, opacity: 0.28, color: "pink" },
  { top: "14%", left: "22%", size: 22, rotate: 14, opacity: 0.2, color: "green" },
  { top: "10%", left: "48%", size: 28, rotate: -8, opacity: 0.22, color: "pink" },
  { top: "16%", left: "72%", size: 40, rotate: 24, opacity: 0.26, color: "pink" },
  { top: "12%", left: "90%", size: 24, rotate: -30, opacity: 0.2, color: "green" },
  { top: "28%", left: "8%", size: 26, rotate: 20, opacity: 0.24, color: "green" },
  { top: "32%", left: "30%", size: 18, rotate: -22, opacity: 0.18, color: "pink" },
  { top: "26%", left: "58%", size: 32, rotate: 10, opacity: 0.22, color: "green" },
  { top: "34%", left: "84%", size: 36, rotate: -16, opacity: 0.28, color: "pink" },
  { top: "44%", left: "3%", size: 42, rotate: 8, opacity: 0.22, color: "pink" },
  { top: "48%", left: "18%", size: 20, rotate: 28, opacity: 0.2, color: "green" },
  { top: "42%", left: "40%", size: 24, rotate: -12, opacity: 0.16, color: "pink" },
  { top: "50%", left: "66%", size: 30, rotate: 18, opacity: 0.24, color: "pink" },
  { top: "46%", left: "92%", size: 28, rotate: -26, opacity: 0.26, color: "green" },
  { top: "60%", left: "10%", size: 22, rotate: -14, opacity: 0.22, color: "green" },
  { top: "64%", left: "28%", size: 36, rotate: 32, opacity: 0.26, color: "pink" },
  { top: "58%", left: "52%", size: 18, rotate: -6, opacity: 0.18, color: "green" },
  { top: "62%", left: "76%", size: 34, rotate: -20, opacity: 0.24, color: "pink" },
  { top: "70%", left: "4%", size: 30, rotate: 12, opacity: 0.2, color: "pink" },
  { top: "74%", left: "38%", size: 26, rotate: -28, opacity: 0.24, color: "green" },
  { top: "78%", left: "58%", size: 38, rotate: 16, opacity: 0.28, color: "pink" },
  { top: "72%", left: "88%", size: 22, rotate: 8, opacity: 0.2, color: "green" },
  { top: "86%", left: "16%", size: 28, rotate: 22, opacity: 0.22, color: "pink" },
  { top: "88%", left: "48%", size: 24, rotate: -10, opacity: 0.2, color: "green" },
  { top: "84%", left: "70%", size: 32, rotate: 30, opacity: 0.26, color: "pink" },
  { top: "90%", left: "92%", size: 20, rotate: -18, opacity: 0.18, color: "green" },
] as const;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Hero() {
  const t = useT();
  const containerRef = useRef<HTMLElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline();
      tl.from(".hero-text", {
        x: -36,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out",
      })
        .from(
          ".hero-blob",
          {
            scale: 0.85,
            opacity: 0,
            duration: 0.9,
            ease: "elastic.out(1, 0.75)",
          },
          "-=0.45",
        )
        .from(
          ".hero-image",
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.5)",
          },
          "-=0.6",
        )
        .from(
          ".hero-cta",
          {
            y: 20,
            opacity: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.3",
        );

      if (blobRef.current) {
        gsap.to(blobRef.current, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative flex min-h-[88vh] flex-col justify-center overflow-x-hidden px-4 pb-28 pt-32 md:min-h-[92vh] md:pb-32 md:pt-36"
      onMouseMove={(e) => {
        if (containerRef.current) {
          updateDotGridVars(containerRef.current, e.clientX, e.clientY);
        }
      }}
    >
      <DotGrid opacity={0.5} gap={28} proximity={130} />

      <div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden
      >
        {PAW_MARKS.map((paw, i) => (
          <PawPrint
            key={i}
            size={paw.size}
            fill="currentColor"
            strokeWidth={0}
            className={`absolute ${paw.color === "green" ? "text-brand-green" : "text-brand-pink"}`}
            style={{
              top: paw.top,
              left: paw.left,
              opacity: paw.opacity,
              transform: `rotate(${paw.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div ref={blobRef} className="pointer-events-none absolute inset-0 z-[1]">
        <OrganicBlob
          color="pink"
          className="hero-blob -right-8 top-[8%] h-[280px] w-[280px] opacity-40 blur-3xl md:h-[400px] md:w-[400px]"
        />
        <OrganicBlob
          color="green"
          className="bottom-[18%] left-[-4%] h-44 w-44 opacity-35 blur-2xl md:h-64 md:w-64"
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
        <div className="hero-text min-w-0 text-left">
          <h1 className="font-display mb-4 text-4xl leading-[1.12] tracking-tight text-ink md:text-5xl lg:text-6xl">
            {t.hero.titleLine1} <br />
            <span className="text-brand-pink">{t.hero.titleHighlight}</span>
          </h1>

          <ScrollReveal className="mb-8 max-w-md text-base leading-relaxed text-ink-muted md:text-lg">
            {t.hero.body}
          </ScrollReveal>

          <div className="hero-cta flex flex-wrap gap-3">
            <Button href="/register" variant="pink" magnetic={false}>
              <UserPlus size={18} />
              {t.hero.ctaAccount}
            </Button>
            <Button href="/#how-it-works" variant="white" magnetic={false}>
              <ArrowDown size={18} />
              {t.hero.ctaHow}
            </Button>
          </div>
        </div>

        <div className="hero-image relative flex justify-center md:justify-end">
          <TiltedCard rotateAmplitude={8} scaleOnHover={1.03}>
            <div className="relative">
              <div className="absolute inset-0 scale-105 rotate-6 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-brand-green/40" />
              <div className="relative z-10 h-[340px] w-[340px] overflow-hidden rounded-[60%_40%_30%_70%/60%_30%_70%_40%] border-[6px] border-white shadow-xl md:h-[460px] md:w-[460px]">
                <Image
                  src="/images/hero-pet.jpg"
                  alt={t.hero.imageAlt}
                  fill
                  priority
                  quality={95}
                  className="object-cover"
                  style={{ objectPosition: "68% 52%" }}
                  sizes="(max-width: 768px) 680px, 920px"
                />
              </div>
            </div>
          </TiltedCard>
        </div>
      </div>
    </section>
  );
}
