"use client";

import { ReactNode } from "react";
import { Lock, MoreHorizontal } from "lucide-react";
import { IconButton } from "./button";

interface CardProps {
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
  className?: string;
  showActions?: boolean;
}

export function Card({ icon, title, children, className = "", showActions = true }: CardProps) {
  const hasHeader = icon || title;

  return (
    <div
      className={`flex flex-col bg-[var(--card)] border border-[var(--border)] shadow-sm ${className}`}
    >
      {/* Header - only show if icon or title provided */}
      {hasHeader && (
        <div className="flex items-center gap-2 px-5 py-4">
          {icon && <span className="text-[var(--primary)]">{icon}</span>}
          {title && (
            <span className="text-base font-medium text-[var(--foreground)]">
              {title}
            </span>
          )}
          <div className="flex-1" />
          {showActions && (
            <>
              <IconButton icon={<Lock className="w-4 h-4 text-[var(--foreground)]" />} />
              <IconButton icon={<MoreHorizontal className="w-4 h-4 text-[var(--foreground)]" />} />
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className={hasHeader ? "px-5 pb-5" : ""}>{children}</div>
    </div>
  );
}
