"use client";

import {
  useCallback,
  useId,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

const LENGTH = 6;

type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  autoFocus?: boolean;
};

function onlyDigits(raw: string) {
  return raw.replace(/\D/g, "").slice(0, LENGTH);
}

export function CodeInput({
  value,
  onChange,
  disabled = false,
  error = false,
  label = "Verification code",
  autoFocus = true,
}: CodeInputProps) {
  const groupId = useId();
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");

  const focusAt = (index: number) => {
    refs.current[Math.max(0, Math.min(LENGTH - 1, index))]?.focus();
  };

  const setDigit = useCallback(
    (index: number, char: string) => {
      const next = digits.map((d, i) => (i === index ? char : d));
      onChange(next.join("").slice(0, LENGTH));
    },
    [digits, onChange],
  );

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = onlyDigits(e.clipboardData.getData("text"));
    if (!pasted) return;
    onChange(pasted);
    focusAt(Math.min(pasted.length, LENGTH - 1));
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        setDigit(index - 1, "");
        focusAt(index - 1);
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(index - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(index + 1);
    }
  };

  return (
    <div role="group" aria-labelledby={groupId}>
      <p id={groupId} className="sr-only">
        {label}
      </p>
      <div className="flex justify-center gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`${label} digit ${index + 1}`}
            autoFocus={autoFocus && index === 0}
            onPaste={handlePaste}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onChange={(e) => {
              const next = onlyDigits(e.target.value).slice(-1);
              if (!next) {
                setDigit(index, "");
                return;
              }
              setDigit(index, next);
              if (index < LENGTH - 1) focusAt(index + 1);
            }}
            className={[
              "size-12 rounded-2xl border-2 text-center text-xl font-bold text-ink sm:size-14",
              "outline-none transition-all duration-200",
              "focus:border-primary focus:bg-surface focus:shadow-[0_0_0_4px_var(--primary-soft)]",
              error
                ? "border-error bg-danger-soft focus:shadow-[0_0_0_4px_var(--danger-soft)]"
                : digit
                  ? "border-brand-green/30 bg-white shadow-sm"
                  : "border-border-soft bg-gray-soft",
              disabled ? "cursor-not-allowed opacity-60" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </div>
    </div>
  );
}

export const CODE_INPUT_LENGTH = LENGTH;
