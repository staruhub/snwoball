"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopNavbar } from "@/components/features/workspace";
import { useUserStore } from "@/stores";

interface TemplatesLayoutProps {
  children: ReactNode;
}

export default function TemplatesLayout({ children }: TemplatesLayoutProps) {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, router]);

  if (isChecking && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <span className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <span className="text-[var(--muted-foreground)]">加载中...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      <TopNavbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
