"use client";

import { ModuleProps, registerModule, holdingSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "metric", header: "指标" },
  { key: "current", header: "当前" },
  { key: "prev", header: "上期" },
  { key: "change", header: "变化" },
];

function getMockData() {
  return [
    { metric: "前5大持仓占比", current: "28.15%", prev: "25.68%", change: "+2.47%" },
    { metric: "前10大持仓占比", current: "45.68%", prev: "42.35%", change: "+3.33%" },
    { metric: "前20大持仓占比", current: "65.23%", prev: "60.12%", change: "+5.11%" },
    { metric: "持股数量", current: "85只", prev: "92只", change: "-7只" },
    { metric: "行业集中度(前3)", current: "45.5%", prev: "42.8%", change: "+2.7%" },
    { metric: "个股集中度(HHI)", current: "0.0856", prev: "0.0725", change: "+0.0131" },
  ];
}

export function ConcentrationModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "concentration",
    name: "持仓集中度",
    category: "portfolio",
    description: "展示持仓集中度分析",
    displayType: "table",
  },
  ConcentrationModule,
  holdingSchema
);
