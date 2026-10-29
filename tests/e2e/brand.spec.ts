import { expect, test } from "@playwright/test";

test("home shows the brand and has no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("img", { name: "Chumbuo" })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});

test("brand guide renders lockups, palette and downloads", async ({ page }) => {
  await page.goto("/brand");
  await expect(page.getByRole("heading", { name: "Lockups" })).toBeVisible();
  await expect(page.getByText("#E8DCC6")).toBeVisible();
  const svg = await page.request.get("/brand/chumbuo-horizontal-light.svg");
  expect(svg.ok()).toBe(true);
  expect(svg.headers()["content-type"]).toContain("svg");
});

test("favicon and apple icon are served", async ({ page }) => {
  await page.goto("/");
  const icon = page.locator('link[rel="icon"]').first();
  await expect(icon).toHaveAttribute("href", /icon\.png/);
  expect((await page.request.get("/apple-icon.png")).ok()).toBe(true);
});
