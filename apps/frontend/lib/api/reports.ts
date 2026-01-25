/**
 * 报告 API
 */

import { fetchApi, buildQueryParams } from "./config";

// ==================== 类型定义 ====================

export interface Report {
  id: string;
  name: string;
  fundId?: string;
  fundName?: string;
  status: "draft" | "completed";
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
}

export interface ReportListParams {
  page?: number;
  pageSize?: number;
  status?: "draft" | "completed";
  keyword?: string;
}

export interface ReportListResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Report[];
}

export interface CreateReportParams {
  name: string;
  fundId?: string;
  fundName?: string;
  templateId?: string;
}

// ==================== 后端响应类型 ====================

interface BackendReportItem {
  id: string;
  name: string;
  fund_id: string | null;
  fund_name: string | null;
  template_id: string | null;
  status: string;
  content: Record<string, unknown> | null;
  thumbnail_url: string | null;
  user_id: string;
  create_time: string;
  update_time: string;
}

interface BackendReportListResponse {
  total: number;
  page: number;
  page_size: number;
  items: BackendReportItem[];
}

// ==================== 数据转换函数 ====================

function transformBackendReport(r: BackendReportItem): Report {
  return {
    id: r.id,
    name: r.name,
    fundId: r.fund_id || undefined,
    fundName: r.fund_name || undefined,
    status: r.status as "draft" | "completed",
    createdAt: r.create_time,
    updatedAt: r.update_time,
    thumbnailUrl: r.thumbnail_url || undefined,
  };
}

// ==================== API 函数 ====================

/**
 * 获取最近报告列表
 */
export async function getRecentReports(limit: number = 10): Promise<Report[]> {
  const response = await fetchApi<BackendReportItem[]>(
    `/api/v1/user-reports/recent?limit=${limit}`
  );
  return response.map(transformBackendReport);
}

/**
 * 获取报告列表
 */
export async function getReports(params?: ReportListParams): Promise<ReportListResponse> {
  const query = buildQueryParams({
    page: params?.page,
    page_size: params?.pageSize,
    status: params?.status,
    keyword: params?.keyword,
  });

  const response = await fetchApi<BackendReportListResponse>(
    `/api/v1/user-reports${query}`
  );

  return {
    total: response.total,
    page: response.page,
    pageSize: response.page_size,
    items: response.items.map(transformBackendReport),
  };
}

/**
 * 获取单个报告
 */
export async function getReport(id: string): Promise<Report | null> {
  try {
    const response = await fetchApi<BackendReportItem>(
      `/api/v1/user-reports/${id}`
    );
    return transformBackendReport(response);
  } catch {
    return null;
  }
}

/**
 * 创建新报告
 */
export async function createReport(params: CreateReportParams): Promise<Report> {
  const response = await fetchApi<BackendReportItem>("/api/v1/user-reports", {
    method: "POST",
    body: JSON.stringify({
      name: params.name,
      fund_id: params.fundId ? parseInt(params.fundId, 10) : undefined,
      fund_name: params.fundName,
      template_id: params.templateId ? parseInt(params.templateId, 10) : undefined,
    }),
  });
  return transformBackendReport(response);
}

/**
 * 从模板创建报告
 */
export async function createReportFromTemplate(
  templateId: string,
  params?: { name?: string; fundId?: string; fundName?: string }
): Promise<Report> {
  const response = await fetchApi<BackendReportItem>(
    `/api/v1/user-reports/from-template/${templateId}`,
    {
      method: "POST",
      body: JSON.stringify({
        name: params?.name,
        fund_id: params?.fundId ? parseInt(params.fundId, 10) : undefined,
        fund_name: params?.fundName,
      }),
    }
  );
  return transformBackendReport(response);
}

/**
 * 复制报告
 */
export async function duplicateReport(id: string): Promise<Report> {
  const response = await fetchApi<BackendReportItem>(
    `/api/v1/user-reports/${id}/duplicate`,
    { method: "POST" }
  );
  return transformBackendReport(response);
}

/**
 * 删除报告
 */
export async function deleteReport(id: string): Promise<void> {
  await fetchApi<{ success: boolean }>(`/api/v1/user-reports/${id}`, {
    method: "DELETE",
  });
}

/**
 * 搜索报告
 */
export async function searchReports(keyword: string, limit: number = 5): Promise<Report[]> {
  const result = await getReports({ keyword, pageSize: limit });
  return result.items;
}
