"use client";

import {
  Sparkles,
  Building2,
  Stethoscope,
  MapPinned,
  BarChart3,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/Button";
import {
  AnimatedContent,
  DotGrid,
  ScrollReveal,
  updateDotGridVars,
} from "@/components/bits";
import { useRef } from "react";
import { SectionDivider } from "./SectionDivider";

const PILLARS = [
  {
    icon: Sparkles,
    title: "Match inteligente",
    body: "Você vê animais compatíveis com a sua rotina — não só fotos bonitas.",
  },
  {
    icon: Building2,
    title: "Gestão para ONGs",
    body: "Cadastre animais e acompanhe solicitações sem planilha infinita.",
  },
  {
    icon: Stethoscope,
    title: "Marketplace de profissionais",
    body: "Veterinários e especialistas no mesmo fluxo de cuidado.",
  },
  {
    icon: MapPinned,
    title: "Georreferenciamento",
    body: "Mapa de ocorrências para denunciar e agir com contexto.",
  },
  {
    icon: BarChart3,
    title: "Indicadores ambientais",
    body: "Dados que ajudam quem cuida da cidade e da fauna.",
  },
];

export function SolutionSection() {
  const container = useRef<HTMLElement>(null);

  return (
    <section
      id="solucao"
      ref={container}
      className="relative z-10 overflow-x-hidden bg-pastel-sky py-20 md:py-24"
      onMouseMove={(e) => {
        if (container.current) {
          updateDotGridVars(container.current, e.clientX, e.clientY);
        }
      }}
    >
      <SectionDivider fill="var(--gray-soft)" position="top" />
      <DotGrid
        opacity={0.4}
        gap={30}
        baseColor="rgba(224, 122, 150, 0.12)"
        activeColor="rgba(95, 175, 106, 0.3)"
        proximity={110}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-10 md:pt-12">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-4 inline-block rounded-full border border-brand-green/30 bg-pastel-green px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-green">
            O produto
          </div>
          <ScrollReveal>
            <h2 className="font-display mb-4 text-3xl leading-tight tracking-tight text-ink md:text-4xl">
              Uma plataforma.{" "}
              <span className="text-brand-green">Todo o cuidado.</span>
            </h2>
          </ScrollReveal>
          <p className="text-base leading-relaxed text-ink-muted md:text-lg">
            Com a sua conta você ganha match responsável, mapa de ocorrências e
            um só lugar para{" "}
            <span className="font-semibold text-brand-pink">adotantes</span>,{" "}
            <span className="font-semibold text-brand-green">ONGs</span>,{" "}
            <span className="font-semibold text-brand-blue">veterinários</span> e{" "}
            <span className="font-semibold text-brand-green">órgãos públicos</span>.
          </p>
        </div>

        <ul className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((item, i) => (
            <AnimatedContent key={item.title} delay={i * 0.08} distance={28}>
              <li className="flex h-full items-start gap-4 rounded-3xl border border-transparent bg-white p-5 shadow-sm transition-colors hover:border-brand-pink/25">
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pastel-pink text-brand-pink">
                  <item.icon size={22} strokeWidth={2.25} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted md:text-base">
                    {item.body}
                  </p>
                </div>
              </li>
            </AnimatedContent>
          ))}
        </ul>

        <div className="flex justify-center">
          <Button href="#lista" variant="pink">
            <UserPlus size={18} />
            Criar conta
          </Button>
        </div>
      </div>
    </section>
  );
}
