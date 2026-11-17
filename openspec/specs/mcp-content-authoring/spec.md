# mcp-content-authoring Specification

## Purpose
TBD - created by archiving change mcp-content-authoring. Update Purpose after archive.

## Requirements

### Requirement: Remote MCP server reachable over HTTPS
The MCP server SHALL be hosted as a Vercel Function exposing an MCP endpoint over streamable-HTTP transport, deployed with the app, and usable as a custom connector in an MCP client (e.g. the Claude app).

#### Scenario: Connector can list tools
- **WHEN** an authenticated MCP client connects to the deployed endpoint
- **THEN** the server SHALL advertise its tools over the MCP protocol

### Requirement: Endpoint requires authentication
The MCP endpoint SHALL reject unauthenticated requests; only the owner SHALL be able to invoke tools.

#### Scenario: Unauthenticated request rejected
- **WHEN** a request arrives without valid credentials
- **THEN** the server SHALL refuse it and SHALL NOT read or write content

### Requirement: Subject-scoped, discovery-first tools
Tools SHALL be subject-scoped: `list_subjects` returns available subjects; all other tools take a `subject` slug (except `create_subject`). There SHALL be no flat cross-subject question pool.

#### Scenario: Discovery then scoped read
- **WHEN** the client calls `list_subjects` then `get_subject("dp-750")`
- **THEN** it SHALL receive the list of subjects, then the full `dp-750` content (topics, questions, sources, notes)

#### Scenario: Question tools are scoped to one subject
- **WHEN** `add_question` is called with `subject: "dp-750"`
- **THEN** the change SHALL affect only `dp-750` content and no other subject

### Requirement: Read and add/update tools, no deletes
The server SHALL expose read tools (`list_subjects`, `get_subject`) and add/update tools for subjects, topics, questions, sources, and notes. It SHALL NOT expose delete/destructive tools in this version.

#### Scenario: Code snippet and level are editable via question tools
- **WHEN** `update_question` sets a `codeSnippet` and `level` on a question
- **THEN** those fields SHALL be persisted on that question

#### Scenario: No delete tool is offered
- **WHEN** the client lists available tools
- **THEN** no tool that deletes a subject, topic, question, source, or note SHALL be present

### Requirement: Every write is validated before it lands
Each write SHALL build the full updated subject in memory, run `validateSubject`, and commit only if valid. Invalid writes SHALL be rejected with an actionable error and SHALL NOT be committed.

#### Scenario: Policy violation is rejected
- **WHEN** a write would add a non-`learn.microsoft.com` source URL to `dp-750` (a `microsoft-only` subject)
- **THEN** the write SHALL be rejected with an error explaining the policy, and no commit SHALL be made

#### Scenario: Referential integrity enforced
- **WHEN** `add_question` references a `topicId` that does not exist in the subject
- **THEN** the write SHALL be rejected with an error, and no commit SHALL be made

### Requirement: Writes are GitHub commits against the current file
Writes SHALL read the target file's current content and `sha` from `master`, then commit the updated JSON (one commit per edit). A stale-`sha` conflict SHALL trigger a refetch-and-retry rather than overwrite.

#### Scenario: Edit produces a commit
- **WHEN** a valid `update_question` completes
- **THEN** the subject's JSON file on `master` SHALL be updated by a commit, triggering a deploy

#### Scenario: Reads reflect latest master
- **WHEN** `get_subject` is called
- **THEN** it SHALL return content fetched from the current `master`, not a stale bundled copy

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

### Requirement: Topic tools accept every topic field the app supports
`add_topic` and `update_topic` SHALL accept every topic field the app supports, including the optional study media `passage` (`{ title?, text }`) and `audio` (`{ src, title? }`). The tool input schemas SHALL check field shape only; content rules SHALL be enforced by `validateSubject` on the updated subject, as for every other write, so the MCP accepts exactly the topics the app can load.

#### Scenario: Passage and audio are stored, not dropped
- **WHEN** `add_topic` is called with a `passage` that has `text` and an `audio` that has `src`
- **THEN** the committed topic SHALL carry that `passage` and `audio`, and the committed subject SHALL pass `validateSubject`

#### Scenario: Passage without text is rejected
- **WHEN** `add_topic` or `update_topic` supplies a `passage` without `text`
- **THEN** the call SHALL return an error and no commit SHALL be made

#### Scenario: Audio without src is rejected
- **WHEN** `add_topic` or `update_topic` supplies an `audio` without `src`
- **THEN** the call SHALL return an error and no commit SHALL be made

#### Scenario: Media added to an existing topic
- **WHEN** `update_topic` sets a `passage` and an `audio` on an existing topic
- **THEN** both SHALL be persisted on that topic

#### Scenario: Tool schema stays in step with the topic type
- **WHEN** the app's topic type gains a field that the tool schema does not accept
- **THEN** the MCP type check (part of `npm run build`) SHALL fail
