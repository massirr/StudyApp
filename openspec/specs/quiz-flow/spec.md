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
