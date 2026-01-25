/**
 * 报告导出 API 模块
 */

import { API_BASE_URL } from "./config";

export interface ReportExportRequest {
  html: string;
  file_name: string;
  wait_ms?: number;
  landscape?: boolean;
  page_width?: number;
  page_height?: number;
}

/**
 * 导出报告为 PDF
 * 返回 PDF Blob 供下载
 */
export async function exportReportPdf(
  request: ReportExportRequest,
  token: string,
  signal?: AbortSignal
): Promise<Blob> {
  const url = `${API_BASE_URL}/api/v1/report/export`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      html: request.html,
      file_name: request.file_name,
      wait_ms: request.wait_ms ?? 800,
      landscape: request.landscape ?? false,
      page_width: request.page_width,
      page_height: request.page_height,
    }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`导出失败: ${response.status} - ${errorText}`);
  }

  return response.blob();
}

/**
 * 下载 Blob 为文件
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
