"use client";

interface SwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange?.(!checked)}
        className={`relative w-8 h-5 rounded-full transition-colors ${
          checked ? "bg-[var(--primary)]" : "bg-[var(--input)]"
        }`}
      >
        <div
          className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${
            checked ? "left-[18px]" : "left-1"
          }`}
        />
      </button>
      {label && (
        <span className="text-base text-[var(--foreground)]">{label}</span>
      )}
    </div>
  );
}
