"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  X,
  type LucideIcon,
} from "lucide-react";

export type ToastTone = "info" | "success" | "error" | "warning";

export type ToastInput = {
  message: string;
  tone?: ToastTone;
  /** Auto-dismiss duration in ms (default 4200). */
  durationMs?: number;
};

type ToastItem = ToastInput & {
  id: string;
  exiting?: boolean;
};

type ToastContextValue = {
  toast: (input: ToastInput | string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_ICON: Record<ToastTone, LucideIcon> = {
  info: Info,
  success: CircleCheck,
  error: CircleX,
  warning: CircleAlert,
};

const TONE_ICON_CLASS: Record<ToastTone, string> = {
  info: "text-brand-pink",
  success: "text-brand-green",
  error: "text-red-500",
  warning: "text-amber-500",
};

const ENTER_MS = 280;
const EXIT_MS = 260;

function toneClasses(tone: ToastTone): string {
  switch (tone) {
    case "success":
      return "border-brand-green/40 bg-white text-ink shadow-[0_8px_24px_-8px_rgba(95,175,106,0.45)]";
    case "error":
      return "border-red-300 bg-white text-ink shadow-[0_8px_24px_-8px_rgba(239,68,68,0.35)]";
    case "warning":
      return "border-amber-300 bg-white text-ink shadow-[0_8px_24px_-8px_rgba(245,158,11,0.4)]";
    default:
      return "border-brand-pink/35 bg-white text-ink shadow-[0_8px_24px_-8px_rgba(224,122,150,0.45)]";
  }
}

function ToastCard({
  item,
  onRequestClose,
  onExited,
}: {
  item: ToastItem;
  onRequestClose: (id: string) => void;
  onExited: (id: string) => void;
}) {
  const tone = item.tone ?? "info";
  const Icon = TONE_ICON[tone];
  const [entered, setEntered] = useState(false);
  const exitTimer = useRef<number | null>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setEntered(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!item.exiting) return;
    exitTimer.current = window.setTimeout(() => onExited(item.id), EXIT_MS);
    return () => {
      if (exitTimer.current != null) window.clearTimeout(exitTimer.current);
    };
  }, [item.exiting, item.id, onExited]);

  const visible = entered && !item.exiting;

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-[transform,opacity] ease-out will-change-transform ${toneClasses(
        tone,
      )} ${
        visible
          ? "translate-x-0 opacity-100"
          : "translate-x-[120%] opacity-0"
      }`}
      style={{ transitionDuration: `${item.exiting ? EXIT_MS : ENTER_MS}ms` }}
    >
      <Icon
        size={18}
        strokeWidth={2.25}
        className={`shrink-0 ${TONE_ICON_CLASS[tone]}`}
        aria-hidden
      />
      <p className="min-w-0 flex-1 leading-snug">{item.message}</p>
      <button
        type="button"
        className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-gray-soft hover:text-ink"
        aria-label="Dismiss"
        onClick={() => onRequestClose(item.id)}
      >
        <X size={16} strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const clearAutoDismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer != null) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const requestClose = useCallback(
    (id: string) => {
      clearAutoDismiss(id);
      setItems((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
      );
    },
    [clearAutoDismiss],
  );

  const remove = useCallback((id: string) => {
    clearAutoDismiss(id);
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, [clearAutoDismiss]);

  const toast = useCallback(
    (input: ToastInput | string) => {
      const payload: ToastInput =
        typeof input === "string" ? { message: input } : input;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const durationMs = payload.durationMs ?? 4200;
      const item: ToastItem = {
        id,
        message: payload.message,
        tone: payload.tone ?? "info",
        durationMs,
      };
      setItems((prev) => [...prev, item].slice(-4));
      const timer = window.setTimeout(() => requestClose(id), durationMs);
      timers.current.set(id, timer);
    },
    [requestClose],
  );

  useEffect(() => {
    const active = timers.current;
    return () => {
      active.forEach((timer) => window.clearTimeout(timer));
      active.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(100%-2rem,22rem)] flex-col-reverse items-stretch gap-2 sm:bottom-6 sm:right-6"
        aria-live="polite"
        aria-relevant="additions"
      >
        {items.map((item) => (
          <ToastCard
            key={item.id}
            item={item}
            onRequestClose={requestClose}
            onExited={remove}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
