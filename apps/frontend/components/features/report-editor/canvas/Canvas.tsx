'use client';

import React, { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useReportEditorStore } from '@/stores';
import { SortableModule } from './SortableModule';
import { EmptyState } from './EmptyState';

export function Canvas() {
  const { modules, selectedModuleId, reorderModules, selectModule } =
    useReportEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 最小移动距离才开始拖拽
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderModules(active.id as string, over.id as string);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // 只有点击画布空白处才取消选中
    if (e.target === e.currentTarget) {
      selectModule(null);
    }
  };

  // 使用 useMemo 缓存排序结果，避免不必要的重新排序
  const sortedModules = useMemo(
    () => [...modules].sort((a, b) => a.order - b.order),
    [modules]
  );

  if (modules.length === 0) {
    return (
      <div className="h-full bg-gray-50">
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      className="h-full bg-gray-50 p-6 overflow-y-auto"
      onClick={handleCanvasClick}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedModules.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="max-w-4xl mx-auto space-y-4">
            {sortedModules.map((module) => (
              <SortableModule
                key={module.id}
                module={module}
                isSelected={selectedModuleId === module.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
