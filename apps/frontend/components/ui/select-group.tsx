"use client";

import { ChevronDown } from "lucide-react";

interface SelectGroupProps {
  label?: string;
  value: string;
  options?: { value: string; label: string }[];
  onChange?: (value: string) => void;
  className?: string;
}

export function SelectGroup({
  label,
  value,
  options = [],
  onChange,
  className = "",
}: SelectGroupProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="appearance-none w-full h-10 px-4 py-2 pr-10 text-sm text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--input)] rounded-none outline-none focus:border-[var(--primary)]"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
      </div>
    </div>
  );
}
