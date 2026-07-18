"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionDivider } from "./SectionDivider";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    value: "1.000+",
    label: "Meta de interessados no piloto",
    accent: "text-brand-orange",
  },
  {
    value: "50+",
    label: "Meta de ONGs parceiras",
    accent: "text-brand-blue",
  },
  {
    value: "Nacional",
    label: "Escopo de captação",
    accent: "text-brand-green",
  },
];

export function SocialProofCarousel() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".stat-card", {
        scrollTrigger: { trigger: container.current, start: "top 75%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.5)",
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative z-10 overflow-hidden bg-ink px-4 py-20 text-white md:py-24"
    >
      <SectionDivider fill="#ffffff" position="top" />

      <div className="relative z-10 mx-auto max-w-6xl pt-12 md:pt-16">
        <p className="mb-2 text-sm font-black uppercase tracking-widest text-brand-yellow">
          Prova social
        </p>
        <p className="max-w-lg text-sm font-medium text-gray-400">
          Números projetados do piloto. Atualizaremos com dados reais assim que
          a lista e as parcerias amadurecerem.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <article
              key={s.label}
              className="stat-card rounded-[2rem] border-2 border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm"
            >
              <p className={`text-3xl font-black tracking-tight md:text-4xl ${s.accent}`}>
                {s.value}
              </p>
              <p className="mt-2 text-sm font-bold text-gray-400">{s.label}</p>
            </article>
          ))}
          <article className="stat-card rounded-[2rem] border-2 border-dashed border-gray-600 p-6">
            <p className="text-xl font-black text-gray-500">Espaço parceiros</p>
            <p className="mt-2 text-sm font-bold text-gray-500">
              Em breve: logos de ONGs confirmadas.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
