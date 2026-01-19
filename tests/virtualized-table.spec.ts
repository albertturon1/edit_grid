import { expect, test } from "@playwright/test";
import path from "node:path";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByLabel("Click here to upload your file").click();
  const fileChooser = await fileChooserPromise;

  await fileChooser.setFiles(
    path.join(import.meta.dirname, "../public/customers-1000.csv"),
  );

  await page.getByRole("button", { name: "Import" }).click();
  await page.waitForURL("/room");

  const tableContainer = page.getByTestId("virtualized-table-container");
  await expect(tableContainer).toBeVisible();

  const firstRow = tableContainer.getByTestId("row-0");
  const firstCell = firstRow.locator("td").first();

  await expect(firstRow).toBeVisible();
  await expect(firstCell).not.toBeEmpty();
});

test("keeps header sticky on vertical scroll", async ({ page }) => {
  const container = page.getByTestId("virtualized-table-container");
  const header = page.getByRole("columnheader").first();

  await expect(header).toBeVisible();

  await container.hover();
  await page.mouse.wheel(0, 3000);

  await expect(header).toBeVisible();
});

test("keeps first column sticky on horizontal scroll", async ({ page }) => {
  const container = page.getByTestId("virtualized-table-container");
  const stickyCell = page.getByRole("row").nth(1).locator("td").first();

  await expect(stickyCell).toBeVisible();

  await container.hover();
  await page.mouse.wheel(3000, 0);

  await expect(stickyCell).toBeVisible();
});
