## MODIFIED Requirements

### Requirement: QuizQuestion data model
The quiz question model SHALL be extended with an optional `codeSnippet` field. All existing fields remain unchanged. Option ids are positional — `correctOptionIds` MUST always match the position of the correct answer in the `options` array.

Updated model:

- `id`: stable question identifier
- `topicId`: topic the question belongs to
- `prompt`: the question text
- `type`: single-select or multi-select
- `options`: answer choices; order determines the option letter (A=index 0, B=index 1, C=index 2, D=index 3)
- `correctOptionIds`: one or more correct answers, referencing the positional id (`'a'`–`'d'`) matching the current `options` array order
- `explanation`: short learning-oriented explanation
- `sourceUrls`: references to official Microsoft documentation URLs
- `codeSnippet` *(optional)*: `{ language: string; code: string }` — a code block displayed as part of the question body

#### Scenario: Existing questions unaffected
- **WHEN** an existing question without `codeSnippet` is rendered
- **THEN** quiz behavior, scoring, and display SHALL be identical to before this change

#### Scenario: New code-snippet question renders correctly
- **WHEN** a question with `codeSnippet` is rendered
- **THEN** the prompt SHALL appear above the code block, and answer choices SHALL appear below

#### Scenario: correctOptionIds matches option position after rotation
- **WHEN** options are reordered in the static data
- **THEN** `correctOptionIds` SHALL reflect the new position of the correct answer text in the `options` array
