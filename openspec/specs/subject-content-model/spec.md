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
A registry `src/data/subjects/index.ts` SHALL import every subject JSON, validate each against the schema, and expose `getSubjects()` and `getSubjectBySlug(slug)`. Invalid subject data SHALL fail the build/load.

#### Scenario: Valid subject loads
- **WHEN** a well-formed subject JSON is present
- **THEN** `getSubjectBySlug` SHALL return it

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
