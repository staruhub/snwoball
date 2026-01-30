"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TopNavbar, TemplateSelectModal } from "@/components/features/workspace";
import { useWorkspaceStore, useUserStore } from "@/stores";
import { useIframeMode } from "@/hooks/useIframeMode";

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isTemplateModalOpen, setTemplateModalOpen } = useWorkspaceStore();
  const { isAuthenticated, _hasHydrated } = useUserStore();
  const [isChecking, setIsChecking] = useState(true);
  const { isIframe } = useIframeMode();

  // 路由保护：未登录重定向到 ratel-mind-web 登录页
  useEffect(() => {
    if (!_hasHydrated) {
      return;
    }
    if (!isAuthenticated) {
      const currentPath = pathname || "/";
      router.replace(`/ratel/login?redirect=${encodeURIComponent(currentPath)}`);
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, router, _hasHydrated, pathname]);

  // 检查登录状态时显示加载状态
  if (!_hasHydrated || (isChecking && !isAuthenticated)) {
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
      {/* 顶部导航栏 */}
      {!isIframe && <TopNavbar />}

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">{children}</main>

      {/* 模板选择弹窗 */}
      <TemplateSelectModal
        open={isTemplateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
      />
    </div>
  );
}
