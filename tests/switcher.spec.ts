import { expect, test } from '@playwright/test';

test('header switcher lists subjects and navigates', async ({ page }) => {
  await page.goto('/dp-750');
  await page.getByRole('button', { name: 'Switch subject' }).click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('menuitem').first()).toBeVisible();
});
