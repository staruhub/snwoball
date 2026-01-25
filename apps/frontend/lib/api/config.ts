/**
 * API 配置和通用请求函数
 */

// Admin API (端口 8002)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

// Web API - 用户认证 (端口 8003)
export const WEB_API_URL =
  process.env.NEXT_PUBLIC_WEB_API_URL || "http://localhost:8003";

export interface ApiError {
  status: number;
  message: string;
  detail?: unknown;
}

/**
 * 后端标准响应格式
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: string;
  data: T;
  timestamp?: string;
  request_id?: string;
}

/**
 * 通用 API 请求函数
 * 自动解包后端标准响应格式，返回 data 部分
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: `API Error: ${response.status} ${response.statusText}`,
    };

    try {
      error.detail = await response.json();
    } catch {
      // 忽略解析错误
    }

    throw error;
  }

  const result: ApiResponse<T> = await response.json();

  // 检查业务逻辑是否成功
  if (!result.success) {
    const error: ApiError = {
      status: parseInt(result.code) || 500,
      message: result.message || "请求失败",
    };
    throw error;
  }

  return result.data;
}

/**
 * 带认证的 API 请求函数
 */
export async function fetchApiAuth<T>(
  endpoint: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * 构建查询参数字符串
 */
export function buildQueryParams(
  params: Record<string, string | number | boolean | undefined>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Web API 请求函数（用于普通用户认证）
 * 使用 WEB_API_URL 作为基础 URL
 */
export async function fetchWebApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${WEB_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: `API Error: ${response.status} ${response.statusText}`,
    };

    try {
      error.detail = await response.json();
    } catch {
      // 忽略解析错误
    }

    throw error;
  }

  const result = await response.json();

  // 检查业务逻辑是否成功
  if (result.success === false) {
    const error: ApiError = {
      status: parseInt(result.code) || 500,
      message: result.message || "请求失败",
    };
    throw error;
  }

  return result.data;
}

/**
 * 带认证的 Web API 请求函数
 */
export async function fetchWebApiAuth<T>(
  endpoint: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  return fetchWebApi<T>(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
