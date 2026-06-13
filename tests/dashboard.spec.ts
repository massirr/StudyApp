import { test, expect } from '@playwright/test';

const consoleErrors: string[] = [];

test('dashboard loads correctly', async ({ page }) => {
  await page.goto('http://localhost:5174/');
  await page.waitForSelector('h1', { timeout: 10000 });
  await expect(page.getByRole('heading', { name: 'DP-750 Study Dashboard' })).toBeVisible();
  await expect(page).toHaveTitle('DP-750 Study Dashboard');
  await page.waitForSelector('.topics-list', { timeout: 10000 });
  await expect(page.getByText(/This topic will have \d+ questions?\./).first()).toBeVisible();
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
});

test.afterEach(() => {
  if (consoleErrors.length > 0) {
    console.log('Console errors:', consoleErrors);
  }
});
