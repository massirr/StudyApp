## Why

The NL3 written retake asks the learner to **produce** Dutch forms, not recognise them: "Vul de goede vorm van 'zouden' of 'zullen' in", "zet het verbum in het imperfectum", "kies het juiste relatief pronomen". Those exercises are currently modelled as `single`-select multiple choice, which only tests recognition — seeing `werkte` among four options is far easier than writing it cold, and the distractors give the answer away.

The existing `freeText` type lets the learner type, but it is deliberately self-graded: the app reveals a model answer and the learner marks themselves ✓/✗. That is correct for open-ended answers with many valid phrasings ("combineer deze twee zinnen"), but it is the wrong tool for a one-word gap fill. For `zou` there is exactly one right answer, self-grading adds a pointless step, and a tired learner marks themselves generously.

What is missing is the middle case: a short, typed answer that the app can check itself.

## What Changes

- Add a question `type` of `shortText`: the learner types into a single-line text input and the app grades the answer automatically, with no self-grade step.
- Add `acceptedAnswers: string[]` to `QuizQuestion`, required for `shortText`. Multiple entries allow legitimate variants (e.g. `zou` / `zou graag`, or a form accepted with and without a trailing period).
- Compare typed input against `acceptedAnswers` after normalising case, surrounding and repeated whitespace, common apostrophe/quote variants, and trailing punctuation — so `Zou`, ` zou `, and `zou.` all match `zou`.
- Feedback reuses the existing correct/incorrect panel: the verdict, the accepted answer, and the existing `explanation`. No new feedback surface.
- A `shortText` result feeds the topic score and the ≥70% Level-2 unlock exactly as an MCQ does.
- Convert the NL3 grammar gap-fill questions — the `zou`/`zullen`, imperfectum, and relatief-pronomen items whose prompt contains a literal `____` blank and has one unambiguous answer — from `single` to `shortText`. Conceptual and vocabulary questions ("Welke zin drukt een WENS uit?") stay multiple choice.
- **Not** a replacement for `freeText`. Both types remain: `freeText` for open-ended production with self-grade, `shortText` for a checkable gap fill.

## Capabilities

### New Capabilities
- `short-text-questions`: A `shortText` question type whose typed answer is auto-checked against a set of accepted answers using a defined normalisation, producing a correct/incorrect verdict without learner self-assessment, and feeding scoring and the Level-2 unlock.

### Modified Capabilities
- `subject-content-model`: `QuizQuestion.type` gains `'shortText'`; `QuizQuestion` gains an optional `acceptedAnswers: string[]` that is required when the type is `shortText`; `validateSubject` rejects a `shortText` question with a missing or empty `acceptedAnswers`. A `shortText` question MAY omit `options` and `correctOptionIds`.

## Impact

- **Types**: `src/types/quiz.ts` — `QuizQuestionType` union, `acceptedAnswers?: string[]`.
- **Validation**: `src/data/subjects/schema.ts` — presence check for `shortText`, mirroring the existing `freeText`/`sampleAnswer` check.
- **Engine**: `src/hooks/useQuizState.ts` — submit gating on non-empty text (the `freeText` branch already does this) and a grading branch that compares normalised text instead of option ids or a self-grade.
- **UI**: `src/components/quiz/AnswerPicker.tsx` renders a single-line input for `shortText`; `FeedbackPanel.tsx` shows the verdict plus the accepted answer, and must **not** render the ✓/✗ self-grade controls for this type.
- **Content**: `src/data/subjects/yb1398.json` — the converted gap-fill questions.
- **Tests**: normalisation and grading are pure functions and get unit tests; `answerDistribution.test.ts` only covers `single` questions, so converting questions removes them from that policy's population and each affected topic's A/B/C/D spread must be re-verified.
- **No impact** on DP-750, whose questions remain `single`/`multiple`.
- **Dependency**: the `freeText` type this builds beside was introduced by the `dutch-study` change, which is implemented but not yet archived, so its deltas are not in `openspec/specs/` yet.
