"use client";

import { ModuleProps, registerModule } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "rank", header: "排名" },
  { key: "drawdown", header: "最大回撤" },
  { key: "startDate", header: "开始日期" },
  { key: "endDate", header: "结束日期" },
  { key: "duration", header: "持续天数" },
  { key: "recovery", header: "恢复天数" },
];

function getMockData() {
  return [
    { rank: "1", drawdown: "-25.36%", startDate: "2022-01-05", endDate: "2022-04-26", duration: "112", recovery: "186" },
    { rank: "2", drawdown: "-18.52%", startDate: "2020-02-20", endDate: "2020-03-23", duration: "32", recovery: "95" },
    { rank: "3", drawdown: "-12.85%", startDate: "2023-08-15", endDate: "2023-10-31", duration: "77", recovery: "45" },
    { rank: "4", drawdown: "-9.63%", startDate: "2021-02-18", endDate: "2021-03-25", duration: "35", recovery: "28" },
    { rank: "5", drawdown: "-7.25%", startDate: "2024-01-22", endDate: "2024-02-05", duration: "14", recovery: "21" },
  ];
}

export function MaxDrawdownModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "max-drawdown",
    name: "最大回撤",
    category: "risk-stats",
    description: "展示历史最大回撤统计",
    displayType: "table",
  },
  MaxDrawdownModule
);
