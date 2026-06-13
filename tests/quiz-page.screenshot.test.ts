import { test, expect } from '@playwright/test';

test('Quiz page renders and takes screenshot', async ({ page }) => {
  await page.goto('http://localhost:5174/quiz');
  await expect(page.locator('text=DP-750 Quiz')).toBeVisible({ timeout: 5000 });
  await page.screenshot({ path: 'quiz-page.png', fullPage: true });
});
