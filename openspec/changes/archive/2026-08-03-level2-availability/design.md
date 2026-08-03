## Context

Level 2 has no representation in the content model; `getCodeSnippetQuestionsForTopic` derives it
from `!!q.codeSnippet`. `TopicPage.tsx` already computes `level2Count` and hides its Level-2
section when the count is zero; `QuizPage.tsx`'s score screen does not.

## Decisions

- **Reuse the existing guard rather than invent one.** Compute availability with the same
  `getCodeSnippetQuestionsForTopic(...).length > 0` check `TopicPage` uses, and fold it into the
  existing `showLevel2Cta` boolean. One screen becomes consistent with the other; no new concept.
- **Do not change what "Level 2" means.** Introducing a real tier field (the unused
  `QuizQuestion.level`) would fix the conflation properly, but nothing needs it yet — no subject
  has a non-code second tier. Deferred until one does.
- **Keep recording the unlock.** Gating the CTA is a presentation concern; suppressing the progress
  write would lose a fact the learner earned and would silently change behaviour if Level-2 content
  is added to that topic later.

## Risks / Trade-offs

- The CTA label remains hardcoded "Try Level 2: Code Questions →", which is wrong for any future
  non-code subject. Acceptable while Level 2 *is* code-only by definition; revisit with the tier
  field.

## Migration Plan

Presentation-only. No data migration, no persisted-shape change. Rollback is reverting the change.
