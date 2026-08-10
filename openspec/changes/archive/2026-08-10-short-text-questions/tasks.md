## 1. Types & schema (additive)

- [x] 1.1 In `src/types/quiz.ts`, add `'shortText'` to `QuizQuestionType` and add optional `acceptedAnswers?: string[]` to `QuizQuestion`
- [x] 1.2 In `src/data/subjects/schema.ts`, reject a `shortText` question whose `acceptedAnswers` is missing, not an array, or empty — mirroring the existing `freeText`/`sampleAnswer` check and naming the question id in the error
- [x] 1.3 Extend `schema.test.ts`: a valid `shortText` question validates; one with missing/empty `acceptedAnswers` is rejected; DP-750 and existing NL3 content still validate

## 2. Grading engine

- [x] 2.1 In `src/hooks/useQuizState.ts`, export `normalizeAnswer(s: string): string` applying exactly: trim, collapse all Unicode whitespace runs to one space, lowercase, map curly apostrophes/quotes (`’ ‘ ” “`) to straight, strip trailing `.,!?;:`
- [x] 2.2 Add `answerText` as a parameter to `gradeQuestion` and add a `shortText` branch returning whether the normalised input equals any normalised entry of `acceptedAnswers`; leave the `freeText` (selfGrade) and MCQ branches unchanged
- [x] 2.3 Extend `isAnswerSubmittable` so `shortText` gates on non-empty trimmed text, exactly like `freeText`
- [x] 2.4 Confirm `awaitingSelfGrade` stays false for `shortText` (it is keyed to `freeText`), so `Finish Quiz` is never blocked waiting for a self-grade that will not come
- [x] 2.5 Unit-test in `useQuizState.test.ts`: each normalisation rule (case, surrounding + internal whitespace, curly apostrophe, trailing punctuation); a misspelling (`werkde` vs `werkte`) is incorrect; a second entry in `acceptedAnswers` matches; a `shortText` deck completes and scores without any self-grade

## 3. Quiz UI

- [x] 3.1 In `AnswerPicker.tsx`, render a single-line `<input type="text">` for `shortText` with `autoCapitalize="off"`, `autoCorrect="off"`, `spellCheck={false}`, disabled once submitted, labelled like the existing free-text control
- [x] 3.2 In `FeedbackPanel.tsx`, show the correct/incorrect verdict plus `explanation` for `shortText`, and reveal `acceptedAnswers[0]` as the expected answer when the answer was wrong
- [x] 3.3 Ensure the ✓ / ✗ self-grade controls do NOT render for `shortText` — they belong to `freeText` only
- [x] 3.4 Style the input to match the existing `.answerInput` textarea; verify it does not overflow its container at 390px (the stylesheet is now `border-box`, so `width: 100%` is safe)

## 4. Content conversion

- [x] 4.1 Convert these 23 NL3 questions from `single` to `shortText`, keeping their ids, prompts and explanations, setting `acceptedAnswers` from the former correct option, and clearing `options`/`correctOptionIds`:
      **zou/zullen (H1)** q-2, q-17, q-18, q-19, q-20, q-21, q-23 ·
      **imperfectum (H2)** q-27, q-28, q-29, q-30, q-33, q-34, q-35, q-36 ·
      **relatief pronomen (H4)** q-54, q-55, q-56, q-57, q-58 ·
      **bijzin & inversie (H3/H5)** q-43, q-46, q-66
- [x] 4.2 Where a variant is genuinely correct, add it to `acceptedAnswers` (e.g. q-19 `Zullen` and q-23 `zullen` are case-insensitive already; q-43 accepts only `gaat ze`, not `ze gaat`, since word order is the point of the question)
- [x] 4.3 Leave as `single` the gap fills where the exercise is choosing between candidate *words* rather than producing a *form* — q-7, q-12, q-47, q-48, q-49, q-68, q-69, q-71, q-79 — and note that decision in `content/dutch/README.md`
- [x] 4.4 Re-run `answerDistribution.test.ts`; conversion removes 23 questions from the `single` population, and a pre-check showed every topic still within the ≤2 spread, so no re-balancing is expected — if that changes, reorder remaining options rather than weakening the test

## 5. Verify

- [x] 5.1 Run `npx vitest run` and `npx tsc --noEmit` — all green, no regressions to DP-750
- [x] 5.2 Drive the app through the Playwright MCP (project convention; do not run `playwright install` or the local `tests/` specs): a `shortText` question renders an input, a correct answer with different case/spacing is marked correct, a misspelling is marked incorrect and reveals the expected answer, no ✓/✗ controls appear, and the deck reaches the score screen
- [x] 5.3 Check the same at 390px for overflow and that the on-screen keyboard does not obscure the submit control
- [x] 5.4 Update `content/dutch/README.md` with the new question-type table entry and the counts
