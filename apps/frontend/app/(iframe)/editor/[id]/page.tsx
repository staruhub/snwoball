"use client";

export const dynamic = "force-dynamic";

import { useParams } from "next/navigation";
import { EditorContent } from "@/components/features/report-editor/editor-content";

/**
 * 报告编辑页面
 *
 * 路由: /editor/[id]
 * 功能: 编辑现有报告，根据 ID 加载报告数据
 */
export default function ReportEditorPage() {
  const params = useParams();
  const reportId = params.id as string;

  return <EditorContent reportId={reportId} />;
}
