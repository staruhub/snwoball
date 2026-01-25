'use client';

import { useEffect, useCallback, useState } from 'react';
import { useReportEditorStore } from '@/stores';

interface UseUnsavedChangesReturn {
  showConfirmDialog: boolean;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
  pendingPath: string | null;
  requestNavigation: (path: string) => boolean;
}

export function useUnsavedChanges(): UseUnsavedChangesReturn {
  const { isDirty } = useReportEditorStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  // 浏览器关闭/刷新时的提示
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '您有未保存的更改，确定要离开吗？';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // 确认导航
  const confirmNavigation = useCallback(() => {
    setShowConfirmDialog(false);
    if (pendingPath) {
      window.location.href = pendingPath;
    }
  }, [pendingPath]);

  // 取消导航
  const cancelNavigation = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingPath(null);
  }, []);

  // 请求导航（用于自定义导航逻辑）
  const requestNavigation = useCallback((path: string) => {
    if (isDirty) {
      setPendingPath(path);
      setShowConfirmDialog(true);
      return false;
    }
    return true;
  }, [isDirty]);

  return {
    showConfirmDialog,
    confirmNavigation,
    cancelNavigation,
    pendingPath,
    requestNavigation,
  };
}
