import { expect, test } from '@playwright/test';

test('quiz requires selection before submit', async ({ page }) => {
    await page.goto('http://localhost:5174/quiz');

    const submit = page.getByRole('button', { name: 'Submit Answer' });
    await expect(submit).toBeDisabled();

    await page.getByLabel('workspace.database.table').check();
    await expect(submit).toBeEnabled();
});

test('multi-select question validates combined answer', async ({ page }) => {
    await page.goto('http://localhost:5174/quiz?topic=ingest-and-transform-data');

    await page.getByLabel('Batch ingestion').check();
    await page.getByLabel('Streaming ingestion').check();
    await page.getByRole('button', { name: 'Submit Answer' }).click();

    await expect(page.getByText('Correct')).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Official Source' }).first()).toBeVisible();

    const next = page.getByRole('button', { name: 'Next' });
    await expect(next).toBeEnabled();
    await next.click();

    await expect(page.getByText('Question 2 of')).toBeVisible();
});
