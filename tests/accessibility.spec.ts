import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Foundation smoke test — verifies axe-core integration only. Violation assertions are added in T96 / Group 13 QA.
test.describe("accessibility foundation", () => {
  test("axe-core integration scans the rendered document", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.testEngine.name).toBe("axe-core");
    expect(Array.isArray(results.violations)).toBe(true);
  });
});
