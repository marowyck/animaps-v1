type SectionDividerProps = {
  /** Fill matches the section this curve leads into. */
  fill?: string;
  /** `bottom` paints the next section's color. `top` flips that curve. */
  position?: "top" | "bottom";
  className?: string;
};

/** Soft curve. The fill is one continuous color with the section it joins. */
export function SectionDivider({
  fill = "var(--background)",
  position = "bottom",
  className = "",
}: SectionDividerProps) {
  const isTop = position === "top";

  return (
    <div
      className={`pointer-events-none absolute ${isTop ? "top-0" : "bottom-0"} left-0 z-20 w-full leading-[0] ${className}`}
      aria-hidden
    >
      <svg
        className={`relative block h-12 w-full md:h-16 ${isTop ? "rotate-180" : ""}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        style={{ color: fill }}
      >
        <path
          d="M0,34 C160,62 300,14 500,30 C700,46 840,10 1020,26 C1100,34 1150,22 1200,28 L1200,80 L0,80 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
