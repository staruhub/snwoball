"use client";

import { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 认证守卫组件
 * 用于保护需要登录才能访问的页面或组件
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-8 w-8 text-[var(--primary)]"
              viewBox="0 0 24 24"
            >
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
            <span className="text-sm text-[var(--muted-foreground)]">
              加载中...
            </span>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    // useRequireAuth 会自动重定向到登录页
    return null;
  }

  return <>{children}</>;
}
