import { expect, test } from "@playwright/test";

/**
 * The one smoke test (spec › Testing Decisions, seam 3): the core path from an
 * empty day to reading an Exercise's form guidance out of the Plan.
 */
test("plan an Exercise for today and open its form guidance", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Plan hari ini" })).toBeVisible();
  await expect(page.getByText("Belum ada gerakan di plan ini.")).toBeVisible();

  await page.getByRole("link", { name: "Pilih dari Library" }).click();
  const row = page.getByRole("listitem").filter({ hasText: "Conventional Deadlift" });
  await row.getByRole("button", { name: "Tambah" }).click();
  await expect(row.getByText("Sudah di plan")).toBeVisible();

  await page.getByRole("link", { name: "Hari ini" }).click();
  const plan = page.getByTestId("plan-list");
  await expect(plan).toContainText("Conventional Deadlift");

  await plan.getByRole("link", { name: /Conventional Deadlift/ }).click();
  await expect(page.getByRole("heading", { name: "Conventional Deadlift", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Form yang benar" })).toBeVisible();
  await expect(page.getByText("Bar di atas tengah kaki")).toBeVisible();
});

test("a visitor without a session is sent to sign-in", async ({ browser }) => {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("button", { name: "Masuk dengan Google" })).toBeVisible();
  await context.close();
});
