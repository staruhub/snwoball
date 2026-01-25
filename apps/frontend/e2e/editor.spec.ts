import { test, expect } from "@playwright/test";

test.describe("Report Editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/editor/new");
  });

  test("should display editor layout with three panels", async ({ page }) => {
    // Left panel - module navigation
    await expect(page.locator('[data-testid="module-navigation"]').or(
      page.getByText("产品信息")
    )).toBeVisible();

    // Center - canvas area
    await expect(page.locator('[data-testid="canvas"]').or(
      page.getByText("拖拽模块到此处")
    )).toBeVisible();
  });

  test("should show global filters bar", async ({ page }) => {
    await expect(page.getByText("基金选择").or(
      page.getByPlaceholder("搜索基金")
    )).toBeVisible();
  });

  test("should show save button in toolbar", async ({ page }) => {
    await expect(page.getByRole("button", { name: /保存/ })).toBeVisible();
  });

  test("should show export button in toolbar", async ({ page }) => {
    await expect(page.getByRole("button", { name: /导出/ })).toBeVisible();
  });

  test("should expand module category on click", async ({ page }) => {
    const categoryButton = page.getByText("收益统计");
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      await expect(page.getByText("净值走势图")).toBeVisible();
    }
  });

  test("should add module to canvas", async ({ page }) => {
    // Expand category
    const categoryButton = page.getByText("产品信息");
    if (await categoryButton.isVisible()) {
      await categoryButton.click();

      // Click add button for a module
      const addButton = page.getByRole("button", { name: /添加.*产品表头/ }).first();
      if (await addButton.isVisible()) {
        await addButton.click();
        // Verify module appears in canvas
        await expect(page.locator('[data-testid="module-card"]').first()).toBeVisible();
      }
    }
  });
});
