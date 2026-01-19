import { test, expect } from "@playwright/test";

test("should open example file and display data in table", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open example file" }).click();
  await page.waitForURL("/room");

  const tableContainer = page.getByTestId("virtualized-table-container");
  const firstRow = tableContainer.getByTestId("row-0");
  const firstCell = firstRow.locator("td").first();

  await expect(firstRow).toBeVisible();
  await expect(firstCell).not.toBeEmpty();
});
