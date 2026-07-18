"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeartHandshake, MapPinned, Building2 } from "lucide-react";
import { SectionDivider } from "./SectionDivider";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    icon: HeartHandshake,
    title: "Match ideal",
    body: "Compatibilidade real — não só “bonitinho”.",
    color: "bg-pastel-orange text-brand-orange",
  },
  {
    icon: MapPinned,
    title: "Mapa de ocorrências",
    body: "Denúncias georreferenciadas, com ou sem conta.",
    color: "bg-pastel-blue text-brand-blue",
  },
  {
    icon: Building2,
    title: "ONGs e clínicas",
    body: "Mesmo fluxo, perfis verificados.",
    color: "bg-pastel-green text-brand-green",
  },
];

export function SolutionSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".solution-item", {
        scrollTrigger: { trigger: container.current, start: "top 75%" },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "back.out(1.5)",
      });
    },
    { scope: container },
  );

  return (
    <section
      id="solucao"
      ref={container}
      className="relative z-10 bg-pastel-sky py-24 md:py-28"
    >
      <SectionDivider fill="#333333" position="top" />

      {/*
        Two equal columns (sum = full width). Avoid 5+8 on a 12-col grid
        (13 > 12 wraps the cards below). Oi glyphs are wide — clip +
        line breaks keep the title inside its column.
      */}
      <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-10 px-4 pt-12 md:grid-cols-2 md:gap-12 md:pt-16 lg:gap-16">
        <div className="min-w-0 overflow-x-clip">
          <div className="mb-6 inline-block rounded-full border-2 border-blue-200 bg-pastel-blue px-4 py-2 text-sm font-black uppercase tracking-wider text-brand-blue">
            A solução
          </div>
          <h2 className="font-display mb-6 text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.1] text-ink">
            Match ideal +
            <br />
            <span className="text-brand-blue">
              mapa de
              <br />
              ocorrências.
            </span>
          </h2>
          <p className="max-w-md text-lg font-bold leading-relaxed text-ink-muted">
            Tecnologia e coração no mesmo lugar — para adotar com
            responsabilidade e denunciar com segurança.
          </p>
        </div>

        <ul className="relative z-10 min-w-0 space-y-4">
          {ITEMS.map((item) => (
            <li
              key={item.title}
              className="solution-item flex items-start gap-4 rounded-[2rem] border-2 border-transparent bg-white p-5 shadow-sm transition-colors hover:border-brand-blue/30"
            >
              <div
                className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.color}`}
              >
                <item.icon size={24} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-black text-ink">{item.title}</h3>
                <p className="font-medium text-ink-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
