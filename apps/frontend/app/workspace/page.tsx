"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  QuickActions,
  RecentReports,
  FavoriteTemplates,
} from "@/components/features/workspace";
import { getWorkspaceOverview } from "@/lib/api/workspace";
import { useWorkspaceStore } from "@/stores";

export default function WorkspacePage() {
  const [loading, setLoading] = useState(true);
  const {
    recentReports,
    favoriteTemplates,
    setRecentReports,
    setFavoriteTemplates,
    setUnreadNotificationCount,
  } = useWorkspaceStore();

  useEffect(() => {
    loadWorkspaceData();
  }, []);

  const loadWorkspaceData = async () => {
    setLoading(true);
    try {
      const data = await getWorkspaceOverview();
      setRecentReports(data.recentReports);
      setFavoriteTemplates(data.favoriteTemplates);
      setUnreadNotificationCount(data.unreadNotificationCount);
    } catch (error) {
      console.error("Failed to load workspace data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* 欢迎信息 */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          工作台
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          管理您的基金分析报告和模板
        </p>
      </div>

      {/* 快捷入口 */}
      <QuickActions />

      {/* 最近报告 */}
      <RecentReports reports={recentReports} />

      {/* 收藏模板 */}
      <FavoriteTemplates templates={favoriteTemplates} />
    </div>
  );
}
