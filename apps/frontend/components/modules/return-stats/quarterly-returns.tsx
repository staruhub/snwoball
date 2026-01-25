"use client";

import { ModuleProps, registerModule, tableModuleSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "quarter", header: "季度" },
  { key: "fund", header: "本基金" },
  { key: "benchmark", header: "基准" },
  { key: "excess", header: "超额收益" },
];

function getMockData() {
  return [
    { quarter: "2024Q4", fund: "+5.23%", benchmark: "+3.56%", excess: "+1.67%" },
    { quarter: "2024Q3", fund: "+2.45%", benchmark: "+1.23%", excess: "+1.22%" },
    { quarter: "2024Q2", fund: "+3.56%", benchmark: "+2.23%", excess: "+1.33%" },
    { quarter: "2024Q1", fund: "+3.99%", benchmark: "+5.54%", excess: "-1.55%" },
    { quarter: "2023Q4", fund: "+1.68%", benchmark: "+0.45%", excess: "+1.23%" },
    { quarter: "2023Q3", fund: "-2.12%", benchmark: "-3.56%", excess: "+1.44%" },
    { quarter: "2023Q2", fund: "+4.35%", benchmark: "+2.89%", excess: "+1.46%" },
    { quarter: "2023Q1", fund: "+4.54%", benchmark: "+5.45%", excess: "-0.91%" },
  ];
}

export function QuarterlyReturnsModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "quarterly-returns",
    name: "季度收益",
    category: "return-stats",
    description: "展示季度收益对比",
    displayType: "table",
  },
  QuarterlyReturnsModule,
  tableModuleSchema
);
