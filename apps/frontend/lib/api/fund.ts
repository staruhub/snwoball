/**
 * 基金 API 模块
 */

import { fetchWebApi, buildQueryParams } from "./config";
import type {
  FundListResponse,
  FundProfile,
  PerformanceComparisonResponse,
  ComprehensiveMetricsResponse,
  FundOverviewResponse,
  FundListParams,
  PerformanceCompareParams,
  ComprehensiveMetricsParams,
  BenchmarkListResponse,
  BenchmarkInfo,
} from "./types";

/**
 * 获取公募基金列表（公开接口，无需登录）
 */
export async function getPublicFunds(
  params?: FundListParams
): Promise<FundListResponse> {
  const queryString = buildQueryParams({
    page: params?.page,
    page_size: params?.page_size,
    keyword: params?.keyword,
  });
  return fetchWebApi<FundListResponse>(
    `/api/v1/fund/public-funds${queryString}`,
    { skipAuth: true }
  );
}

/**
 * 获取基金详情（公开接口）
 */
export async function getFundProfile(fundId: string): Promise<FundProfile> {
  return fetchWebApi<FundProfile>(
    `/api/v1/fund/profiles/${fundId}`,
    { skipAuth: true }
  );
}

/**
 * 获取基金 vs 基准业绩对比（公开接口）
 */
export async function getPerformanceComparison(
  params: PerformanceCompareParams
): Promise<PerformanceComparisonResponse> {
  const queryString = buildQueryParams({
    fund_id: params.fund_id,
    benchmark_id: params.benchmark_id,
    start_date: params.start_date,
    end_date: params.end_date,
  });
  return fetchWebApi<PerformanceComparisonResponse>(
    `/api/v1/fund/performance/compare${queryString}`,
    { skipAuth: true }
  );
}

/**
 * 获取基金综合业绩指标
 */
export async function getComprehensiveMetrics(
  params: ComprehensiveMetricsParams
): Promise<ComprehensiveMetricsResponse> {
  const queryString = buildQueryParams({
    fund_id: params.fund_id,
    benchmark_id: params.benchmark_id,
    start_date: params.start_date,
    end_date: params.end_date,
  });
  return fetchWebApi<ComprehensiveMetricsResponse>(
    `/api/v1/fund/performance/metrics${queryString}`
  );
}

/**
 * 获取基金概览（公开接口）
 */
export async function getFundOverview(
  fundId: string
): Promise<FundOverviewResponse> {
  return fetchWebApi<FundOverviewResponse>(
    `/api/v1/fund/overview/${fundId}`,
    { skipAuth: true }
  );
}

/**
 * 获取基准列表（公开接口）
 */
export async function getBenchmarks(): Promise<BenchmarkListResponse> {
  return fetchWebApi<BenchmarkListResponse>(
    "/api/v1/fund/benchmarks",
    { skipAuth: true }
  );
}

/**
 * 获取活跃的基准列表（公开接口）
 */
export async function getActiveBenchmarks(): Promise<BenchmarkInfo[]> {
  return fetchWebApi<BenchmarkInfo[]>(
    "/api/v1/fund/benchmarks/active",
    { skipAuth: true }
  );
}
