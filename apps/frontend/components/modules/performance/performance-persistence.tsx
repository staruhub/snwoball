"use client";

import { ModuleProps, registerModule } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "year", header: "年份" },
  { key: "rank", header: "排名" },
  { key: "quartile", header: "分位" },
  { key: "consecutive", header: "连续优秀" },
];

function getMockData() {
  return [
    { year: "2024", rank: "25/1500", quartile: "前1/4", consecutive: "是" },
    { year: "2023", rank: "38/1500", quartile: "前1/4", consecutive: "是" },
    { year: "2022", rank: "156/1500", quartile: "前1/4", consecutive: "是" },
    { year: "2021", rank: "85/1500", quartile: "前1/4", consecutive: "是" },
    { year: "2020", rank: "425/1500", quartile: "前1/4", consecutive: "-" },
  ];
}

export function PerformancePersistenceModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data} />
      <div className="text-sm text-[var(--muted-foreground)] p-3 bg-[var(--muted)] rounded">
        业绩持续性评估：该基金过去4年连续保持同类前1/4排名，表现出较强的业绩持续性。
      </div>
    </div>
  );
}

registerModule(
  {
    id: "performance-persistence",
    name: "业绩持续性",
    category: "performance",
    description: "分析业绩的持续性和稳定性",
    displayType: "mixed",
  },
  PerformancePersistenceModule
);
