## ADDED Requirements

### Requirement: Vehicle Check subject is available
The app SHALL provide a subject with slug `vehicle-check` that passes `validateSubject` and appears in the subject picker. It SHALL have `sourcePolicy: 'any'` and a `shortLabel` using only supported glyphs.

#### Scenario: Subject loads
- **WHEN** the app loads its subjects
- **THEN** `vehicle-check` SHALL be present with its topics, questions, notes and sources

### Requirement: Topics follow the Flemish exam structure
The subject SHALL contain topics for (1) the exam-day procedure, (2) setup and precautions, (3) lights and controls (the systematic checks), (4) tyres and fluids (the random check) and (5) dashboard warning lights, and every question SHALL belong to one of them.

#### Scenario: Every question resolves to a topic
- **WHEN** the subject is validated
- **THEN** every `question.topicId` SHALL equal the `id` of a topic in the subject

### Requirement: Content is bilingual
Each question prompt SHALL give the Dutch phrasing and an English rendering. Vocabulary drills SHALL accept the standard Dutch term, and common variants, as typed answers.

#### Scenario: Typed vocabulary answer
- **WHEN** the learner types `dimlicht` for the English prompt "dipped beam"
- **THEN** the app SHALL mark it correct

### Requirement: Facts are grounded in cited sources
Each question that states a rule, threshold or procedure SHALL list at least one source URL, preferring GOCA, the Flemish government and Belgian publishers. Belgian values SHALL be used where Belgian and Dutch rules differ.

#### Scenario: Belgian fog-light threshold
- **WHEN** a question asks when the rear fog light is used in fog or snow
- **THEN** the correct answer SHALL be a visibility below 100 metres

### Requirement: Images are original, accessible and present
Question images SHALL be original SVG files under `public/images/vehicle-check/`, each with a non-empty `alt` that describes the picture, and every referenced file SHALL exist.

#### Scenario: Referenced images exist
- **WHEN** the subject's questions are checked
- **THEN** every `image.src` SHALL resolve to a file under `public/`

### Requirement: Existing content policies still hold
The subject SHALL satisfy the answer-distribution policy (correct letters within a topic differ by at most 2) and use positional option ids.

#### Scenario: Distribution test passes
- **WHEN** the unit tests run
- **THEN** the answer-distribution tests SHALL pass for every `vehicle-check` topic
