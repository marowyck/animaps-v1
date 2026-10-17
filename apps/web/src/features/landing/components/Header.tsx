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
import { DURATION, EASE, STAGGER } from "@/lib/motion";
import { AUDIENCE_EVENT, type AudienceKey } from "../audience";

const NAV_META: {
  href: string;
  key: "home" | "benefits" | "howToStart" | "faq" | "createAccount" | "login";
  Icon: LucideIcon;
}[] = [
  { href: "/#top", key: "home", Icon: Home },
  { href: "/#solution", key: "benefits", Icon: Sparkles },
  { href: "/#how-it-works", key: "howToStart", Icon: ListChecks },
  { href: "/#faq", key: "faq", Icon: CircleHelp },
  { href: "/register", key: "createAccount", Icon: UserPlus },
  { href: "/login", key: "login", Icon: LogIn },
];

const DESKTOP_NAV = [
  { href: "/#how-it-works", key: "howToStart", section: "how-it-works" },
  { href: "/#audience-guardians", key: "forPeople", section: "audience", audience: "guardians" },
  { href: "/#audience-ngos", key: "forOrganizations", section: "audience", audience: "ngos" },
  { href: "/#audience-agencies", key: "forInstitutions", section: "audience", audience: "agencies" },
] as const;

/** Which landing section is under the header, plus the audience tab currently shown. */
function useActiveSection() {
  const [section, setSection] = useState<string | null>(null);
  const [audience, setAudience] = useState<AudienceKey>("guardians");

  useEffect(() => {
    const ids = ["how-it-works", "audience"];
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => !!n);
    if (!nodes.length) return;
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        setSection(ids.find((id) => visible.get(id)) ?? null);
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    nodes.forEach((n) => observer.observe(n));

    const onAudience = (e: Event) => setAudience((e as CustomEvent<AudienceKey>).detail);
    window.addEventListener(AUDIENCE_EVENT, onAudience);
    return () => {
      observer.disconnect();
      window.removeEventListener(AUDIENCE_EVENT, onAudience);
    };
  }, []);

  return { section, audience };
}

export function Header() {
  const t = useT();
  const reduced = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const { section, audience } = useActiveSection();

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

      gsap.killTweensOf(menu);
      if (isOpen) {
        gsap.to(menu, {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: DURATION.state,
          ease: EASE.settle,
          pointerEvents: "auto",
        });
        gsap.fromTo(
          itemsRef.current.filter(Boolean),
          { y: 8, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DURATION.state,
            stagger: STAGGER / 2,
            ease: EASE.settle,
          },
        );
      } else {
        gsap.to(menu, {
          scale: 0.98,
          y: -4,
          opacity: 0,
          duration: DURATION.hover,
          ease: EASE.exit,
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
        {DESKTOP_NAV.map((item) => {
          const active =
            section === item.section &&
            (!("audience" in item) || item.audience === audience);
          return (
            <a
              key={item.key}
              href={item.href}
              aria-current={active ? "true" : undefined}
              className={[
                "rounded-full px-3 py-2 text-body-sm font-semibold transition-colors duration-(--duration-fast)",
                active
                  ? "bg-primary-soft text-primary-ink"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text",
              ].join(" ")}
            >
              {t.nav[item.key]}
            </a>
          );
        })}
      </nav>

      <div ref={clusterRef} className="relative">
        <div className="flex items-center gap-1 rounded-full bg-secondary-soft px-1.5 py-1">
          <LocaleSwitcher tone="light" variant="menu" />
          <Button
            href="/login"
            variant="outline"
            size="sm"
            magnetic={false}
            className="!hidden md:!inline-flex"
          >
            <LogIn size={16} className="shrink-0" aria-hidden />
            <span>{t.nav.login}</span>
          </Button>
          <Button
            href="/register"
            variant="primary"
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
          className="absolute top-[calc(100%+0.65rem)] right-0 z-10 flex w-[min(18rem,calc(100vw-2.5rem))] origin-top-right scale-[0.98] flex-col items-stretch gap-0.5 rounded-2xl border border-border-subtle bg-surface-elevated p-2 opacity-0 shadow-lg lg:hidden"
          style={{ pointerEvents: "none" }}
          aria-hidden={!isOpen}
          inert={!isOpen}
        >
          <div className="px-3 pt-1 pb-2 text-label text-text-muted">
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
                className="group flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-body font-semibold text-text transition-colors duration-(--duration-fast) hover:bg-primary-soft hover:text-primary-ink focus-visible:bg-primary-soft focus-visible:outline-none"
                onClick={() => setIsOpen(false)}
              >
                <span>{item.label}</span>
                <Icon
                  size={18}
                  className="shrink-0 text-text-muted transition-colors duration-(--duration-fast) group-hover:text-primary-ink"
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      </div>
      </div>
    </header>
  );
}
