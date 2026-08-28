"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Menu,
  X,
  PawPrint,
  Home,
  Sparkles,
  ListChecks,
  CircleHelp,
  UserPlus,
  LogIn,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/Button";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useT } from "@/i18n";

const NAV_META: {
  href: string;
  key: "home" | "benefits" | "howToStart" | "faq" | "createAccount" | "login";
  rotation: number;
  hoverBg: string;
  hoverText: string;
  Icon: LucideIcon;
}[] = [
  {
    href: "/#top",
    key: "home",
    rotation: -3,
    hoverBg: "#E07A96",
    hoverText: "#ffffff",
    Icon: Home,
  },
  {
    href: "/#solution",
    key: "benefits",
    rotation: -3,
    hoverBg: "#5FAF6A",
    hoverText: "#ffffff",
    Icon: Sparkles,
  },
  {
    href: "/#how-it-works",
    key: "howToStart",
    rotation: 3,
    hoverBg: "#E07A96",
    hoverText: "#ffffff",
    Icon: ListChecks,
  },
  {
    href: "/#faq",
    key: "faq",
    rotation: -2,
    hoverBg: "#5FAF6A",
    hoverText: "#ffffff",
    Icon: CircleHelp,
  },
  {
    href: "/register",
    key: "createAccount",
    rotation: 2,
    hoverBg: "#E07A96",
    hoverText: "#ffffff",
    Icon: UserPlus,
  },
  {
    href: "/login",
    key: "login",
    rotation: -2,
    hoverBg: "#5FAF6A",
    hoverText: "#ffffff",
    Icon: LogIn,
  },
];

export function Header() {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const nav = NAV_META.map((item) => ({
    ...item,
    label: t.nav[item.key],
  }));

  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!menu) return;

      if (isOpen) {
        gsap.killTweensOf(menu);
        gsap.to(menu, {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          ease: "back.out(1.4)",
          pointerEvents: "auto",
        });
        gsap.fromTo(
          itemsRef.current.filter(Boolean),
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.06,
            ease: "power3.out",
          },
        );
      } else {
        gsap.killTweensOf(menu);
        gsap.to(menu, {
          scale: 0.92,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          pointerEvents: "none",
        });
      }
    },
    { scope: containerRef, dependencies: [isOpen] },
  );

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (clusterRef.current?.contains(target)) return;
      setIsOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  function handleMouseEnter(index: number, bg: string, text: string) {
    gsap.to(itemsRef.current[index], {
      backgroundColor: bg,
      color: text,
      scale: 1.02,
      duration: 0.25,
      ease: "power2.out",
    });
  }

  function handleMouseLeave(index: number) {
    gsap.to(itemsRef.current[index], {
      backgroundColor: "transparent",
      color: "#243028",
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-2 p-3 sm:gap-3 sm:p-4 md:p-6"
    >
      <a
        href="/#top"
        className="pointer-events-auto flex max-w-[42%] cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5 text-base font-semibold text-ink shadow-sm backdrop-blur-sm sm:max-w-none sm:gap-2 sm:px-3 sm:py-2 sm:text-lg"
      >
        <PawPrint size={18} className="shrink-0 text-brand-pink sm:size-5" fill="currentColor" />
        <span className="font-display truncate tracking-tight">ANIMAPS</span>
      </a>

      <div ref={clusterRef} className="pointer-events-auto relative max-w-[58%] sm:max-w-none">
        <div className="flex items-center gap-1 rounded-full border border-white/70 bg-white/90 p-1 shadow-md backdrop-blur-md sm:gap-1.5 sm:p-1.5">
          {/* Full CTAs from md up — on small screens they live in the bubble menu */}
          <Button
            href="/login"
            variant="white"
            size="sm"
            magnetic={false}
            className="!hidden md:!inline-flex"
          >
            <LogIn size={16} className="shrink-0" aria-hidden />
            <span>{t.nav.login}</span>
          </Button>
          <Button
            href="/register"
            variant="pink"
            size="sm"
            magnetic={false}
            className="!hidden md:!inline-flex"
          >
            <PawPrint size={16} className="shrink-0" fill="currentColor" aria-hidden />
            <span className="whitespace-nowrap">{t.nav.createAccount}</span>
          </Button>
          <Button
            type="button"
            variant="soft"
            size="icon"
            magnetic={false}
            selected={isOpen}
            aria-expanded={isOpen}
            aria-controls="bubble-menu"
            aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setIsOpen((v) => !v)}
            className="!size-10 sm:!size-11"
          >
            {isOpen ? <X size={20} strokeWidth={2.25} /> : <Menu size={20} strokeWidth={2.25} />}
          </Button>
        </div>

        <div
          id="bubble-menu"
          ref={menuRef}
          className="absolute top-[calc(100%+0.65rem)] right-0 z-10 flex min-w-60 origin-top-right scale-95 flex-col items-stretch gap-1 rounded-3xl border border-border-soft bg-white/95 p-4 opacity-0 shadow-xl backdrop-blur-xl"
          style={{ pointerEvents: "none" }}
          aria-hidden={!isOpen}
        >
          <div className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            {t.nav.menu}
          </div>
          {nav.map((item, index) => {
            const Icon = item.Icon;
            return (
              <a
                key={item.href}
                href={item.href}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-full px-4 py-2.5 text-left text-base font-semibold tracking-tight text-ink"
                onMouseEnter={() =>
                  handleMouseEnter(index, item.hoverBg, item.hoverText)
                }
                onMouseLeave={() => handleMouseLeave(index)}
                onClick={() => setIsOpen(false)}
              >
                <span>{item.label}</span>
                <Icon size={18} className="shrink-0 opacity-80" aria-hidden />
              </a>
            );
          })}

          <div className="mt-2 border-t border-border-soft pt-3">
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {t.nav.language}
            </div>
            <LocaleSwitcher tone="light" variant="menu" />
          </div>
        </div>
      </div>
    </div>
  );
}
