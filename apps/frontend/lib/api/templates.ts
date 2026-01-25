/**
 * 模板 API
 */

import { fetchApi, buildQueryParams } from "./config";

// ==================== 类型定义 ====================

export type TemplateType = "weekly" | "monthly" | "quarterly" | "annual" | "special" | "report" | "email" | "notification";

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  description?: string;
  previewUrl?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  moduleCount?: number;
}

export interface TemplateListParams {
  page?: number;
  pageSize?: number;
  type?: TemplateType;
  keyword?: string;
  favoriteOnly?: boolean;
}

export interface TemplateListResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Template[];
}

// ==================== 后端响应类型 ====================

interface BackendTemplateItem {
  id: number;
  template_name: string;
  template_code: string;
  template_type: string;
  description: string | null;
  preview_image: string | null;
  status: number;
  is_default: boolean;
  version: string;
  create_time: string;
  publish_time: string | null;
}

interface BackendTemplateListResponse {
  total: number;
  items: BackendTemplateItem[];
}

// ==================== 数据转换函数 ====================

function transformBackendTemplate(t: BackendTemplateItem): Template {
  // 将后端模板类型映射到前端类型
  const typeMap: Record<string, TemplateType> = {
    report: "report",
    email: "email",
    notification: "notification",
    weekly: "weekly",
    monthly: "monthly",
    quarterly: "quarterly",
    annual: "annual",
    special: "special",
  };

  return {
    id: String(t.id),
    name: t.template_name,
    type: typeMap[t.template_type] || "special",
    description: t.description || undefined,
    previewUrl: t.preview_image || undefined,
    isFavorite: t.is_default, // 使用 is_default 作为收藏的替代
    createdAt: t.create_time,
    updatedAt: t.publish_time || t.create_time,
  };
}

// ==================== 辅助函数 ====================

export const templateTypeLabels: Record<TemplateType, string> = {
  weekly: "周报",
  monthly: "月报",
  quarterly: "季报",
  annual: "年报",
  special: "专项",
  report: "报告",
  email: "邮件",
  notification: "通知",
};

export function getTemplateTypeLabel(type: TemplateType): string {
  return templateTypeLabels[type] || type;
}

// ==================== API 函数 ====================

/**
 * 获取模板列表
 */
export async function getTemplates(params?: TemplateListParams): Promise<TemplateListResponse> {
  const query = buildQueryParams({
    template_type: params?.type,
    keyword: params?.keyword,
  });

  const response = await fetchApi<BackendTemplateListResponse>(
    `/api/v1/templates${query}`
  );

  let items = response.items.map(transformBackendTemplate);

  // 如果需要只显示收藏的（使用 is_default 作为替代）
  if (params?.favoriteOnly) {
    items = items.filter((t) => t.isFavorite);
  }

  return {
    total: params?.favoriteOnly ? items.length : response.total,
    page: params?.page || 1,
    pageSize: params?.pageSize || 10,
    items: items.slice(0, params?.pageSize || 10),
  };
}

/**
 * 获取收藏的模板
 * 注意：当前使用 is_default 字段作为"推荐模板"的替代
 */
export async function getFavoriteTemplates(): Promise<Template[]> {
  const response = await fetchApi<BackendTemplateListResponse>(
    "/api/v1/templates"
  );

  // 返回默认模板作为推荐/收藏模板
  return response.items
    .filter((t) => t.is_default)
    .map(transformBackendTemplate);
}

/**
 * 获取单个模板
 */
export async function getTemplate(id: string): Promise<Template | null> {
  try {
    const response = await fetchApi<BackendTemplateItem>(
      `/api/v1/templates/${id}`
    );
    return transformBackendTemplate(response);
  } catch {
    return null;
  }
}

/**
 * 切换模板收藏状态
 * 注意：当前后端不支持用户收藏功能，此函数仅作为占位
 */
export async function toggleTemplateFavorite(_id: string): Promise<{ isFavorite: boolean }> {
  // 后端暂不支持用户收藏模板功能
  console.warn("toggleTemplateFavorite: 后端暂不支持用户收藏模板功能");
  return { isFavorite: false };
}

/**
 * 搜索模板
 */
export async function searchTemplates(keyword: string, limit: number = 5): Promise<Template[]> {
  const result = await getTemplates({ keyword, pageSize: limit });
  return result.items;
}
