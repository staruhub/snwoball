"use client";

import { ModuleProps, registerModule, riskModuleSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "metric", header: "指标" },
  { key: "fund", header: "本基金" },
  { key: "benchmark", header: "基准" },
];

function getMockData() {
  return [
    { metric: "下行波动率", fund: "12.35%", benchmark: "15.68%" },
    { metric: "最大回撤", fund: "-25.36%", benchmark: "-32.15%" },
    { metric: "平均回撤", fund: "-5.23%", benchmark: "-6.85%" },
    { metric: "回撤持续天数", fund: "45天", benchmark: "62天" },
    { metric: "负收益月份占比", fund: "35.5%", benchmark: "42.3%" },
    { metric: "最大连续亏损月", fund: "3个月", benchmark: "5个月" },
    { metric: "亏损月平均亏损", fund: "-2.85%", benchmark: "-3.56%" },
  ];
}

export function DownsideRiskModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "downside-risk",
    name: "下行风险分析",
    category: "risk-stats",
    description: "展示下行风险相关指标",
    displayType: "table",
  },
  DownsideRiskModule,
  riskModuleSchema
);
