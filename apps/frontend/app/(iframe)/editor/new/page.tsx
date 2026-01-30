"use client";

import { EditorContent } from "@/components/features/report-editor/editor-content";

// 强制动态渲染，不进行静态生成
// 因为 EditorContent 使用了 useSearchParams
export const dynamic = "force-dynamic";

/**
 * 新建报告页面
 *
 * 路由: /editor/new
 * 功能: 创建新的报告，不加载现有报告数据
 */
export default function NewReportPage() {
  return <EditorContent />;
}
