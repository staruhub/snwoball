/**
 * 导出表单测试
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExportForm } from "@/components/features/export/export-form";
import { DEFAULT_EXPORT_CONFIG, SYSTEM_TEMPLATES } from "@/components/features/export/types";

describe("ExportForm", () => {
  const defaultConfig = { ...DEFAULT_EXPORT_CONFIG };
  const mockOnChange = vi.fn();

  it("渲染所有表单字段", () => {
    render(
      <ExportForm
        config={defaultConfig}
        onChange={mockOnChange}
        templates={SYSTEM_TEMPLATES}
      />
    );

    expect(screen.getByText("报告名称")).toBeInTheDocument();
    expect(screen.getByText("导出模板")).toBeInTheDocument();
    expect(screen.getByText("导出类型")).toBeInTheDocument();
    expect(screen.getByText("导出尺寸")).toBeInTheDocument();
    expect(screen.getByText("导出范围")).toBeInTheDocument();
    expect(screen.getByText("其他选项")).toBeInTheDocument();
  });

  it("更改报告名称触发 onChange", () => {
    render(
      <ExportForm
        config={defaultConfig}
        onChange={mockOnChange}
        templates={SYSTEM_TEMPLATES}
      />
    );

    const input = screen.getByDisplayValue(defaultConfig.reportName);
    fireEvent.change(input, { target: { value: "新报告名称" } });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ reportName: "新报告名称" })
    );
  });

  it("选择导出类型触发 onChange", () => {
    render(
      <ExportForm
        config={defaultConfig}
        onChange={mockOnChange}
        templates={SYSTEM_TEMPLATES}
      />
    );

    const pdfRadio = screen.getByText("PDF");
    fireEvent.click(pdfRadio);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("选择页面尺寸触发 onChange", () => {
    render(
      <ExportForm
        config={defaultConfig}
        onChange={mockOnChange}
        templates={SYSTEM_TEMPLATES}
      />
    );

    const landscapeRadio = screen.getByText("A4 横向");
    fireEvent.click(landscapeRadio);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ pageSize: "a4-landscape" })
    );
  });

  it("勾选包含封面触发 onChange", () => {
    render(
      <ExportForm
        config={{ ...defaultConfig, includeCover: false }}
        onChange={mockOnChange}
        templates={SYSTEM_TEMPLATES}
      />
    );

    const coverCheckbox = screen.getByText("包含封面");
    fireEvent.click(coverCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ includeCover: true })
    );
  });

  it("显示已选模块数量", () => {
    render(
      <ExportForm
        config={{ ...defaultConfig, exportScope: "selected" }}
        onChange={mockOnChange}
        templates={SYSTEM_TEMPLATES}
        selectedModulesCount={5}
      />
    );

    expect(screen.getByText("已选择 5 个模块")).toBeInTheDocument();
  });

  it("无选中模块时显示提示", () => {
    render(
      <ExportForm
        config={{ ...defaultConfig, exportScope: "selected" }}
        onChange={mockOnChange}
        templates={SYSTEM_TEMPLATES}
        selectedModulesCount={0}
      />
    );

    expect(screen.getByText("请先在画布中选择模块")).toBeInTheDocument();
  });
});
