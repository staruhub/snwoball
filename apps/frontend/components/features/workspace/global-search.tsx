"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileText, LayoutTemplate, TrendingUp } from "lucide-react";
import { SearchDropdown } from "@/components/ui/search-input";
import { globalSearch, type GlobalSearchResult } from "@/lib/api/workspace";
import { useDebounce } from "@/hooks/useDebounce";

interface GlobalSearchProps {
  className?: string;
}

export function GlobalSearch({ className = "" }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的 AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const search = async () => {
      setLoading(true);
      try {
        const data = await globalSearch(debouncedQuery);
        // 只在未被取消时更新结果
        if (!abortController.signal.aborted) {
          setResults(data);
        }
      } catch (error) {
        // 忽略 AbortError
        if ((error as Error).name === 'AbortError') {
          return;
        }
        console.error("Search error:", error);
        if (!abortController.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    search();

    // 清理函数：取消请求
    return () => {
      abortController.abort();
    };
  }, [debouncedQuery]);

  const handleSelect = useCallback(
    (item: GlobalSearchResult) => {
      setQuery("");
      setResults([]);
      router.push(item.link);
    },
    [router]
  );

  const getIcon = (type: GlobalSearchResult["type"]) => {
    switch (type) {
      case "fund":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "report":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "template":
        return <LayoutTemplate className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: GlobalSearchResult["type"]) => {
    switch (type) {
      case "fund":
        return "基金";
      case "report":
        return "报告";
      case "template":
        return "模板";
      default:
        return type;
    }
  };

  const renderResult = (item: GlobalSearchResult) => (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--muted)]">
      {getIcon(item.type)}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[var(--foreground)] truncate">
          {item.title}
        </div>
        {item.subtitle && (
          <div className="text-xs text-[var(--muted-foreground)] truncate">
            {item.subtitle}
          </div>
        )}
      </div>
      <span className="text-xs text-[var(--muted-foreground)] px-2 py-0.5 bg-[var(--muted)] rounded">
        {getTypeLabel(item.type)}
      </span>
    </div>
  );

  return (
    <SearchDropdown
      value={query}
      onChange={setQuery}
      placeholder="搜索基金、报告、模板..."
      className={`w-80 ${className}`}
      loading={loading}
      results={results}
      renderResult={renderResult}
      onSelect={handleSelect}
      emptyMessage={query ? "未找到匹配结果" : "输入关键词开始搜索"}
    />
  );
}
