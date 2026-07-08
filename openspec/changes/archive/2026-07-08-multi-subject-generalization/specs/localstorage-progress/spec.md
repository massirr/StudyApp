## MODIFIED Requirements

### Requirement: Progress is stored per subject (v2)
The persisted progress payload SHALL be schema `version: 2` with a `subjects` map keyed by subject id, each entry holding `completedTopicIds`, `completedSubtopicIds`, and `lastVisitedTopicSlug`. Progress mutations SHALL apply to the active subject's slice only.

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

#### Scenario: Malformed payload still recovers safely
- **WHEN** the stored payload is missing or corrupt
- **THEN** the app SHALL fall back to a clean default v2 state
