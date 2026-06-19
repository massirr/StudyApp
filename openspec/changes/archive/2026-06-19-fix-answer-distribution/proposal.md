## Why

The current MCQ question bank has a severe skew in which option letter holds the correct answer: 37 single-correct questions point to option A, 9 to B, 9 to C, and 7 to D. A test-savvy user can exploit this pattern to score above chance without reading the question, and the imbalance undermines the app's exam-preparation value.

## What Changes

- Rotate option arrays for single-correct single-select questions so that correct answers are distributed roughly evenly across A, B, C, and D within each topic.
- Multi-select questions are excluded (their "correct" answers are a set, not a single letter, so positional bias is less meaningful).
- No question content changes — only the order in which options appear is adjusted.
- No scoring, persistence, or UI logic changes.

## Capabilities

### New Capabilities
- `answer-distribution-policy`: Defines the requirement that correct answers must be balanced across A/B/C/D within each topic and how that balance is maintained when questions are added.

### Modified Capabilities
- `quiz-flow`: Add requirement that the question bank maintains balanced correct-answer distribution across option positions.

## Impact

- `src/data/questions.ts`: option arrays reordered for affected single-select questions; `correctOptionIds` updated to match new positions.
- No changes to types, components, hooks, or build pipeline.
