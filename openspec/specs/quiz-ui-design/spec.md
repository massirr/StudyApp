# Spec: Quiz UI Design

## Purpose

Define the structure, interaction states, and accessibility of the quiz UI so it is clean, scannable, and consistent. This spec covers component structure and behavior; concrete color values follow the app's active theme (currently the light paper/ink theme) rather than being fixed here.

## Requirements

### Requirement: Quiz screen composes a fixed set of components
The quiz screen SHALL compose these components: `QuizHeader` (topic + progress), `QuestionDisplay` (prompt, optional code snippet), `AnswerPicker` (options), `FeedbackPanel` (conditional explanation + sources), and `QuizNav` (previous/next/finish).

#### Scenario: Components present during a question
- **WHEN** a quiz question is displayed
- **THEN** the header, question display, answer picker, and nav SHALL be present, with the feedback panel appearing after submission

### Requirement: Answer options have visually distinct states
Answer options SHALL be visually distinct across idle, hover, selected (pre-submit), and submitted-locked states. After submission, correct and incorrect selections SHALL be clearly differentiated and options SHALL be locked.

#### Scenario: Selected state before submit
- **WHEN** the user selects an option before submitting
- **THEN** that option SHALL be visually marked as selected and distinct from unselected options

#### Scenario: Correct vs incorrect after submit
- **WHEN** an answer is submitted
- **THEN** correct and incorrect options SHALL be visually differentiated and no longer editable

### Requirement: Feedback panel appears after submission
The `FeedbackPanel` SHALL appear only after submission, showing the explanation and official source links.

#### Scenario: Feedback hidden until submit
- **WHEN** a question has not been submitted
- **THEN** no feedback panel SHALL be shown

### Requirement: Navigation controls enable and disable correctly
The previous control SHALL be disabled on the first question; the next/finish control SHALL be disabled until the current question is submitted.

#### Scenario: Next disabled until submit
- **WHEN** the current question has not been submitted
- **THEN** the next control SHALL be disabled

### Requirement: Quiz UI is keyboard accessible and screen-reader friendly
Answer options SHALL expose appropriate roles (`radio`/`checkbox`) with checked state; the feedback region SHALL be announced (`aria-live="polite"`); focus indicators SHALL be visible; and source links SHALL have descriptive text.

#### Scenario: Options are operable by keyboard
- **WHEN** a user tabs to an answer option and presses Space/Enter
- **THEN** the option SHALL toggle its selection with a visible focus indicator

#### Scenario: Feedback is announced
- **WHEN** the feedback panel appears
- **THEN** it SHALL be in an `aria-live="polite"` region so assistive tech announces it
