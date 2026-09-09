"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { UserPlus, ArrowDown } from "lucide-react";
import { Button } from "@/components/Button";
import { useT } from "@/i18n";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ClayFigure } from "./ClayFigure";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

/**
 * White Hero with soft brand atmosphere — pets frame the copy as one composition.
 */
export function Hero() {
  const t = useT();
  const containerRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const container = containerRef.current;
      const scene = sceneRef.current;
      const ui = uiRef.current;
      if (!container || !scene || !ui) return;

      let split: GSAPSplitText | undefined;
      const layers = {
        wash: scene.querySelector<HTMLElement>(".layer-wash"),
        clayLeft: scene.querySelector<HTMLElement>(".clay-left"),
        clayRight: scene.querySelector<HTMLElement>(".clay-right"),
        ui,
      };

      const mouse = { x: 0, y: 0 };
      const target = { x: 0, y: 0 };
      let raf = 0;

      const applyLayerTransforms = () => {
        if (layers.wash) {
          gsap.set(layers.wash, { x: mouse.x * -8, y: mouse.y * -5 });
        }
        if (layers.clayLeft) {
          gsap.set(layers.clayLeft, { x: mouse.x * 16, y: mouse.y * 9 });
        }
        if (layers.clayRight) {
          gsap.set(layers.clayRight, { x: mouse.x * -16, y: mouse.y * 9 });
        }
        gsap.set(layers.ui, { x: mouse.x * 5, y: mouse.y * 4 });
      };

      const runIntro = () => {
        const tl = gsap.timeline({ defaults: { ease: "back.out(1.6)" } });

        if (titleRef.current) {
          split = new GSAPSplitText(titleRef.current, {
            type: "words",
            wordsClass: "hero-word inline-block",
          });
          tl.from(split.words, {
            y: 40,
            scale: 0.9,
            opacity: 0,
            duration: 0.6,
            stagger: 0.04,
          });
        }

        tl.from(
          ".hero-body",
          { y: 16, opacity: 0, duration: 0.4, ease: "power2.out" },
          "-=0.28",
        )
          .from(
            ".hero-cta > *",
            {
              y: 12,
              scale: 0.94,
              opacity: 0,
              duration: 0.35,
              stagger: 0.06,
              ease: "back.out(1.7)",
            },
            "-=0.18",
          )
          .from(
            ".clay-companion",
            {
              y: 40,
              opacity: 0,
              scale: 0.9,
              duration: 0.6,
              stagger: 0.12,
              ease: "power2.out",
            },
            "-=0.4",
          );
      };

      if (document.fonts?.status === "loaded") runIntro();
      else document.fonts?.ready.then(runIntro);

      const onMove = (e: MouseEvent) => {
        if (reduced) return;
        const rect = container.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };

      const tick = () => {
        mouse.x += (target.x - mouse.x) * 0.08;
        mouse.y += (target.y - mouse.y) * 0.08;
        if (!reduced) applyLayerTransforms();
        raf = requestAnimationFrame(tick);
      };

      if (!reduced) {
        window.addEventListener("mousemove", onMove, { passive: true });
        raf = requestAnimationFrame(tick);
      }

      let fadeTween: gsap.core.Tween | undefined;
      if (!reduced) {
        fadeTween = gsap.to(container, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: 0.4,
          },
        });
      }

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
        fadeTween?.scrollTrigger?.kill();
        fadeTween?.kill();
        try {
          split?.revert();
        } catch {
          /* ignore */
        }
      };
    },
    { scope: containerRef, dependencies: [reduced, t.hero.titleLine1] },
  );

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-white"
    >
      <div ref={sceneRef} className="absolute inset-0 z-0">
        {/* Soft brand atmosphere on white */}
        <div className="layer-wash pointer-events-none absolute inset-0 will-change-transform">
          <div
            className="absolute -left-24 top-[-10%] h-[55vmax] w-[55vmax] rounded-full bg-pastel-pink/70 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -right-20 bottom-[-5%] h-[50vmax] w-[50vmax] rounded-full bg-pastel-green/55 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute left-1/2 top-[42%] h-[min(55vw,420px)] w-[min(55vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pastel-pink/40 blur-3xl"
            aria-hidden
          />
        </div>

        {/* Pets as large companions framing the brand */}
        <div className="pointer-events-none absolute inset-0 z-[2]">
          <div className="clay-companion clay-left absolute bottom-[8%] left-0 flex flex-col items-center sm:left-[2%] md:bottom-[10%] md:left-[4%] lg:left-[7%]">
            <div
              className="absolute bottom-6 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-pastel-pink/80 blur-2xl sm:h-56 sm:w-56 md:h-64 md:w-64"
              aria-hidden
            />
            <ClayFigure
              name="puppy"
              size={300}
              sizes="(max-width: 768px) 200px, (max-width: 1024px) 260px, 320px"
              priority
              className="relative z-[1] !w-[160px] sm:!w-[210px] md:!w-[260px] lg:!w-[300px]"
            />
            <div
              className="relative z-[1] mt-[-12px] h-6 w-[75%] rounded-[100%] bg-brand-pink/20 blur-[8px]"
              aria-hidden
            />
          </div>

          <div className="clay-companion clay-right absolute bottom-[7%] right-0 flex flex-col items-center sm:right-[2%] md:bottom-[9%] md:right-[4%] lg:right-[7%]">
            <div
              className="absolute bottom-6 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-pastel-green/70 blur-2xl sm:h-52 sm:w-52 md:h-60 md:w-60"
              aria-hidden
            />
            <ClayFigure
              name="cat"
              size={280}
              sizes="(max-width: 768px) 180px, (max-width: 1024px) 240px, 300px"
              priority
              className="relative z-[1] !w-[150px] sm:!w-[190px] md:!w-[240px] lg:!w-[280px]"
            />
            <div
              className="relative z-[1] mt-[-10px] h-6 w-[70%] rounded-[100%] bg-brand-green/20 blur-[8px]"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div
        ref={uiRef}
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center will-change-transform md:max-w-4xl"
      >
        <p className="hero-eyebrow mb-4 inline-flex items-center rounded-full border border-brand-pink/25 bg-pastel-pink/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-pink shadow-[0_8px_24px_-8px_rgba(224,122,150,0.45)]">
          ANIMAPS
        </p>

        <h1
          ref={titleRef}
          className="font-display mb-4 max-w-3xl text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl md:mb-5 md:text-7xl lg:text-[5.75rem]"
        >
          {t.hero.titleLine1}{" "}
          <span className="text-brand-pink">{t.hero.titleHighlight}</span>
        </h1>

        <p className="hero-body mb-8 max-w-lg text-base leading-relaxed text-ink-muted md:text-lg">
          {t.hero.body}
        </p>

        <div className="hero-cta flex flex-wrap items-center justify-center gap-3">
          <Button href="/register" variant="pink" magnetic={false}>
            <UserPlus size={18} />
            {t.hero.ctaAccount}
          </Button>
          <Button href="/#how-it-works" variant="white" magnetic={false}>
            <ArrowDown size={18} />
            {t.hero.ctaHow}
          </Button>
        </div>
      </div>
    </section>
  );
}
