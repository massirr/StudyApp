## 1. Types & schema (additive, backward-compatible)

- [x] 1.1 In `src/types/quiz.ts`, add `'freeText'` to `QuizQuestionType` and add optional `sampleAnswer?: string` to `QuizQuestion`
- [x] 1.2 In `src/types/study.ts`, add optional `passage?: { title?: string; text: string }` and `audio?: { src: string; title?: string }` to `Topic`
- [x] 1.3 In `src/data/subjects/schema.ts`, validate the new optional fields only when present (freeText requires `sampleAnswer`; passage requires `text`; audio requires `src`); leave existing paths untouched
- [x] 1.4 Extend `schema.test.ts`: existing DP-750 still validates; a freeText question validates; a topic with passage+audio validates; a freeText missing `sampleAnswer` is rejected

## 2. Quiz engine — free-text self-grade

- [x] 2.1 In `src/hooks/useQuizState.ts`, treat a free-text question as answered via a self-grade signal (✓/✗) instead of option matching; feed that result into `correctCount` and `isComplete` exactly like an MCQ
- [x] 2.2 Ensure submit is gated on non-empty text for free-text (mirrors empty-selection gating), and option-selection rules are skipped for free-text
- [x] 2.3 Unit-test `useQuizState`: a free-text deck completes; ✓ increments score, ✗ does not; a mixed MCQ+free-text deck at ≥70% self-grade reports the passing percentage

## 3. Quiz UI

- [x] 3.1 In `AnswerPicker.tsx`, render a text input for free-text questions instead of option buttons
- [x] 3.2 In `FeedbackPanel.tsx` (or `QuestionDisplay`), on submit reveal the learner's text next to `sampleAnswer` + explanation, with ✓ "I got it right" / ✗ "Missed it" self-grade controls wired to the engine
- [x] 3.3 Render `topic.passage` (title + text) above the question deck in `QuizPage.tsx` when present
- [x] 3.4 Render a native `<audio controls src={topic.audio.src}>` (with optional title) above the deck when `topic.audio` is present; nothing when absent
- [x] 3.5 Confirm `QuizPage` completion + `markLevel2Unlocked` path works unchanged when the deck contains free-text questions

## 4. Dutch content (vertical slice, then expand)

- [x] 4.1 Read the source files the user drops in `content/dutch/` and draft `src/data/subjects/dutch.json` (`sourcePolicy: 'any'`) with one topic end-to-end: passage + a couple of MCQs + at least one free-text question
- [x] 4.2 Register/verify the Dutch subject loads via `src/data/subjects/index.ts` and appears on the subject picker
- [x] 4.3 (Audio) Wire `audio.src` to an mp3 placeholder under `public/audio/dutch/`; user replaces it with the NotebookLM download
- [x] 4.4 Expand `dutch.json` with the remaining topics/questions once the slice is validated
      — `yb1398.json` now carries 82 questions (55 single / 9 multiple / 18 freeText) across all
      seven topics, plus reading passages on H2 and H6. Authored from `content/dutch/cursus-nl3/`
      (the course PDF converted to markdown) and `content/dutch/retake-2025-2026.md`; every
      question maps to a task on the Aug 2026 retake.

## 5. Verify

- [x] 5.1 Run unit tests (Vitest) — 98/98 green, no regressions to DP-750; `tsc --noEmit` clean.
      Browser verification is done through the Playwright MCP by project convention — the `tests/`
      specs are for CI, and local Chromium is deliberately not installed. Verified via the MCP:
      passage renders on H2, single/multiple/freeText all render, free-text self-grade ✓ scored
      the H0 deck 4/4 = 100% and marked the topic complete.
- [x] 5.2 Drive the Dutch quiz end-to-end (passage shows, audio plays, free-text self-grade ✓/✗ scores, ≥70% unlocks Level 2) and confirm behavior in the running app
