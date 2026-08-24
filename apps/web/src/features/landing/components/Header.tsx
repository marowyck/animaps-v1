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
    hoverBg: "#F89D1C",
    hoverText: "#ffffff",
  },
  {
    label: "Problema",
    href: "#problema",
    rotation: 3,
    hoverBg: "#FFD400",
    hoverText: "#333333",
  },
  {
    label: "Solução",
    href: "#solucao",
    rotation: -3,
    hoverBg: "#00A0E3",
    hoverText: "#ffffff",
  },
  {
    label: "Como funciona",
    href: "#como-funciona",
    rotation: 3,
    hoverBg: "#68BC45",
    hoverText: "#ffffff",
  },
  {
    label: "FAQ",
    href: "#faq",
    rotation: -2,
    hoverBg: "#FFD400",
    hoverText: "#333333",
  },
  {
    label: "Lista",
    href: "#lista",
    rotation: 2,
    hoverBg: "#92278F",
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
      scale: 1.1,
      duration: 0.3,
      ease: "power2.out",
    });
  }

  function handleMouseLeave(index: number) {
    gsap.to(itemsRef.current[index], {
      backgroundColor: "transparent",
      color: "#111111",
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between p-5 md:p-6"
    >
      <a
        href="#topo"
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/90 p-3 text-xl font-bold text-ink shadow-sm backdrop-blur-sm"
      >
        <PawPrint
          size={24}
          className="text-brand-orange"
          fill="currentColor"
        />
        <span className="tracking-tight">ANIMAPS</span>
      </a>

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="pointer-events-auto z-50 rounded-full bg-white p-4 text-ink shadow-lg transition-transform hover:scale-110 active:scale-95"
        aria-expanded={isOpen}
        aria-controls="bubble-menu"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        id="bubble-menu"
        ref={menuRef}
        className="pointer-events-auto fixed top-4 right-4 flex min-w-[220px] origin-top-right flex-col items-center gap-3 rounded-[2.5rem] border border-border-soft bg-white/95 p-8 opacity-0 scale-90 shadow-2xl backdrop-blur-xl"
        aria-hidden={!isOpen}
      >
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-ink-muted">
          Menu
        </div>
        {NAV.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            className="block rounded-full px-6 py-2 text-center text-3xl font-extrabold tracking-tight text-ink md:text-4xl"
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
