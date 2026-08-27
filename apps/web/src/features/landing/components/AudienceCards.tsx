"use client";

import { Heart, Building2, Stethoscope, Landmark } from "lucide-react";
import { AnimatedContent, ScrollReveal } from "@/components/bits";

const AUDIENCES = [
  {
    title: "Tutores",
    body: "Encontre um animal compatível com a sua rotina.",
    icon: Heart,
    tone: "bg-pastel-pink",
    iconColor: "text-brand-pink",
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
    tone: "bg-pastel-sky",
    iconColor: "text-brand-green",
  },
  {
    title: "Órgãos e pesquisa",
    body: "Indicadores agregados para quem cuida da cidade.",
    icon: Landmark,
    tone: "bg-pastel-pink",
    iconColor: "text-brand-pink",
  },
];

export function AudienceCards() {
  return (
    <section
      id="para-quem"
      className="relative z-10 bg-gray-soft px-4 py-20 md:py-24"
    >
      <div className="relative z-10 mx-auto max-w-6xl pt-4 md:pt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-green">
          É para você se…
        </p>
        <ScrollReveal>
          <h2 className="font-display mb-3 max-w-xl text-3xl leading-tight tracking-tight text-ink md:text-4xl">
            Feito para quem cuida —{" "}
            <span className="text-brand-green">de formas diferentes.</span>
          </h2>
        </ScrollReveal>
        <p className="mb-8 max-w-lg text-base text-ink-muted">
          Adotante, ONG, clínica ou órgão: crie sua conta e use o que combina
          com o seu papel.
        </p>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((a, i) => (
            <AnimatedContent key={a.title} delay={i * 0.07} distance={24}>
              <article
                className={`h-full rounded-3xl p-5 shadow-sm transition-transform hover:-translate-y-0.5 ${a.tone}`}
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white ${a.iconColor}`}
                >
                  <a.icon size={20} strokeWidth={2.25} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-ink">
                  {a.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {a.body}
                </p>
              </article>
            </AnimatedContent>
          ))}
        </div>
        <a
          href="#lista"
          className="inline-flex min-h-11 items-center rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-pink-hover"
        >
          Criar conta
        </a>
      </div>
    </section>
  );
}
