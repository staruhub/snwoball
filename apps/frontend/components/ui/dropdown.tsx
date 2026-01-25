"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  align = "right",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1 min-w-[160px] bg-[var(--card)] border border-[var(--border)] shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick?.();
                  setIsOpen(false);
                }
              }}
              disabled={item.disabled}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-[var(--muted)] ${
                item.danger ? "text-red-500" : "text-[var(--foreground)]"
              } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface SelectDropdownProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SelectDropdown({
  value,
  options,
  onChange,
  placeholder = "Select...",
  className = "",
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm bg-[var(--background)] border border-[var(--input)] text-[var(--foreground)]"
      >
        <span className={selectedOption ? "" : "text-[var(--muted-foreground)]"}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-[var(--card)] border border-[var(--border)] shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-[var(--muted)] ${
                option.value === value
                  ? "bg-[var(--muted)] text-[var(--foreground)]"
                  : "text-[var(--foreground)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
