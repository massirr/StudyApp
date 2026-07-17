## ADDED Requirements

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
