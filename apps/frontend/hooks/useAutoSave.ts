'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useReportEditorStore } from '@/stores';

interface UseAutoSaveOptions {
  interval?: number; // 自动保存间隔（毫秒）
  onSave: () => Promise<void>;
}

export function useAutoSave({ interval = 30000, onSave }: UseAutoSaveOptions) {
  const { isDirty, setSaving, markSaved } = useReportEditorStore();
  const lastChangeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const savingRef = useRef(false);

  // 执行保存 - 使用 ref 防止竞态条件
  const performSave = useCallback(async () => {
    if (savingRef.current || !isDirty) return;

    savingRef.current = true;
    setSaving(true);
    try {
      await onSave();
      markSaved();
    } catch (error) {
      console.error('Auto save failed:', error);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }, [isDirty, onSave, setSaving, markSaved]);

  // 监听 isDirty 变化，重置计时器
  useEffect(() => {
    if (isDirty) {
      lastChangeRef.current = Date.now();
    }
  }, [isDirty]);

  // 自动保存定时器
  useEffect(() => {
    const checkAndSave = () => {
      const timeSinceLastChange = Date.now() - lastChangeRef.current;
      if (isDirty && timeSinceLastChange >= interval && !savingRef.current) {
        performSave();
      }
    };

    timerRef.current = setInterval(checkAndSave, 5000); // 每 5 秒检查一次

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isDirty, interval, performSave]);

  // 手动保存
  const saveNow = useCallback(async () => {
    await performSave();
  }, [performSave]);

  return { saveNow };
}
