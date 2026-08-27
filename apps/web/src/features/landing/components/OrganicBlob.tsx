type OrganicBlobProps = {
  className?: string;
  color?: "pink" | "orange" | "blue" | "yellow" | "green" | "purple" | "sky";
};

const colorMap = {
  pink: "bg-pastel-pink",
  orange: "bg-pastel-pink",
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
