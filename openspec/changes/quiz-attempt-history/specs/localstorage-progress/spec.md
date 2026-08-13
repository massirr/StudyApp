## ADDED Requirements

### Requirement: Subject progress carries optional attempt history
`SubjectProgress` SHALL accept an optional `attempts` field: a map from topic id to an array of attempt records, each holding a finish timestamp, correct count, total, and percentage. The field SHALL be optional, so a stored payload without it remains valid and continues to load unchanged. The stored `version` SHALL remain 2 — this is an additive extension, not a new schema version.

#### Scenario: Payload without attempts still loads
- **WHEN** a v2 payload with no `attempts` field is loaded
- **THEN** it SHALL migrate through unchanged and read as an empty history

#### Scenario: Payload with attempts round-trips
- **WHEN** progress containing attempts is saved and loaded again
- **THEN** the attempts SHALL be returned intact

#### Scenario: Migration remains idempotent
- **WHEN** a payload that already contains attempts is migrated a second time
- **THEN** the result SHALL be unchanged
