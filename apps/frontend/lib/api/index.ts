/**
 * API 模块导出
 */

// 配置和工具
export { API_BASE_URL, WEB_API_URL, fetchApi, fetchApiAuth, fetchWebApi, fetchWebApiAuth, buildQueryParams } from "./config";
export type { ApiError } from "./config";

// 导出 API
export { exportReportPdf, downloadBlob } from "./export";
export type { ReportExportRequest } from "./export";

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

// Admin 管理 API (使用具名导出避免冲突)
export {
  type AdminUser,
  type AdminUserListResponse,
  type CreateAdminUserRequest,
  type UpdateAdminUserRequest,
  type Role,
  type RoleListResponse,
  type CreateRoleRequest,
  type UpdateRoleRequest,
  type Module,
  type ModulePermission,
  type ModuleTreeResponse,
  type UpdateModuleRequest,
  type AdminTemplate,
  type AdminTemplateDetail,
  type AdminTemplateListResponse,
  type CreateAdminTemplateRequest,
  type UpdateAdminTemplateRequest,
  type ConfigItem,
  type ConfigGroup,
  type SystemConfigResponse,
  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  updateAdminUserStatus,
  resetAdminPassword,
  getRoles,
  getAllRoles,
  getRole,
  createRole,
  updateRole,
  updateRolePermissions,
  deleteRole,
  getAllPermissions,
  getModuleTree,
  getModule,
  updateModule,
  updateModuleSort,
  getSystemConfig,
  getConfigByKey,
  updateConfig,
  batchUpdateConfigs,
  getPublicConfig,
  getAdminTemplates,
  getAdminTemplate,
  createAdminTemplate,
  updateAdminTemplate,
  publishAdminTemplate,
  deleteAdminTemplate,
} from "./admin";

// 用户设置 API
export * from "./settings";

// 报告 API
export * from "./reports";

// 模板 API
export * from "./templates";

// 通知 API
export * from "./notifications";

// 工作台 API
export * from "./workspace";

// 认证 API
export * from "./auth";
