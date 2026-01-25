/**
 * API 类型定义
 * 基于后端 Pydantic Schema 转换
 */

// ==================== 基金档案类型 ====================

export interface FundProfile {
  id: string;
  name: string;
  short_name?: string;
  code: string;
  combination_type_id?: string;
  fund_manager?: string;
  launch_date?: string;
  nav_start_date?: string;
  nav_frequency: string;
  default_benchmark_id?: string;
  status: number;
  risk_level: number;
  fund_type: number;
  create_user?: string;
  share_level?: string;
  fund_operation_type?: string;
  fund_nature?: string;
  is_index_type?: string;
  fund_investment_style?: string;
  fund_type_code?: string;
  latest_nav?: number;
  latest_nav_date?: string;
  cumulative_return?: number;
  return_pct?: number;
  annualized_return?: number;
  sharpe_ratio?: number;
  max_drawdown?: number;
  daily_return?: number;
  unit_nav?: number;
  accumulated_nav?: number;
  accumulated_value?: number;
  create_time: string;
  update_time: string;
}

export interface FundListResponse {
  total: number;
  page: number;
  page_size: number;
  items: FundProfile[];
}

// ==================== 基金净值类型 ====================

export interface FundNav {
  fund_id: string;
  nav_date: string;
  unit_nav?: number;
  accumulated_nav?: number;
  create_time: string;
  update_time: string;
}

export interface FundNavListResponse {
  total: number;
  page: number;
  page_size: number;
  items: FundNav[];
}

// ==================== 业绩对比类型 ====================

export interface PerformanceMetrics {
  // 收益指标
  total_return?: number;
  annualized_return?: number;
  // 风险指标
  annualized_volatility?: number;
  max_drawdown?: number;
  max_drawdown_start?: string;
  max_drawdown_end?: string;
  // 风险调整收益
  sharpe_ratio?: number;
  sortino_ratio?: number;
  calmar_ratio?: number;
  // 持有体验
  win_rate?: number;
  avg_drawdown?: number;
  avg_drawdown_days?: number;
  // 字符串格式化版本
  total_return_str?: string;
  annualized_return_str?: string;
  max_drawdown_str?: string;
  sharpe_ratio_str?: string;
  // 允许额外字段
  [key: string]: unknown;
}

export interface PerformanceComparisonResponse {
  dates: string[];
  fund_returns: number[];
  benchmark_returns: number[];
  excess_returns: number[];
  fund_drawdowns: number[];
  benchmark_drawdowns: number[];
  excess_drawdowns: number[];
  metrics: PerformanceMetrics;
}

// ==================== 综合业绩指标类型 ====================

export interface MetricValue {
  [key: string]: number | string | undefined;
}

export interface MetricCategory {
  fund: MetricValue;
  benchmark: MetricValue;
  excess: MetricValue;
}

export interface ComprehensiveMetricsResponse {
  return_metrics: MetricCategory;
  risk_metrics: MetricCategory;
  risk_adjusted_metrics: MetricCategory;
  experience_metrics: MetricCategory;
}

// ==================== 基金概览类型 ====================

export interface FundOverviewResponse {
  launch_date?: string;
  latest_nav_date?: string;
  latest_nav?: number;
  accumulated_value?: number;
  cumulative_return?: number;
  annualized_return?: number;
  annualized_volatility?: number;
  sharpe_ratio?: number;
  max_drawdown?: number;
}

// ==================== 多基金对比类型 ====================

export interface FundCurveData {
  fund_id: string;
  fund_name: string;
  fund_code: string;
  short_name?: string;
  returns: number[];
  drawdowns: number[];
}

export interface FundMetricsData {
  fund_id: string;
  fund_name: string;
  fund_code: string;
  short_name?: string;
  return_1m?: number;
  return_3m?: number;
  return_6m?: number;
  return_ytd?: number;
  total_return: number;
  annualized_return: number;
  annualized_volatility: number;
  max_drawdown: number;
  max_drawdown_start?: string;
  max_drawdown_end?: string;
  sharpe_ratio: number;
  sortino_ratio?: number;
  calmar_ratio: number;
  win_rate: number;
  avg_drawdown?: number;
  avg_drawdown_days?: number;
}

export interface FundInfoData {
  fund_id: string;
  fund_name: string;
  fund_code: string;
  short_name?: string;
  fund_type: string;
  nav_start_date?: string;
  latest_nav_date?: string;
  latest_accumulated_nav: number;
  nav_frequency: string;
}

export interface MultiFundCompareResponse {
  dates: string[];
  funds: FundCurveData[];
  metrics: FundMetricsData[];
  fund_info: FundInfoData[];
}

// ==================== 基准类型 ====================

export interface BenchmarkInfo {
  id: string;
  name: string;
  code: string;
  short_name?: string;
}

export interface BenchmarkListResponse {
  items: BenchmarkInfo[];
  total: number;
}

// ==================== 通用响应类型 ====================

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ==================== 请求参数类型 ====================

export interface FundListParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  fund_type?: number;
  status?: number;
}

export interface PerformanceCompareParams {
  fund_id: string;
  benchmark_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface ComprehensiveMetricsParams {
  fund_id: string;
  benchmark_id?: string;
  start_date?: string;
  end_date?: string;
}
