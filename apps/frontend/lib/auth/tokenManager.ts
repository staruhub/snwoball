'use client';

import { notifyParent } from '@/lib/iframe';

/**
 * 统一的 Token 管理模块
 * 作为 ratel-mind-web 和 Snowball 的认证状态同步中心
 */

// 直接定义 WEB_API_URL 避免与 config.ts 循环依赖
const WEB_API_URL =
  process.env.NEXT_PUBLIC_WEB_API_URL || 'http://localhost:8003';

/**
 * 认证相关的 localStorage key 常量
 * 与 ratel-mind-web 的 STORAGE_KEYS 保持一致
 */
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  IS_LOGGED_IN: 'isLoggedIn',
  EXPIRES_IN: 'expires_in',
  TOKEN_TYPE: 'token_type',
  PHONE_NUMBER: 'phoneNumber',
  USER_NAME: 'userName',
  USER_ID: 'userId',
  // Zustand persist key
  USER_STORAGE: 'user-storage',
  // Admin 专用存储 keys (与 user token 物理隔离)
  ADMIN_ACCESS_TOKEN: 'admin_access_token',
  ADMIN_REFRESH_TOKEN: 'admin_refresh_token',
} as const;

/**
 * 认证同步事件（同标签页触发）
 */
export const AUTH_SYNC_EVENT = 'auth-storage-sync';

/**
 * 检查是否在浏览器环境
 */
const isBrowser = () => typeof window !== 'undefined';

/**
 * 检查当前是否在 admin 路由
 * 用于决定使用哪个 token 存储 key
 */
export function isAdminRoute(): boolean {
  if (!isBrowser()) return false;
  const pathname = window.location.pathname;
  return pathname.startsWith('/admin/') || pathname === '/admin';
}

function emitAuthSyncEvent() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(AUTH_SYNC_EVENT));
}

/**
 * 获取 access token
 * 统一使用 ratel 的 access_token（admin 和 user 共享同一认证）
 */
export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * 获取 refresh token
 * 统一使用 ratel 的 refresh_token
 */
export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(AUTH_STORAGE_KEYS.IS_LOGGED_IN) === 'true';
}

/**
 * 保存认证信息
 */
export function saveAuthInfo(data: {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType?: string;
}) {
  if (!isBrowser()) return;

  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.IS_LOGGED_IN, 'true');

  if (data.expiresIn) {
    localStorage.setItem(AUTH_STORAGE_KEYS.EXPIRES_IN, data.expiresIn.toString());
  }
  if (data.tokenType) {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN_TYPE, data.tokenType);
  }

  // 同步到 Zustand user-storage
  syncToZustandStorage(data.accessToken);

  // 同标签页同步
  emitAuthSyncEvent();
}

/**
 * 清除所有认证信息
 */
export function clearAllAuthInfo() {
  if (!isBrowser()) return;

  // 清除 ratel-mind-web 的存储
  Object.values(AUTH_STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });

  emitAuthSyncEvent();
}

/**
 * 保存 Admin 认证信息
 * 使用独立的 localStorage keys，与 user token 物理隔离
 */
export function saveAdminAuthInfo(data: {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}) {
  if (!isBrowser()) return;

  localStorage.setItem(AUTH_STORAGE_KEYS.ADMIN_ACCESS_TOKEN, data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem(AUTH_STORAGE_KEYS.ADMIN_REFRESH_TOKEN, data.refreshToken);
  }

  emitAuthSyncEvent();
}

/**
 * 清除 Admin 认证信息
 * 只清除 admin 专用 keys，不影响 user token
 */
export function clearAdminAuthInfo() {
  if (!isBrowser()) return;

  localStorage.removeItem(AUTH_STORAGE_KEYS.ADMIN_ACCESS_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.ADMIN_REFRESH_TOKEN);

  emitAuthSyncEvent();
}

/**
 * 刷新 Token
 * 使用单例 Promise 防止并发刷新
 */
let refreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refresh = getRefreshToken();
      if (!refresh) return false;

      const response = await fetch(`${WEB_API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      });

      if (!response.ok) {
        console.error('Token refresh failed:', response.status, response.statusText);
        try {
          const text = await response.text();
          console.error('Refresh response body:', text);
        } catch {
          // ignore
        }
        return false;
      }

      let data: unknown;
      try {
        data = await response.json();
      } catch (error) {
        console.error('Failed to parse refresh response JSON:', error);
        return false;
      }

      if (
        typeof data === 'object' &&
        data !== null &&
        (data as { success?: boolean }).success &&
        (data as { data?: { access_token?: string; refresh_token?: string; expires_in?: number; token_type?: string } })
          .data
      ) {
        const payload = (data as {
          data: {
            access_token: string;
            refresh_token: string;
            expires_in: number;
            token_type: string;
          };
        }).data;
        saveAuthInfo({
          accessToken: payload.access_token,
          refreshToken: payload.refresh_token,
          expiresIn: payload.expires_in,
          tokenType: payload.token_type,
        });
        return true;
      }

      console.error('Unexpected refresh response shape:', data);
      return false;
    } catch (error) {
      console.error('Token 刷新失败:', error);
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * 同步到 Zustand user-storage
 */
function syncToZustandStorage(token: string) {
  if (!isBrowser()) return;

  try {
    const existing = localStorage.getItem(AUTH_STORAGE_KEYS.USER_STORAGE);
    let state: Record<string, unknown> = { preferences: { theme: 'system' } };

    if (existing) {
      const parsed = JSON.parse(existing);
      state = { ...parsed.state };
    }

    localStorage.setItem(
      AUTH_STORAGE_KEYS.USER_STORAGE,
      JSON.stringify({
        state: { ...state, token },
        version: 0,
      })
    );
  } catch (error) {
    console.error('同步到 Zustand 存储失败:', error);
  }
}

/**
 * 处理认证过期
 */
export function handleAuthExpired() {
  clearAllAuthInfo();

  if (!isBrowser()) return;

  // 检查是否在 iframe 中
  const isInIframe = window.self !== window.top;

  if (isInIframe) {
    // iframe 中通过 postMessage 通知父窗口
    // 通过受限的 origin 发送通知，避免使用通配符
    notifyParent({ type: 'AUTH_EXPIRED' });
  } else {
    // 直接重定向到登录页
    window.location.href = '/ratel/login';
  }
}
