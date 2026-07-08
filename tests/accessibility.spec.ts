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

  test("header navigation exposes active route state", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Desktop navigation is hidden until the approved mobile menu sprint.",
    );

    await page.goto("/en/about");

    const primaryNavigation = page.getByRole("navigation", {
      name: "Primary navigation",
    });
    const aboutLink = primaryNavigation.getByRole("link", {
      name: "About",
    });

    await expect(aboutLink).toHaveAttribute("aria-current", "page");
  });

  test("breadcrumbs are semantic and mark the current page", async ({ page }) => {
    await page.goto("/en/about");

    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    const breadcrumbList = breadcrumb.getByRole("list");
    const currentPage = breadcrumb.getByText("About");

    await expect(breadcrumbList).toBeVisible();
    await expect(currentPage).toHaveAttribute("aria-current", "page");
  });

  test("disabled placeholder controls are announced and skipped by tab order", async ({
    page,
  }) => {
    await page.goto("/en/portfolio");

    const disabledFilter = page.getByRole("button", {
      name: "Branding",
      exact: true,
    });

    await expect(disabledFilter).toHaveAttribute("aria-disabled", "true");
    await expect(disabledFilter).toHaveAttribute("tabindex", "-1");

    await page.keyboard.press("Tab");
    await expect(disabledFilter).not.toBeFocused();
  });

  test("contact form keeps labels, autocomplete, and busy semantics", async ({
    page,
  }) => {
    await page.goto("/en/contact");

    const form = page.getByRole("form", { name: "Send a focused brief" });

    await expect(form).toHaveAttribute("aria-busy", "false");
    await expect(
      page.getByRole("textbox", { name: "Name", exact: true }),
    ).toHaveAttribute("autocomplete", "name");
    await expect(page.getByLabel("Email address")).toHaveAttribute(
      "autocomplete",
      "email",
    );
    await expect(page.getByLabel("Phone number")).toHaveAttribute(
      "autocomplete",
      "tel",
    );
  });

  test("quote form keeps fieldset grouping and step semantics", async ({ page }) => {
    await page.goto("/en/quote");

    await expect(
      page.getByRole("group", {
        name: "What services are you looking for?",
      }),
    ).toBeVisible();
    await expect(page.getByRole("group", { name: "Budget range" })).toBeVisible();
    await expect(page.getByRole("group", { name: "Timeline" })).toBeVisible();
    await expect(page.getByText("Service selection").locator("..")).toHaveAttribute(
      "aria-current",
      "step",
    );
  });
});
