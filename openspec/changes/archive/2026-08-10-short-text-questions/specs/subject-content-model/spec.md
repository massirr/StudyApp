## ADDED Requirements

### Requirement: Short-text question fields are part of the schema
`QuizQuestion.type` SHALL accept the value `'shortText'` in addition to `'single'`, `'multiple'` and `'freeText'`. `QuizQuestion` SHALL carry an optional `acceptedAnswers: string[]`, which SHALL be required and non-empty when the type is `'shortText'`. A `shortText` question MAY have empty `options` and `correctOptionIds`. Existing MCQ and free-text questions SHALL be unaffected.

#### Scenario: Short-text question validates
- **WHEN** a question has `type: 'shortText'` with a non-empty `acceptedAnswers` and no options
- **THEN** it SHALL validate and load

#### Scenario: Short-text without accepted answers is rejected
- **WHEN** a question has `type: 'shortText'` and `acceptedAnswers` is missing, not an array, or empty
- **THEN** `validateSubject` SHALL throw an error naming the offending question id

#### Scenario: Existing question types unchanged
- **WHEN** a `single`, `multiple` or `freeText` question is validated
- **THEN** it SHALL behave exactly as before this change

### Requirement: Answer-distribution policy applies only to single-select questions
The answer-distribution policy SHALL be evaluated over `single`-select questions with exactly one correct option. Converting a question to `shortText` SHALL remove it from that policy's population, and the remaining `single` questions in each affected topic SHALL still satisfy the policy.

#### Scenario: Converted questions leave the population
- **WHEN** a `single` question is converted to `shortText`
- **THEN** it SHALL no longer be counted when computing that topic's A/B/C/D spread

#### Scenario: Remaining questions still satisfy the policy
- **WHEN** conversions are complete
- **THEN** every topic's remaining `single` questions SHALL have an A/B/C/D spread no greater than 2
