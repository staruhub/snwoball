'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ModuleCard } from './ModuleCard';
import { ModuleInstance } from '@/stores';

interface SortableModuleProps {
  module: ModuleInstance;
  isSelected: boolean;
}

export function SortableModule({ module, isSelected }: SortableModuleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ModuleCard
        module={module}
        isSelected={isSelected}
        dragHandleProps={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}
