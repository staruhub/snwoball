'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';

/**
 * 认证 Hook
 * 用于管理认证状态和访问控制
 */
export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, isAuthenticated, _hasHydrated, logout: storeLogout } = useUserStore();

  /**
   * 检查认证状态，未认证时重定向到登录页
   * @param redirectTo 重定向目标，默认为 ratel-mind-web 登录页
   */
  const requireAuth = useCallback((redirectTo?: string) => {
    // 等待 hydration 完成
    if (!_hasHydrated) {
      return true; // 还在加载中，暂时不重定向
    }
    if (!isAuthenticated || !token) {
      const currentPath = pathname || '/';
      const target =
        redirectTo ?? `/ratel/login?redirect=${encodeURIComponent(currentPath)}`;
      router.replace(target);
      return false;
    }
    return true;
  }, [isAuthenticated, token, router, _hasHydrated, pathname]);

  /**
   * 登出并重定向到登录页
   * @param redirectTo 重定向目标，默认为 ratel-mind-web 登录页
   */
  const logout = useCallback((redirectTo: string = '/ratel/login') => {
    storeLogout();
    router.replace(redirectTo);
  }, [storeLogout, router]);

  /**
   * 用于页面级别的认证守卫
   * 在 useEffect 中使用，自动检查并重定向
   * @param redirectTo 重定向目标，默认为 ratel-mind-web 登录页
   */
  const useAuthGuard = useCallback((redirectTo: string = '/ratel/login') => {
    // 等待 hydration 完成
    if (!_hasHydrated) {
      return;
    }
    if (!isAuthenticated || !token) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, token, router, _hasHydrated]);

  return {
    token,
    isAuthenticated,
    isLoading: !_hasHydrated,
    requireAuth,
    logout,
    useAuthGuard,
  };
}
