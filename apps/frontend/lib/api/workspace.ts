/**
 * 工作台 API
 * 聚合工作台首页所需的数据
 */

import { Report, getRecentReports } from "./reports";
import { Template, getFavoriteTemplates } from "./templates";
import { getUnreadCount } from "./notifications";
import { getPublicFunds } from "./fund";

// ==================== 类型定义 ====================

export interface WorkspaceOverview {
  recentReports: Report[];
  favoriteTemplates: Template[];
  unreadNotificationCount: number;
}

export interface GlobalSearchResult {
  type: "fund" | "report" | "template";
  id: string;
  title: string;
  subtitle?: string;
  link: string;
}

// ==================== API 函数 ====================

/**
 * 获取工作台概览数据
 * 聚合多个 API 的数据，使用容错处理确保部分失败不影响整体
 */
export async function getWorkspaceOverview(): Promise<WorkspaceOverview> {
  const [recentReports, favoriteTemplates, unreadNotificationCount] = await Promise.all([
    getRecentReports(10).catch((error) => {
      console.warn("获取最近报告失败:", error);
      return [];
    }),
    getFavoriteTemplates().catch((error) => {
      console.warn("获取收藏模板失败:", error);
      return [];
    }),
    getUnreadCount().catch((error) => {
      console.warn("获取未读通知数失败:", error);
      return 0;
    }),
  ]);

  return {
    recentReports,
    favoriteTemplates,
    unreadNotificationCount,
  };
}

/**
 * 全局搜索
 * 搜索基金、报告、模板
 */
export async function globalSearch(
  keyword: string,
  limit: number = 10
): Promise<GlobalSearchResult[]> {
  if (!keyword.trim()) {
    return [];
  }

  const results: GlobalSearchResult[] = [];

  // 并行搜索基金、报告、模板
  const [fundsResult, reports, templates] = await Promise.all([
    searchFunds(keyword, 3).catch(() => []),
    import("./reports").then((m) => m.searchReports(keyword, 3)).catch(() => []),
    import("./templates").then((m) => m.searchTemplates(keyword, 3)).catch(() => []),
  ]);

  // 添加基金搜索结果
  fundsResult.forEach((f) => {
    results.push({
      type: "fund",
      id: f.id,
      title: f.name,
      subtitle: f.code,
      link: `/funds/${f.id}`,
    });
  });

  // 添加报告搜索结果
  reports.forEach((r) => {
    results.push({
      type: "report",
      id: r.id,
      title: r.name,
      subtitle: r.fundName,
      link: `/editor/${r.id}`,
    });
  });

  // 添加模板搜索结果
  templates.forEach((t) => {
    results.push({
      type: "template",
      id: t.id,
      title: t.name,
      subtitle: t.description,
      link: `/templates/${t.id}`,
    });
  });

  return results.slice(0, limit);
}

/**
 * 搜索基金
 * 使用真实的公募基金 API
 */
export async function searchFunds(
  keyword: string,
  limit: number = 10
): Promise<Array<{ id: string; name: string; code: string }>> {
  try {
    const response = await getPublicFunds({
      keyword: keyword.trim() || undefined,
      page: 1,
      page_size: limit,
    });

    return response.items.map((fund) => ({
      id: String(fund.id),
      name: fund.name,
      code: fund.code,
    }));
  } catch {
    // 如果 API 调用失败，返回空数组
    return [];
  }
}
