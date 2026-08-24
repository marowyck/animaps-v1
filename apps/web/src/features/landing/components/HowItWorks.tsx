"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UserRound, Sparkles, HeartHandshake } from "lucide-react";
import { SectionDivider } from "./SectionDivider";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    title: "Crie seu perfil",
    desc: "Espaço, tempo e experiência — o essencial para um Match ideal.",
    icon: UserRound,
    color: "bg-pastel-blue text-brand-blue",
    border: "border-blue-200",
  },
  {
    title: "Veja o Match ideal",
    desc: "Animais compatíveis com a sua rotina, não só fotos bonitas.",
    icon: Sparkles,
    color: "bg-pastel-orange text-brand-orange",
    border: "border-orange-200",
  },
  {
    title: "Adote com responsabilidade",
    desc: "Solicite, acompanhe e feche o processo com a ONG.",
    icon: HeartHandshake,
    color: "bg-pastel-green text-brand-green",
    border: "border-green-200",
  },
];

export function HowItWorks() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".step-card", {
        scrollTrigger: { trigger: container.current, start: "top 70%" },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.5)",
      });
    },
    { scope: container },
  );

  return (
    <section
      id="como-funciona"
      ref={container}
      className="relative z-10 bg-white py-28 md:py-32"
    >
      <SectionDivider fill="var(--pastel-sky)" position="top" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-12 md:pt-16">
        <div className="mb-16 text-center">
          <h2 className="font-display mb-4 text-4xl text-ink md:text-5xl">
            Como funciona —{" "}
            <span className="text-brand-orange underline decoration-wavy">
              simples.
            </span>
          </h2>
          <p className="font-bold text-ink-muted">
            Três passos. Sem drama.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, idx) => (
            <div
              key={step.title}
              className={`step-card group relative flex flex-col items-center overflow-hidden rounded-[3rem] border-4 ${step.border} bg-white p-8 text-center shadow-xl transition-transform hover:-translate-y-2`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute top-2 right-6 font-display text-8xl text-gray-100 transition-colors group-hover:text-gray-200"
              >
                {idx + 1}
              </span>
              <div
                className={`relative mb-8 flex h-28 w-28 items-center justify-center rounded-full ${step.color} shadow-sm ring-8 ring-white transition-transform duration-300 group-hover:scale-110`}
              >
                <step.icon size={40} strokeWidth={2.5} />
              </div>
              <h3 className="relative font-display mb-4 text-2xl text-ink">
                {step.title}
              </h3>
              <p className="relative text-lg font-bold leading-relaxed text-ink-muted">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
