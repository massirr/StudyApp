## ADDED Requirements

### Requirement: Free-text questions integrate into the one-at-a-time flow
Free-text questions SHALL participate in the existing one-question-at-a-time, submit-then-feedback, and completion flow. The option-selection rules (single/multi-select, match against `correctOptionIds`) SHALL NOT apply to a free-text question; its correctness comes from self-grade instead.

#### Scenario: Free-text advances like any question
- **WHEN** a free-text question is self-graded
- **THEN** the learner SHALL be able to advance to the next question, and the deck SHALL reach the same completion state with a score

#### Scenario: Option rules skipped for free-text
- **WHEN** the current question is free-text
- **THEN** the app SHALL NOT require an option selection to enable submit
