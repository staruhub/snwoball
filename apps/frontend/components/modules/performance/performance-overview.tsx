"use client";

import { ModuleProps, registerModule, tableModuleSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "period", header: "期间" },
  { key: "fund", header: "本基金" },
  { key: "benchmark", header: "基准" },
  { key: "excess", header: "超额" },
  { key: "rank", header: "同类排名" },
];

function getMockData() {
  return [
    { period: "近1周", fund: "+1.25%", benchmark: "+0.85%", excess: "+0.40%", rank: "125/1500" },
    { period: "近1月", fund: "+3.56%", benchmark: "+2.35%", excess: "+1.21%", rank: "85/1500" },
    { period: "近3月", fund: "+8.25%", benchmark: "+5.68%", excess: "+2.57%", rank: "56/1500" },
    { period: "近6月", fund: "+12.35%", benchmark: "+8.56%", excess: "+3.79%", rank: "42/1500" },
    { period: "今年以来", fund: "+15.68%", benchmark: "+10.25%", excess: "+5.43%", rank: "38/1500" },
    { period: "近1年", fund: "+23.45%", benchmark: "+15.68%", excess: "+7.77%", rank: "25/1500" },
    { period: "近3年", fund: "+45.68%", benchmark: "+28.35%", excess: "+17.33%", rank: "18/1500" },
    { period: "成立以来", fund: "+85.23%", benchmark: "+52.68%", excess: "+32.55%", rank: "12/1500" },
  ];
}

export function PerformanceOverviewModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "performance-overview",
    name: "业绩概览表",
    category: "performance",
    description: "展示不同期间的业绩概览",
    displayType: "table",
  },
  PerformanceOverviewModule,
  tableModuleSchema
);
