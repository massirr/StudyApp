## 1. Types & storage

- [x] 1.1 In `src/types/study.ts`, add `QuizAttempt { finishedAt: string; correct: number; total: number; percent: number }` and `attempts?: Record<string, QuizAttempt[]>` on `SubjectProgress`
- [x] 1.2 In `src/utils/progressStorage.ts`, add `readAttempts(progress, topicId): QuizAttempt[]` returning `[]` for a missing, non-array or malformed value (defensive — bad data must never throw during load)
- [x] 1.3 Add `appendAttempt(progress, topicId, attempt): SubjectProgress` applying the 20-per-topic cap (drop oldest) and refusing an exact duplicate of the most recent attempt for that topic (StrictMode double-invoke guard)
- [x] 1.4 Add `bestAttempt` / `latestAttempt` selectors
- [x] 1.5 Confirm `resetProgressState` clears attempts (it rebuilds the whole state, so verify rather than change)
- [x] 1.6 Extend `progressStorage.test.ts`: a v2 payload without `attempts` still loads; attempts round-trip through save/load; the cap drops the oldest at 21; a duplicate write is ignored; malformed `attempts` reads as `[]`; migration stays idempotent

## 2. Hook

- [x] 2.1 In `src/hooks/useProgress.ts`, add `recordAttempt(topicId, correct, total)` writing through `appendAttempt` with an ISO `finishedAt` and `scorePercent`
- [x] 2.2 Expose `attemptsFor(topicId)`, `bestFor(topicId)`, `latestFor(topicId)` for the pages to read

## 3. Quiz completion

- [x] 3.1 In `QuizPage.tsx`, capture the previous latest attempt *before* recording (needed for the delta), then call `recordAttempt` inside the existing `isComplete` effect alongside `markTopicComplete`
- [x] 3.2 On the score screen, show the comparison: improvement/decline versus the previous attempt, or a first-attempt note when there is none
- [x] 3.3 Verify Retake Quiz produces a second attempt rather than overwriting the first

## 4. Pages

- [x] 4.1 `TopicPage.tsx`: an attempts panel with best %, latest %, attempt count, and the recent attempts as date + score; render nothing when the topic has no attempts
- [x] 4.2 Dashboard: show best % per attempted topic, nothing for unattempted ones
- [x] 4.3 Style both with the existing card/shadow patterns; no new dependencies, no charts

## 5. Verify

- [x] 5.1 `npx vitest run` and `npx tsc --noEmit` green, no regressions to DP-750
- [x] 5.2 Drive through the Playwright MCP (project convention — do not run `playwright install` or the `tests/` specs): finish a deck, confirm one attempt appears; retake and confirm two; reload and confirm they persist; check the dashboard best score
- [x] 5.3 Confirm an in-progress deck that is abandoned records nothing
- [x] 5.4 Check the topic page and dashboard at 390px for overflow
- [x] 5.5 Inspect `localStorage.studyapp_progress` to confirm the payload is still `version: 2` and existing completion state is intact
