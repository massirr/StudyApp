## Context

The quiz engine already has three question types. `single` and `multiple` are auto-graded by matching selected option ids against `correctOptionIds` (`gradeQuestion` in `src/hooks/useQuizState.ts`). `freeText` is deliberately **not** auto-graded: `gradeQuestion` returns the learner's `selfGrade`, and `design.md` for the `dutch-study` change states the typed text is never compared against `sampleAnswer`. That decision was right for open-ended answers, where many phrasings are correct and a string comparison would mark good Dutch wrong.

The NL3 written retake, however, is dominated by gap fills with exactly one right answer: fill in `zouden`/`zullen`, put the verb in the imperfectum, choose the relative pronoun. Modelling those as MCQs tests recognition only, and the distractors leak the answer. Modelling them as `freeText` makes the learner grade a one-word answer against a one-word model answer, which is busywork and invites generous self-marking.

The exam is close, so the change must be additive and must not disturb DP-750 or the existing NL3 decks.

## Goals / Non-Goals

**Goals:**
- A typed-answer question the app grades itself, with no self-grade step.
- Forgiving on presentation (case, whitespace, apostrophe style, trailing punctuation), strict on spelling — a misspelt Dutch verb form must be marked wrong, because that is what the exam does.
- Additive: existing types, content, progress data and the DP-750 subject are untouched.
- Grading logic testable without a DOM, matching how `useQuizState` is already tested.

**Non-Goals:**
- Replacing `freeText`. Open-ended production questions keep self-grading.
- Fuzzy matching, edit distance, stemming, or "nearly right" partial credit. A near miss on a verb form is a wrong answer on this exam, and a fuzzy grader that accepts `werkde` actively teaches the wrong thing.
- Inline blanks rendered inside the sentence. The blank stays as `____` in the prompt text with a separate input below it; a true inline-input renderer is a presentation change that can come later without touching grading.
- Accent-insensitive matching or auto-correct.

## Decisions

### Grade by exact match on a normalised string, not fuzzy matching
Normalise both sides, then require equality against any entry in `acceptedAnswers`.

*Why:* the answers are short and closed. The risk to guard against is not "the learner phrased it differently" but "the learner typed `Zou ` with a capital and a trailing space", which is a presentation difference, not a knowledge difference. Content authors handle genuine variants explicitly by adding entries to `acceptedAnswers`, which keeps the judgement with the person writing the question rather than in a similarity threshold.

*Alternative considered:* Levenshtein distance ≤ 1. Rejected — `werkte`/`werkde` and `zou`/`zal` differ by one character and are exactly the confusions being drilled. A tolerant grader would mark the core mistakes correct.

### Normalisation is a small, explicitly enumerated set of transformations
Trim, collapse internal whitespace, lowercase, unify curly apostrophes/quotes to straight, strip trailing sentence punctuation. Nothing else.

*Why:* every rule maps to a difference that is certainly not a Dutch error. Dutch answers in this course contain apostrophes (`'s morgens`) and mobile keyboards produce `’` by default, so without the apostrophe rule a correct answer would be marked wrong on a phone — the very device this is studied on. Accents are left alone deliberately: they carry meaning in Dutch spelling.

*Alternative considered:* stripping all punctuation. Rejected — it would erase the apostrophe in `'s morgens` on both sides and quietly accept `s morgens`.

### `acceptedAnswers: string[]`, always an array
Even a single answer is a one-element array.

*Why:* one shape to validate and one code path to grade. A `string | string[]` union would push a type check into both the validator and the grader for no gain.

### Grading stays a pure function in `useQuizState.ts`
Add `normalizeAnswer` and extend `gradeQuestion` with a `shortText` branch, alongside the existing `isSelectionCorrect`. Both exported.

*Why:* `useQuizState.test.ts` runs in the `node` environment and already tests these rules directly without a DOM. The normalisation table is exactly the kind of thing that deserves cheap unit tests, and this keeps them cheap.

### `gradeQuestion` needs the typed text
Its current signature is `(question, selectedOptionIds, selfGrade)`. `shortText` needs the answer text, which the hook already holds as `answerText`.

*Why the chosen shape:* add `answerText` as a parameter rather than reading component state, so the function stays pure. `freeText` continues to return `selfGrade`; `shortText` returns a boolean from the comparison, so it is never `null` and never "awaiting self-grade".

### `awaitingSelfGrade` must exclude `shortText`
The hook currently derives `awaitingSelfGrade` from `isFreeText && submitted && selfGrade === null`. That check is already keyed to `freeText` specifically, so `shortText` is excluded by construction — but the UI must not fall into a generic "is typed input → show ✓/✗" branch.

*Why it matters:* if the self-grade controls rendered for `shortText`, the learner could override the app's verdict, and `Finish Quiz` would stay gated waiting for input that conceptually does not exist.

### Convert only unambiguous gap fills
A question is a conversion candidate only if its prompt contains a literal `____` blank and its correct option is a short form with no plausible alternative phrasing. Conceptual questions ("Welke zin drukt een WENS uit?", "Welk voegwoord is ONDERSCHIKKEND?") stay `single`.

*Why:* a `shortText` question whose answer is a whole sentence would be graded by exact match and would fail constantly. That is the `freeText` case.

### Re-verify the answer-distribution policy after conversion
`answerDistribution.test.ts` only counts `single` questions with exactly one correct option. Removing questions from a topic changes that topic's A/B/C/D counts.

*Why it needs stating:* the policy has regressed silently once before. Conversion could push a topic's spread over 2 without anyone touching an option order, and the fix is to re-balance the remaining `single` questions, not to weaken the test.

## Risks / Trade-offs

- **A correct answer is marked wrong over a character the normaliser does not cover** (e.g. a non-breaking space pasted from the course PDF, or a different Unicode apostrophe) → normalisation collapses all Unicode whitespace, not just ASCII spaces, and maps the common curly quote characters. The feedback always shows the expected answer, so a false negative is visible and self-correcting rather than mysterious.
- **Authors forget `acceptedAnswers` and ship a broken question** → `validateSubject` rejects a `shortText` question without a non-empty `acceptedAnswers`, and subjects are validated at load, so the failure is immediate and names the question id.
- **Typing on a phone is slower than tapping, so the learner does fewer questions** → conversion is limited to the grammar gap fills, which are precisely the ones worth the extra seconds; the recognition-style questions stay tappable.
- **Autocorrect or autocapitalise on mobile silently changes the answer** → the input sets `autocapitalize="off"`, `autocorrect="off"`, `spellcheck={false}`, matching the existing free-text textarea, so the browser does not "fix" Dutch into English.
- **Progress data references question ids** → conversion edits questions in place and keeps their ids, so persisted `completedQuestionIds` stay meaningful. No migration needed.

## Migration Plan

Additive and reversible. The type union grows, the validator gains a branch, and content changes type field by field. Rollback is `git revert` of the content commit alone if the type behaves badly — the engine change is inert with no `shortText` questions present.

## Open Questions

- Should a `shortText` question also carry `sampleAnswer` for a fuller explanation when the accepted answer is terse? Currently the `explanation` field covers this, so no field is added; revisit only if explanations start duplicating answer text.
