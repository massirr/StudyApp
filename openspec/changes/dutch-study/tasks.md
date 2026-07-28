## 1. Types & schema (additive, backward-compatible)

- [ ] 1.1 In `src/types/quiz.ts`, add `'freeText'` to `QuizQuestionType` and add optional `sampleAnswer?: string` to `QuizQuestion`
- [ ] 1.2 In `src/types/study.ts`, add optional `passage?: { title?: string; text: string }` and `audio?: { src: string; title?: string }` to `Topic`
- [ ] 1.3 In `src/data/subjects/schema.ts`, validate the new optional fields only when present (freeText requires `sampleAnswer`; passage requires `text`; audio requires `src`); leave existing paths untouched
- [ ] 1.4 Extend `schema.test.ts`: existing DP-750 still validates; a freeText question validates; a topic with passage+audio validates; a freeText missing `sampleAnswer` is rejected

## 2. Quiz engine — free-text self-grade

- [ ] 2.1 In `src/hooks/useQuizState.ts`, treat a free-text question as answered via a self-grade signal (✓/✗) instead of option matching; feed that result into `correctCount` and `isComplete` exactly like an MCQ
- [ ] 2.2 Ensure submit is gated on non-empty text for free-text (mirrors empty-selection gating), and option-selection rules are skipped for free-text
- [ ] 2.3 Unit-test `useQuizState`: a free-text deck completes; ✓ increments score, ✗ does not; a mixed MCQ+free-text deck at ≥70% self-grade reports the passing percentage

## 3. Quiz UI

- [ ] 3.1 In `AnswerPicker.tsx`, render a text input for free-text questions instead of option buttons
- [ ] 3.2 In `FeedbackPanel.tsx` (or `QuestionDisplay`), on submit reveal the learner's text next to `sampleAnswer` + explanation, with ✓ "I got it right" / ✗ "Missed it" self-grade controls wired to the engine
- [ ] 3.3 Render `topic.passage` (title + text) above the question deck in `QuizPage.tsx` when present
- [ ] 3.4 Render a native `<audio controls src={topic.audio.src}>` (with optional title) above the deck when `topic.audio` is present; nothing when absent
- [ ] 3.5 Confirm `QuizPage` completion + `markLevel2Unlocked` path works unchanged when the deck contains free-text questions

## 4. Dutch content (vertical slice, then expand)

- [ ] 4.1 Read the source files the user drops in `content/dutch/` and draft `src/data/subjects/dutch.json` (`sourcePolicy: 'any'`) with one topic end-to-end: passage + a couple of MCQs + at least one free-text question
- [ ] 4.2 Register/verify the Dutch subject loads via `src/data/subjects/index.ts` and appears on the subject picker
- [ ] 4.3 (Audio) Wire `audio.src` to an mp3 placeholder under `public/audio/dutch/`; user replaces it with the NotebookLM download
- [ ] 4.4 Expand `dutch.json` with the remaining topics/questions once the slice is validated

## 5. Verify

- [ ] 5.1 Run unit tests (Vitest) and existing E2E (Playwright) — all green, no regressions to DP-750
- [ ] 5.2 Drive the Dutch quiz end-to-end (passage shows, audio plays, free-text self-grade ✓/✗ scores, ≥70% unlocks Level 2) and confirm behavior in the running app
