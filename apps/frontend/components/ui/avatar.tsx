"use client";

import { ReactNode } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
};

export function Avatar({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  className = "",
  onClick,
}: AvatarProps) {
  const initials = fallback || alt.charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        onClick={onClick}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className} ${
          onClick ? "cursor-pointer" : ""
        }`}
      />
    );
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-medium ${sizeClasses[size]} ${className} ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {initials}
    </div>
  );
}

interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  className?: string;
}

export function AvatarGroup({
  children,
  max = 4,
  className = "",
}: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleChildren = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleChildren.map((child, index) => (
        <div key={index} className="ring-2 ring-[var(--background)] rounded-full">
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-medium ring-2 ring-[var(--background)]">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
