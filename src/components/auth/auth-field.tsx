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
  disabled,
  inputRef,
}: AuthFieldProps) {
  const errorId = useId();
  const hintId = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-ink"
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
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`mt-2 h-12 w-full rounded-xl border bg-surface px-4 text-base text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-pen disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? "border-danger" : "border-line"
        }`}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 text-sm text-ink-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
