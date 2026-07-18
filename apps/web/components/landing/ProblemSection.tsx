"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AlertTriangle, Users, MessageCircleWarning } from "lucide-react";
import { SectionDivider } from "./SectionDivider";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    icon: AlertTriangle,
    title: "Abandono e abrigos lotados",
    body: "Animais sem lar e estruturas sobrecarregadas.",
    color: "bg-pastel-orange text-brand-orange",
    border: "hover:border-brand-orange",
  },
  {
    icon: MessageCircleWarning,
    title: "Redes sem filtro",
    body: "Grupos sem compatibilidade — adoções por impulso.",
    color: "bg-pastel-yellow text-ink",
    border: "hover:border-brand-yellow",
  },
  {
    icon: Users,
    title: "ONGs sem tempo",
    body: "Triagem e follow-up perdidos em planilhas e WhatsApp.",
    color: "bg-pastel-blue text-brand-blue",
    border: "hover:border-brand-blue",
  },
];

export function ProblemSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".problem-card", {
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
      id="problema"
      ref={container}
      className="relative z-10 bg-ink py-28 text-white md:py-32"
    >
      <SectionDivider fill="var(--gray-soft)" position="top" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-12 md:pt-16">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-sm font-black uppercase tracking-wide text-red-300">
          <AlertTriangle size={16} /> O problema
        </div>
        <h2 className="font-display mb-6 max-w-2xl text-4xl leading-tight md:text-6xl">
          Informação dispersa. <br />
          <span className="text-brand-orange">Adoções por impulso.</span>
        </h2>
        <p className="mb-14 max-w-xl text-xl font-medium text-gray-300">
          {/* TODO copy */}
          O silêncio e a bagunça digital machucam. Nós organizamos o caminho até
          o Match ideal.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className={`problem-card rounded-[2.5rem] border-2 border-gray-700 bg-gray-800/50 p-8 backdrop-blur-sm transition-colors ${card.border}`}
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full ${card.color}`}
              >
                <card.icon size={28} strokeWidth={2.5} />
              </div>
              <h3 className="font-display mb-3 text-2xl">{card.title}</h3>
              <p className="font-bold text-gray-400">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
