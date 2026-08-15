## ADDED Requirements

### Requirement: Question image fields are part of the schema
`QuizQuestion` SHALL accept an optional `image: { src: string; alt: string }`. The field SHALL be optional, so existing questions and subjects validate unchanged. When present, both `src` and `alt` SHALL be non-empty strings.

#### Scenario: Question with a well-formed image validates
- **WHEN** a question carries an `image` with a non-empty `src` and `alt`
- **THEN** it SHALL validate and load

#### Scenario: Malformed image is rejected
- **WHEN** a question's `image` is not an object, or has a missing or empty `src` or `alt`
- **THEN** `validateSubject` SHALL throw an error naming the question id

#### Scenario: Existing content is unaffected
- **WHEN** a subject whose questions carry no `image` is validated
- **THEN** it SHALL behave exactly as before this change
