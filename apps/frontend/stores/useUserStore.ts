'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserPreferences } from '@/lib/api/settings';
import { applyTheme, initializeThemeListener, Theme } from '@/lib/utils/theme';
import { AUTH_STORAGE_KEYS, clearAllAuthInfo } from '@/lib/auth/tokenManager';

interface UserState {
  // 用户信息
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  // Admin 认证状态 (与 user 认证独立)
  adminToken: string | null;
  isAdminAuthenticated: boolean;

  // Actions
  setToken: (token: string | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setPreferences: (preferences: UserPreferences | null) => void;
  updateTheme: (theme: 'light' | 'dark' | 'system') => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
  syncFromStorage: () => void;

  // Admin Actions
  setAdminToken: (token: string | null) => void;
  clearAdminToken: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      preferences: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      // Admin 认证状态初始值
      adminToken: null,
      isAdminAuthenticated: false,

      setToken: (token) =>
        set({
          token,
          isAuthenticated: !!token,
        }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setProfile: (profile) =>
        set({ profile }),

      setPreferences: (preferences) => {
        set({ preferences });
        // 同步应用主题
        if (preferences?.theme) {
          applyTheme(preferences.theme);
        }
      },

      updateTheme: (theme) =>
        set((state) => ({
          preferences: state.preferences
            ? { ...state.preferences, theme }
            : null,
        })),

      logout: () => {
        // 使用统一的清除函数
        clearAllAuthInfo();

        set({
          profile: null,
          preferences: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // 从 localStorage 同步状态
      syncFromStorage: () => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
        const loggedIn =
          localStorage.getItem(AUTH_STORAGE_KEYS.IS_LOGGED_IN) === 'true';

        set({
          token,
          isAuthenticated: loggedIn && !!token,
        });
      },

      // Admin token 管理
      setAdminToken: (adminToken) =>
        set({
          adminToken,
          isAdminAuthenticated: !!adminToken,
        }),

      clearAdminToken: () =>
        set({
          adminToken: null,
          isAdminAuthenticated: false,
        }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        token: state.token,
        preferences: state.preferences,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 统一使用 ratel token 判断认证状态（admin 和 user 共享同一认证）
          const tokenFromRatel =
            typeof window !== 'undefined'
              ? localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
              : null;
          const loggedIn =
            typeof window !== 'undefined'
              ? localStorage.getItem(AUTH_STORAGE_KEYS.IS_LOGGED_IN) === 'true'
              : false;

          // 如果 ratel-mind-web 有有效的 token，使用它
          if (tokenFromRatel && loggedIn) {
            state.token = tokenFromRatel;
            state.isAuthenticated = true;
          } else {
            // 否则使用 Zustand 持久化的 token
            state.isAuthenticated = !!state.token;
          }

          state._hasHydrated = true;
        }
      },
    }
  )
);

/**
 * 初始化主题（在客户端调用）
 */
export function initializeTheme() {
  return initializeThemeListener(() => {
    const state = useUserStore.getState();
    return state.preferences?.theme as Theme | undefined;
  });
}
