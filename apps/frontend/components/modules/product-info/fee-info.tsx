"use client";

import { ModuleProps, registerModule } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "feeType", header: "费用类型" },
  { key: "rate", header: "费率" },
  { key: "description", header: "说明" },
];

function getMockData() {
  return [
    { feeType: "管理费", rate: "1.50%/年", description: "按前一日基金资产净值的1.50%年费率计提" },
    { feeType: "托管费", rate: "0.25%/年", description: "按前一日基金资产净值的0.25%年费率计提" },
    { feeType: "销售服务费", rate: "0.00%/年", description: "A类份额不收取销售服务费" },
    { feeType: "申购费", rate: "1.50%", description: "金额100万以下适用费率，可打折" },
    { feeType: "赎回费", rate: "1.50%", description: "持有少于7天，7天以上逐步降低" },
    { feeType: "转换费", rate: "0.00%", description: "转入基金申购费补差" },
  ];
}

export function FeeInfoModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "fee-info",
    name: "费率信息",
    category: "product-info",
    description: "展示管理费、托管费、申赎费等费率",
    displayType: "table",
  },
  FeeInfoModule
);
