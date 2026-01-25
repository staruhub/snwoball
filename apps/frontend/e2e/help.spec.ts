import { test, expect } from "@playwright/test";

test.describe("Help Center", () => {
  test("should display getting started page", async ({ page }) => {
    await page.goto("/help/getting-started");
    await expect(page.locator("h1")).toContainText("快速入门");
  });

  test("should display guide sections", async ({ page }) => {
    await page.goto("/help/getting-started");
    await expect(page.getByText("创建第一份报告")).toBeVisible();
    await expect(page.getByText("添加分析模块")).toBeVisible();
    await expect(page.getByText("导出报告")).toBeVisible();
    await expect(page.getByText("使用模板")).toBeVisible();
  });

  test("should expand guide section on click", async ({ page }) => {
    await page.goto("/help/getting-started");
    await page.getByText("添加分析模块").click();
    await expect(page.getByText("浏览可用模块")).toBeVisible();
  });

  test("should display indicators page", async ({ page }) => {
    await page.goto("/help/indicators");
    await expect(page.locator("h1")).toContainText("指标说明");
  });

  test("should show indicator categories", async ({ page }) => {
    await page.goto("/help/indicators");
    await expect(page.getByText("收益指标")).toBeVisible();
    await expect(page.getByText("风险指标")).toBeVisible();
    await expect(page.getByText("风险调整收益指标")).toBeVisible();
  });

  test("should display indicator detail on selection", async ({ page }) => {
    await page.goto("/help/indicators");
    // Expand category and select indicator
    await page.getByText("收益指标").click();
    await page.getByText("区间收益率").click();
    await expect(page.getByText("计算公式")).toBeVisible();
  });

  test("should display FAQ page", async ({ page }) => {
    await page.goto("/help/faq");
    await expect(page.locator("h1")).toContainText("常见问题");
  });

  test("should filter FAQ by category", async ({ page }) => {
    await page.goto("/help/faq");
    await page.getByRole("button", { name: "报告制作" }).click();
    await expect(page.getByText("如何创建新报告")).toBeVisible();
  });

  test("should expand FAQ on click", async ({ page }) => {
    await page.goto("/help/faq");
    await page.getByText("如何修改登录密码").click();
    await expect(page.getByText("个人中心")).toBeVisible();
  });

  test("should display contact page", async ({ page }) => {
    await page.goto("/help/contact");
    await expect(page.locator("h1")).toContainText("联系客服");
  });

  test("should show contact methods", async ({ page }) => {
    await page.goto("/help/contact");
    await expect(page.getByText("电子邮件")).toBeVisible();
    await expect(page.getByText("客服电话")).toBeVisible();
    await expect(page.getByText("在线客服")).toBeVisible();
  });

  test("should display feedback form", async ({ page }) => {
    await page.goto("/help/contact");
    await expect(page.getByText("提交反馈")).toBeVisible();
    await expect(page.getByPlaceholder("请详细描述")).toBeVisible();
  });
});
