## ADDED Requirements

### Requirement: Short-text question type with typed input
The quiz SHALL support a question `type` of `shortText` in which the learner types a short answer into a single-line text input instead of selecting options. A `shortText` question SHALL provide a non-empty `acceptedAnswers: string[]` and MAY omit `options` and `correctOptionIds`.

#### Scenario: Typed input replaces options
- **WHEN** the current question is `shortText`
- **THEN** the app SHALL render a single-line text input and SHALL NOT render answer options

#### Scenario: Submit gated on non-empty input
- **WHEN** the short-text input is empty or contains only whitespace
- **THEN** the submit control SHALL be disabled, consistent with empty-selection gating for MCQs

### Requirement: The app decides correctness, not the learner
On submit, the app SHALL compare the learner's normalised input against the normalised entries of `acceptedAnswers` and SHALL determine correctness itself. The app SHALL NOT present self-grade controls for a `shortText` question.

#### Scenario: Matching answer is correct
- **WHEN** the learner submits input that matches any entry in `acceptedAnswers` after normalisation
- **THEN** the question SHALL be counted as correct and correct-answer feedback SHALL be shown

#### Scenario: Non-matching answer is incorrect
- **WHEN** the learner submits input that matches no entry in `acceptedAnswers` after normalisation
- **THEN** the question SHALL be counted as incorrect

#### Scenario: No self-grade controls
- **WHEN** feedback is shown for a `shortText` question
- **THEN** the ✓ / ✗ self-grade controls SHALL NOT be present, and the question's correctness SHALL already be decided

### Requirement: Answer comparison is normalised
Comparison SHALL ignore differences that do not change the Dutch answer. Both the learner's input and each accepted answer SHALL be normalised by: trimming leading and trailing whitespace; collapsing internal whitespace runs to a single space; lowercasing; mapping curly apostrophes and quotes to their straight equivalents; and removing trailing sentence punctuation (`.`, `,`, `!`, `?`, `;`, `:`). No other transformation SHALL be applied — in particular, internal spelling, accents and word order SHALL be compared exactly.

#### Scenario: Case and surrounding whitespace ignored
- **WHEN** the accepted answer is `zou` and the learner types `  Zou `
- **THEN** the answer SHALL be counted as correct

#### Scenario: Trailing punctuation ignored
- **WHEN** the accepted answer is `zou` and the learner types `zou.`
- **THEN** the answer SHALL be counted as correct

#### Scenario: Apostrophe variants match
- **WHEN** the accepted answer is `'s morgens` and the learner types `’s morgens`
- **THEN** the answer SHALL be counted as correct

#### Scenario: Internal whitespace collapsed
- **WHEN** the accepted answer is `at ik` and the learner types `at   ik`
- **THEN** the answer SHALL be counted as correct

#### Scenario: Misspelling is not forgiven
- **WHEN** the accepted answer is `werkte` and the learner types `werkde`
- **THEN** the answer SHALL be counted as incorrect

### Requirement: Multiple accepted answers
A `shortText` question SHALL accept any entry in `acceptedAnswers`, so that legitimate variants of the same answer are all graded correct.

#### Scenario: Variant accepted
- **WHEN** `acceptedAnswers` is `["ging", "ging weg"]` and the learner types `ging weg`
- **THEN** the answer SHALL be counted as correct

### Requirement: Feedback reveals the accepted answer
After submission the app SHALL show the correct/incorrect verdict, the question's `explanation`, and — when the answer was incorrect — the first entry of `acceptedAnswers` as the expected answer, so the learner can see what was wanted.

#### Scenario: Incorrect answer reveals what was expected
- **WHEN** the learner submits an incorrect short-text answer
- **THEN** the feedback SHALL show the expected answer and the explanation

### Requirement: Short-text results feed scoring and Level-2 unlock
A `shortText` result SHALL contribute to the topic's completion score exactly as a scored MCQ does, including the ≥70% Level-1 threshold that unlocks Level 2.

#### Scenario: Short-text counts toward the unlock
- **WHEN** a Level-1 deck containing short-text questions is completed at ≥70%
- **THEN** Level 2 SHALL be unlocked for that topic, persisted the same way as MCQ-driven unlocks

### Requirement: Short-text questions integrate into the one-at-a-time flow
Short-text questions SHALL participate in the existing one-question-at-a-time, submit-then-feedback, and completion flow. Option-selection rules SHALL NOT apply to a `shortText` question.

#### Scenario: Advancing after grading
- **WHEN** a short-text question has been submitted and graded
- **THEN** the learner SHALL be able to advance to the next question, and the deck SHALL reach the same completion state with a score

#### Scenario: Answer locked after submit
- **WHEN** a short-text question has been submitted
- **THEN** the text input SHALL be disabled so the graded answer cannot be edited
