"use client";

import { ModuleProps, registerModule, holdingSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "sector", header: "行业" },
  { key: "fund", header: "本基金" },
  { key: "benchmark", header: "基准" },
  { key: "diff", header: "超配/低配" },
];

function getMockData() {
  return [
    { sector: "新能源", fund: "18.5%", benchmark: "12.3%", diff: "+6.2%" },
    { sector: "半导体", fund: "15.2%", benchmark: "10.5%", diff: "+4.7%" },
    { sector: "医药生物", fund: "12.8%", benchmark: "15.6%", diff: "-2.8%" },
    { sector: "食品饮料", fund: "10.5%", benchmark: "8.2%", diff: "+2.3%" },
    { sector: "银行", fund: "8.3%", benchmark: "12.5%", diff: "-4.2%" },
    { sector: "房地产", fund: "2.5%", benchmark: "5.8%", diff: "-3.3%" },
    { sector: "其他", fund: "32.2%", benchmark: "35.1%", diff: "-2.9%" },
  ];
}

export function SectorAllocationModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "sector-allocation",
    name: "行业配置",
    category: "portfolio",
    description: "展示行业配置及超配/低配情况",
    displayType: "table",
  },
  SectorAllocationModule,
  holdingSchema
);
