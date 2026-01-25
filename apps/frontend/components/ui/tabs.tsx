"use client";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
  return (
    <div
      className={`flex gap-2 p-1 bg-[var(--card)] border border-[var(--input)] ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 px-3 py-1.5 text-sm text-center ${
            activeTab === tab.id
              ? "bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-sm"
              : "text-[var(--foreground)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
