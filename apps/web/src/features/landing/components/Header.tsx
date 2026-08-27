"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Menu, X, PawPrint } from "lucide-react";

const NAV = [
  {
    label: "Início",
    href: "#topo",
    rotation: -3,
    hoverBg: "#E07A96",
    hoverText: "#ffffff",
  },
  {
    label: "Benefícios",
    href: "#solucao",
    rotation: -3,
    hoverBg: "#5FAF6A",
    hoverText: "#ffffff",
  },
  {
    label: "Como começar",
    href: "#como-funciona",
    rotation: 3,
    hoverBg: "#E07A96",
    hoverText: "#ffffff",
  },
  {
    label: "FAQ",
    href: "#faq",
    rotation: -2,
    hoverBg: "#5FAF6A",
    hoverText: "#ffffff",
  },
  {
    label: "Criar conta",
    href: "#lista",
    rotation: 2,
    hoverBg: "#E07A96",
    hoverText: "#ffffff",
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(
    () => {
      if (isOpen) {
        gsap.to(menuRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.5)",
          pointerEvents: "all",
        });
        gsap.fromTo(
          itemsRef.current,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            rotation: (i: number) => NAV[i]?.rotation ?? 0,
          },
        );
      } else {
        gsap.to(menuRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          pointerEvents: "none",
        });
      }
    },
    { scope: containerRef, dependencies: [isOpen] },
  );

  function handleMouseEnter(index: number, bg: string, text: string) {
    gsap.to(itemsRef.current[index], {
      backgroundColor: bg,
      color: text,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  }

  function handleMouseLeave(index: number) {
    gsap.to(itemsRef.current[index], {
      backgroundColor: "transparent",
      color: "#243028",
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-3 p-5 md:p-6"
    >
      <a
        href="#topo"
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-lg font-semibold text-ink shadow-sm backdrop-blur-sm"
      >
        <PawPrint size={20} className="text-brand-pink" fill="currentColor" />
        <span className="font-display tracking-tight">ANIMAPS</span>
      </a>

      <div className="pointer-events-auto flex items-center gap-3">
        <a
          href="#lista"
          className="hidden min-h-11 items-center rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-pink-hover sm:inline-flex"
        >
          Criar conta
        </a>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="z-50 rounded-full bg-white p-3 text-ink shadow-md transition-transform hover:scale-105 active:scale-95"
          aria-expanded={isOpen}
          aria-controls="bubble-menu"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        id="bubble-menu"
        ref={menuRef}
        className="pointer-events-auto fixed top-4 right-4 flex min-w-[200px] origin-top-right scale-90 flex-col items-stretch gap-1 rounded-3xl border border-border-soft bg-white/95 p-5 opacity-0 shadow-xl backdrop-blur-xl"
        aria-hidden={!isOpen}
      >
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Menu
        </div>
        {NAV.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            className="block rounded-full px-4 py-2.5 text-left text-base font-semibold tracking-tight text-ink"
            onMouseEnter={() =>
              handleMouseEnter(index, item.hoverBg, item.hoverText)
            }
            onMouseLeave={() => handleMouseLeave(index)}
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
