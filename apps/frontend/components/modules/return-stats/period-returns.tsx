"use client";

import { ModuleProps, registerModule, tableModuleSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "metric", header: "指标" },
  { key: "fund", header: "本基金" },
  { key: "benchmark", header: "基准" },
  { key: "excess", header: "超额收益" },
];

function getMockData() {
  return [
    { metric: "累计收益", fund: "+23.45%", benchmark: "+18.56%", excess: "+4.89%" },
    { metric: "年化收益", fund: "+12.35%", benchmark: "+9.85%", excess: "+2.50%" },
    { metric: "最大回撤", fund: "-15.23%", benchmark: "-18.56%", excess: "+3.33%" },
    { metric: "夏普比率", fund: "1.25", benchmark: "0.98", excess: "+0.27" },
    { metric: "波动率", fund: "18.56%", benchmark: "22.35%", excess: "-3.79%" },
    { metric: "胜率", fund: "58.5%", benchmark: "52.3%", excess: "+6.2%" },
  ];
}

export function PeriodReturnsModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "period-returns",
    name: "区间收益",
    category: "return-stats",
    description: "展示指定日期范围的收益统计",
    displayType: "table",
  },
  PeriodReturnsModule,
  tableModuleSchema
);
