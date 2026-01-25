"use client";

import { ModuleProps, registerModule, riskModuleSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "metric", header: "指标" },
  { key: "fund", header: "本基金" },
  { key: "benchmark", header: "基准" },
  { key: "description", header: "说明" },
];

function getMockData() {
  return [
    { metric: "夏普比率", fund: "1.25", benchmark: "0.98", description: "每承担1单位风险获得的超额收益" },
    { metric: "索提诺比率", fund: "1.58", benchmark: "1.12", description: "仅考虑下行风险的收益比" },
    { metric: "卡玛比率", fund: "0.85", benchmark: "0.62", description: "年化收益与最大回撤之比" },
    { metric: "特雷诺比率", fund: "0.12", benchmark: "0.08", description: "每承担1单位系统风险的超额收益" },
    { metric: "信息比率", fund: "0.68", benchmark: "-", description: "超额收益与跟踪误差之比" },
    { metric: "詹森Alpha", fund: "2.35%", benchmark: "-", description: "CAPM模型下的超额收益" },
  ];
}

export function RiskAdjustedModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "risk-adjusted",
    name: "风险调整收益",
    category: "risk-stats",
    description: "展示风险调整后的收益指标",
    displayType: "table",
  },
  RiskAdjustedModule,
  riskModuleSchema
);
