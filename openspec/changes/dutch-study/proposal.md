## Why

The user sits a Dutch language exam in August and fails most on **producing written Dutch**, which the current app cannot drill — quizzes are multiple-choice only, with no reading passages, no audio, and no free-text answering. Adding a Dutch subject plus these practice modes turns the app into real exam prep for that test.

## What Changes

- Add a new **Dutch subject** (`src/data/subjects/dutch.json`, `sourcePolicy: 'any'`), authored from source material the user drops in `content/dutch/`.
- Add a **free-text question type** where the learner types a Dutch answer, then **self-grades** against a revealed model answer (✓/✗). The self-grade result feeds the existing ≥70% Level-2 unlock, exactly like a scored MCQ.
- Add optional **per-topic reading passages** and **per-topic audio clips**, both rendered above that topic's questions. Audio uses the native `<audio controls>` element (no library); files live in `public/audio/dutch/`.
- All new question/topic fields are **optional and additive** — existing `dp-750.json`, the subject schema, and current tests remain valid and untouched.

Out of scope (explicitly): NotebookLM MCP integration, updating the StudyApp MCP schema to author the new fields, automatic grading of Dutch text, and any backend / runtime audio generation.

## Capabilities

### New Capabilities
- `free-text-questions`: A `freeText` question type with a self-grade flow — learner types an answer, reveals the model answer (`sampleAnswer`) and explanation, marks self ✓/✗, and that result counts toward the topic's Level-1 score and Level-2 unlock.
- `topic-media`: Optional per-topic study media — a reading `passage` (title + text) and an `audio` clip (source + title) rendered above the topic's questions; audio via a native HTML player.

### Modified Capabilities
- `subject-content-model`: `Topic` gains optional `passage` and `audio` fields; `QuizQuestion.type` gains `'freeText'` plus an optional `sampleAnswer` field. All additive/optional.
- `quiz-flow`: The answering flow renders a topic's passage/audio above its questions and supports the free-text self-grade path in scoring and Level-2 unlocking.

## Impact

- **Types**: `src/types/quiz.ts` (`QuizQuestionType`, `QuizQuestion.sampleAnswer`), `src/types/study.ts` (`Topic.passage`, `Topic.audio`).
- **Validation**: `src/data/subjects/schema.ts` (accept new optional fields; keep existing tests green).
- **Quiz UI**: `src/components/quiz/` — `QuizPage`, `QuestionDisplay`, `AnswerPicker` (free-text input + self-grade), plus passage/audio rendering; `useQuizState` scoring for self-grade.
- **Content**: new `src/data/subjects/dutch.json`; new `public/audio/dutch/` for mp3s; transient `content/dutch/` source files.
- **Durability caveat**: self-grade results persist to `localStorage` and remain subject to Safari ITP eviction — no worse than existing progress; the backup/restore or cloud-sync fix is tracked separately.
- No backend, no new runtime dependencies.
