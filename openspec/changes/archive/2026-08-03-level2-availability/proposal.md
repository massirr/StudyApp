## Why

"Level 2" is not stored in the content model — it is inferred entirely from `!!q.codeSnippet`
(`src/data/subjects/index.ts:26`). That conflates *tier* with *contains a code block*, so the app
cannot tell "this topic has no tier 2" from "this topic has no code".

`TopicPage.tsx:91` already guards for this (`level2Count > 0 && …`). The quiz score screen in
`QuizPage.tsx` does not, so it offers a Level-2 call-to-action for topics that have zero Level-2
questions. The link leads to *"No quiz questions are available for this selection yet."*

This is a live bug, not a hypothetical: DP-750's `case-study-lakehouse` topic has 0 code questions,
so passing it at ≥70% already produces the dead end. The new Dutch subject (no code questions at
all) makes it reproducible on every topic.

## What Changes

- Gate the score screen's Level-2 CTA **and** its "Score 70% or higher…" hint on the topic actually
  having Level-2 questions, matching the guard `TopicPage` already uses.
- No schema change, no content change, no change to how Level 2 is defined.
- `markLevel2Unlocked` still records the unlock when the learner passes — the progress data stays
  truthful; only the dead-end link is suppressed.

Out of scope (explicitly): introducing a real tier field, per-subject Level-2 labels (the CTA text
"Code Questions" is wrong for non-code subjects), and giving Dutch a Level 2. Those wait until a
subject actually needs a non-code second tier — the unused `QuizQuestion.level` field is the
upgrade path.

## Capabilities

### Modified Capabilities
- `quiz-flow`: the post-quiz score screen surfaces a Level-2 entry point only when the topic has at
  least one Level-2 question.

## Impact

- `src/components/quiz/QuizPage.tsx` — one derived value feeding the existing `showLevel2Cta`.
- No types, no storage shape, no persisted-data migration.
