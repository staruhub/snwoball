"use client";

import { create } from "zustand";
import type { Report } from "@/lib/api/reports";
import type { Template } from "@/lib/api/templates";

// ==================== 类型定义 ====================

interface WorkspaceState {
  // 数据
  recentReports: Report[];
  favoriteTemplates: Template[];
  unreadNotificationCount: number;

  // UI 状态
  isLoading: boolean;
  isSearchOpen: boolean;
  isTemplateModalOpen: boolean;

  // Actions - 数据
  setRecentReports: (reports: Report[]) => void;
  setFavoriteTemplates: (templates: Template[]) => void;
  setUnreadNotificationCount: (count: number) => void;
  decrementUnreadCount: () => void;
  clearUnreadCount: () => void;

  // Actions - UI
  setLoading: (loading: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setTemplateModalOpen: (open: boolean) => void;

  // Actions - 报告操作
  addReport: (report: Report) => void;
  removeReport: (reportId: string) => void;
  updateReport: (reportId: string, updates: Partial<Report>) => void;

  // Actions - 模板操作
  toggleTemplateFavorite: (templateId: string) => void;

  // 重置
  reset: () => void;
}

// ==================== Store ====================

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  // 初始状态
  recentReports: [],
  favoriteTemplates: [],
  unreadNotificationCount: 0,
  isLoading: false,
  isSearchOpen: false,
  isTemplateModalOpen: false,

  // 数据 Actions
  setRecentReports: (reports) => set({ recentReports: reports }),

  setFavoriteTemplates: (templates) => set({ favoriteTemplates: templates }),

  setUnreadNotificationCount: (count) => set({ unreadNotificationCount: count }),

  decrementUnreadCount: () =>
    set((state) => ({
      unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1),
    })),

  clearUnreadCount: () => set({ unreadNotificationCount: 0 }),

  // UI Actions
  setLoading: (loading) => set({ isLoading: loading }),

  setSearchOpen: (open) => set({ isSearchOpen: open }),

  setTemplateModalOpen: (open) => set({ isTemplateModalOpen: open }),

  // 报告操作
  addReport: (report) =>
    set((state) => ({
      recentReports: [report, ...state.recentReports].slice(0, 10),
    })),

  removeReport: (reportId) =>
    set((state) => ({
      recentReports: state.recentReports.filter((r) => r.id !== reportId),
    })),

  updateReport: (reportId, updates) =>
    set((state) => ({
      recentReports: state.recentReports.map((r) =>
        r.id === reportId ? { ...r, ...updates } : r
      ),
    })),

  // 模板操作
  toggleTemplateFavorite: (templateId) =>
    set((state) => ({
      favoriteTemplates: state.favoriteTemplates.map((t) =>
        t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
      ),
    })),

  // 重置
  reset: () =>
    set({
      recentReports: [],
      favoriteTemplates: [],
      unreadNotificationCount: 0,
      isLoading: false,
      isSearchOpen: false,
      isTemplateModalOpen: false,
    }),
}));
