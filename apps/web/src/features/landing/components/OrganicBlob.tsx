type OrganicBlobProps = {
  className?: string;
  color?: "orange" | "blue" | "yellow" | "green" | "purple" | "sky";
};

const colorMap = {
  orange: "bg-pastel-orange",
  blue: "bg-pastel-blue",
  yellow: "bg-pastel-yellow",
  green: "bg-pastel-green",
  purple: "bg-pastel-purple",
  sky: "bg-pastel-sky",
} as const;

export function OrganicBlob({
  className = "",
  color = "yellow",
}: OrganicBlobProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute organic-blob ${colorMap[color]} ${className}`}
    />
  );
}
