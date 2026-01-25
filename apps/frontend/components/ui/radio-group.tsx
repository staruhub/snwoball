"use client";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label?: string;
  value: string;
  options: RadioOption[];
  onChange?: (value: string) => void;
  direction?: "horizontal" | "vertical";
  className?: string;
}

export function RadioGroup({
  label,
  value,
  options,
  onChange,
  direction = "horizontal",
  className = "",
}: RadioGroupProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </span>
      )}
      <div
        className={`flex gap-4 ${
          direction === "vertical" ? "flex-col" : "flex-row flex-wrap"
        }`}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-2 cursor-pointer ${
              option.disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <button
              type="button"
              role="radio"
              aria-checked={value === option.value}
              disabled={option.disabled}
              onClick={() => !option.disabled && onChange?.(option.value)}
              className={`flex items-center justify-center w-4 h-4 rounded-full border transition-colors ${
                value === option.value
                  ? "border-[var(--primary)]"
                  : "border-[var(--input)]"
              }`}
            >
              {value === option.value && (
                <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              )}
            </button>
            <span className="text-sm text-[var(--foreground)]">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
