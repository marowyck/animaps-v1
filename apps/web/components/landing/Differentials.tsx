"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, MapPinned, BadgeCheck, Shield } from "lucide-react";
import { SectionDivider } from "./SectionDivider";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    icon: Sparkles,
    title: "Match ideal",
    text: "Não é feed infinito — é compatibilidade com a sua rotina.",
    color: "bg-pastel-orange text-brand-orange",
    tone: "bg-pastel-orange/50",
  },
  {
    icon: MapPinned,
    title: "Mapa de ocorrências",
    text: "Denúncias georreferenciadas, com ou sem conta.",
    color: "bg-white text-brand-blue",
    tone: "bg-pastel-blue",
  },
  {
    icon: BadgeCheck,
    title: "Perfis verificados",
    text: "ONGs e clínicas no mesmo fluxo, com confiança.",
    color: "bg-white text-brand-green",
    tone: "bg-pastel-green",
  },
  {
    icon: Shield,
    title: "LGPD desde o início",
    text: "Consentimento claro — dados com responsabilidade.",
    color: "bg-white text-brand-purple",
    tone: "bg-pastel-purple",
  },
];

export function Differentials() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".diff-card", {
        scrollTrigger: { trigger: container.current, start: "top 75%" },
        y: 36,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "back.out(1.5)",
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative z-10 bg-white px-4 py-24 md:py-28"
    >
      <SectionDivider fill="var(--gray-soft)" position="top" />

      <div className="relative z-10 mx-auto max-w-6xl pt-12 md:pt-16">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-black uppercase tracking-wider text-brand-green">
            Por que o ANIMAPS
          </p>
          <h2 className="font-display text-4xl text-ink md:text-5xl">
            Diferenciais
          </h2>
          <p className="mt-4 text-lg font-bold text-ink-muted">
            O que muda em relação a grupos de redes sociais e planilhas soltas.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {ITEMS.map((item) => (
            <article
              key={item.title}
              className={`diff-card flex gap-4 rounded-[2rem] p-6 transition-transform hover:-translate-y-1 ${item.tone}`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm ${item.color}`}
              >
                <item.icon size={24} strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="text-lg font-black text-ink">{item.title}</h3>
                <p className="mt-1 text-sm font-bold leading-relaxed text-ink-muted">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
