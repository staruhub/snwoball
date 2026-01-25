"use client";

import { ModuleProps, registerModule, tableModuleSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "period", header: "市场阶段" },
  { key: "dateRange", header: "日期区间" },
  { key: "market", header: "市场涨跌" },
  { key: "fund", header: "本基金" },
  { key: "excess", header: "超额" },
];

function getMockData() {
  return [
    { period: "牛市1", dateRange: "2020.03-2021.02", market: "+65.23%", fund: "+82.56%", excess: "+17.33%" },
    { period: "熊市1", dateRange: "2021.02-2022.04", market: "-32.15%", fund: "-22.36%", excess: "+9.79%" },
    { period: "震荡市", dateRange: "2022.04-2022.11", market: "-5.68%", fund: "+2.35%", excess: "+8.03%" },
    { period: "牛市2", dateRange: "2022.11-2023.05", market: "+28.56%", fund: "+35.68%", excess: "+7.12%" },
    { period: "熊市2", dateRange: "2023.05-2024.02", market: "-18.25%", fund: "-12.56%", excess: "+5.69%" },
    { period: "当前", dateRange: "2024.02-至今", market: "+15.68%", fund: "+22.35%", excess: "+6.67%" },
  ];
}

export function BullBearPerformanceModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "bull-bear-performance",
    name: "牛熊市表现",
    category: "performance",
    description: "展示在不同市场阶段的表现",
    displayType: "table",
  },
  BullBearPerformanceModule,
  tableModuleSchema
);
