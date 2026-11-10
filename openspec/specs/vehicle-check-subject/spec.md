# vehicle-check-subject Specification

## Purpose
TBD - created by archiving change vehicle-check-subject. Update Purpose after archive.

## Requirements

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
Question images SHALL be either original files created for the app or photographs the learner owns or that carry a free licence, stored under `public/images/vehicle-check/`. Each SHALL have a non-empty `alt` describing the picture, and every referenced file SHALL exist. Third-party photos SHALL be credited with author, licence and source URL.

#### Scenario: Referenced images exist
- **WHEN** the subject's questions are checked
- **THEN** every `image.src` SHALL resolve to a file under `public/`

#### Scenario: Third-party photo is credited
- **WHEN** a question uses a photograph the learner did not take
- **THEN** its explanation SHALL name the author and licence and the source SHALL be listed in `sources`

### Requirement: Existing content policies still hold
The subject SHALL satisfy the answer-distribution policy (correct letters within a topic differ by at most 2) and use positional option ids.

#### Scenario: Distribution test passes
- **WHEN** the unit tests run
- **THEN** the answer-distribution tests SHALL pass for every `vehicle-check` topic

### Requirement: Engine-bay questions use a real photo
The engine-bay questions SHALL use a photograph of a real car with numbered markers, and the numbers named in prompts and answers SHALL match the markers in the photo. A part that is not visible in the main engine-bay photo (the washer fluid cap, number 5) SHALL use a second photograph that shows that part, with the same number on its marker. No engine-bay question SHALL use a schematic diagram.

#### Scenario: Marker numbers match the questions
- **WHEN** a question asks "Welk nummer is de oliepeilstok?"
- **THEN** the correct option SHALL be the number printed on the dipstick in the photo

#### Scenario: Washer fluid question uses a photo
- **WHEN** a question asks "Wat is nummer 5 in het Engels?"
- **THEN** its image SHALL be a photograph (not an SVG) with marker 5 on the washer fluid cap
- **AND** the photo SHALL be credited with author, licence and source URL
