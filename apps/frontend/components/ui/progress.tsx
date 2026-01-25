"use client";

interface ProgressProps {
  value: number; // 0-100
  showLabel?: boolean;
  className?: string;
}

export function Progress({
  value,
  showLabel = true,
  className = "",
}: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="relative h-2 bg-[var(--muted)] rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-[var(--primary)] transition-all duration-300 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-[var(--muted-foreground)] text-right">
          {clampedValue}%
        </div>
      )}
    </div>
  );
}
