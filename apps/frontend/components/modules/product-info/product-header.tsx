"use client";

import { ModuleProps, registerModule } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "field", header: "" },
  { key: "value", header: "" },
];

// 模拟数据
function getMockData() {
  return [
    { field: "基金名称", value: "示例混合型基金A" },
    { field: "基金代码", value: "000001" },
    { field: "基金类型", value: "混合型" },
    { field: "成立日期", value: "2020-01-15" },
    { field: "最新净值", value: "1.2345" },
    { field: "累计收益", value: "+23.45%" },
  ];
}

export function ProductHeaderModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

// 注册模块
registerModule(
  {
    id: "product-header",
    name: "产品表头",
    category: "product-info",
    description: "展示基金名称、代码、关键摘要信息",
    displayType: "table",
  },
  ProductHeaderModule
);
