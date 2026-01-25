"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicFunds } from "@/lib/api/fund";
import type { FundProfile } from "@/lib/api/types";

interface UseFundsParams {
  keyword?: string;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

interface UseFundsResult {
  funds: FundProfile[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook for fetching fund list with search and pagination
 */
export function useFunds({
  keyword = "",
  page = 1,
  pageSize = 50,
  enabled = true,
}: UseFundsParams = {}): UseFundsResult {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["funds", keyword, page, pageSize],
    queryFn: async () => {
      const result = await getPublicFunds({
        keyword: keyword || undefined,
        page,
        page_size: pageSize,
      });
      return result;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime renamed to gcTime in v5)
  });

  return {
    funds: data?.items || [],
    total: data?.total || 0,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
}
