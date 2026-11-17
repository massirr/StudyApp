## ADDED Requirements

### Requirement: Question tools accept every question type the app supports
`add_question` and `update_question` SHALL accept every question `type` the app supports (`single`, `multiple`, `shortText`, `freeText`) and the optional question fields `codeSnippet`, `level`, `acceptedAnswers`, `sampleAnswer` and `image` (`{ src, alt }`). The tool input schemas SHALL check field shape only; the per-type rules SHALL be enforced by `validateSubject` on the updated subject, as for every other write, so the MCP accepts exactly the questions the app can load.

#### Scenario: Typed-answer question is added
- **WHEN** `add_question` is called with `type: "shortText"`, `options: []`, `correctOptionIds: []` and a non-empty `acceptedAnswers`
- **THEN** the question SHALL be committed with its `acceptedAnswers`, and the committed subject SHALL pass `validateSubject`

#### Scenario: Typed-answer question without accepted answers is rejected
- **WHEN** `add_question` is called with `type: "shortText"` and no `acceptedAnswers`
- **THEN** the call SHALL return an error and no commit SHALL be made

#### Scenario: Free-text question needs a sample answer
- **WHEN** `add_question` is called with `type: "freeText"`
- **THEN** it SHALL commit if `sampleAnswer` is present, and SHALL return an error without committing if it is absent

#### Scenario: Image without alt text is rejected
- **WHEN** `add_question` or `update_question` supplies an `image` whose `alt` is missing or empty
- **THEN** the call SHALL return an error and no commit SHALL be made

#### Scenario: Image is stored, not dropped
- **WHEN** `add_question` supplies an `image` with a non-empty `src` and `alt`
- **THEN** the committed question SHALL carry that `image`

#### Scenario: Question type changed through update
- **WHEN** `update_question` changes a question's `type` to `shortText`
- **THEN** it SHALL commit if the resulting question has a non-empty `acceptedAnswers`, and SHALL return an error without committing otherwise

#### Scenario: Tool schema stays in step with the question type
- **WHEN** the app's question type gains a question type or field that the tool schema does not accept
- **THEN** the MCP type check (part of `npm run build`) SHALL fail
