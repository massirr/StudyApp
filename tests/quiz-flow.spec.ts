import { expect, test } from '@playwright/test';

test('quiz requires selection before submit', async ({ page }) => {
    await page.goto('http://localhost:5174/quiz');

    const submit = page.getByRole('button', { name: 'Submit Answer' });
    await expect(submit).toBeDisabled();

    // Select first available radio option regardless of label text
    await page.getByRole('radio').first().check();
    await expect(submit).toBeEnabled();
});

test('multi-select question validates combined answer', async ({ page }) => {
    await page.goto('http://localhost:5174/quiz?topic=ingest-and-transform-data');

    // Navigate past the first two single-select questions to reach q-t2-3 (multi-select)
    for (let i = 0; i < 2; i++) {
        await page.getByRole('radio').first().check();
        await page.getByRole('button', { name: 'Submit Answer' }).click();
        await page.getByRole('button', { name: 'Next' }).click();
    }

    // q-t2-3: "Which tools can orchestrate data movement?" — correct: a+b
    await page.getByLabel('Azure Data Factory').check();
    await page.getByLabel('Databricks Jobs').check();
    await page.getByRole('button', { name: 'Submit Answer' }).click();

    await expect(page.getByText('Correct')).toBeVisible();

    const next = page.getByRole('button', { name: 'Next' });
    await expect(next).toBeEnabled();
    await next.click();

    await expect(page.getByText('Question 4 of')).toBeVisible();
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
    await expect(page.getByText(/^\d+%$/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retake Quiz' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to Dashboard' })).toBeVisible();
});
