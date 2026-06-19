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
    await expect(page.getByRole('link', { name: /Azure|Microsoft|Official/ }).first()).toBeVisible();

    const next = page.getByRole('button', { name: 'Next' });
    await expect(next).toBeEnabled();
    await next.click();

    await expect(page.getByText('Question 2 of')).toBeVisible();
});

test('score screen shows after completing all topic questions', async ({ page }) => {
    await page.goto('http://localhost:5174/quiz?topic=ingest-and-transform-data');

    let questionsRemaining = true;
    while (questionsRemaining) {
        const options = page.getByRole('radio').or(page.getByRole('checkbox'));
        const firstOption = options.first();
        await firstOption.check();
        await page.getByRole('button', { name: 'Submit Answer' }).click();

        const hasNext = await page.getByRole('button', { name: 'Next' }).isVisible();
        const hasFinish = await page.getByRole('button', { name: 'Finish' }).isVisible();

        if (hasNext) {
            await page.getByRole('button', { name: 'Next' }).click();
        } else if (hasFinish) {
            await page.getByRole('button', { name: 'Finish' }).click();
            questionsRemaining = false;
        } else {
            questionsRemaining = false;
        }
    }

    await expect(page.getByText(/\d+ \/ \d+/)).toBeVisible();
    await expect(page.getByText(/%/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retake Quiz' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to Dashboard' })).toBeVisible();
});
