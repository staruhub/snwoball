"use client";

import { useState, useRef, useEffect, ReactNode, KeyboardEvent } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  loading?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  loading = false,
  onFocus,
  onBlur,
  onKeyDown,
  autoFocus = false,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        className="w-full h-9 pl-9 pr-8 text-sm bg-[var(--background)] border border-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

interface SearchDropdownProps<T> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  loading?: boolean;
  results: T[];
  renderResult: (item: T, index: number) => ReactNode;
  onSelect: (item: T) => void;
  emptyMessage?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SearchDropdown<T>({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  loading = false,
  results,
  renderResult,
  onSelect,
  emptyMessage = "No results found",
  open,
  onOpenChange,
}: SearchDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const actualOpen = open !== undefined ? open : isOpen;
  const setActualOpen = onOpenChange || setIsOpen;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActualOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setActualOpen]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      onSelect(results[selectedIndex]);
      setActualOpen(false);
    } else if (e.key === "Escape") {
      setActualOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <SearchInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        loading={loading}
        onFocus={() => setActualOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {actualOpen && (value || results.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--card)] border border-[var(--border)] shadow-lg max-h-80 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-4 text-[var(--muted-foreground)]">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-4 text-center text-sm text-[var(--muted-foreground)]">
              {emptyMessage}
            </div>
          ) : (
            results.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  onSelect(item);
                  setActualOpen(false);
                }}
                className={`cursor-pointer ${
                  selectedIndex === index ? "bg-[var(--muted)]" : ""
                }`}
              >
                {renderResult(item, index)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
