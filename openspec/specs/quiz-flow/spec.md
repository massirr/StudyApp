# Spec: Quiz Flow

## Purpose

Provide a simple, learning-focused quiz for each topic: one question at a time, select then submit, immediate feedback with a grounded explanation, and a completion state. Supports single-select and multi-select questions without branching into separate flows.
## Requirements
### Requirement: One question at a time with select-then-submit
The quiz SHALL present one question at a time and require the user to submit a selection before feedback is shown. It SHALL NOT auto-submit on selection, and users MAY change their selection before submitting.

#### Scenario: Selection can change before submit
- **WHEN** the user picks an option and then picks another before submitting
- **THEN** only the latest selection SHALL be submitted

#### Scenario: No auto-submit
- **WHEN** the user selects an option
- **THEN** the answer SHALL NOT be submitted until the user activates submit

### Requirement: Empty selection cannot be submitted
The submit action SHALL be disabled until at least one option is selected.

#### Scenario: Submit disabled with no selection
- **WHEN** no option is selected
- **THEN** the submit control SHALL be disabled

### Requirement: Single-select and multi-select are supported
Single-select questions SHALL allow exactly one active answer; multi-select questions SHALL allow more than one and SHALL evaluate the full selection against `correctOptionIds`.

#### Scenario: Multi-select evaluates the full set
- **WHEN** a multi-select question is submitted
- **THEN** correctness SHALL require the selected set to match the correct set exactly

### Requirement: Feedback shows after submission and gates advancing
After submission, correctness and a short explanation SHALL be visible, and the user SHALL NOT advance to the next question until the current one is submitted.

#### Scenario: Feedback appears on submit
- **WHEN** the user submits an answer
- **THEN** correct/incorrect state and an explanation SHALL be shown

#### Scenario: Cannot advance before submit
- **WHEN** the current question has not been submitted
- **THEN** the next control SHALL be unavailable

### Requirement: Completion state after the final question
When all questions in the deck are finished, the quiz SHALL show a completion state with a score and a path back to the dashboard.

#### Scenario: Completion state appears
- **WHEN** the final question is submitted
- **THEN** a completion state with score and a dashboard link SHALL be shown

### Requirement: Score screen offers Level 2 only when Level 2 exists
After a Level-1 quiz is completed for a topic, the score screen SHALL surface a Level-2 entry point
only when that topic has at least one Level-2 question. When the topic has none, neither the
Level-2 call-to-action nor the "score 70% or higher to unlock" hint SHALL be rendered, so the
learner is never offered a link to an empty quiz.

Passing at ≥70% SHALL still record the Level-2 unlock in progress regardless of whether any
Level-2 question exists — the recorded progress reflects what the learner achieved, independent of
available content.

#### Scenario: Topic with Level-2 questions
- **WHEN** a topic that has Level-2 questions is completed at ≥70%
- **THEN** the score screen SHALL show the Level-2 call-to-action

#### Scenario: Topic with Level-2 questions, scored below the threshold
- **WHEN** a topic that has Level-2 questions is completed below 70%
- **THEN** the score screen SHALL show the "score 70% or higher to unlock" hint instead of the call-to-action

#### Scenario: Topic without Level-2 questions
- **WHEN** a topic that has no Level-2 questions is completed at any score
- **THEN** the score screen SHALL show neither the Level-2 call-to-action nor the unlock hint

#### Scenario: Unlock still recorded without Level-2 content
- **WHEN** a topic with no Level-2 questions is completed at ≥70%
- **THEN** the topic's Level-2 unlock SHALL still be persisted to progress

