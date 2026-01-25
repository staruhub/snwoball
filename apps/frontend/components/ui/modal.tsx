"use client";

import { ReactNode, useEffect, useState } from "react";
import { X } from "lucide-react";
import { IconButton } from "./button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = "480px",
}: ModalProps) {
  // 按 ESC 关闭
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // 阻止背景滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative bg-[var(--card)] border border-[var(--border)] shadow-lg"
        style={{ width, maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 32px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-6 border-b border-[var(--border)]">
          <h2 className="text-base font-medium text-[var(--foreground)]">
            {title}
          </h2>
          <IconButton
            icon={<X className="w-4 h-4 text-[var(--muted-foreground)]" />}
            onClick={onClose}
          />
        </div>

        {/* Body */}
        <div className="p-6 overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
  /** 要求输入的确认文本，用于危险操作的二次确认 */
  requireInput?: string;
  /** 输入确认的提示文本 */
  requireInputLabel?: string;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  loading = false,
  requireInput,
  requireInputLabel,
}: ConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");

  // 关闭时重置输入
  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  const variantClasses = {
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)]",
    danger: "bg-red-600 text-white",
  };

  // 检查是否可以确认
  const canConfirm = !requireInput || inputValue === requireInput;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width="400px"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm text-[var(--foreground)] bg-[var(--muted)] hover:bg-[var(--muted)]/80 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || !canConfirm}
            className={`px-4 py-2 text-sm ${variantClasses[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-[var(--muted-foreground)]">{message}</p>

        {requireInput && (
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              {requireInputLabel || `请输入 "${requireInput}" 以确认操作`}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={requireInput}
              className="w-full px-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
              autoComplete="off"
            />
            {inputValue && inputValue !== requireInput && (
              <p className="mt-1 text-xs text-red-500">
                输入不匹配
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
