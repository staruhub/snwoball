"use client";

import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
}: CheckboxProps) {
  return (
    <label
      className={`flex items-center gap-2.5 cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={`flex items-center justify-center w-4 h-4 border transition-colors ${
          checked
            ? "bg-[var(--primary)] border-[var(--primary)]"
            : "bg-transparent border-[var(--input)]"
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>
      {label && (
        <span className="text-sm text-[var(--foreground)]">{label}</span>
      )}
    </label>
  );
}
