## MODIFIED Requirements

### Requirement: Engine-bay questions use a real photo
The engine-bay questions SHALL use a photograph of a real car with numbered markers, and the numbers named in prompts and answers SHALL match the markers in the photo. A part that is not visible in the main engine-bay photo (the washer fluid cap, number 5) SHALL use a second photograph that shows that part, with the same number on its marker. No engine-bay question SHALL use a schematic diagram.

#### Scenario: Marker numbers match the questions
- **WHEN** a question asks "Welk nummer is de oliepeilstok?"
- **THEN** the correct option SHALL be the number printed on the dipstick in the photo

#### Scenario: Washer fluid question uses a photo
- **WHEN** a question asks "Wat is nummer 5 in het Engels?"
- **THEN** its image SHALL be a photograph (not an SVG) with marker 5 on the washer fluid cap
- **AND** the photo SHALL be credited with author, licence and source URL
