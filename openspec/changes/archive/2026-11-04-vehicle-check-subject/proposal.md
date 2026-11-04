## Why

The user sits the Belgian category-B practical exam at AIBV Asse-Mollem on 2026-11-11. The exam opens with the **voorafgaande controles** (preliminary vehicle checks), spoken in Dutch and translated by a sworn interpreter. The user needs to recognise the Dutch terms and the correct procedure for each check, in both Dutch and English, with pictures, before that day.

## What Changes

- Add a **Vehicle Check subject** (`src/data/subjects/vehicle-check.json`, `sourcePolicy: 'any'`) with five topics: the exam-day procedure, setup and precautions, lights and controls (the "systematic" checks), tyres and fluids (the "random" check), and dashboard warning lights (bonus).
- Questions are **bilingual** (Dutch examiner phrasing first, English in parentheses) and mix `single`, `multiple`, `shortText` (type the Dutch word) and `freeText` (explain the check aloud, self-graded).
- Add **original SVG diagrams** under `public/images/vehicle-check/` (front lights, rear lights, engine bay, oil dipstick levels, tyre tread, control symbols, warning lights) and attach them to questions through the existing optional `image` field.
- Add `content/vehicle-check/exam-procedure.md`: the researched source notes the questions are authored from.
- Add a content test that every referenced image exists on disk and every question resolves to a topic.

Out of scope: any change to the quiz engine, the subject schema, or the StudyApp MCP server (its `add_question` tool does not expose `image`, `freeText` or `shortText`, and its GitHub token currently returns 401; authoring is done directly in the repo instead).

## Capabilities

### New Capabilities
- `vehicle-check-subject`: A bilingual NL/EN subject covering the Flemish practical-exam vehicle checks, grounded in the official GOCA/Flemish sources, with illustrative images.

### Modified Capabilities
None. `question-images`, `short-text-questions` and `subject-content-model` are used as already specified.

## Impact

- **Content**: new `src/data/subjects/vehicle-check.json`, `public/images/vehicle-check/*.svg`, `content/vehicle-check/exam-procedure.md`.
- **Tests**: new `src/data/subjects/vehicle-check.test.ts`; the existing answer-distribution and schema tests apply to the new subject automatically (the subject loader globs `*.json`).
- No runtime dependencies, no schema changes, no backend.
