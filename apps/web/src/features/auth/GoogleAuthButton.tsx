"use client";

import { useT } from "@/i18n";
import { useToast } from "@/components/Toast";
import { GoogleIcon } from "./GoogleIcon";

type GoogleAuthButtonProps = {
  className?: string;
  compact?: boolean;
};

/** UI-only Google CTA until OAuth ships. */
export function GoogleAuthButton({
  className = "",
  compact = false,
}: GoogleAuthButtonProps) {
  const t = useT();
  const { toast } = useToast();

  return (
    <div className={`shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => toast({ message: t.auth.googleSoon, tone: "info" })}
        className={`inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border-2 border-border-soft bg-white font-bold tracking-tight text-ink transition-colors hover:border-brand-pink/50 hover:bg-gray-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink ${
          compact
            ? "min-h-11 px-4 py-2.5 text-sm"
            : "min-h-12 px-5 py-3 text-sm"
        }`}
      >
        <span>{t.auth.google}</span>
        <GoogleIcon size={compact ? 18 : 20} />
      </button>
    </div>
  );
}
