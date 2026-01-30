"use client";

export const dynamic = "force-dynamic";

import { use } from 'react';
import { ReportEditor } from '@/components/features/report-editor';

interface EditReportPageProps {
  params: Promise<{ id: string }>;
}

export default function EditReportPage({ params }: EditReportPageProps) {
  const { id } = use(params);

  // "new" 表示创建新报告
  const isNewReport = id === 'new';

  return (
    <ReportEditor
      reportId={isNewReport ? undefined : id}
      initialData={
        isNewReport
          ? { name: '未命名报告' }
          : undefined // TODO: 从 API 加载现有报告数据
      }
    />
  );
}
