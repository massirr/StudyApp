# Quiz Flow Spec

## Goal
Define a simple, reliable quiz experience for each DP-750 topic page so users can check understanding without adding unnecessary complexity.

## User Problem
The app can show topics and track progress, but users also need a lightweight way to confirm what they learned. If quiz behavior is not clearly defined, answer states, feedback, and retry behavior will drift into ad hoc component logic.

## Proposed Solution
Add a topic-level quiz flow that lives inside each topic page and follows the same interaction pattern everywhere.

The quiz should present one question at a time, allow the user to select an answer, submit it, and see immediate feedback. After feedback is shown, the user can move to the next question or retry the current one depending on the question state. The quiz flow should stay simple enough to support both multiple-choice and multi-select questions without branching into separate mini-apps.

The quiz experience should be focused on learning, not scoring. It should explain why answers are right or wrong using official Microsoft source grounding from the content layer.

## User Flow
1. The user opens a topic page and scrolls to the quiz section.
2. The app shows one question with answer options.
3. The user selects one or more answers depending on the question type.
4. The user submits the answer.
5. The app shows correctness feedback and a short explanation.
6. The user moves to the next question or retries.
7. When the topic quiz is complete, the app shows a completion state and a path back to the dashboard.

## Page / Component Structure
### Pages
- `TopicPage`: hosts the topic overview and quiz section.

### Components
- `QuizSection`: wraps the quiz state for a topic.
- `QuestionCard`: renders the current question and its prompt.
- `AnswerPicker`: handles single-select and multi-select answer selection.
- `SubmitButton`: submits the current selection.
- `FeedbackPanel`: shows correct/incorrect state and explanation.
- `QuestionNavigator`: moves to the next question or retries the current one.
- `QuizCompletionState`: appears when the quiz deck is finished.

### Files and Responsibilities
- `src/components/quiz/*`: quiz UI and interaction pieces.
- `src/data/questions.ts`: question definitions for each topic.
- `src/hooks/useQuizState.ts`: quiz interaction state and transitions.
- `src/context/QuizContext.tsx`: optional shared quiz state for the active topic.

## Data Model
The quiz needs a stable question model that can support both content review and answer feedback.

### QuizQuestion
- `id`: stable question identifier.
- `topicId`: topic the question belongs to.
- `prompt`: the question text.
- `type`: single-select or multi-select.
- `options`: answer choices.
- `correctOptionIds`: one or more correct answers.
- `explanation`: short learning-oriented explanation.
- `sourceIds`: references back to the underlying content items.

### QuizOption
- `id`: stable option identifier.
- `label`: answer text.

### Quiz State
- `currentQuestionId`: the active question.
- `selectedOptionIds`: current user selection.
- `submitted`: whether the current question has been submitted.
- `isCorrect`: derived correctness value after submission.
- `completedQuestionIds`: questions the user has finished in the current topic session.

## Interaction Rules
- Users can change their selection before submission.
- After submission, the selected answers and correct answers are both visible.
- Single-select questions only allow one active answer.
- Multi-select questions allow more than one answer and must treat the full selection as the submitted response.
- Feedback must be visible immediately after submission.
- The user cannot advance to the next question until the current question has been submitted.
- The quiz should not auto-submit on selection.

## Source Requirements
- All quiz questions, correct answers, and explanations must be grounded in official Microsoft sources only.
- Explanations should cite the content items or source links used to create the question.
- The quiz must not contain unsupported claims, guessed facts, or community-derived shortcuts.
- If a question cannot be grounded in official sources, it should not be added.

## Acceptance Criteria
- Each topic page can render a quiz section without duplicating unrelated topics.
- The quiz supports both single-select and multi-select questions.
- The user can select answers, submit them, and see feedback.
- Correct and incorrect answers are clearly indicated after submission.
- The user can move through the quiz in order.
- The quiz shows a completion state when all questions for a topic are finished.
- Quiz questions and explanations come from the shared content layer, not hardcoded component text.

## Non-Goals
- Timed exams.
- Leaderboards.
- Authentication.
- Backend APIs.
- Cloud sync.
- Adaptive difficulty.
- Randomized question pools.
- AI chat inside the app.

## Test Plan
- Verify single-select questions allow one answer and submit correctly.
- Verify multi-select questions allow multiple answers and evaluate the full selection.
- Verify feedback appears after submission.
- Verify the user cannot submit an empty selection.
- Verify the next-question flow works after submission.
- Verify completion state appears after the final question.

## Open Questions
- Should users be able to review previous quiz questions within the same session?
- Should incorrect answers stay visible after moving to the next question, or reset immediately?
