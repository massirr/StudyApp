# Spec: Subject Content Model

## Purpose

Define how study content is stored and loaded now that the app is subject-agnostic. Each subject's content lives as a single validated JSON file so it is self-contained and machine-editable (readable/writable by a future MCP), replacing the hand-written TypeScript data modules.

## Requirements

### Requirement: Content stored as per-subject JSON
Each subject's content SHALL live in one JSON file at `src/data/subjects/<slug>.json` containing `id`, `slug`, `name`, `shortLabel`, `tagline`, `sourcePolicy`, `topics`, `questions`, `sources`, and `notes`. The hand-written `src/data/{topics,questions,sources,contentNotes}.ts` files SHALL be removed.

#### Scenario: DP-750 content migrated to JSON
- **WHEN** the app builds after migration
- **THEN** `src/data/subjects/dp-750.json` SHALL exist and the old `src/data/*.ts` content files SHALL NOT

#### Scenario: No content loss in migration
- **WHEN** the DP-750 JSON is compared to the previous TS arrays
- **THEN** every topic, question, option, source, and note SHALL be present with equivalent fields

### Requirement: Subjects loaded and validated at build time
A registry `src/data/subjects/index.ts` SHALL automatically discover every
`src/data/subjects/*.json` file at build time (via eager glob import), validate
each against the schema, and expose `getSubjects()` and `getSubjectBySlug(slug)`.
Adding a subject JSON file SHALL be sufficient for the subject to appear in the
app — no registry code edit is required. Invalid subject data SHALL fail the
build/load. Subject order SHALL be deterministic (sorted by file path).

#### Scenario: Valid subject loads
- **WHEN** a well-formed subject JSON is present
- **THEN** `getSubjectBySlug` SHALL return it

#### Scenario: New subject file appears without registry edit
- **WHEN** a new well-formed `src/data/subjects/<slug>.json` is added (for
  example committed by the MCP `create_subject` tool)
- **THEN** the subject SHALL be returned by `getSubjects()` on the next build
  with no change to `index.ts`

#### Scenario: Malformed subject rejected
- **WHEN** a subject JSON is missing a required field or has a `shortLabel` with unsupported glyphs
- **THEN** validation SHALL throw rather than silently loading partial content

### Requirement: Code-snippet tier is preserved
The loader SHALL split each subject's questions into a regular tier and a code-snippet tier by the presence of a `codeSnippet` field. `getQuestionsForTopic` and `getAllQuestions` SHALL return regular questions; `getCodeSnippetQuestionsForTopic` SHALL return code-snippet questions.

#### Scenario: Regular tier excludes code questions
- **WHEN** `getAllQuestions(subject)` is called
- **THEN** it SHALL return only questions without a `codeSnippet`

#### Scenario: Code tier returns code questions for a topic
- **WHEN** `getCodeSnippetQuestionsForTopic(subject, topicId)` is called
- **THEN** it SHALL return only that topic's questions that have a `codeSnippet`

### Requirement: Question schema is forward-compatible
The `QuizQuestion` schema SHALL include an optional `level?: number` field, unused by this change, reserved for future tiered quizzes. `codeSnippet` SHALL remain an optional field.

#### Scenario: level omitted
- **WHEN** a question omits `level`
- **THEN** it SHALL validate and render normally

#### Scenario: level present
- **WHEN** a question includes `level: 2`
- **THEN** it SHALL validate (no behavior change in this release)

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
