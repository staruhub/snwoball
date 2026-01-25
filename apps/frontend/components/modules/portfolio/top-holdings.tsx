"use client";

import { ModuleProps, registerModule, holdingSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "rank", header: "序号" },
  { key: "code", header: "代码" },
  { key: "name", header: "名称" },
  { key: "ratio", header: "占比" },
  { key: "shares", header: "持股数(万股)" },
  { key: "value", header: "市值(万元)" },
];

function getMockData() {
  return [
    { rank: "1", code: "300750", name: "宁德时代", ratio: "8.56%", shares: "125.6", value: "28,560" },
    { rank: "2", code: "600519", name: "贵州茅台", ratio: "6.23%", shares: "8.5", value: "20,850" },
    { rank: "3", code: "002594", name: "比亚迪", ratio: "5.68%", shares: "85.2", value: "19,012" },
    { rank: "4", code: "000858", name: "五粮液", ratio: "4.56%", shares: "68.5", value: "15,268" },
    { rank: "5", code: "300059", name: "东方财富", ratio: "4.12%", shares: "256.8", value: "13,798" },
    { rank: "6", code: "601318", name: "中国平安", ratio: "3.89%", shares: "185.6", value: "13,028" },
    { rank: "7", code: "600036", name: "招商银行", ratio: "3.56%", shares: "235.6", value: "11,922" },
    { rank: "8", code: "002475", name: "立讯精密", ratio: "3.25%", shares: "186.5", value: "10,883" },
    { rank: "9", code: "600900", name: "长江电力", ratio: "2.98%", shares: "325.6", value: "9,979" },
    { rank: "10", code: "601012", name: "隆基绿能", ratio: "2.85%", shares: "412.5", value: "9,543" },
  ];
}

export function TopHoldingsModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "top-holdings",
    name: "重仓股票",
    category: "portfolio",
    description: "展示前十大重仓股",
    displayType: "table",
  },
  TopHoldingsModule,
  holdingSchema
);
