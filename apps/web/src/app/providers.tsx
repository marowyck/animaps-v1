"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LocaleProvider } from "@/i18n";
import { ToastProvider } from "@/components/Toast";
import { OnboardingProvider } from "@/features/onboarding";

gsap.registerPlugin(ScrollTrigger);

/** Matches `scroll-padding-top: 6rem` — clears the fixed header. */
const ANCHOR_OFFSET = -96;

const easeOutExpo = (t: number) =>
  Math.min(1, 1.001 - Math.pow(2, -10 * t));

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return null;
}

/** Fallback when Lenis is off (reduced motion): still land on the section cleanly. */
function NativeAnchorScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const id = decodeURIComponent(hash.slice(1));
      const el = document.getElementById(id);
      if (!el) return;

      event.preventDefault();
      const top =
        el.getBoundingClientRect().top + window.scrollY + ANCHOR_OFFSET;
      window.scrollTo({ top, behavior: "auto" });
      history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

function SmoothScrollInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const onMarketing = pathname === "/";

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate motion preference after mount */
    setReduced(prefersReducedMotion());
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!ready) {
    return <>{children}</>;
  }

  if (reduced || !onMarketing) {
    return (
      <>
        {onMarketing ? <NativeAnchorScroll /> : null}
        {children}
      </>
    );
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.1,
        easing: easeOutExpo,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.2,
        wheelMultiplier: 1,
        autoRaf: false,
        anchors: {
          offset: ANCHOR_OFFSET,
          duration: 1.05,
          easing: easeOutExpo,
        },
      }}
    >
      <LenisGsapSync />
      {children}
    </ReactLenis>
  );
}

/** Locale outside Lenis so language works with reduced motion too. */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <ToastProvider>
        <OnboardingProvider>
          <SmoothScrollInner>{children}</SmoothScrollInner>
        </OnboardingProvider>
      </ToastProvider>
    </LocaleProvider>
  );
}
