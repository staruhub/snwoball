/**
 * 导出弹窗测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ExportModal } from "@/components/features/export";

describe("ExportModal", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    reportName: "测试报告",
    fundName: "测试基金",
    dateRange: "2024-01-01 ~ 2024-12-31",
    getContentHtml: vi.fn(() => "<div>test content</div>"),
    getToken: vi.fn(() => "test-token"),
    tocItems: [{ id: "test", title: "测试模块", level: 1 }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("当 open 为 true 时显示弹窗", () => {
    render(<ExportModal {...defaultProps} />);
    expect(screen.getByText("导出报告")).toBeInTheDocument();
  });

  it("当 open 为 false 时不显示弹窗", () => {
    render(<ExportModal {...defaultProps} open={false} />);
    expect(screen.queryByText("导出报告")).not.toBeInTheDocument();
  });

  it("显示报告名称输入框", () => {
    render(<ExportModal {...defaultProps} />);
    const input = screen.getByDisplayValue("测试报告");
    expect(input).toBeInTheDocument();
  });

  it("点击取消按钮关闭弹窗", () => {
    render(<ExportModal {...defaultProps} />);
    fireEvent.click(screen.getByText("取消"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("点击开始导出按钮触发导出", async () => {
    // 模拟 fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob(["test"], { type: "application/pdf" })),
      })
    ) as unknown as typeof fetch;

    render(<ExportModal {...defaultProps} />);
    fireEvent.click(screen.getByText("开始导出"));

    await waitFor(() => {
      expect(defaultProps.getContentHtml).toHaveBeenCalled();
    });
  });

  it("没有 token 时显示错误", async () => {
    render(
      <ExportModal {...defaultProps} getToken={() => null} />
    );
    fireEvent.click(screen.getByText("开始导出"));

    await waitFor(() => {
      expect(screen.getByText("请先登录后再导出")).toBeInTheDocument();
    });
  });

  it("选择选中模块但无选中项时显示错误", async () => {
    render(<ExportModal {...defaultProps} selectedModulesCount={0} />);

    // 选择"选中模块"
    const selectedRadio = screen.getByText("选中模块");
    fireEvent.click(selectedRadio);

    fireEvent.click(screen.getByText("开始导出"));

    await waitFor(() => {
      expect(
        screen.getByText("请先在画布中选择要导出的模块")
      ).toBeInTheDocument();
    });
  });
});
