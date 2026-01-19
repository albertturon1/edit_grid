import { expect, test } from "@playwright/test";
import path from "node:path";

test.beforeEach(async ({ page }) => {
  await test.step("Setup: Upload CSV and render table", async () => {
    await page.goto("/");

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByLabel("Click here to upload your file").click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles(path.join(import.meta.dirname, "../public/customers-1000.csv"));

    await page.getByRole("button", { name: "Import" }).click();
    await page.waitForURL("/room");

    const tableContainer = page.getByTestId("virtualized-table-container");
    const firstRow = tableContainer.getByTestId("row-0");
    const firstCell = firstRow.locator("td").first();

    await expect(firstRow).toBeVisible();
    await expect(firstCell).not.toBeEmpty();
  });
});

test("should handle deep vertical scrolling with virtualization", async ({ page }) => {
  const tableContainer = page.getByTestId("virtualized-table-container");

  const firstRow = tableContainer.getByTestId("row-0");
  const targetRowIndex = 50;
  const targetRow = tableContainer.getByTestId(`row-${targetRowIndex}`);

  const stickyHeader = tableContainer.locator("thead th").first();

  let rowHeight = 0;

  await test.step("Measure row height dynamically", async () => {
    const box = await firstRow.boundingBox();
    if (!box) throw new Error("Could not measure row height");
    rowHeight = box.height;
  });

  await test.step("Scroll to target row", async () => {
    const scrollPixels = targetRowIndex * rowHeight;
    await tableContainer.hover();
    await page.mouse.wheel(0, scrollPixels);
  });

  await test.step("Verify sticky header and target row visibility", async () => {
    await expect(stickyHeader).toBeVisible();
    await expect(targetRow).toBeVisible();
  });

  await test.step("Verify virtualization (row 0 removed from DOM)", async () => {
    await expect(firstRow).not.toBeAttached();
  });
});

test("should keep first column sticky on horizontal scroll", async ({ page }) => {
  const tableContainer = page.getByTestId("virtualized-table-container");

  const stickyCell = tableContainer.getByTestId("row-0").locator("td").first();

  await tableContainer.hover();
  await page.mouse.wheel(5000, 0);

  await expect(stickyCell).toBeVisible();
});
