"use client";

interface LegendItem {
  color: string;
  label: string;
}

interface ChartProps {
  legends: LegendItem[];
  className?: string;
}

export function LineChart({ legends, className = "" }: ChartProps) {
  return (
    <div className={`flex flex-col h-full bg-[var(--background)] rounded ${className}`}>
      {/* Legend */}
      <div className="flex gap-4 p-4">
        {legends.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-[var(--muted-foreground)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="relative flex-1 mx-4 mb-4 border-l border-b border-[var(--border)]">
        {/* Y-axis labels */}
        <div className="absolute -left-6 top-0 text-[10px] text-[var(--muted-foreground)]">
          2.0
        </div>
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-foreground)]">
          1.0
        </div>
        <div className="absolute -left-6 bottom-0 text-[10px] text-[var(--muted-foreground)]">
          0.0
        </div>

        {/* SVG Lines */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          {/* Primary line */}
          <path
            d="M0 60 Q70 20, 140 40 T280 30"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
          />
          {/* Secondary line */}
          <path
            d="M0 50 Q70 40, 140 50 T280 45"
            fill="none"
            stroke="var(--input)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
