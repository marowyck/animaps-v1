type SectionDividerProps = {
  /** Fill color of the wave (matches the section ABOVE or the incoming section) */
  fill?: string;
  /** Place wave at top (flipped) or bottom */
  position?: "top" | "bottom";
  className?: string;
};

/** Organic wave divider — default style (amigável). Path from animaps-web reference. */
export function SectionDivider({
  fill = "var(--gray-soft)",
  position = "top",
  className = "",
}: SectionDividerProps) {
  const isTop = position === "top";

  return (
    <div
      className={`absolute ${isTop ? "top-[-1px]" : "bottom-[-1px]"} left-0 w-full overflow-hidden leading-[0] z-20 ${className}`}
      aria-hidden
    >
      <svg
        className={`relative block w-[110%] h-[60px] md:h-[100px] left-1/2 -translate-x-1/2 ${
          isTop ? "" : "rotate-180"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ color: fill }}
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
