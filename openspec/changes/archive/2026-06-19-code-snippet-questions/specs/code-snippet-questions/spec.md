## ADDED Requirements

### Requirement: Code snippet field on QuizQuestion
The `QuizQuestion` type SHALL include an optional `codeSnippet` field of shape `{ language: string; code: string }`. When present, the code snippet is considered part of the question body.

#### Scenario: Type accepts codeSnippet
- **WHEN** a `QuizQuestion` object includes a `codeSnippet` field
- **THEN** TypeScript SHALL compile without error

#### Scenario: Type allows omitting codeSnippet
- **WHEN** a `QuizQuestion` object omits `codeSnippet`
- **THEN** TypeScript SHALL compile without error (field is optional)

### Requirement: Code block renders above answer choices
When a question has a `codeSnippet`, the `QuestionDisplay` component SHALL render a styled `<pre><code>` block between the question prompt and the answer choices.

#### Scenario: Code block present
- **WHEN** the active question has `codeSnippet` set
- **THEN** a `<pre>` element with monospace font and muted background SHALL be visible on the page

#### Scenario: No code block when absent
- **WHEN** the active question has no `codeSnippet`
- **THEN** no `<pre>` element SHALL be rendered for that question

### Requirement: Code block is accessible
The code block wrapper SHALL have `role="region"` and `aria-label="Code snippet"`.

#### Scenario: Accessibility attributes present
- **WHEN** a question with `codeSnippet` is displayed
- **THEN** the wrapping element SHALL have `role="region"` and `aria-label="Code snippet"`

### Requirement: Code block scrolls horizontally on overflow
The `<pre>` element SHALL have `overflow-x: auto` so long lines do not break the layout on narrow viewports.

#### Scenario: Long line does not overflow container
- **WHEN** a code snippet contains a line longer than the viewport width
- **THEN** the container SHALL show a horizontal scrollbar rather than breaking layout

### Requirement: Code-snippet questions per topic
Each of the 5 DP-750 topics SHALL have at least 4 new MCQ questions that include `codeSnippet`. Questions MUST be grounded in official Microsoft Azure Databricks documentation and include at least one `sourceUrl`.

#### Scenario: Questions load for topic-01
- **WHEN** the quiz for topic-01 loads
- **THEN** at least 4 questions with `codeSnippet` SHALL be present in the question bank

#### Scenario: Questions load for topic-02
- **WHEN** the quiz for topic-02 loads
- **THEN** at least 4 questions with `codeSnippet` SHALL be present in the question bank

#### Scenario: Questions load for topic-03
- **WHEN** the quiz for topic-03 loads
- **THEN** at least 4 questions with `codeSnippet` SHALL be present in the question bank

#### Scenario: Questions load for topic-04
- **WHEN** the quiz for topic-04 loads
- **THEN** at least 4 questions with `codeSnippet` SHALL be present in the question bank

#### Scenario: Questions load for topic-05
- **WHEN** the quiz for topic-05 loads
- **THEN** at least 4 questions with `codeSnippet` SHALL be present in the question bank
