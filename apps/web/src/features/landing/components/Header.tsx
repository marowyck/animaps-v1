"use client";

import Link from "next/link";
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
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const NAV_META: {
  href: string;
  key: "home" | "benefits" | "howToStart" | "faq" | "createAccount" | "login";
  rotation: number;
  /** CSS variable name, resolved at interaction time so GSAP gets a real color. */
  hoverBg: "--primary" | "--secondary";
  Icon: LucideIcon;
}[] = [
  {
    href: "/#top",
    key: "home",
    rotation: -3,
    hoverBg: "--primary",
    Icon: Home,
  },
  {
    href: "/#solution",
    key: "benefits",
    rotation: -3,
    hoverBg: "--secondary",
    Icon: Sparkles,
  },
  {
    href: "/#how-it-works",
    key: "howToStart",
    rotation: 3,
    hoverBg: "--primary",
    Icon: ListChecks,
  },
  {
    href: "/#faq",
    key: "faq",
    rotation: -2,
    hoverBg: "--secondary",
    Icon: CircleHelp,
  },
  {
    href: "/register",
    key: "createAccount",
    rotation: 2,
    hoverBg: "--primary",
    Icon: UserPlus,
  },
  {
    href: "/login",
    key: "login",
    rotation: -2,
    hoverBg: "--secondary",
    Icon: LogIn,
  },
];

export function Header() {
  const t = useT();
  const reduced = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

      if (reduced) {
        gsap.set(menu, {
          scale: 1,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        });
        gsap.set(itemsRef.current.filter(Boolean), { y: 0, opacity: 1 });
        return;
      }

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
    { scope: containerRef, dependencies: [isOpen, reduced] },
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  function handleMouseEnter(index: number, bgToken: "--primary" | "--secondary") {
    if (reduced) return;
    gsap.to(itemsRef.current[index], {
      backgroundColor: readToken(bgToken),
      color: readToken("--surface"),
      scale: 1.02,
      duration: 0.25,
      ease: "power2.out",
    });
  }

  function handleMouseLeave(index: number) {
    if (reduced) return;
    gsap.to(itemsRef.current[index], {
      backgroundColor: "transparent",
      color: readToken("--text"),
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  }

  return (
    <header
      ref={containerRef}
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-200",
        scrolled || isOpen
          ? "border-b border-border-subtle bg-surface/90 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
      <Link
        href="/#top"
        className="flex min-w-0 items-center gap-2 text-text"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-surface-elevated">
          <PawPrint size={18} aria-hidden />
        </span>
        <span className="font-display truncate text-xl tracking-tight">{t.brand}</span>
      </Link>

      <nav className="hidden items-center gap-1 lg:flex" aria-label={t.nav.menu}>
        {(
          [
            { href: "/#how-it-works", key: "howToStart" },
            { href: "/#audience-guardians", key: "forPeople" },
            { href: "/#audience-ngos", key: "forOrganizations" },
            { href: "/#audience-agencies", key: "forInstitutions" },
          ] as const
        ).map((item) => (
          <a
            key={item.key}
            href={item.href}
            className="rounded-full px-3 py-2 text-body-sm font-semibold text-text-secondary transition-colors hover:bg-surface-hover hover:text-text"
          >
            {t.nav[item.key]}
          </a>
        ))}
      </nav>

      <div ref={clusterRef} className="relative">
        <div className="flex items-center gap-1 rounded-full bg-secondary-soft px-1.5 py-1">
          <LocaleSwitcher tone="light" variant="menu" />
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
            className="!size-10 lg:!hidden"
          >
            {isOpen ? <X size={20} strokeWidth={2.25} /> : <Menu size={20} strokeWidth={2.25} />}
          </Button>
        </div>

        <div
          id="bubble-menu"
          ref={menuRef}
          className="absolute top-[calc(100%+0.65rem)] right-0 z-10 flex min-w-64 origin-top-right scale-95 flex-col items-stretch gap-1 rounded-2xl border border-border-subtle bg-surface-elevated p-3 opacity-0 shadow-lg lg:hidden"
          style={{ pointerEvents: "none" }}
          aria-hidden={!isOpen}
        >
          <div className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            {t.nav.menu}
          </div>
          {nav.map((item, index) => {
            const Icon = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-full px-4 py-2.5 text-left text-base font-semibold tracking-tight text-ink"
                onMouseEnter={() => handleMouseEnter(index, item.hoverBg)}
                onMouseLeave={() => handleMouseLeave(index)}
                onClick={() => setIsOpen(false)}
              >
                <span>{item.label}</span>
                <Icon size={18} className="shrink-0 opacity-80" aria-hidden />
              </Link>
            );
          })}
        </div>
      </div>
      </div>
    </header>
  );
}
