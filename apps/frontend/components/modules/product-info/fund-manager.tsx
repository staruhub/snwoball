"use client";

import { ModuleProps, registerModule } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "name", header: "姓名" },
  { key: "startDate", header: "任职日期" },
  { key: "duration", header: "任职时长" },
  { key: "aum", header: "管理规模" },
  { key: "funds", header: "在管基金数" },
];

function getMockData() {
  return [
    {
      name: "张三",
      startDate: "2020-01-15",
      duration: "4年0月",
      aum: "50.23亿",
      funds: "3只",
    },
    {
      name: "李四",
      startDate: "2022-06-01",
      duration: "1年6月",
      aum: "32.15亿",
      funds: "2只",
    },
  ];
}

export function FundManagerModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "fund-manager",
    name: "基金经理",
    category: "product-info",
    description: "展示基金经理信息、任期、管理规模",
    displayType: "table",
  },
  FundManagerModule
);
