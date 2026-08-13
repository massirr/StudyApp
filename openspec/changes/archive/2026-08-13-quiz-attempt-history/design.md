## Context

Completion today is a boolean. `QuizPage`'s completion effect calls `markTopicComplete(topic.id)` and, above 70%, `markLevel2Unlocked`. The percentage itself is computed inline on the score screen with `scorePercent(correctCount, total)` and never leaves the component. Separately, `useQuizState` persists `{index, completedQuestionIds, correctQuestionIds}` while a deck is in progress and **removes** that key on finish — deliberately, since it exists to resume an interrupted quiz, not to keep a record.

`SubjectProgress` currently holds `completedTopicIds`, `completedSubtopicIds`, `lastVisitedTopicSlug` and `level2UnlockedTopicIds`. `migrate()` passes any `version: 2` payload straight through.

The exam is 19–20 August, so this needs to be small, additive, and impossible to break existing progress.

## Goals / Non-Goals

**Goals:**
- Know whether a chapter is improving, from inside the app, in one glance.
- Never lose or corrupt existing progress — someone mid-revision must not have their completion state reset by this change.
- Bounded storage. localStorage is small and shared across the origin.
- Pure, unit-testable storage logic, matching how `progressStorage` is already tested.

**Non-Goals:**
- Per-question history. Knowing *which* imperfectum forms you keep missing would be more useful than a percentage, but it is a much larger payload and a different feature.
- Charts. A list of dated percentages and a delta answers the question; a plotting library does not earn its bundle size here.
- Sync or export.

## Decisions

### Extend `SubjectProgress` with an optional field, do not bump to v3
`attempts?: Record<string, QuizAttempt[]>`, keyed by topic id.

*Why:* `migrate()` returns any `version: 2` payload untouched, so an optional field needs no migration code and no new branch — existing stored progress keeps working by construction, and a rollback leaves the extra field sitting harmlessly in storage. A v3 bump would mean writing and testing a migration path for a field that can simply be absent.

*Alternative considered:* a separate `studyapp_attempts` localStorage key. Rejected — two keys can disagree, and `resetProgressState` would need to remember to clear both. One key means reset is already correct.

### Key by topic id, not topic slug
*Why:* `completedTopicIds` and `level2UnlockedTopicIds` already key by id, and slugs are content that could be renamed. Ids are stable.

### Cap at 20 attempts per topic, dropping oldest
*Why:* seven topics × 20 attempts × ~60 bytes is roughly 8 KB — negligible against a ~5 MB budget, while an uncapped list grows every time someone drills a deck. 20 is enough to see a trend over a revision period. The cap is applied at write time so the stored payload is always already bounded.

### Record in the existing completion effect, not on unmount or navigation
*Why:* `QuizPage` already has one `useEffect` keyed on `isComplete` that fires exactly once per finished deck and is the same place `markTopicComplete` lives. Anything unmount-based would fire on navigation too and record phantom attempts.

*Risk this creates:* React StrictMode double-invokes effects in development, which would record two attempts per finish. The recorder must therefore be idempotent per finish — see below.

### Idempotency by timestamp-and-shape, not by a flag
`recordAttempt` ignores a write whose topic, correct count and total match the most recent attempt for that topic within a short window.

*Why:* the alternative — a `hasRecorded` ref in the component — protects only that one component instance and silently fails if the effect is ever restructured. Making the storage helper itself refuse an exact duplicate keeps the guarantee where the data lives, and is directly unit-testable without a DOM.

### Store both the raw counts and the percentage
*Why:* the percentage is what gets displayed and compared, and recomputing it everywhere invites drift if `scorePercent`'s rounding ever changes. Keeping `correct`/`total` alongside means a future feature (say, weighting by deck length) still has the underlying numbers.

### Timestamp as an ISO string
*Why:* human-readable in devtools, sorts lexicographically, and survives `JSON.stringify` round-tripping unchanged — `Date` objects do not.

## Risks / Trade-offs

- **Existing progress is corrupted by the change** → the field is optional and additive, `migrate` is untouched for v2 payloads, and a round-trip test asserts a payload *without* `attempts` still loads. The module already wraps loading in try/catch and falls back to a default state.
- **A malformed `attempts` value throws during load and wipes progress** → reads go through a defensive selector that returns `[]` for anything that is not an array of well-shaped records, so bad data degrades to "no history" rather than a reset.
- **StrictMode double-records in development** → the duplicate guard above; the unit test covers a repeated identical write.
- **The learner games the number by retaking until it is green** → not worth defending against. It is a personal study tool, and re-drilling a deck is the desired behaviour, not cheating.
- **A topic's question count changes between attempts** (content edits are frequent in this repo) → storing `correct`/`total` means an old attempt stays interpretable; the percentage remains comparable even when the denominator moved.

## Migration Plan

Purely additive. Deploy is a normal push; no data migration runs. Rollback is a revert of the code — stored `attempts` data is then simply ignored by the older build and is picked up again if the change is re-applied.

## Open Questions

- Should the dashboard's best-score badge be colour-coded against the 70% Level-2 threshold, reusing `--positive` / `--negative`? Deferred until the panel exists and can be looked at; the spec only requires the number.
