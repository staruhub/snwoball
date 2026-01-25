"use client";

interface InputGroupProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function InputGroup({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: InputGroupProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-10 px-4 py-2 text-sm text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--input)] rounded-none outline-none focus:border-[var(--primary)]"
      />
    </div>
  );
}
