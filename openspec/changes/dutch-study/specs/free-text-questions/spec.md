## ADDED Requirements

### Requirement: Free-text question type with self-grading
The quiz SHALL support a question `type` of `freeText` in which the learner types an answer into a text field instead of selecting options. A free-text question SHALL provide a `sampleAnswer` (the model answer) and MAY omit `options` and `correctOptionIds`.

#### Scenario: Learner types and reveals
- **WHEN** the learner enters text into a free-text question and submits
- **THEN** the app SHALL reveal the learner's answer alongside the `sampleAnswer` and the `explanation`

#### Scenario: Submit gated on non-empty input
- **WHEN** the free-text input is empty
- **THEN** the submit control SHALL be disabled, consistent with empty-selection gating for MCQs

### Requirement: Self-grade decides correctness
After the model answer is revealed, the learner SHALL mark their own answer correct or incorrect via explicit ✓ / ✗ controls, and that choice SHALL determine the question's correctness. The app SHALL NOT auto-compare the typed text against `sampleAnswer`.

#### Scenario: Marked correct
- **WHEN** the learner taps the ✓ ("I got it right") control
- **THEN** the question SHALL be counted as correct

#### Scenario: Marked incorrect
- **WHEN** the learner taps the ✗ ("Missed it") control
- **THEN** the question SHALL be counted as incorrect

### Requirement: Self-grade result feeds scoring and Level-2 unlock
A self-graded free-text result SHALL contribute to the topic's completion score exactly as a scored MCQ does, including the ≥70% Level-1 threshold that unlocks Level 2.

#### Scenario: Free-text counts toward the unlock
- **WHEN** a Level-1 deck containing free-text questions is completed at ≥70% by self-grade
- **THEN** Level 2 SHALL be unlocked for that topic, persisted the same way as MCQ-driven unlocks
