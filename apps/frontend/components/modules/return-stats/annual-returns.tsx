"use client";

import { ModuleProps, registerModule, tableModuleSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "year", header: "年份" },
  { key: "fund", header: "本基金" },
  { key: "benchmark", header: "基准" },
  { key: "excess", header: "超额收益" },
];

function getMockData() {
  return [
    { year: "2024", fund: "+15.23%", benchmark: "+12.56%", excess: "+2.67%" },
    { year: "2023", fund: "+8.45%", benchmark: "+5.23%", excess: "+3.22%" },
    { year: "2022", fund: "-12.56%", benchmark: "-15.23%", excess: "+2.67%" },
    { year: "2021", fund: "+25.68%", benchmark: "+18.45%", excess: "+7.23%" },
    { year: "2020", fund: "+35.12%", benchmark: "+28.56%", excess: "+6.56%" },
  ];
}

export function AnnualReturnsModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "annual-returns",
    name: "年度收益",
    category: "return-stats",
    description: "展示历年收益对比",
    displayType: "table",
  },
  AnnualReturnsModule,
  tableModuleSchema
);
