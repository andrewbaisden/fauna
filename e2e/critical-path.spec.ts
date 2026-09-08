import { expect, test } from "@playwright/test";

async function visit(page: import("@playwright/test").Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
}

test("visitor can search from home and open a species profile", async ({
  page,
}) => {
  await visit(page, "/");
  await expect(
    page.getByRole("heading", { name: /explore life on earth/i }),
  ).toBeVisible();
  await page.getByLabel("Search species").fill("elephant");
  await page.getByLabel("Search species").press("Enter");
  await expect(page).toHaveURL(/\/animals/);
  await expect(
    page.getByRole("heading", { name: "Explore species" }),
  ).toBeVisible();
  const elephant = page
    .getByRole("link", { name: /african elephant/i })
    .first();
  await expect(elephant).toBeVisible();
  await elephant.click();
  await page.waitForURL(/\/animals\/african-elephant/);
  await expect(
    page.getByRole("heading", { level: 1, name: "African elephant" }),
  ).toBeVisible();
  await expect(
    page.getByRole("paragraph").filter({ hasText: /^Loxodonta africana$/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Characteristics" }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    page.getByRole("heading", { name: "Life stages" }),
  ).toBeVisible();
});

test("filters are shareable in the URL", async ({ page }) => {
  await visit(page, "/animals?group=BIRD");
  await expect(
    page.getByRole("heading", { name: "Explore species" }),
  ).toBeVisible();
  await expect(page.getByText(/Peregrine falcon|Bird/i).first()).toBeVisible();
});

test("comparison URLs are canonical", async ({ page }) => {
  await visit(page, "/compare/peregrine-falcon/african-elephant");
  await expect(page).toHaveURL(/compare\/african-elephant\/peregrine-falcon/);
  await expect(
    page.getByRole("heading", {
      name: /African elephant vs Peregrine falcon/i,
    }),
  ).toBeVisible();
});

test("surprise redirects into a profile", async ({ page }) => {
  await visit(page, "/surprise");
  await expect(page).toHaveURL(/\/animals\//);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("species profile includes a 3D viewer entry point", async ({ page }) => {
  await visit(page, "/animals/monarch-butterfly");
  await expect(
    page.getByRole("heading", { name: "Monarch butterfly" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Load 3D model" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Characteristics" }),
  ).toBeVisible();
});

test("sign-in is available without gating the catalogue", async ({ page }) => {
  await visit(page, "/sign-in");
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Explore", exact: true })
    .click();
  await expect(page).toHaveURL(/\/animals/);
});

test("mobile primary navigation reaches Explore", async ({ page }) => {
  await visit(page, "/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Explore", exact: true })
    .click();
  await expect(page).toHaveURL(/\/animals/);
});
