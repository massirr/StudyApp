## Why

You can take a quiz and see a score, then it is gone. The score screen computes `scorePercent(correctCount, total)` for display and throws it away; on completion `QuizPage` records only `markTopicComplete(topic.id)` and possibly `markLevel2Unlocked`, and `useQuizState` *deletes* its localStorage key once the deck is finished. Nothing anywhere stores what you scored.

So a topic is either "complete" or not. There is no way to answer the questions that actually matter when revising: *am I getting better at the imperfectum? which chapter is still weakest? did I pass H3 last time or scrape it?* With the retake on 19–20 August, knowing which chapters are improving is what decides where the remaining days go.

## What Changes

- Record every **finished** attempt: which topic, when, how many correct out of how many, and the percentage.
- Store attempts under the existing per-subject progress in localStorage, as an optional field, so no migration and no version bump — a `SubjectProgress` without attempts stays valid.
- Cap history per topic (keep the most recent 20 attempts) so the payload cannot grow without bound.
- **Topic page**: an "Attempts" panel showing best score, latest score, number of attempts, and the recent attempts with date and score.
- **Dashboard**: each topic shows its best score so far, so the weakest chapter is visible without opening anything.
- **Score screen**: after finishing, show how this attempt compares to the previous one ("+15% since last time", or "first attempt").
- Attempts are recorded for a completed deck only — abandoning mid-deck records nothing, matching how completion already works.
- Resetting progress clears attempt history along with everything else.

## Capabilities

### New Capabilities
- `quiz-attempt-history`: Recording a score per finished quiz attempt, retaining a bounded per-topic history, and surfacing best/latest/trend on the topic page, the dashboard and the score screen.

### Modified Capabilities
- `localstorage-progress`: `SubjectProgress` gains an optional `attempts` map keyed by topic id; the v2 payload shape is extended additively, and `migrate` continues to pass v2 through unchanged. Reset clears attempts.

## Impact

- **Types**: `src/types/study.ts` — a `QuizAttempt` interface and `attempts?: Record<string, QuizAttempt[]>` on `SubjectProgress`.
- **Storage**: `src/utils/progressStorage.ts` — record/read helpers, the 20-per-topic cap, and defensive parsing so a malformed `attempts` value cannot break loading (the module already swallows corrupt payloads).
- **Hook**: `src/hooks/useProgress.ts` — a `recordAttempt` action plus selectors for best/latest.
- **Quiz**: `src/components/quiz/QuizPage.tsx` — call `recordAttempt` in the same completion effect that already calls `markTopicComplete`; show the delta on the score screen.
- **Pages**: `TopicPage.tsx` (attempts panel) and the dashboard (best score per topic).
- **Tests**: storage helpers and the cap are pure and unit-tested; `progressStorage.test.ts` already exists.
- **No impact** on question content, the quiz engine, or DP-750 beyond gaining the same feature.

## Non-Goals

- No per-question history (which specific questions were missed). Useful, but a much bigger payload and a separate change.
- No charts or graphs — a compact list and a delta, nothing that needs a plotting library.
- No cross-device sync; this stays in localStorage, per the v1 non-goals in `CLAUDE.md`.
