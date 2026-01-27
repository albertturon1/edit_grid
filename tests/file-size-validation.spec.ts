import { expect, test } from "@playwright/test";

test.describe("file size validation", () => {
  test("should show error toast when file exceeds 5MB limit on home page", async ({ page }) => {
    await page.goto("/");

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByLabel("Upload your file").click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles("public/customers-100000.csv");

    const toast = page.locator("[data-sonner-toast]");
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/too big|Maximum size/i);

    // Import dialog should NOT appear
    await expect(page.getByRole("button", { name: "Import" })).not.toBeVisible();
  });

  test("should show error toast when file exceeds 5MB limit on room page", async ({ page }) => {
    await page.goto("/room");

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByLabel("Upload your file").click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles("public/customers-100000.csv");

    const toast = page.locator("[data-sonner-toast]");
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/too big|Maximum size/i);

    // Import dialog should NOT appear
    await expect(page.getByRole("button", { name: "Import" })).not.toBeVisible();
  });

  test("should show import dialog when file is within 5MB limit", async ({ page }) => {
    await page.goto("/");

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByLabel("Upload your file").click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles("public/customers-1000.csv");

    // Import dialog should appear
    await expect(page.getByRole("button", { name: "Import" })).toBeVisible();
  });
});
