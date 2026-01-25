'use client';

import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useGlobalFiltersStore, GlobalFilters } from '@/stores';

type Frequency = GlobalFilters['frequency'];

interface FrequencyOption {
  value: Frequency;
  label: string;
}

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { value: 'daily', label: '日度' },
  { value: 'weekly', label: '周度' },
  { value: 'monthly', label: '月度' },
];

export function FrequencySelector() {
  const { filters, setFrequency } = useGlobalFiltersStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = FREQUENCY_OPTIONS.find(
    (o) => o.value === filters.frequency
  );

  const handleSelect = (option: FrequencyOption) => {
    setFrequency(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm text-gray-500">频率:</span>
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
          <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1">
            {FREQUENCY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 ${
                  filters.frequency === option.value
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700'
                }`}
              >
                {option.label}
                {filters.frequency === option.value && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
