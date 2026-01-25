"use client";

import { ModuleProps, registerModule, holdingSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "type", header: "变动类型" },
  { key: "code", header: "代码" },
  { key: "name", header: "名称" },
  { key: "prevRatio", header: "上期占比" },
  { key: "currRatio", header: "本期占比" },
  { key: "change", header: "变动" },
];

function getMockData() {
  return [
    { type: "新进", code: "688012", name: "中微公司", prevRatio: "-", currRatio: "2.56%", change: "+2.56%" },
    { type: "新进", code: "300782", name: "卓胜微", prevRatio: "-", currRatio: "1.85%", change: "+1.85%" },
    { type: "增持", code: "300750", name: "宁德时代", prevRatio: "6.25%", currRatio: "8.56%", change: "+2.31%" },
    { type: "增持", code: "002594", name: "比亚迪", prevRatio: "4.12%", currRatio: "5.68%", change: "+1.56%" },
    { type: "减持", code: "601318", name: "中国平安", prevRatio: "5.68%", currRatio: "3.89%", change: "-1.79%" },
    { type: "减持", code: "600036", name: "招商银行", prevRatio: "5.23%", currRatio: "3.56%", change: "-1.67%" },
    { type: "退出", code: "600887", name: "伊利股份", prevRatio: "2.35%", currRatio: "-", change: "-2.35%" },
    { type: "退出", code: "000333", name: "美的集团", prevRatio: "1.89%", currRatio: "-", change: "-1.89%" },
  ];
}

export function HoldingChangesModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return <DataTable columns={columns} data={data} />;
}

registerModule(
  {
    id: "holding-changes",
    name: "持仓变动",
    category: "portfolio",
    description: "展示重仓股的新进、增持、减持情况",
    displayType: "table",
  },
  HoldingChangesModule,
  holdingSchema
);
