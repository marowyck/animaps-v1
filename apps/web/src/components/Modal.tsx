"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";
import { useT } from "@/i18n";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Larger content area (e.g. interests picker). */
  size?: "md" | "lg";
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  if (!open) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="presentation"
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        aria-label={t.chrome.close}
        className="absolute inset-0 bg-text/45 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={[
          "relative z-10 flex max-h-[92dvh] w-full flex-col rounded-t-3xl border border-border-subtle bg-surface-elevated shadow-lg outline-none sm:rounded-3xl animate-modal-in",
          size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg",
          "mx-0 sm:mx-4",
        ].join(" ")}
      >
        <header className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-4">
          <h2 id={titleId} className="text-h4 text-text">
            {title}
          </h2>
          <IconButton label={t.chrome.close} onClick={onClose} tone="muted">
            <X className="size-5" aria-hidden />
          </IconButton>
        </header>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <footer className="border-t border-border-subtle px-5 py-4">{footer}</footer>
        ) : null}
      </div>
    </div>
  );

  // Portal to body so backdrop covers the full viewport even when a parent
  // uses transform/filter (e.g. onboarding animate-fade-in-up).
  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}

/** Alias for docs / call sites that prefer Dialog naming. */
export const Dialog = Modal;
