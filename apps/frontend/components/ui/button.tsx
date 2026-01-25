"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "link";
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  loading = false,
}: ButtonProps) {
  const baseClasses = "flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-opacity";

  const variantClasses = {
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90",
    outline: "bg-transparent text-[var(--foreground)] border border-[var(--input)] hover:bg-[var(--muted)]",
    ghost: "bg-[var(--muted)] text-[var(--foreground)] hover:opacity-80",
    link: "bg-transparent text-[var(--primary)] hover:underline p-0",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        icon
      )}
      {children}
    </button>
  );
}

interface IconButtonProps {
  icon: ReactNode;
  variant?: "ghost";
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export function IconButton({
  icon,
  onClick,
  className = "",
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-1.5 bg-[var(--muted)] ${className}`}
    >
      {icon}
    </button>
  );
}
