import { test, expect } from "@playwright/test";

test.describe("Workspace", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/workspace");
  });

  test("should display workspace page", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("工作台");
  });

  test("should show quick actions section", async ({ page }) => {
    await expect(page.getByText("新建报告")).toBeVisible();
    await expect(page.getByText("从模板创建")).toBeVisible();
  });

  test("should show recent reports section", async ({ page }) => {
    await expect(page.getByText("最近报告")).toBeVisible();
  });

  test("should show favorite templates section", async ({ page }) => {
    await expect(page.getByText("收藏模板")).toBeVisible();
  });

  test("should navigate to new report on click", async ({ page }) => {
    await page.getByText("新建报告").click();
    await expect(page).toHaveURL(/\/editor\/new/);
  });
});
