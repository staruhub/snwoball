/**
 * API 模块导出
 */

// 配置和工具
export { API_BASE_URL, fetchApi, fetchApiAuth, buildQueryParams } from "./config";
export type { ApiError } from "./config";

// 类型导出
export type {
  FundProfile,
  FundListResponse,
  FundNav,
  FundNavListResponse,
  PerformanceMetrics,
  PerformanceComparisonResponse,
  MetricValue,
  MetricCategory,
  ComprehensiveMetricsResponse,
  FundOverviewResponse,
  FundCurveData,
  FundMetricsData,
  FundInfoData,
  MultiFundCompareResponse,
  BenchmarkInfo,
  BenchmarkListResponse,
  ApiResponse,
  FundListParams,
  PerformanceCompareParams,
  ComprehensiveMetricsParams,
} from "./types";

// 基金 API
export {
  getPublicFunds,
  getFundProfile,
  getPerformanceComparison,
  getComprehensiveMetrics,
  getFundOverview,
  getBenchmarks,
  getActiveBenchmarks,
} from "./fund";
