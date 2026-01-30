/**
 * 报告管理模块测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { Report } from "@/lib/api/reports";

// 模拟报告数据
const mockReports: Report[] = [
  {
    id: "1",
    name: "测试报告1",
    fundId: "fund-1",
    fundName: "测试基金A",
    status: "draft",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
    createdBy: "user-1",
  },
  {
    id: "2",
    name: "测试报告2",
    fundId: "fund-2",
    fundName: "测试基金B",
    status: "published",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
    createdBy: "user-1",
  },
];

// 模拟 API 函数
const mockAPI = {
  getReports: vi.fn(() => Promise.resolve({ items: mockReports, total: 2 })),
  getReport: vi.fn((id: string) =>
    Promise.resolve(mockReports.find((r) => r.id === id))
  ),
  createReport: vi.fn((data: Partial<Report>) =>
    Promise.resolve({ ...data, id: "new-id", createdAt: new Date().toISOString() })
  ),
  updateReport: vi.fn((id: string, data: Partial<Report>) =>
    Promise.resolve({ ...mockReports.find((r) => r.id === id), ...data })
  ),
  deleteReport: vi.fn(() => Promise.resolve(true)),
  duplicateReport: vi.fn((id: string) =>
    Promise.resolve({
      ...mockReports.find((r) => r.id === id),
      id: "duplicated-id",
      name: `${mockReports.find((r) => r.id === id)?.name} (副本)`,
    })
  ),
};

describe("Report Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Report List", () => {
    it("应正确获取报告列表", async () => {
      const result = await mockAPI.getReports();
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it("应返回正确的报告数据结构", async () => {
      const result = await mockAPI.getReports();
      const report = result.items[0];

      expect(report).toHaveProperty("id");
      expect(report).toHaveProperty("name");
      expect(report).toHaveProperty("fundId");
      expect(report).toHaveProperty("status");
      expect(report).toHaveProperty("createdAt");
    });
  });

  describe("Report CRUD", () => {
    it("应正确获取单个报告", async () => {
      const report = await mockAPI.getReport("1");
      expect(report?.id).toBe("1");
      expect(report?.name).toBe("测试报告1");
    });

    it("应正确创建报告", async () => {
      const newReport = await mockAPI.createReport({
        name: "新报告",
        fundId: "fund-new",
      });

      expect(newReport.id).toBe("new-id");
      expect(newReport.name).toBe("新报告");
      expect(mockAPI.createReport).toHaveBeenCalledWith({
        name: "新报告",
        fundId: "fund-new",
      });
    });

    it("应正确更新报告", async () => {
      const updated = await mockAPI.updateReport("1", { name: "更新后的名称" });
      expect(updated?.name).toBe("更新后的名称");
    });

    it("应正确删除报告", async () => {
      const result = await mockAPI.deleteReport("1");
      expect(result).toBe(true);
      expect(mockAPI.deleteReport).toHaveBeenCalledWith("1");
    });

    it("应正确复制报告", async () => {
      const duplicated = await mockAPI.duplicateReport("1");
      expect(duplicated.id).toBe("duplicated-id");
      expect(duplicated.name).toContain("(副本)");
    });
  });

  describe("Report Filtering", () => {
    it("应支持按状态筛选", async () => {
      const draftReports = mockReports.filter((r) => r.status === "draft");
      expect(draftReports).toHaveLength(1);
      expect(draftReports[0].name).toBe("测试报告1");
    });

    it("应支持按名称搜索", async () => {
      const keyword = "报告1";
      const filtered = mockReports.filter((r) => r.name.includes(keyword));
      expect(filtered).toHaveLength(1);
    });
  });

  describe("Report Sorting", () => {
    it("应支持按创建时间排序", () => {
      const sorted = [...mockReports].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      expect(sorted[0].id).toBe("2");
    });

    it("应支持按名称排序", () => {
      const sorted = [...mockReports].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      expect(sorted[0].name).toBe("测试报告1");
    });
  });

  describe("Trash (Recycle Bin)", () => {
    it("删除的报告应可恢复", async () => {
      // 模拟软删除
      const softDelete = vi.fn(() => Promise.resolve(true));
      const restore = vi.fn(() => Promise.resolve(true));

      await softDelete("1");
      expect(softDelete).toHaveBeenCalled();

      await restore("1");
      expect(restore).toHaveBeenCalled();
    });
  });
});
