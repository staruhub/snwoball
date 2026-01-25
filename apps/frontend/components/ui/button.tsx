"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  className = "",
}: ButtonProps) {
  const baseClasses = "flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium";

  const variantClasses = {
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)]",
    outline: "bg-transparent text-[var(--foreground)] border border-[var(--input)]",
    ghost: "bg-[var(--muted)] text-[var(--foreground)]",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

interface IconButtonProps {
  icon: ReactNode;
  variant?: "ghost";
  onClick?: () => void;
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
