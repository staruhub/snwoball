'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  GripVertical,
  MoreVertical,
  Maximize2,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Info,
} from 'lucide-react';
import { ModuleInstance, useReportEditorStore } from '@/stores';
import { getModuleById } from '../navigation/module-registry';

interface ModuleCardProps {
  module: ModuleInstance;
  isSelected: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}

export function ModuleCard({
  module,
  isSelected,
  dragHandleProps,
  isDragging,
}: ModuleCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mouseMoveRef = useRef<((e: MouseEvent) => void) | null>(null);
  const mouseUpRef = useRef<(() => void) | null>(null);
  const {
    selectModule,
    removeModule,
    cloneModule,
    toggleModuleLock,
    updateModuleHeight,
  } = useReportEditorStore();

  const moduleDef = getModuleById(module.moduleType);

  const handleClick = (e: React.MouseEvent) => {
    if (!showMenu && !isResizing) {
      selectModule(module.id);
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeModule(module.id);
    setShowMenu(false);
  };

  const handleClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    cloneModule(module.id);
    setShowMenu(false);
  };

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleModuleLock(module.id);
    setShowMenu(false);
  };

  // 清理事件监听器
  useEffect(() => {
    return () => {
      if (mouseMoveRef.current) {
        document.removeEventListener('mousemove', mouseMoveRef.current);
      }
      if (mouseUpRef.current) {
        document.removeEventListener('mouseup', mouseUpRef.current);
      }
    };
  }, []);

  // 调整高度
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    const startY = e.clientY;
    const startHeight = module.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(150, Math.min(800, startHeight + deltaY));
      updateModuleHeight(module.id, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      mouseMoveRef.current = null;
      mouseUpRef.current = null;
    };

    // 存储引用以便清理
    mouseMoveRef.current = handleMouseMove;
    mouseUpRef.current = handleMouseUp;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [module.height, module.id, updateModuleHeight]);

  // 点击外部关闭菜单
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div
      className={`relative bg-white rounded-lg border-2 transition-all ${
        isDragging
          ? 'shadow-lg opacity-90 border-blue-300'
          : isSelected
          ? 'border-blue-500 shadow-md'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      style={{ height: module.height }}
      onClick={handleClick}
    >
      {/* 卡片头部 */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        {/* 拖拽手柄 */}
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-gray-200 rounded"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        {/* 标题 */}
        <h4 className="flex-1 text-sm font-medium text-gray-700 truncate">
          {module.title}
        </h4>

        {/* 锁定状态 */}
        {module.isLocked && (
          <span title="参数已锁定">
            <Lock className="w-4 h-4 text-amber-500" />
          </span>
        )}

        {/* 指标说明 */}
        {moduleDef && (
          <button
            className="p-1 hover:bg-gray-200 rounded"
            title={moduleDef.description}
            onClick={(e) => e.stopPropagation()}
          >
            <Info className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* 更多菜单 */}
        <div className="relative" ref={menuRef}>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={handleMenuClick}
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={(e) => e.stopPropagation()}
              >
                <Maximize2 className="w-4 h-4" />
                全屏预览
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={handleClone}
              >
                <Copy className="w-4 h-4" />
                克隆模块
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={handleToggleLock}
              >
                {module.isLocked ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    解锁参数
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    锁定参数
                  </>
                )}
              </button>
              <hr className="my-1 border-gray-100" />
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                删除模块
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="p-4 h-[calc(100%-44px)] overflow-hidden">
        {/* 这里将来会渲染实际的模块内容 */}
        <div className="h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
          {moduleDef?.description || '模块内容预览'}
        </div>
      </div>

      {/* 调整大小手柄 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-100 transition-colors"
        onMouseDown={handleResizeStart}
      />
    </div>
  );
}
