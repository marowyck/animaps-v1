"use client";

type ProfileAvatarProps = {
  name?: string | null;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE = {
  sm: "size-9 text-xs",
  md: "size-12 text-sm",
  lg: "size-16 text-lg",
} as const;

function initials(name?: string | null) {
  if (!name?.trim()) return "A";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "A";
}

export function ProfileAvatar({
  name,
  src,
  size = "md",
  className = "",
}: ProfileAvatarProps) {
  const label = name?.trim() || "User";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={label}
        className={[
          "rounded-full object-cover ring-2 ring-surface",
          SIZE[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={label}
      className={[
        "inline-flex items-center justify-center rounded-full bg-primary-soft font-semibold text-primary ring-2 ring-surface",
        SIZE[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {initials(name)}
    </span>
  );
}
