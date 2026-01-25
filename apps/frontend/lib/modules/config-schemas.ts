/**
 * 模块配置 Schema 定义
 * 定义通用的配置字段模板
 */

import { ConfigSchema, ConfigField } from "./types";

// 通用时间段选择
export const periodField: ConfigField = {
  key: "period",
  label: "时间周期",
  type: "select",
  defaultValue: "1Y",
  options: [
    { value: "1M", label: "近1月" },
    { value: "3M", label: "近3月" },
    { value: "6M", label: "近6月" },
    { value: "YTD", label: "今年以来" },
    { value: "1Y", label: "近1年" },
    { value: "3Y", label: "近3年" },
    { value: "5Y", label: "近5年" },
    { value: "ALL", label: "成立以来" },
  ],
};

// 滚动窗口选择
export const rollingWindowField: ConfigField = {
  key: "rollingWindow",
  label: "滚动窗口",
  type: "select",
  defaultValue: "252",
  options: [
    { value: "21", label: "21天" },
    { value: "63", label: "63天" },
    { value: "126", label: "126天" },
    { value: "252", label: "252天" },
  ],
};

// 无风险利率
export const riskFreeRateField: ConfigField = {
  key: "riskFreeRate",
  label: "无风险利率",
  type: "number",
  defaultValue: 0.025,
  min: 0,
  max: 0.1,
  step: 0.001,
};

// 显示图例
export const showLegendField: ConfigField = {
  key: "showLegend",
  label: "显示图例",
  type: "boolean",
  defaultValue: true,
};

// 显示数据标签
export const showDataLabelsField: ConfigField = {
  key: "showDataLabels",
  label: "显示数据标签",
  type: "boolean",
  defaultValue: false,
};

// 显示网格线
export const showGridField: ConfigField = {
  key: "showGrid",
  label: "显示网格线",
  type: "boolean",
  defaultValue: true,
};

// 图表高度
export const chartHeightField: ConfigField = {
  key: "chartHeight",
  label: "图表高度",
  type: "number",
  defaultValue: 300,
  min: 150,
  max: 600,
  step: 50,
};

// 显示基准
export const showBenchmarkField: ConfigField = {
  key: "showBenchmark",
  label: "显示基准",
  type: "boolean",
  defaultValue: true,
};

// 显示超额收益
export const showExcessField: ConfigField = {
  key: "showExcess",
  label: "显示超额",
  type: "boolean",
  defaultValue: true,
};

// 预设配置 Schema

// 表格类模块通用配置
export const tableModuleSchema: ConfigSchema = {
  fields: [
    periodField,
    showBenchmarkField,
    showExcessField,
  ],
};

// 图表类模块通用配置
export const chartModuleSchema: ConfigSchema = {
  fields: [
    periodField,
    chartHeightField,
    showLegendField,
    showGridField,
    showBenchmarkField,
  ],
};

// 滚动指标模块配置
export const rollingChartSchema: ConfigSchema = {
  fields: [
    periodField,
    rollingWindowField,
    chartHeightField,
    showLegendField,
    showGridField,
    showBenchmarkField,
  ],
};

// 风险指标模块配置
export const riskModuleSchema: ConfigSchema = {
  fields: [
    periodField,
    rollingWindowField,
    riskFreeRateField,
    chartHeightField,
    showLegendField,
    showGridField,
  ],
};

// 归因分析模块配置
export const attributionSchema: ConfigSchema = {
  fields: [
    periodField,
    {
      key: "attributionMethod",
      label: "归因方法",
      type: "select",
      defaultValue: "brinson",
      options: [
        { value: "brinson", label: "Brinson模型" },
        { value: "factor", label: "因子归因" },
        { value: "sector", label: "行业归因" },
      ],
    },
    showDataLabelsField,
    chartHeightField,
  ],
};

// 持仓分析模块配置
export const holdingSchema: ConfigSchema = {
  fields: [
    {
      key: "reportDate",
      label: "报告日期",
      type: "select",
      defaultValue: "latest",
      options: [
        { value: "latest", label: "最新" },
        { value: "Q4", label: "四季报" },
        { value: "Q3", label: "三季报" },
        { value: "Q2", label: "中报" },
        { value: "Q1", label: "一季报" },
      ],
    },
    {
      key: "topN",
      label: "显示前N项",
      type: "number",
      defaultValue: 10,
      min: 5,
      max: 50,
      step: 5,
    },
  ],
};
