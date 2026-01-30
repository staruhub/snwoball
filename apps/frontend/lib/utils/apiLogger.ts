/**
 * API 错误日志工具
 * 提供统一的错误日志记录、分类和历史追踪功能
 */

// 错误类型分类
export type ApiErrorType = 'network_error' | 'auth_error' | 'client_error' | 'server_error' | 'unknown';

// 错误日志选项
export interface ApiErrorLogOptions {
  level?: 'warn' | 'error';
  silent?: boolean; // 是否静默（不打印 console）
  metadata?: Record<string, unknown>;
}

// 错误日志条目
export interface ApiErrorEntry {
  timestamp: number;
  context: string;
  errorType: ApiErrorType;
  message: string;
  statusCode?: number;
  metadata?: Record<string, unknown>;
}

// 内存中的错误历史记录（最多保留 100 条）
const errorHistory: ApiErrorEntry[] = [];
const MAX_HISTORY_SIZE = 100;

/**
 * 分类错误类型
 */
function classifyError(error: any): { type: ApiErrorType; message: string } {
  // 网络错误（无法连接服务器）
  if (error.name === 'TypeError' && error.message?.includes('fetch')) {
    return { type: 'network_error', message: '网络连接失败' };
  }

  if (error.code === 'ECONNREFUSED' || error.message?.includes('Network')) {
    return { type: 'network_error', message: '无法连接到服务器' };
  }

  // 状态码分类
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;

    if (status === 401 || status === 403) {
      return { type: 'auth_error', message: '身份验证失败' };
    }

    if (status >= 400 && status < 500) {
      return { type: 'client_error', message: error.message || `客户端错误 (${status})` };
    }

    if (status >= 500) {
      return { type: 'server_error', message: error.message || `服务器错误 (${status})` };
    }
  }

  // AbortError (请求被取消)
  if (error.name === 'AbortError') {
    return { type: 'client_error', message: '请求已取消' };
  }

  // 默认分类
  return { type: 'unknown', message: error.message || '未知错误' };
}

/**
 * 记录 API 错误
 * @param context - 错误上下文（如 "getPublicFunds", "searchFunds"）
 * @param error - 错误对象
 * @param options - 日志选项
 */
export function logApiError(
  context: string,
  error: any,
  options: ApiErrorLogOptions = {}
): void {
  const { level = 'error', silent = false, metadata } = options;

  const { type, message } = classifyError(error);
  const statusCode = error.status || error.statusCode;

  // 创建日志条目
  const entry: ApiErrorEntry = {
    timestamp: Date.now(),
    context,
    errorType: type,
    message,
    statusCode,
    metadata,
  };

  // 添加到历史记录
  errorHistory.unshift(entry);
  if (errorHistory.length > MAX_HISTORY_SIZE) {
    errorHistory.pop();
  }

  // 输出到控制台（除非 silent）
  if (!silent) {
    const logFn = level === 'warn' ? console.warn : console.error;
    logFn(`[API Error] ${context}:`, {
      type,
      message,
      statusCode,
      metadata,
      timestamp: new Date(entry.timestamp).toISOString(),
    });
  }
}

/**
 * 获取最近的错误记录
 * @param limit - 返回的最大记录数
 */
export function getRecentApiErrors(limit: number = 10): ApiErrorEntry[] {
  return errorHistory.slice(0, limit);
}

/**
 * 清空错误历史记录
 */
export function clearApiErrorHistory(): void {
  errorHistory.length = 0;
}

/**
 * 获取错误统计信息
 */
export function getErrorStats(): Record<ApiErrorType, number> {
  const stats: Record<ApiErrorType, number> = {
    network_error: 0,
    auth_error: 0,
    client_error: 0,
    server_error: 0,
    unknown: 0,
  };

  for (const entry of errorHistory) {
    stats[entry.errorType]++;
  }

  return stats;
}
