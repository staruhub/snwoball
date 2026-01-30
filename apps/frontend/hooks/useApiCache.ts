/**
 * 通用 API 缓存 Hook
 * 实现 SWR (Stale-While-Revalidate) 模式，支持请求去重、TTL 过期、LRU 淘汰
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { logApiError } from '../lib/utils/apiLogger';

// 缓存条目接口
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  promise?: Promise<T>; // 用于请求去重
}

// 缓存存储（全局单例）
const cacheStore = new Map<string, CacheEntry<any>>();
const cacheAccessOrder: string[] = []; // 用于 LRU 淘汰
const MAX_CACHE_SIZE = 50;

/**
 * 生成缓存 key
 * @param endpoint - API 端点标识
 * @param params - 请求参数
 */
export function generateCacheKey(endpoint: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return endpoint;
  }
  return `${endpoint}:${JSON.stringify(params)}`;
}

/**
 * 更新 LRU 访问顺序
 */
function touchCacheKey(key: string): void {
  const index = cacheAccessOrder.indexOf(key);
  if (index !== -1) {
    cacheAccessOrder.splice(index, 1);
  }
  cacheAccessOrder.push(key);

  // LRU 淘汰：超过最大缓存数时，移除最少使用的
  if (cacheAccessOrder.length > MAX_CACHE_SIZE) {
    const oldestKey = cacheAccessOrder.shift();
    if (oldestKey) {
      cacheStore.delete(oldestKey);
    }
  }
}

/**
 * 检查缓存是否过期
 */
function isCacheExpired(entry: CacheEntry<any>, ttl: number): boolean {
  return Date.now() - entry.timestamp > ttl;
}

/**
 * 使缓存失效
 */
export function invalidateCache(key: string): void {
  cacheStore.delete(key);
  const index = cacheAccessOrder.indexOf(key);
  if (index !== -1) {
    cacheAccessOrder.splice(index, 1);
  }
}

/**
 * 清空所有缓存
 */
export function invalidateAllCache(): void {
  cacheStore.clear();
  cacheAccessOrder.length = 0;
}

/**
 * 通用 API 缓存 Hook
 * @param fetcher - 数据获取函数
 * @param cacheKey - 缓存键
 * @param ttl - 缓存有效期（毫秒），默认 5 分钟
 * @param enabled - 是否启用（默认 true）
 */
export function useApiCache<T>(
  fetcher: () => Promise<T>,
  cacheKey: string,
  ttl: number = 5 * 60 * 1000,
  enabled: boolean = true
): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  // 获取数据的核心函数
  const fetchData = useCallback(
    async (forceRefresh: boolean = false): Promise<void> => {
      if (!enabled) return;

      const cached = cacheStore.get(cacheKey);

      // 如果缓存存在且未过期，直接使用缓存
      if (!forceRefresh && cached && !isCacheExpired(cached, ttl)) {
        touchCacheKey(cacheKey);
        setData(cached.data);
        setIsLoading(false);
        return;
      }

      // 请求去重：如果已有进行中的请求，复用 Promise
      if (cached?.promise) {
        try {
          const result = await cached.promise;
          if (isMounted.current) {
            setData(result);
            setIsLoading(false);
          }
        } catch (err) {
          if (isMounted.current) {
            setError(err as Error);
            setIsLoading(false);
          }
        }
        return;
      }

      // 发起新请求
      setIsLoading(true);
      setError(null);

      const promise = fetcher();

      // 存储 Promise 用于请求去重
      cacheStore.set(cacheKey, {
        data: cached?.data || null,
        timestamp: Date.now(),
        promise,
      });

      try {
        const result = await promise;

        if (isMounted.current) {
          setData(result);
          setIsLoading(false);
        }

        // 更新缓存
        cacheStore.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
        touchCacheKey(cacheKey);
      } catch (err) {
        if (isMounted.current) {
          const errorObj = err as Error;
          setError(errorObj);
          setIsLoading(false);

          // 记录错误
          logApiError(cacheKey, errorObj, { level: 'error' });
        }

        // 移除失败的 Promise
        const currentEntry = cacheStore.get(cacheKey);
        if (currentEntry?.promise === promise) {
          cacheStore.delete(cacheKey);
        }
      }
    },
    [fetcher, cacheKey, ttl, enabled]
  );

  // 手动刷新数据
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // 初始化和缓存过期后台刷新
  useEffect(() => {
    isMounted.current = true;

    // 初始加载
    fetchData();

    // SWR: 如果缓存存在但已过期，先展示缓存数据，后台刷新
    const cached = cacheStore.get(cacheKey);
    if (cached && isCacheExpired(cached, ttl)) {
      setData(cached.data); // 先展示旧数据
      fetchData(true); // 后台刷新
    }

    return () => {
      isMounted.current = false;
    };
  }, [cacheKey, fetchData, ttl]);

  return { data, isLoading, error, refetch };
}
