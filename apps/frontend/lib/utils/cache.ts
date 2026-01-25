/**
 * API Cache Utility
 *
 * Provides a simple in-memory cache for API responses with TTL support.
 * Can be used to reduce redundant API calls and improve performance.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class APICache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default

  /**
   * Get cached data if valid, otherwise return null
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Cache expired
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache data with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL,
    });
  }

  /**
   * Check if cache key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache size
   */
  get size(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const apiCache = new APICache();

/**
 * Generate cache key from URL and params
 */
export function generateCacheKey(
  url: string,
  params?: Record<string, unknown>
): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${JSON.stringify(params[key])}`)
    .join("&");

  return `${url}?${sortedParams}`;
}

/**
 * Wrapper for fetch with caching
 */
export async function cachedFetch<T>(
  url: string,
  options?: RequestInit & { cacheTTL?: number; cacheKey?: string }
): Promise<T> {
  const cacheKey = options?.cacheKey ?? url;
  const ttl = options?.cacheTTL;

  // Check cache first (only for GET requests)
  if (!options?.method || options.method === "GET") {
    const cached = apiCache.get<T>(cacheKey);
    if (cached !== null) {
      return cached;
    }
  }

  // Fetch from API
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as T;

  // Cache the response (only for GET requests)
  if (!options?.method || options.method === "GET") {
    apiCache.set(cacheKey, data, ttl);
  }

  return data;
}

/**
 * Hook-friendly cache wrapper
 */
export function createCachedQuery<T, P extends unknown[]>(
  queryFn: (...args: P) => Promise<T>,
  keyFn: (...args: P) => string,
  ttl?: number
) {
  return async (...args: P): Promise<T> => {
    const key = keyFn(...args);
    const cached = apiCache.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const data = await queryFn(...args);
    apiCache.set(key, data, ttl);
    return data;
  };
}

// Auto-cleanup expired entries every 5 minutes
if (typeof window !== "undefined") {
  setInterval(() => {
    apiCache.cleanup();
  }, 5 * 60 * 1000);
}
