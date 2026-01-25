"use client";

interface InputGroupProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: "text" | "password" | "email" | "tel";
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function InputGroup({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  type = "text",
  error,
  disabled = false,
  required = false,
}: InputGroupProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-[var(--foreground)]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`h-10 px-4 py-2 text-sm bg-[var(--card)] border rounded-none outline-none transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${error
            ? "border-red-500 focus:border-red-500 text-[var(--foreground)]"
            : "border-[var(--input)] focus:border-[var(--primary)] text-[var(--foreground)]"
          }
          placeholder:text-[var(--muted-foreground)]`}
      />
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
