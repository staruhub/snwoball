'use client';

import { create } from 'zustand';

// 全局筛选条件类型
export interface GlobalFilters {
  fundId: string | null;
  fundName: string | null;
  benchmarkId: string | null;
  benchmarkName: string | null;
  dateRange: {
    type: 'since_inception' | '1y' | '3y' | '5y' | 'ytd' | 'custom';
    startDate: string | null;
    endDate: string | null;
  };
  frequency: 'daily' | 'weekly' | 'monthly';
  navType: 'adjusted' | 'unit' | 'cumulative';
}

interface GlobalFiltersState {
  filters: GlobalFilters;

  // Actions
  setFund: (fundId: string | null, fundName: string | null) => void;
  setBenchmark: (benchmarkId: string | null, benchmarkName: string | null) => void;
  setDateRange: (dateRange: GlobalFilters['dateRange']) => void;
  setFrequency: (frequency: GlobalFilters['frequency']) => void;
  setNavType: (navType: GlobalFilters['navType']) => void;
  resetFilters: () => void;
}

// 默认筛选条件
const defaultFilters: GlobalFilters = {
  fundId: null,
  fundName: null,
  benchmarkId: null,
  benchmarkName: null,
  dateRange: {
    type: 'since_inception',
    startDate: null,
    endDate: null,
  },
  frequency: 'daily',
  navType: 'adjusted',
};

export const useGlobalFiltersStore = create<GlobalFiltersState>((set) => ({
  filters: defaultFilters,

  setFund: (fundId, fundName) =>
    set((state) => ({
      filters: { ...state.filters, fundId, fundName },
    })),

  setBenchmark: (benchmarkId, benchmarkName) =>
    set((state) => ({
      filters: { ...state.filters, benchmarkId, benchmarkName },
    })),

  setDateRange: (dateRange) =>
    set((state) => ({
      filters: { ...state.filters, dateRange },
    })),

  setFrequency: (frequency) =>
    set((state) => ({
      filters: { ...state.filters, frequency },
    })),

  setNavType: (navType) =>
    set((state) => ({
      filters: { ...state.filters, navType },
    })),

  resetFilters: () => set({ filters: defaultFilters }),
}));
