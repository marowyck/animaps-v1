"use client";

import {
  Sparkles,
  Building2,
  Users,
  Stethoscope,
  Leaf,
  AlertTriangle,
  TreePine,
  MapPinned,
  Landmark,
  HeartHandshake,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/Button";
import { AnimatedContent, ScrollReveal } from "@/components/bits";
import { SectionDivider } from "./SectionDivider";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Match inteligente",
    body: "Compatibilidade real entre você e o animal — rotina, espaço e experiência.",
    tone: "bg-pastel-pink text-brand-pink",
  },
  {
    icon: Building2,
    title: "Cadastro de ONGs",
    body: "Organizações verificadas no mesmo fluxo da adoção responsável.",
    tone: "bg-pastel-green text-brand-green",
  },
  {
    icon: HeartHandshake,
    title: "Gestão de animais",
    body: "Cadastre, acompanhe solicitações e feche adoções sem planilha.",
    tone: "bg-pastel-pink text-brand-pink",
  },
  {
    icon: Users,
    title: "Comunidade pós-adoção",
    body: "Apoio contínuo depois que o match vira lar.",
    tone: "bg-pastel-green text-brand-green",
  },
  {
    icon: Stethoscope,
    title: "Marketplace de veterinários",
    body: "Profissionais no caminho do cuidado — quando você precisar.",
    tone: "bg-pastel-pink text-brand-pink",
  },
  {
    icon: Leaf,
    title: "Rede de biólogos",
    body: "Especialistas conectados à proteção da fauna.",
    tone: "bg-pastel-green text-brand-green",
  },
  {
    icon: AlertTriangle,
    title: "Registro de abandono e maus-tratos",
    body: "Denúncias organizadas para quem precisa de ajuda agora.",
    tone: "bg-pastel-pink text-brand-pink",
  },
  {
    icon: TreePine,
    title: "Registro de fauna silvestre",
    body: "Registro responsável de ocorrências com fauna silvestre.",
    tone: "bg-pastel-green text-brand-green",
  },
  {
    icon: MapPinned,
    title: "Mapa georreferenciado",
    body: "Ocorrências no mapa — contexto real, ação mais rápida.",
    tone: "bg-pastel-pink text-brand-pink",
  },
  {
    icon: Landmark,
    title: "Apoio a órgãos públicos",
    body: "Indicadores e fluxo pensados para políticas de proteção animal.",
    tone: "bg-pastel-green text-brand-green",
  },
];

export function Differentials() {
  return (
    <section
      id="diferenciais"
      className="relative z-10 bg-white px-4 py-20 md:py-24"
    >
      <SectionDivider fill="var(--gray-soft)" position="top" />

      <div className="relative z-10 mx-auto max-w-6xl pt-10 md:pt-12">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-green">
            O que o ANIMAPS traz
          </p>
          <ScrollReveal>
            <h2 className="font-display text-3xl tracking-tight text-ink md:text-4xl">
              Tudo o que você precisa em{" "}
              <span className="text-brand-pink">uma conta.</span>
            </h2>
          </ScrollReveal>
          <p className="mt-3 text-base leading-relaxed text-ink-muted md:text-lg">
            Do match ao mapa — recursos pensados para adotantes, ONGs e quem
            protege animais.
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((item, i) => (
            <AnimatedContent key={item.title} delay={i * 0.05} distance={22}>
              <article className="flex h-full gap-4 rounded-3xl border border-border-soft bg-gray-soft/50 p-5 shadow-sm transition-transform hover:-translate-y-0.5">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${item.tone}`}
                >
                  <item.icon size={20} strokeWidth={2.25} />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </div>
              </article>
            </AnimatedContent>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href="#lista" variant="pink">
            <UserPlus size={18} />
            Criar conta no ANIMAPS
          </Button>
        </div>
      </div>
    </section>
  );
}
