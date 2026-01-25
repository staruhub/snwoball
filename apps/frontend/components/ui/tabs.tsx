"use client";

import { createContext, useContext, ReactNode } from "react";

// Context for tabs state
interface TabsContextValue {
  activeTab: string;
  onChange: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

// Legacy API (simple tabs)
interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs?: Tab[];
  activeTab?: string;
  onChange?: (id: string) => void;
  className?: string;
  children?: ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className = "",
  children,
  defaultValue,
  value,
  onValueChange,
}: TabsProps) {
  // Support both legacy and new API
  const currentValue = value ?? activeTab ?? defaultValue ?? "";
  const handleChange = onValueChange ?? onChange ?? (() => {});

  // Legacy API (tabs array)
  if (tabs && tabs.length > 0) {
    return (
      <div
        className={`flex gap-2 p-1 bg-[var(--card)] border border-[var(--input)] ${className}`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={`flex-1 px-3 py-1.5 text-sm text-center ${
              currentValue === tab.id
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

  // New API (composition)
  return (
    <TabsContext.Provider value={{ activeTab: currentValue, onChange: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// TabsList component
interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div
      className={`flex gap-2 p-1 bg-[var(--card)] border border-[var(--input)] ${className}`}
    >
      {children}
    </div>
  );
}

// TabsTrigger component
interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className = "" }: TabsTriggerProps) {
  const { activeTab, onChange } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => onChange(value)}
      className={`flex-1 px-3 py-1.5 text-sm text-center ${
        isActive
          ? "bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-sm"
          : "text-[var(--foreground)]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

// TabsContent component
interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = "" }: TabsContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return <div className={className}>{children}</div>;
}
