'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserPreferences } from '@/lib/api/settings';
import { applyTheme, initializeThemeListener, Theme } from '@/lib/utils/theme';

interface UserState {
  // 用户信息
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setToken: (token: string | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setPreferences: (preferences: UserPreferences | null) => void;
  updateTheme: (theme: 'light' | 'dark' | 'system') => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      preferences: null,
      token: null,
      isAuthenticated: false,

      setToken: (token) =>
        set({
          token,
          isAuthenticated: !!token,
        }),

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

      logout: () =>
        set({
          profile: null,
          preferences: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        token: state.token,
        preferences: state.preferences,
      }),
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
