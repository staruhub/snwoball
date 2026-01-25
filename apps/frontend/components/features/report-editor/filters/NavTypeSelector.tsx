'use client';

import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useGlobalFiltersStore, GlobalFilters } from '@/stores';

type NavType = GlobalFilters['navType'];

interface NavTypeOption {
  value: NavType;
  label: string;
  description: string;
}

const NAV_TYPE_OPTIONS: NavTypeOption[] = [
  { value: 'adjusted', label: '复权净值', description: '考虑分红再投资' },
  { value: 'unit', label: '单位净值', description: '不考虑分红' },
  { value: 'cumulative', label: '累计净值', description: '包含历史分红' },
];

export function NavTypeSelector() {
  const { filters, setNavType } = useGlobalFiltersStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = NAV_TYPE_OPTIONS.find(
    (o) => o.value === filters.navType
  );

  const handleSelect = (option: NavTypeOption) => {
    setNavType(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm text-gray-500">净值:</span>
        <span className="text-sm font-medium">{currentOption?.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1">
            {NAV_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`w-full flex items-start gap-3 px-3 py-2 hover:bg-gray-50 ${
                  filters.navType === option.value
                    ? 'bg-blue-50'
                    : ''
                }`}
              >
                <div className="flex-1 text-left">
                  <div
                    className={`text-sm ${
                      filters.navType === option.value
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-400">{option.description}</div>
                </div>
                {filters.navType === option.value && (
                  <Check className="w-4 h-4 text-blue-500 mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
