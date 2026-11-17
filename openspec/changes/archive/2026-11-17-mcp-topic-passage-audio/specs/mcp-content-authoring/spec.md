## ADDED Requirements

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
