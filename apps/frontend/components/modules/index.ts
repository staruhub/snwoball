/**
 * 模块系统导出
 * 导入此文件将自动注册所有模块
 */

// 基础组件
export * from "./base";

// 产品信息模块
export * from "./product-info";

// 收益统计模块
export * from "./return-stats";

// 风险统计模块
export * from "./risk-stats";

// 业绩分析模块
export * from "./performance";

// 组合分析模块
export * from "./portfolio";

// 重新导出模块系统核心
export {
  moduleRegistry,
  registerModule,
  type ModuleDefinition,
  type ModuleInstance,
  type ModuleProps,
  type ModuleComponent,
  MODULE_CATEGORIES,
  getCategoryLabel,
} from "@/lib/modules";
