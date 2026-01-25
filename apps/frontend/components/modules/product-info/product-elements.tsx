"use client";

import { ModuleProps, registerModule } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "element", header: "要素" },
  { key: "content", header: "说明" },
];

function getMockData() {
  return [
    { element: "投资范围", content: "股票资产占基金资产的比例为60%-95%" },
    { element: "投资策略", content: "采用定量与定性相结合的方法精选个股" },
    { element: "业绩比较基准", content: "沪深300指数收益率×80%+中债总指数收益率×20%" },
    { element: "风险等级", content: "R4（中高风险）" },
    { element: "投资限制", content: "单只股票投资比例不超过基金资产净值的10%" },
    { element: "收益分配", content: "每年最多分配4次，每次分配比例不低于可分配利润的10%" },
  ];
}

export function ProductElementsModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "product-elements",
    name: "产品要素",
    category: "product-info",
    description: "展示投资范围、策略、风险等级等要素",
    displayType: "table",
  },
  ProductElementsModule
);
