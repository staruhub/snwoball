import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            基金报告系统
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            专业的基金分析报告生成平台
          </p>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
