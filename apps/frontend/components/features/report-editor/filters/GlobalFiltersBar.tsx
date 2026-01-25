'use client';

import React from 'react';
import { FundSelector } from './FundSelector';
import { DateRangePicker } from './DateRangePicker';
import { BenchmarkSelector } from './BenchmarkSelector';
import { FrequencySelector } from './FrequencySelector';
import { NavTypeSelector } from './NavTypeSelector';

export function GlobalFiltersBar() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <FundSelector />
      <BenchmarkSelector />
      <DateRangePicker />
      <FrequencySelector />
      <NavTypeSelector />
    </div>
  );
}
