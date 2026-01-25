"use client";

import { ModuleProps, registerModule, tableModuleSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "period", header: "期间" },
  { key: "fundDrawdown", header: "本基金回撤" },
  { key: "benchmarkDrawdown", header: "基准回撤" },
  { key: "excessDrawdown", header: "超额回撤" },
];

function getMockData() {
  return [
    { period: "近1月", fundDrawdown: "-2.35%", benchmarkDrawdown: "-3.12%", excessDrawdown: "+0.77%" },
    { period: "近3月", fundDrawdown: "-5.68%", benchmarkDrawdown: "-7.25%", excessDrawdown: "+1.57%" },
    { period: "近6月", fundDrawdown: "-8.45%", benchmarkDrawdown: "-10.56%", excessDrawdown: "+2.11%" },
    { period: "近1年", fundDrawdown: "-12.36%", benchmarkDrawdown: "-15.89%", excessDrawdown: "+3.53%" },
    { period: "近3年", fundDrawdown: "-25.36%", benchmarkDrawdown: "-32.15%", excessDrawdown: "+6.79%" },
    { period: "成立以来", fundDrawdown: "-25.36%", benchmarkDrawdown: "-35.68%", excessDrawdown: "+10.32%" },
  ];
}

export function DrawdownTableModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "drawdown-table",
    name: "回撤统计表",
    category: "risk-stats",
    description: "展示不同期间的回撤对比",
    displayType: "table",
  },
  DrawdownTableModule,
  tableModuleSchema
);
