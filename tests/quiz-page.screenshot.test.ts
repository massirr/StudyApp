import { test, expect } from '@playwright/test';

test('Quiz page renders and takes screenshot', async ({ page }) => {
  await page.goto('/dp-750/quiz');
  await expect(page.locator('text=DP-750 Quiz')).toBeVisible({ timeout: 5000 });
  await page.screenshot({ path: 'test-results/quiz-page.png', fullPage: true });
});
