## MODIFIED Requirements

### Requirement: Images are original, accessible and present
Question images SHALL be either original files created for the app or photographs the learner owns or that carry a free licence, stored under `public/images/vehicle-check/`. Each SHALL have a non-empty `alt` describing the picture, and every referenced file SHALL exist. Third-party photos SHALL be credited with author, licence and source URL.

#### Scenario: Referenced images exist
- **WHEN** the subject's questions are checked
- **THEN** every `image.src` SHALL resolve to a file under `public/`

#### Scenario: Third-party photo is credited
- **WHEN** a question uses a photograph the learner did not take
- **THEN** its explanation SHALL name the author and licence and the source SHALL be listed in `sources`

## ADDED Requirements

### Requirement: Engine-bay questions use a real photo
The engine-bay questions SHALL use a photograph of a real car with numbered markers, and the numbers named in prompts and answers SHALL match the markers in the photo.

#### Scenario: Marker numbers match the questions
- **WHEN** a question asks "Welk nummer is de oliepeilstok?"
- **THEN** the correct option SHALL be the number printed on the dipstick in the photo
