"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Heart, PawPrint, ArrowDown } from "lucide-react";
import { Button } from "@/components/Button";
import { OrganicBlob } from "./OrganicBlob";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline();
      tl.from(".hero-text", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(
          ".hero-blob",
          {
            scale: 0,
            opacity: 0,
            duration: 1,
            ease: "elastic.out(1, 0.75)",
          },
          "-=0.6",
        )
        .from(
          ".hero-image",
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.5)",
          },
          "-=0.8",
        )
        .from(
          ".hero-cta",
          {
            y: 40,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4",
        );

      if (blobRef.current) {
        gsap.to(blobRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <section
      id="topo"
      ref={containerRef}
      className="relative overflow-hidden px-4 pb-24 pt-32"
    >
      <div ref={blobRef} className="pointer-events-none absolute inset-0">
        <OrganicBlob
          color="yellow"
          className="hero-blob right-0 top-0 h-[500px] w-[500px] translate-x-1/4 -translate-y-1/4 opacity-40 mix-blend-multiply blur-3xl md:h-[700px] md:w-[700px]"
        />
        <OrganicBlob
          color="orange"
          className="bottom-[10%] left-[-5%] h-48 w-48 opacity-50 md:h-72 md:w-72"
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 md:grid-cols-2">
        <div className="hero-text text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-pastel-blue px-4 py-2 text-sm font-bold text-brand-blue">
            <PawPrint size={16} /> Plataforma de proteção animal
          </div>

          <h1 className="font-display mb-6 text-5xl leading-none text-ink drop-shadow-sm md:text-7xl lg:text-8xl">
            O seu melhor <br />
            <span className="text-brand-orange">amigo espera.</span>
          </h1>

          <p className="mb-10 max-w-md text-xl font-bold leading-relaxed text-ink-muted">
            {/* TODO copy — content brief */}
            Unimos tecnologia e coração para o Match ideal — e um mapa de
            ocorrências para quem precisa de ajuda agora.
          </p>

          <div className="hero-cta flex flex-wrap gap-4">
            <Button href="#lista" variant="orange">
              <Heart fill="currentColor" size={22} />
              Entrar na lista de espera
            </Button>
            <Button href="#como-funciona" variant="white">
              <ArrowDown size={22} />
              Ver como funciona
            </Button>
          </div>
        </div>

        <div className="hero-image relative flex justify-center">
          <div className="absolute inset-0 scale-105 rotate-6 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-brand-orange opacity-50" />
          <div className="relative z-10 h-[320px] w-[320px] overflow-hidden rounded-[60%_40%_30%_70%/60%_30%_70%_40%] border-8 border-white shadow-2xl md:h-[420px] md:w-[420px]">
            {/* Placeholder até fotos stock — design brief */}
            <div className="flex h-full w-full items-end justify-end bg-[linear-gradient(160deg,var(--pastel-yellow)_0%,var(--pastel-orange)_50%,var(--pastel-green)_100%)] p-6">
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-ink">
                Foto · placeholder
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
