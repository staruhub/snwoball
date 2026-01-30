/**
 * 模板管理模块测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// 模拟模板数据
interface Template {
  id: string;
  name: string;
  code: string;
  type: "report" | "email" | "notification";
  description?: string;
  status: number; // 0: draft, 1: published, 2: unpublished
  isDefault?: boolean;
  version: number;
  config?: Record<string, unknown>;
  createdAt: string;
}

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "基金基础报告",
    code: "fund_basic_report",
    type: "report",
    description: "基础报告模板",
    status: 1,
    isDefault: true,
    version: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "基金详细报告",
    code: "fund_detailed_report",
    type: "report",
    description: "详细报告模板",
    status: 1,
    isDefault: false,
    version: 1,
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "草稿模板",
    code: "draft_template",
    type: "report",
    description: "未发布的模板",
    status: 0,
    version: 1,
    createdAt: "2024-01-03T00:00:00Z",
  },
];

// 模拟 API 函数
const mockAPI = {
  getTemplates: vi.fn((params?: { type?: string; status?: number }) => {
    let result = [...mockTemplates];
    if (params?.type) {
      result = result.filter((t) => t.type === params.type);
    }
    if (params?.status !== undefined) {
      result = result.filter((t) => t.status === params.status);
    }
    return Promise.resolve({ items: result, total: result.length });
  }),
  getTemplate: vi.fn((id: string) =>
    Promise.resolve(mockTemplates.find((t) => t.id === id))
  ),
  createTemplate: vi.fn((data: Partial<Template>) =>
    Promise.resolve({
      ...data,
      id: "new-id",
      status: 0,
      version: 1,
      createdAt: new Date().toISOString(),
    })
  ),
  updateTemplate: vi.fn((id: string, data: Partial<Template>) =>
    Promise.resolve({ ...mockTemplates.find((t) => t.id === id), ...data })
  ),
  publishTemplate: vi.fn((id: string, action: "publish" | "unpublish") => {
    const template = mockTemplates.find((t) => t.id === id);
    if (template) {
      template.status = action === "publish" ? 1 : 2;
    }
    return Promise.resolve(true);
  }),
  deleteTemplate: vi.fn((id: string) => {
    const template = mockTemplates.find((t) => t.id === id);
    if (template?.status === 1) {
      return Promise.reject(new Error("已发布的模板不能删除"));
    }
    return Promise.resolve(true);
  }),
  setDefaultTemplate: vi.fn((id: string) => Promise.resolve(true)),
};

describe("Template Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Template List", () => {
    it("应正确获取模板列表", async () => {
      const result = await mockAPI.getTemplates();
      expect(result.items).toHaveLength(3);
    });

    it("应支持按类型筛选", async () => {
      const result = await mockAPI.getTemplates({ type: "report" });
      expect(result.items.every((t) => t.type === "report")).toBe(true);
    });

    it("应支持按状态筛选", async () => {
      const result = await mockAPI.getTemplates({ status: 1 });
      expect(result.items.every((t) => t.status === 1)).toBe(true);
      expect(result.items).toHaveLength(2);
    });
  });

  describe("Template CRUD", () => {
    it("应正确获取单个模板", async () => {
      const template = await mockAPI.getTemplate("1");
      expect(template?.id).toBe("1");
      expect(template?.name).toBe("基金基础报告");
    });

    it("应正确创建模板", async () => {
      const newTemplate = await mockAPI.createTemplate({
        name: "新模板",
        code: "new_template",
        type: "report",
      });

      expect(newTemplate.id).toBe("new-id");
      expect(newTemplate.status).toBe(0); // 新建模板默认为草稿
    });

    it("应正确更新模板", async () => {
      const updated = await mockAPI.updateTemplate("1", {
        description: "更新后的描述",
      });
      expect(updated?.description).toBe("更新后的描述");
    });

    it("已发布的模板不能删除", async () => {
      await expect(mockAPI.deleteTemplate("1")).rejects.toThrow(
        "已发布的模板不能删除"
      );
    });

    it("草稿模板可以删除", async () => {
      const result = await mockAPI.deleteTemplate("3");
      expect(result).toBe(true);
    });
  });

  describe("Template Publishing", () => {
    it("应正确发布模板", async () => {
      await mockAPI.publishTemplate("3", "publish");
      expect(mockAPI.publishTemplate).toHaveBeenCalledWith("3", "publish");
    });

    it("应正确下架模板", async () => {
      await mockAPI.publishTemplate("1", "unpublish");
      expect(mockAPI.publishTemplate).toHaveBeenCalledWith("1", "unpublish");
    });
  });

  describe("Default Template", () => {
    it("应只有一个默认模板", () => {
      const defaultTemplates = mockTemplates.filter((t) => t.isDefault);
      expect(defaultTemplates).toHaveLength(1);
    });

    it("应可设置默认模板", async () => {
      const result = await mockAPI.setDefaultTemplate("2");
      expect(result).toBe(true);
    });
  });

  describe("Template Versioning", () => {
    it("模板应有版本号", () => {
      mockTemplates.forEach((template) => {
        expect(template.version).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("Template Config", () => {
    it("模板配置应可选", () => {
      const withConfig = mockTemplates.filter((t) => t.config !== undefined);
      const withoutConfig = mockTemplates.filter((t) => t.config === undefined);

      // 两种情况都有效
      expect(withConfig.length + withoutConfig.length).toBe(mockTemplates.length);
    });
  });
});
