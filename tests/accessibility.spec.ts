import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Foundation smoke test — verifies axe-core integration only. Violation assertions are added in T96 / Group 13 QA.
test.describe("accessibility foundation", () => {
  test("skip navigation is first focus target and moves focus to main content", async ({
    page,
  }) => {
    await page.goto("/");

    const skipLink = page.getByRole("link", {
      name: "تخطي إلى المحتوى الرئيسي",
    });

    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("skip navigation is localized for English pages", async ({ page }) => {
    await page.goto("/en");

    const skipLink = page.getByRole("link", {
      name: "Skip to main content",
    });

    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("axe-core integration scans the rendered document", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.testEngine.name).toBe("axe-core");
    expect(Array.isArray(results.violations)).toBe(true);
  });
});
