"use client";

import { useId, type RefObject } from "react";

type AuthFieldProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email" | "tel";
  disabled?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
};

export function AuthField({
  id,
  label,
  type,
  value,
  onChange,
  error,
  hint,
  placeholder,
  autoComplete,
  inputMode,
  disabled,
  inputRef,
}: AuthFieldProps) {
  const errorId = useId();
  const hintId = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[13px] font-medium tracking-[-0.01em] text-lp-ink"
      >
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`mt-1.5 h-10 w-full rounded-lg border bg-lp-paper px-3 text-[13px] text-lp-ink outline-none transition-colors placeholder:text-lp-ink-4 focus:border-lp-accent disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? "border-lp-accent" : "border-lp-rule"
        }`}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-lp-accent">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-lp-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
