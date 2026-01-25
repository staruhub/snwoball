"use client";

import { ModuleProps, registerModule } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "label", header: "项目" },
  { key: "value", header: "内容" },
];

function getMockData() {
  return [
    { label: "基金全称", value: "示例混合型证券投资基金" },
    { label: "基金简称", value: "示例混合A" },
    { label: "基金代码", value: "000001" },
    { label: "基金类型", value: "混合型-偏股" },
    { label: "成立日期", value: "2020-01-15" },
    { label: "基金管理人", value: "示例基金管理有限公司" },
    { label: "基金托管人", value: "示例银行股份有限公司" },
    { label: "注册登记机构", value: "示例基金管理有限公司" },
    { label: "运作方式", value: "契约型开放式" },
    { label: "投资目标", value: "追求基金资产的长期稳健增值" },
  ];
}

export function BasicInfoModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "basic-info",
    name: "基本信息",
    category: "product-info",
    description: "展示基金成立日期、类型、托管人等基本信息",
    displayType: "table",
  },
  BasicInfoModule
);
