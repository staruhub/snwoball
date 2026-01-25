"use client";

import { ModuleProps, registerModule } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "period", header: "持有期" },
  { key: "probability", header: "正收益概率" },
  { key: "avgReturn", header: "平均收益" },
  { key: "maxReturn", header: "最大收益" },
  { key: "minReturn", header: "最小收益" },
];

function getMockData() {
  return [
    { period: "1个月", probability: "58.3%", avgReturn: "+1.2%", maxReturn: "+8.5%", minReturn: "-6.2%" },
    { period: "3个月", probability: "65.7%", avgReturn: "+3.5%", maxReturn: "+15.2%", minReturn: "-12.8%" },
    { period: "6个月", probability: "72.4%", avgReturn: "+6.8%", maxReturn: "+25.6%", minReturn: "-18.3%" },
    { period: "1年", probability: "78.5%", avgReturn: "+12.5%", maxReturn: "+45.2%", minReturn: "-25.6%" },
    { period: "3年", probability: "85.2%", avgReturn: "+35.8%", maxReturn: "+120.5%", minReturn: "-15.2%" },
  ];
}

export function ProfitProbabilityModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "profit-probability",
    name: "历史盈利概率",
    category: "return-stats",
    description: "展示不同持有期的正收益概率",
    displayType: "table",
  },
  ProfitProbabilityModule
);
