## MODIFIED Requirements

### Requirement: QuizQuestion data model
The quiz question model SHALL be extended with an optional `codeSnippet` field. All existing fields remain unchanged.

Updated model:

- `id`: stable question identifier
- `topicId`: topic the question belongs to
- `prompt`: the question text
- `type`: single-select or multi-select
- `options`: answer choices
- `correctOptionIds`: one or more correct answers
- `explanation`: short learning-oriented explanation
- `sourceUrls`: references to official Microsoft documentation URLs
- `codeSnippet` *(optional)*: `{ language: string; code: string }` — a code block displayed as part of the question body

#### Scenario: Existing questions unaffected
- **WHEN** an existing question without `codeSnippet` is rendered
- **THEN** quiz behavior, scoring, and display SHALL be identical to before this change

#### Scenario: New code-snippet question renders correctly
- **WHEN** a question with `codeSnippet` is rendered
- **THEN** the prompt SHALL appear above the code block, and answer choices SHALL appear below
