"use client";

import {
  UserPlus,
  UserRound,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/Button";
import { AnimatedContent, ScrollReveal } from "@/components/bits";
import { SectionDivider } from "./SectionDivider";

const STEPS = [
  {
    title: "Crie sua conta",
    desc: "Garanta seu acesso à plataforma com prioridade no piloto.",
    icon: UserPlus,
    color: "bg-pastel-pink text-brand-pink",
    border: "border-brand-pink/25",
  },
  {
    title: "Complete seu perfil",
    desc: "Espaço, tempo e experiência — base do seu Match ideal.",
    icon: UserRound,
    color: "bg-pastel-green text-brand-green",
    border: "border-brand-green/25",
  },
  {
    title: "Veja o Match e o mapa",
    desc: "Animais compatíveis com a sua rotina e ocorrências perto de você.",
    icon: Sparkles,
    color: "bg-pastel-pink text-brand-pink",
    border: "border-brand-pink/25",
  },
  {
    title: "Adote com responsabilidade",
    desc: "Solicite, acompanhe com a ONG e faça parte da comunidade.",
    icon: HeartHandshake,
    color: "bg-pastel-green text-brand-green",
    border: "border-brand-green/25",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative z-10 bg-pastel-green pt-20 pb-10 md:pt-24 md:pb-12"
    >
      <SectionDivider fill="var(--pastel-sky)" position="top" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-10 md:pt-12">
        <div className="mb-12 text-center">
          <ScrollReveal>
            <h2 className="font-display mb-2 text-3xl tracking-tight text-ink md:text-4xl">
              Da conta ao match —{" "}
              <span className="text-brand-pink">simples.</span>
            </h2>
          </ScrollReveal>
          <p className="text-base text-ink-muted">
            Quatro passos para você entrar na plataforma e cuidar de verdade.
          </p>
        </div>

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => (
            <AnimatedContent key={step.title} delay={idx * 0.1} distance={28}>
              <div
                className={`group relative flex h-full flex-col items-center overflow-hidden rounded-3xl border-2 ${step.border} bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-0.5`}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-2 right-4 font-display text-5xl text-ink/5"
                >
                  {idx + 1}
                </span>
                <div
                  className={`relative mb-5 flex h-16 w-16 items-center justify-center rounded-full ${step.color} shadow-sm ring-4 ring-white transition-transform duration-300 group-hover:scale-105`}
                >
                  <step.icon size={28} strokeWidth={2.25} />
                </div>
                <h3 className="relative mb-2 text-lg font-semibold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-ink-muted">
                  {step.desc}
                </p>
              </div>
            </AnimatedContent>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href="#lista" variant="pink">
            <UserPlus size={18} />
            Criar minha conta
          </Button>
        </div>
      </div>
    </section>
  );
}
