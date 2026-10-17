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
        className={`inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-border bg-surface text-body-sm font-semibold text-text transition-[background-color,border-color,scale] duration-(--duration-fast) ease-(--ease-out) hover:border-primary/40 hover:bg-surface-hover active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          compact ? "min-h-11 px-4 py-2.5" : "min-h-12 px-5 py-3"
        }`}
      >
        <GoogleIcon size={compact ? 18 : 20} />
        <span>{t.auth.google}</span>
      </button>
    </div>
  );
}
