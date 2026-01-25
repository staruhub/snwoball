"use client";

interface Column {
  key: string;
  header: string;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, string | number>[];
  className?: string;
}

export function DataTable({ columns, data, className = "" }: DataTableProps) {
  const getValueColor = (value: string | number) => {
    if (typeof value === "string") {
      if (value.startsWith("+")) return "text-[var(--color-success-foreground)]";
      if (value.startsWith("-")) return "text-[var(--destructive)]";
    }
    return "text-[var(--foreground)]";
  };

  return (
    <div className={`border border-[var(--border)] bg-[var(--background)] ${className}`}>
      {/* Header */}
      <div className="flex bg-[var(--muted)] border-b border-[var(--border)]">
        {columns.map((col, index) => (
          <div
            key={col.key}
            className={`flex items-center px-3 py-3 text-sm text-[var(--muted-foreground)] border-b border-[var(--border)] ${
              index === 0 ? "w-[120px]" : "flex-1"
            }`}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Rows */}
      {data.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex border-b border-[var(--border)] last:border-b-0"
        >
          {columns.map((col, colIndex) => (
            <div
              key={col.key}
              className={`flex items-center px-3 py-3 text-sm ${
                colIndex === 0
                  ? "w-[120px] text-[var(--foreground)] border-r border-[var(--border)]"
                  : `flex-1 ${getValueColor(row[col.key])} border-r border-[var(--border)] last:border-r-0`
              }`}
            >
              {row[col.key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
