"use client";

import { escapeHtml } from "@/lib/utils/escape-html";

interface CoverPageProps {
  reportTitle: string;
  fundName?: string;
  dateRange?: string;
  generatedAt?: string;
}

/**
 * 报告封面页模板
 * 用于生成导出 PDF 的封面 HTML
 */
export function CoverPageTemplate({
  reportTitle,
  fundName,
  dateRange,
  generatedAt,
}: CoverPageProps) {
  return (
    <div
      className="cover-page"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        pageBreakAfter: "always",
      }}
    >
      {/* Logo */}
      <div
        style={{
          marginBottom: "48px",
          fontSize: "32px",
          fontWeight: "bold",
          color: "#0F5FFE",
        }}
      >
        Snowball
      </div>

      {/* 报告标题 */}
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "600",
          color: "#1a1a1a",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        {reportTitle}
      </h1>

      {/* 基金名称 */}
      {fundName && (
        <div
          style={{
            fontSize: "18px",
            color: "#666666",
            marginBottom: "16px",
          }}
        >
          {fundName}
        </div>
      )}

      {/* 分析区间 */}
      {dateRange && (
        <div
          style={{
            fontSize: "14px",
            color: "#999999",
            marginBottom: "8px",
          }}
        >
          分析区间：{dateRange}
        </div>
      )}

      {/* 生成时间 */}
      <div
        style={{
          fontSize: "14px",
          color: "#999999",
          marginTop: "48px",
        }}
      >
        生成时间：{generatedAt || new Date().toLocaleString("zh-CN")}
      </div>
    </div>
  );
}

/**
 * 生成封面页 HTML 字符串
 */
export function generateCoverHtml(props: CoverPageProps): string {
  const safeReportTitle = escapeHtml(props.reportTitle);
  const safeFundName = props.fundName ? escapeHtml(props.fundName) : "";
  const safeDateRange = props.dateRange ? escapeHtml(props.dateRange) : "";
  const safeGeneratedAt = props.generatedAt
    ? escapeHtml(props.generatedAt)
    : escapeHtml(new Date().toLocaleString("zh-CN"));

  return `
    <div class="cover-page" style="
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #ffffff;
      page-break-after: always;
    ">
      <div style="
        margin-bottom: 48px;
        font-size: 32px;
        font-weight: bold;
        color: #0F5FFE;
      ">Snowball</div>

      <h1 style="
        font-size: 36px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 24px;
        text-align: center;
      ">${safeReportTitle}</h1>

      ${
        safeFundName
          ? `<div style="
              font-size: 18px;
              color: #666666;
              margin-bottom: 16px;
            ">${safeFundName}</div>`
          : ""
      }

      ${
        safeDateRange
          ? `<div style="
              font-size: 14px;
              color: #999999;
              margin-bottom: 8px;
            ">分析区间：${safeDateRange}</div>`
          : ""
      }

      <div style="
        font-size: 14px;
        color: #999999;
        margin-top: 48px;
      ">生成时间：${safeGeneratedAt}</div>
    </div>
  `;
}
