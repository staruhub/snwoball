'use client';

import React, { useState } from 'react';
import { Settings, Lock, Unlock, Check } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Checkbox } from '@/components/ui/checkbox';
import { useReportEditorStore, type ModuleInstance } from '@/stores';
import { getModuleById } from '../navigation/module-registry';

interface BatchParameterModalProps {
  open: boolean;
  onClose: () => void;
}

export function BatchParameterModal({ open, onClose }: BatchParameterModalProps) {
  const { modules, batchUpdateModules } = useReportEditorStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [height, setHeight] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState<boolean | null>(null);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === modules.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(modules.map(m => m.id)));
    }
  };

  const handleApply = () => {
    if (selectedIds.size === 0) return;

    const updates: Partial<Pick<ModuleInstance, 'height' | 'isLocked'>> = {};
    if (height !== null) {
      updates.height = height;
    }
    if (isLocked !== null) {
      updates.isLocked = isLocked;
    }

    if (Object.keys(updates).length > 0) {
      batchUpdateModules(Array.from(selectedIds), updates);
    }

    onClose();
    // Reset state
    setSelectedIds(new Set());
    setHeight(null);
    setIsLocked(null);
  };

  const handleClose = () => {
    onClose();
    setSelectedIds(new Set());
    setHeight(null);
    setIsLocked(null);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="批量参数设置"
      width="600px"
      footer={
        <>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-[var(--foreground)] bg-[var(--muted)]"
          >
            取消
          </button>
          <button
            onClick={handleApply}
            disabled={selectedIds.size === 0 || (height === null && isLocked === null)}
            className="px-4 py-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            应用
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* 模块选择 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-[var(--foreground)]">选择模块</h4>
            <button
              onClick={toggleSelectAll}
              className="text-xs text-[var(--primary)] hover:underline"
            >
              {selectedIds.size === modules.length ? '取消全选' : '全选'}
            </button>
          </div>

          {modules.length === 0 ? (
            <div className="text-center py-8 text-[var(--muted-foreground)]">
              暂无模块
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto border border-[var(--border)] rounded">
              {modules.map((module) => {
                const moduleDef = getModuleById(module.moduleType);
                return (
                  <div
                    key={module.id}
                    className={`flex items-center gap-3 px-3 py-2 border-b border-[var(--border)] last:border-b-0 cursor-pointer hover:bg-[var(--muted)] ${
                      selectedIds.has(module.id) ? 'bg-[var(--muted)]' : ''
                    }`}
                    onClick={() => toggleSelect(module.id)}
                  >
                    <Checkbox
                      checked={selectedIds.has(module.id)}
                      onChange={() => toggleSelect(module.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--foreground)] truncate">
                        {module.title}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        {moduleDef?.category || module.moduleType}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      {module.isLocked && <Lock className="w-3 h-3" />}
                      <span>{module.height}px</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-xs text-[var(--muted-foreground)] mt-2">
            已选择 {selectedIds.size} / {modules.length} 个模块
          </div>
        </div>

        {/* 参数设置 */}
        <div>
          <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">参数设置</h4>

          <div className="space-y-4">
            {/* 显示高度 */}
            <div>
              <label className="block text-sm text-[var(--muted-foreground)] mb-2">
                统一高度
              </label>
              <div className="flex gap-2">
                {[
                  { value: null, label: '不修改' },
                  { value: 200, label: '小 (200px)' },
                  { value: 300, label: '中 (300px)' },
                  { value: 400, label: '大 (400px)' },
                  { value: 500, label: '特大 (500px)' },
                ].map((option) => (
                  <button
                    key={option.value ?? 'null'}
                    onClick={() => setHeight(option.value)}
                    className={`flex-1 py-2 text-xs border rounded transition-colors ${
                      height === option.value
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                        : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 参数锁定 */}
            <div>
              <label className="block text-sm text-[var(--muted-foreground)] mb-2">
                参数锁定状态
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsLocked(null)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs border rounded transition-colors ${
                    isLocked === null
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                      : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                  }`}
                >
                  <Settings className="w-3 h-3" />
                  不修改
                </button>
                <button
                  onClick={() => setIsLocked(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs border rounded transition-colors ${
                    isLocked === false
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                      : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                  }`}
                >
                  <Unlock className="w-3 h-3" />
                  跟随全局
                </button>
                <button
                  onClick={() => setIsLocked(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs border rounded transition-colors ${
                    isLocked === true
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                      : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  锁定参数
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 预览 */}
        {(height !== null || isLocked !== null) && selectedIds.size > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Check className="w-4 h-4" />
              <span className="font-medium">将应用以下更改</span>
            </div>
            <ul className="text-blue-600 text-xs space-y-1 ml-6">
              {height !== null && (
                <li>设置高度为 {height}px</li>
              )}
              {isLocked !== null && (
                <li>
                  {isLocked ? '锁定参数（独立于全局筛选）' : '跟随全局筛选条件'}
                </li>
              )}
              <li>影响 {selectedIds.size} 个模块</li>
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
