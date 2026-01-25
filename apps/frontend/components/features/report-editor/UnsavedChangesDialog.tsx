'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onSave?: () => void;
}

export function UnsavedChangesDialog({
  isOpen,
  onConfirm,
  onCancel,
  onSave,
}: UnsavedChangesDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* 对话框 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              有未保存的更改
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              您的报告有未保存的更改，离开前是否要保存？
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                不保存
              </button>
              {onSave && (
                <button
                  onClick={onSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存并离开
                </button>
              )}
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                继续编辑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
