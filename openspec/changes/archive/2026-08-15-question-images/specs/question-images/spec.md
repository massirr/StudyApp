## ADDED Requirements

### Requirement: A question may carry one image
`QuizQuestion` SHALL accept an optional `image` of `{ src: string; alt: string }`. When present the app SHALL render that image as part of the question, above the answer area. A question without an `image` SHALL render exactly as before.

#### Scenario: Question with an image
- **WHEN** a question carrying an `image` is displayed
- **THEN** the image SHALL be rendered above the answer controls, with the question prompt still visible

#### Scenario: Question without an image
- **WHEN** a question with no `image` is displayed
- **THEN** no image element SHALL be rendered and the layout SHALL be unchanged

### Requirement: Alternative text is mandatory
Whenever `image` is present, `alt` SHALL be a non-empty string, and the rendered image SHALL expose it as its alternative text. `validateSubject` SHALL reject a question whose `image` is missing `src` or `alt`, or whose values are empty.

#### Scenario: Missing alt is rejected at load
- **WHEN** a subject contains a question whose `image` has no `alt`, or an empty `alt`
- **THEN** `validateSubject` SHALL throw an error naming the offending question id

#### Scenario: Missing src is rejected at load
- **WHEN** a subject contains a question whose `image` has no `src`, or an empty `src`
- **THEN** `validateSubject` SHALL throw an error naming the offending question id

#### Scenario: Alt text reaches the accessibility tree
- **WHEN** a question image is rendered
- **THEN** its alternative text SHALL be the question's `image.alt`

### Requirement: Images never overflow their container
A question image SHALL be constrained to the width of its container and SHALL preserve its aspect ratio, so that it does not overflow horizontally on a narrow screen.

#### Scenario: Narrow viewport
- **WHEN** a question with an image is displayed at a 390px viewport
- **THEN** the image SHALL fit within the question card and the page SHALL NOT scroll horizontally
