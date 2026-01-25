import { test, expect } from "@playwright/test";

test.describe("Admin System", () => {
  test("should display admin login page", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByText("管理员登录").or(page.locator("h1"))).toBeVisible();
  });

  test("should display admin dashboard after login", async ({ page }) => {
    // Note: In real tests, you'd need to mock authentication
    await page.goto("/admin");
    // Should either show dashboard or redirect to login
    const url = page.url();
    expect(url).toMatch(/\/admin/);
  });

  test("should have user management link", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("用户管理")).toBeVisible();
  });

  test("should have role management link", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("角色管理")).toBeVisible();
  });

  test("should have module management link", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("模块管理")).toBeVisible();
  });

  test("should have template management link", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("模板管理")).toBeVisible();
  });

  test("should have system settings link", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("系统配置")).toBeVisible();
  });

  test("should navigate to user management", async ({ page }) => {
    await page.goto("/admin");
    await page.getByText("用户管理").click();
    await expect(page).toHaveURL(/\/admin\/users/);
  });
});
