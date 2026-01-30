/**
 * 基金数据 Hooks
 * 提供带缓存的基金数据查询接口
 */

import { useMemo, useState, useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { useApiCache, generateCacheKey } from './useApiCache';
import {
  getPublicFunds,
  getFundProfile,
  getFundOverview,
  getActiveBenchmarks,
} from '../lib/api/fund';
import { fetchWebApi } from '../lib/api/config';
import { logApiError } from '../lib/utils/apiLogger';
import type {
  FundListResponse,
  FundProfile,
  FundOverviewResponse,
  BenchmarkInfo,
  FundListParams,
} from '../lib/api/types';

/**
 * 获取基金列表（带缓存）
 * TTL: 5 分钟
 * @param params - 查询参数 { page, pageSize, keyword }
 */
export function useFunds(params?: FundListParams) {
  const cacheKey = useMemo(
    () => generateCacheKey('getPublicFunds', params),
    [params]
  );

  const fetcher = useMemo(
    () => () => getPublicFunds(params),
    [params]
  );

  return useApiCache<FundListResponse>(
    fetcher,
    cacheKey,
    5 * 60 * 1000 // 5 分钟
  );
}

/**
 * 获取活跃基准列表（带缓存）
 * TTL: 30 分钟（基准数据相对稳定）
 */
export function useBenchmarks() {
  const cacheKey = 'getActiveBenchmarks';

  const fetcher = useMemo(() => getActiveBenchmarks, []);

  return useApiCache<BenchmarkInfo[]>(
    fetcher,
    cacheKey,
    30 * 60 * 1000 // 30 分钟
  );
}

/**
 * 获取基金档案（带缓存）
 * TTL: 10 分钟（档案信息变化少）
 * @param fundId - 基金 ID
 */
export function useFundProfile(fundId: string | null) {
  const cacheKey = useMemo(
    () => generateCacheKey('getFundProfile', { fundId }),
    [fundId]
  );

  const fetcher = useMemo(
    () => (fundId ? () => getFundProfile(fundId) : null),
    [fundId]
  );

  const enabled = !!fundId;

  return useApiCache<FundProfile>(
    fetcher || (() => Promise.resolve({} as FundProfile)),
    cacheKey,
    10 * 60 * 1000, // 10 分钟
    enabled
  );
}

/**
 * 获取基金概览（带缓存）
 * TTL: 5 分钟（净值可能更新）
 * @param fundId - 基金 ID
 */
export function useFundOverview(fundId: string | null) {
  const cacheKey = useMemo(
    () => generateCacheKey('getFundOverview', { fundId }),
    [fundId]
  );

  const fetcher = useMemo(
    () => (fundId ? () => getFundOverview(fundId) : null),
    [fundId]
  );

  const enabled = !!fundId;

  return useApiCache<FundOverviewResponse>(
    fetcher || (() => Promise.resolve({} as FundOverviewResponse)),
    cacheKey,
    5 * 60 * 1000, // 5 分钟
    enabled
  );
}

/**
 * 搜索基金（带防抖和请求取消）
 * 使用 useDebounce 防抖 300ms，使用 AbortController 取消过期请求
 * @param keyword - 搜索关键词
 */
export function useSearchFunds(keyword: string): {
  results: FundListResponse | null;
  isSearching: boolean;
  error: Error | null;
} {
  const [results, setResults] = useState<FundListResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 防抖关键词（300ms）
  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    // 如果关键词为空，清空结果
    if (!debouncedKeyword.trim()) {
      setResults(null);
      setIsSearching(false);
      setError(null);
      return;
    }

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的 AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // 发起搜索请求
    const searchFunds = async () => {
      setIsSearching(true);
      setError(null);

      try {
        const response = await fetchWebApi<FundListResponse>(
          `/api/v1/fund/public-funds?keyword=${encodeURIComponent(debouncedKeyword)}`,
          {
            skipAuth: true,
            signal: abortController.signal,
          }
        );

        // 如果请求未被取消，更新结果
        if (!abortController.signal.aborted) {
          setResults(response);
          setIsSearching(false);
        }
      } catch (err) {
        // 忽略 AbortError（请求被取消是正常的）
        if ((err as Error).name === 'AbortError') {
          return;
        }

        // 记录其他错误
        logApiError('useSearchFunds', err as Error, {
          metadata: { keyword: debouncedKeyword },
        });

        if (!abortController.signal.aborted) {
          setError(err as Error);
          setIsSearching(false);
        }
      }
    };

    searchFunds();

    // 清理函数：取消请求
    return () => {
      abortController.abort();
    };
  }, [debouncedKeyword]);

  return { results, isSearching, error };
}
