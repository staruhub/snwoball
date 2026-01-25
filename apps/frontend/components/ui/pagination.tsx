"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  current,
  total,
  pageSize,
  onChange,
  className = "",
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    const halfShow = Math.floor(showPages / 2);

    let startPage = Math.max(1, current - halfShow);
    let endPage = Math.min(totalPages, current + halfShow);

    if (current - halfShow < 1) {
      endPage = Math.min(totalPages, showPages);
    }
    if (current + halfShow > totalPages) {
      startPage = Math.max(1, totalPages - showPages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-[var(--muted-foreground)]">
        Total {total} items, {totalPages} pages
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className="p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onChange(page)}
            disabled={page === "..."}
            className={`min-w-[32px] h-8 px-2 text-sm ${
              page === current
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : page === "..."
                ? "cursor-default text-[var(--muted-foreground)]"
                : "text-[var(--foreground)] hover:bg-[var(--muted)]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onChange(current + 1)}
          disabled={current === totalPages}
          className="p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
