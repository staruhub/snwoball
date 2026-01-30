'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import {
  AUTH_STORAGE_KEYS,
  AUTH_SYNC_EVENT,
  isLoggedIn,
  getAccessToken,
} from '@/lib/auth/tokenManager';

/**
 * 认证状态同步 Hook
 * 监听 localStorage 变化，保持 Zustand 状态同步
 * 支持多 Tab 同步
 */
export function useAuthSync() {
  const setToken = useUserStore((state) => state.setToken);
  const logout = useUserStore((state) => state.logout);
  const syncFromStorage = useUserStore((state) => state.syncFromStorage);

  useEffect(() => {
    // 初始同步：从 ratel-mind-web 的 localStorage 读取
    const token = getAccessToken();
    if (token && isLoggedIn()) {
      setToken(token);
    }

    // 监听 storage 事件 (其他 tab 或 ratel-mind-web 的变化)
    const handleStorageChange = (e: StorageEvent) => {
      // access_token 变化
      if (e.key === AUTH_STORAGE_KEYS.ACCESS_TOKEN) {
        if (e.newValue) {
          setToken(e.newValue);
        } else {
          logout();
        }
      }

      // isLoggedIn 变化
      if (e.key === AUTH_STORAGE_KEYS.IS_LOGGED_IN) {
        if (e.newValue !== 'true') {
          logout();
        }
      }

      // user-storage 变化 (Zustand persist)
      if (e.key === AUTH_STORAGE_KEYS.USER_STORAGE) {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (parsed.state?.token) {
              setToken(parsed.state.token);
            }
          } catch {
            // 解析失败忽略
          }
        } else {
          logout();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const handleAuthSync = () => {
      syncFromStorage();
    };
    window.addEventListener(AUTH_SYNC_EVENT, handleAuthSync);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(AUTH_SYNC_EVENT, handleAuthSync);
    };
  }, [setToken, logout, syncFromStorage]);
}
