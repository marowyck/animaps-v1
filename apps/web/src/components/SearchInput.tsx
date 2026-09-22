"use client";

import { Search, X } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { IconButton } from "./IconButton";
import { useT } from "@/i18n";

type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

export function SearchInput({
  value,
  onChange,
  label,
  placeholder,
  className = "",
  id,
  ...rest
}: SearchInputProps) {
  const t = useT();
  const inputId = id ?? "search-input";
  const fieldLabel = label ?? t.chrome.search;
  const fieldPlaceholder = placeholder ?? t.chrome.search;

  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      <label htmlFor={inputId} className="sr-only">
        {fieldLabel}
      </label>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
        aria-hidden
      />
      <input
        id={inputId}
        type="search"
        value={value}
        placeholder={fieldPlaceholder}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "w-full rounded-full border-2 border-border-soft bg-gray-soft py-3 pl-11 pr-11 text-sm font-medium text-ink",
          "placeholder:text-ink-muted/70",
          "outline-none focus:border-brand-pink focus:bg-white",
        ].join(" ")}
        {...rest}
      />
      {value ? (
        <IconButton
          label={t.chrome.clearSearch}
          className="absolute right-1 top-1/2 size-9 -translate-y-1/2"
          tone="muted"
          onClick={() => onChange("")}
        >
          <X className="size-4" aria-hidden />
        </IconButton>
      ) : null}
    </div>
  );
}
