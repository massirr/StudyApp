# Spec: LocalStorage Progress Model

## Purpose

Persist study progress locally so the app remembers topic completion and the resume point between browser sessions, without an account or backend. Progress is scoped per subject and versioned so the shape can migrate safely.

## Requirements

### Requirement: Progress is stored per subject (v2)
The persisted progress payload SHALL be schema `version: 2` under the `studyapp_progress` key, with a `subjects` map keyed by subject id, each entry holding `completedTopicIds`, `completedSubtopicIds`, and `lastVisitedTopicSlug`. Progress mutations SHALL apply to the active subject's slice only.

#### Scenario: Completion is scoped to the active subject
- **WHEN** the user marks a topic complete under `/dp-750`
- **THEN** the topic id SHALL be added to `subjects["dp-750"].completedTopicIds` and no other subject's slice SHALL change

#### Scenario: Each subject tracks its own resume point
- **WHEN** the user visits topics under two different subjects
- **THEN** each subject SHALL retain its own `lastVisitedTopicSlug`

### Requirement: v1 progress migrates without loss
On load, a legacy v1 (flat, single-subject) payload SHALL be migrated by wrapping its topic data under `subjects["dp-750"]` and setting `version: 2`. No completed-topic data SHALL be lost.

#### Scenario: Existing DP-750 progress is preserved
- **WHEN** the app loads a v1 payload with completed DP-750 topics
- **THEN** those topics SHALL appear as complete under `dp-750` after migration

#### Scenario: Migration is idempotent
- **WHEN** an already-v2 payload is loaded
- **THEN** it SHALL be used as-is without re-wrapping

### Requirement: Storage is written automatically and recovers safely
Progress SHALL be written back to LocalStorage on every change, and the app SHALL fall back to a clean default v2 state when the stored payload is missing or corrupt.

#### Scenario: Auto-save on change
- **WHEN** the user changes any progress state
- **THEN** the updated payload SHALL be written to LocalStorage without an explicit save action

#### Scenario: Corrupt payload recovers
- **WHEN** the stored payload is missing or malformed
- **THEN** the app SHALL load a clean default v2 state instead of crashing

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
