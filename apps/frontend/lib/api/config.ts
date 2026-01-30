/**
 * API 配置和通用请求函数
 */
import { isIframe, notifyParent } from "@/lib/iframe";
import { useUserStore } from "@/stores/useUserStore";
import {
  getAccessToken,
  refreshAccessToken,
  handleAuthExpired,
} from "@/lib/auth/tokenManager";

// Admin API (端口 8002)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

// Web API - 用户认证 (端口 8003)
export const WEB_API_URL =
  process.env.NEXT_PUBLIC_WEB_API_URL || "http://localhost:8003";

/**
 * 认证端点白名单
 * 这些端点的 401 响应不应触发 token refresh 或 redirect
 * 因为它们本身就是认证失败的正常响应
 */
export const AUTH_ENDPOINTS = [
  '/api/v1/auth/login',
  '/api/v1/auth/send-code',
  '/api/v1/admin-auth/login',
  '/api/v1/auth/register',
];

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
    if (response.status === 401 && isIframe()) {
      notifyParent({ type: "AUTH_EXPIRED" });
    }

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
 * Web API 请求选项
 */
interface WebApiOptions extends RequestInit {
  skipAuth?: boolean; // 跳过认证 (登录接口等)
  skipRefresh?: boolean; // 跳过 token 刷新 (刷新接口本身)
  signal?: AbortSignal; // AbortController 信号（用于取消请求）
}

interface WebApiResponse<T> {
  success: boolean;
  message?: string;
  code?: string;
  data: T;
}

function isWebApiEnvelope<T>(value: unknown): value is WebApiResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    "success" in value &&
    typeof (value as Record<string, unknown>).success === "boolean"
  );
}

/**
 * Web API 请求函数（用于普通用户认证）
 * 使用 WEB_API_URL 作为基础 URL
 * 自动从 localStorage 获取 token 并添加到请求头
 * 支持 Token 自动刷新和 401 统一处理
 */
export async function fetchWebApi<T>(
  endpoint: string,
  options?: WebApiOptions
): Promise<T> {
  const url = `${WEB_API_URL}${endpoint}`;
  const { skipAuth = false, skipRefresh = false, signal, ...fetchOptions } =
    options || {};

  const makeRequest = async (authToken: string | null) => {
    return fetch(url, {
      ...fetchOptions,
      signal, // 传递 AbortSignal
      headers: {
        "Content-Type": "application/json",
        ...(authToken && !skipAuth
          ? { Authorization: `Bearer ${authToken}` }
          : {}),
        ...fetchOptions?.headers,
      },
    });
  };

  // 优先从 localStorage 获取 token (与 ratel-mind-web 同步)
  let token = getAccessToken() || useUserStore.getState().token;
  let response = await makeRequest(token);

  // 检查是否为认证端点（登录、注册等）
  const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => endpoint.includes(ep));

  // 401 时尝试刷新 token
  // 但如果是认证端点的 401，直接返回（让调用者处理登录错误信息）
  // 也需要检查是否有现有 token，没有 token 时不需要 refresh
  if (
    response.status === 401 &&
    !skipAuth &&
    !skipRefresh &&
    !isAuthEndpoint &&
    token
  ) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // 刷新成功，重试请求
      token = getAccessToken();
      response = await makeRequest(token);
    } else {
      // 刷新失败，处理过期
      handleAuthExpired();
      const error: ApiError = {
        status: 401,
        message: "登录已过期，请重新登录",
      };
      throw error;
    }
  }

  if (!response.ok) {
    // 其他 401 情况 (skipRefresh=true 或刷新后仍然 401)
    // 但认证端点的 401 不应触发 handleAuthExpired（因为这是登录失败的正常响应）
    if (response.status === 401 && !isAuthEndpoint) {
      if (isIframe()) {
        notifyParent({ type: "AUTH_EXPIRED" });
      } else {
        handleAuthExpired();
      }
    }

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

  if (isWebApiEnvelope<T>(result)) {
    // 检查业务逻辑是否成功
    if (result.success === false) {
      const error: ApiError = {
        status: result.code ? parseInt(result.code) : 500,
        message: result.message || "请求失败",
      };
      throw error;
    }

    return result.data;
  }

  return result as T;
}

/**
 * 带认证的 Web API 请求函数
 */
export async function fetchWebApiAuth<T>(
  endpoint: string,
  token: string,
  options?: WebApiOptions
): Promise<T> {
  return fetchWebApi<T>(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
