/**
 * 模块系统类型定义
 */

import { ReactNode } from "react";

// 模块分类
export type ModuleCategory =
  | "product-info"      // 产品信息
  | "return-stats"      // 收益统计
  | "risk-stats"        // 风险统计
  | "performance"       // 业绩分析
  | "portfolio"         // 组合分析
  | "attribution"       // 归因分析
  | "equity-strategy"   // 股票策略
  | "bond-strategy"     // 债券策略
  | "fof-analysis"      // FOF分析
  | "risk-monitor"      // 风险监控
  | "comparison"        // 比较分析
  | "custom";           // 自定义模块

// 模块显示类型
export type ModuleDisplayType = "table" | "chart" | "mixed" | "custom";

// 分类信息
export interface CategoryInfo {
  id: ModuleCategory;
  label: string;
  order: number;
}

// 模块定义
export interface ModuleDefinition {
  id: string;
  name: string;
  category: ModuleCategory;
  description?: string;
  displayType: ModuleDisplayType;
  defaultConfig?: Record<string, unknown>;
  icon?: string;
}

// 模块实例（在画布上的模块）
export interface ModuleInstance {
  instanceId: string;
  moduleId: string;
  config: Record<string, unknown>;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

// 模块组件 Props
export interface ModuleProps {
  instance: ModuleInstance;
  definition: ModuleDefinition;
  fundId?: string;
  benchmarkId?: string;
  startDate?: string;
  endDate?: string;
  onConfigChange?: (config: Record<string, unknown>) => void;
}

// 模块组件类型
export type ModuleComponent = React.ComponentType<ModuleProps>;

// 配置字段类型
export type ConfigFieldType =
  | "text"
  | "number"
  | "select"
  | "date"
  | "boolean"
  | "color"
  | "range";

// 配置字段定义
export interface ConfigField {
  key: string;
  label: string;
  type: ConfigFieldType;
  defaultValue?: unknown;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
}

// 配置 Schema
export interface ConfigSchema {
  fields: ConfigField[];
}

// 模块注册项
export interface ModuleRegistryEntry {
  definition: ModuleDefinition;
  component: ModuleComponent;
  configSchema?: ConfigSchema;
}

// 分类列表
export const MODULE_CATEGORIES: CategoryInfo[] = [
  { id: "product-info", label: "产品信息", order: 1 },
  { id: "return-stats", label: "收益统计", order: 2 },
  { id: "risk-stats", label: "风险统计", order: 3 },
  { id: "performance", label: "业绩分析", order: 4 },
  { id: "portfolio", label: "组合分析", order: 5 },
  { id: "attribution", label: "归因分析", order: 6 },
  { id: "equity-strategy", label: "股票策略", order: 7 },
  { id: "bond-strategy", label: "债券策略", order: 8 },
  { id: "fof-analysis", label: "FOF分析", order: 9 },
  { id: "risk-monitor", label: "风险监控", order: 10 },
  { id: "comparison", label: "比较分析", order: 11 },
  { id: "custom", label: "自定义", order: 12 },
];

// 获取分类标签
export function getCategoryLabel(category: ModuleCategory): string {
  const info = MODULE_CATEGORIES.find((c) => c.id === category);
  return info?.label ?? category;
}
