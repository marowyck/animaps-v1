"use client";

type DotGridProps = {
  className?: string;
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  opacity?: number;
};

export default function DotGrid({
  className = "",
  dotSize = 2,
  gap = 28,
  baseColor = "rgba(95, 175, 106, 0.16)",
  activeColor = "rgba(224, 122, 150, 0.35)",
  proximity = 120,
  opacity = 1,
}: DotGridProps) {
  return (
    <div
      data-dotgrid
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{
        opacity,
        ["--mx" as string]: "45%",
        ["--my" as string]: "35%",
        backgroundImage: `radial-gradient(circle at var(--mx) var(--my), ${activeColor} 0%, transparent ${proximity}px), radial-gradient(${baseColor} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `100% 100%, ${gap}px ${gap}px`,
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 80%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, #000 80%, transparent 100%)",
      }}
    />
  );
}

export function updateDotGridVars(
  section: HTMLElement,
  clientX: number,
  clientY: number,
) {
  const layer = section.querySelector<HTMLElement>("[data-dotgrid]");
  if (!layer) return;
  const rect = section.getBoundingClientRect();
  layer.style.setProperty("--mx", `${clientX - rect.left}px`);
  layer.style.setProperty("--my", `${clientY - rect.top}px`);
}
