## ADDED Requirements

### Requirement: Topics support optional study-media fields
The `Topic` schema SHALL accept two optional fields: `passage` ({ `title?: string`, `text: string` }) and `audio` ({ `src: string`, `title?: string` }). Both SHALL be optional; existing topics without them SHALL validate unchanged.

#### Scenario: Topic without media validates
- **WHEN** a topic JSON omits `passage` and `audio`
- **THEN** it SHALL validate and load as before

#### Scenario: Topic with media validates
- **WHEN** a topic JSON includes a well-formed `passage` and/or `audio`
- **THEN** it SHALL validate and expose those fields to the quiz

### Requirement: Free-text question fields are part of the schema
`QuizQuestion.type` SHALL accept the value `'freeText'` in addition to `'single'` and `'multiple'`. A `freeText` question SHALL carry an optional `sampleAnswer: string` and MAY have empty `options` and `correctOptionIds`. Existing MCQ questions SHALL be unaffected.

#### Scenario: Free-text question validates
- **WHEN** a question has `type: 'freeText'` with a `sampleAnswer` and no options
- **THEN** it SHALL validate and load

#### Scenario: MCQ schema unchanged
- **WHEN** a `single` or `multiple` question is validated
- **THEN** it SHALL behave exactly as before this change
