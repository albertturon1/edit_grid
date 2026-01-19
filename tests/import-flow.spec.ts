import { expect, test } from "@playwright/test";
import path from "node:path";

test("should import CSV file and display data in table", async ({ page }) => {
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
