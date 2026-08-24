"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HelpCircle } from "lucide-react";
import { AccordionItem } from "@/components/AccordionItem";
import { SectionDivider } from "./SectionDivider";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: "Quando o ANIMAPS vai lançar?",
    a: "Estamos em fase de lista de espera. Quem se cadastrar recebe prioridade no acesso ao piloto e avisos de novidades.",
  },
  {
    q: "O ANIMAPS é gratuito?",
    a: "Para tutores e adotantes, o uso básico será gratuito. Modelos para ONGs e clínicas serão definidos no piloto — transparência desde o início.",
  },
  {
    q: "Como funciona o Match ideal?",
    a: "Você cria um perfil com espaço, tempo e experiência. O sistema sugere animais compatíveis com a sua rotina — não é só um feed de fotos.",
  },
  {
    q: "Como ONGs e clínicas participam?",
    a: "ONGs cadastram animais e gerenciam solicitações. Clínicas entram como parceiras verificadas no fluxo de adoção responsável.",
  },
  {
    q: "E se eu encontrar um animal em situação urgente?",
    a: "O mapa de ocorrências permite denúncias georreferenciadas, com ou sem conta — para quem precisa de ajuda agora.",
  },
  {
    q: "Como meus dados são usados?",
    a: "Na lista de espera coletamos nome, e-mail e tipo de perfil com o seu consentimento. Detalhes na política de privacidade.",
  },
  {
    q: "O ANIMAPS funciona em todo o Brasil?",
    a: "Sim — a captação e a mensagem são nacionais. O piloto começa com ONGs parceiras e cresce por região.",
  },
  {
    q: "Vai ter aplicativo para celular?",
    a: "Sim. Começamos pela web e, em seguida, expandimos para Android e iOS — a mesma experiência, no bolso.",
  },
];

export function FAQ() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".faq-item", {
        scrollTrigger: { trigger: container.current, start: "top 75%" },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(1.5)",
      });
    },
    { scope: container },
  );

  return (
    <section
      id="faq"
      ref={container}
      className="relative z-10 bg-pastel-yellow px-4 py-24 md:py-28"
    >
      <SectionDivider fill="var(--ink)" position="top" />

      <div className="relative z-10 mx-auto max-w-3xl pt-12 md:pt-16">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pastel-orange px-4 py-2 text-sm font-black uppercase tracking-wider text-brand-orange">
            <HelpCircle size={16} /> FAQ
          </div>
          <h2 className="font-display text-4xl text-ink md:text-5xl">
            Dúvidas frequentes
          </h2>
          <p className="mt-4 font-bold text-ink-muted">
            {/* TODO copy */}
            Respostas rápidas antes de entrar na lista.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((item) => (
            <div key={item.q} className="faq-item">
              <AccordionItem question={item.q}>
                {/* TODO copy — refine before go-live */}
                {item.a}
              </AccordionItem>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
