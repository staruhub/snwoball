"use client";

import { ModuleProps, registerModule, riskModuleSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "confidence", header: "置信水平" },
  { key: "var1d", header: "1日VaR" },
  { key: "var5d", header: "5日VaR" },
  { key: "var10d", header: "10日VaR" },
  { key: "var20d", header: "20日VaR" },
];

function getMockData() {
  return [
    { confidence: "90%", var1d: "-1.25%", var5d: "-2.80%", var10d: "-3.96%", var20d: "-5.60%" },
    { confidence: "95%", var1d: "-1.65%", var5d: "-3.69%", var10d: "-5.22%", var20d: "-7.38%" },
    { confidence: "99%", var1d: "-2.33%", var5d: "-5.21%", var10d: "-7.37%", var20d: "-10.42%" },
  ];
}

export function VarDistributionModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "var-distribution",
    name: "VaR分布",
    category: "risk-stats",
    description: "展示不同置信水平的风险价值",
    displayType: "table",
  },
  VarDistributionModule,
  riskModuleSchema
);
