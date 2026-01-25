"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseClasses = "flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-opacity";

  const variantClasses = {
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)]",
    outline: "bg-transparent text-[var(--foreground)] border border-[var(--input)]",
    ghost: "bg-[var(--muted)] text-[var(--foreground)]",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {icon}
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
