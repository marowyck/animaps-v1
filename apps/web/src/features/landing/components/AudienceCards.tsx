"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Building2, Stethoscope, Landmark } from "lucide-react";
import { SectionDivider } from "./SectionDivider";

gsap.registerPlugin(ScrollTrigger);

const AUDIENCES = [
  {
    title: "Tutores",
    body: "Encontre um animal compatível com a sua rotina.",
    icon: Heart,
    tone: "bg-pastel-orange",
    iconColor: "text-brand-orange",
  },
  {
    title: "ONGs",
    body: "Cadastre animais e gerencie solicitações sem planilha.",
    icon: Building2,
    tone: "bg-pastel-green",
    iconColor: "text-brand-green",
  },
  {
    title: "Clínicas",
    body: "Parceria verificada no fluxo de adoção responsável.",
    icon: Stethoscope,
    tone: "bg-pastel-blue",
    iconColor: "text-brand-blue",
  },
  {
    title: "Órgãos e pesquisa",
    body: "Menção institucional — indicadores agregados no futuro.",
    icon: Landmark,
    tone: "bg-pastel-purple",
    iconColor: "text-brand-purple",
  },
];

export function AudienceCards() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".audience-card", {
        scrollTrigger: { trigger: container.current, start: "top 75%" },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "back.out(1.5)",
      });
    },
    { scope: container },
  );

  return (
    <section
      id="para-quem"
      ref={container}
      className="relative z-10 bg-gray-soft px-4 py-24 md:py-28"
    >
      <SectionDivider fill="#ffffff" position="top" />

      <div className="relative z-10 mx-auto max-w-6xl pt-12 md:pt-16">
        <p className="mb-3 text-sm font-black uppercase tracking-wider text-brand-purple">
          Para quem é
        </p>
        <h2 className="font-display mb-12 max-w-xl text-4xl leading-tight text-ink md:text-5xl">
          Feito para quem cuida — de formas diferentes.
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((a) => (
            <article
              key={a.title}
              className={`audience-card rounded-[2rem] p-6 shadow-sm transition-transform hover:-translate-y-1 ${a.tone}`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white ${a.iconColor}`}
              >
                <a.icon size={24} strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-xl text-ink">{a.title}</h3>
              <p className="mt-3 text-sm font-bold text-ink-muted">{a.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
