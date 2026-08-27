"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Client-only: matchMedia is unavailable during SSR.
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate motion preference after mount */
    setReduced(prefersReducedMotion());
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!ready) {
    return <>{children}</>;
  }

  if (reduced) {
    return (
      <>
        <NativeAnchorScroll />
        {children}
      </>
    );
  }

  return (
    <ReactLenis
      root
      options={{
        // Higher lerp = less “lag behind” the wheel → easier to travel the page
        lerp: 0.16,
        duration: 1,
        easing: easeOutExpo,
        smoothWheel: true,
        // Native touch/trackpad feels lighter than Lenis syncing every gesture
        syncTouch: false,
        touchMultiplier: 1.4,
        wheelMultiplier: 1.2,
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
