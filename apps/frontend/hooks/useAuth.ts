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
  const { token, isAuthenticated, logout: storeLogout } = useUserStore();

  /**
   * 检查认证状态，未认证时重定向到登录页
   */
  const requireAuth = useCallback(() => {
    if (!isAuthenticated || !token) {
      router.replace('/admin/login');
      return false;
    }
    return true;
  }, [isAuthenticated, token, router]);

  /**
   * 登出并重定向到登录页
   */
  const logout = useCallback(() => {
    storeLogout();
    router.replace('/admin/login');
  }, [storeLogout, router]);

  /**
   * 用于页面级别的认证守卫
   * 在 useEffect 中使用，自动检查并重定向
   */
  const useAuthGuard = useCallback(() => {
    if (!isAuthenticated || !token) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, token, router]);

  return {
    token,
    isAuthenticated,
    requireAuth,
    logout,
    useAuthGuard,
  };
}

/**
 * 认证守卫 Hook
 * 在 Admin 页面中使用，自动检查认证状态
 */
export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, isAuthenticated } = useUserStore();

  useEffect(() => {
    // 跳过登录页面的检查
    if (pathname === '/admin/login') {
      return;
    }

    if (!isAuthenticated || !token) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, token, pathname, router]);

  return { token, isAuthenticated };
}
