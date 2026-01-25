"use client";

import { escapeHtml } from "@/lib/utils/escape-html";

export interface TocItem {
  id: string;
  title: string;
  level: number;
  page?: number;
}

interface TocPageProps {
  items: TocItem[];
  title?: string;
}

/**
 * 报告目录页模板
 * 用于生成导出 PDF 的目录 HTML
 */
export function TocPageTemplate({ items, title = "目录" }: TocPageProps) {
  return (
    <div
      className="toc-page"
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "48px",
        backgroundColor: "#ffffff",
        pageBreakAfter: "always",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#1a1a1a",
          marginBottom: "32px",
          borderBottom: "2px solid #0F5FFE",
          paddingBottom: "12px",
        }}
      >
        {title}
      </h2>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item, index) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              alignItems: "baseline",
              marginBottom: "12px",
              marginLeft: item.level > 1 ? `${(item.level - 1) * 24}px` : 0,
            }}
          >
            <span
              style={{
                fontSize: item.level === 1 ? "16px" : "14px",
                fontWeight: item.level === 1 ? "500" : "400",
                color: "#1a1a1a",
              }}
            >
              {index + 1}. {item.title}
            </span>
            <span
              style={{
                flex: 1,
                borderBottom: "1px dotted #cccccc",
                margin: "0 12px",
                minWidth: "24px",
              }}
            />
            {item.page && (
              <span
                style={{
                  fontSize: "14px",
                  color: "#666666",
                }}
              >
                {item.page}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 生成目录页 HTML 字符串
 */
export function generateTocHtml(items: TocItem[], title = "目录"): string {
  const safeTitle = escapeHtml(title);

  const itemsHtml = items
    .map((item, index) => {
      const safeItemTitle = escapeHtml(item.title);
      return `
      <li style="
        display: flex;
        align-items: baseline;
        margin-bottom: 12px;
        margin-left: ${item.level > 1 ? `${(item.level - 1) * 24}px` : "0"};
      ">
        <span style="
          font-size: ${item.level === 1 ? "16px" : "14px"};
          font-weight: ${item.level === 1 ? "500" : "400"};
          color: #1a1a1a;
        ">${index + 1}. ${safeItemTitle}</span>
        <span style="
          flex: 1;
          border-bottom: 1px dotted #cccccc;
          margin: 0 12px;
          min-width: 24px;
        "></span>
        ${item.page ? `<span style="font-size: 14px; color: #666666;">${item.page}</span>` : ""}
      </li>
    `;
    })
    .join("");

  return `
    <div class="toc-page" style="
      width: 100%;
      min-height: 100vh;
      padding: 48px;
      background-color: #ffffff;
      page-break-after: always;
    ">
      <h2 style="
        font-size: 24px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 32px;
        border-bottom: 2px solid #0F5FFE;
        padding-bottom: 12px;
      ">${safeTitle}</h2>

      <ul style="list-style: none; padding: 0; margin: 0;">
        ${itemsHtml}
      </ul>
    </div>
  `;
}
