## Why

In the "Banden en vloeistoffen" quiz, `q-45` ("Wat is nummer 5 in het Engels?") still shows the schematic `engine-bay.svg`, while the other engine-bay questions use the real photo. The photo (Opel Corsa E) has no marker 5 because the washer fluid cap is outside the frame (see `content/vehicle-check/photo-credits.md`). The learner noticed the mismatch and chose to fix it with a second real photo. The exam is on 2026-11-11.

## What Changes

- Add a freely licensed photo in which the washer fluid cap is clearly visible, with a numbered marker 5 on the cap (same marker style as the other engine-bay photo).
- Point `q-45` at that photo, with a new `alt`, a credit in the explanation, and the photo listed in `sources`.
- Remove `engine-bay.svg`: no question references it any more.
- Record the credit and the change in `content/vehicle-check/photo-credits.md`.

Out of scope: new questions (for example on the cap symbol or colour), changes to the other questions, schema, engine or MCP changes.

## Capabilities

### Modified Capabilities
- `vehicle-check-subject`: the engine-bay requirement no longer allows a schematic for a part missing from the main photo; that part gets its own photo with the same marker number.

## Impact

- `public/images/vehicle-check/`: adds `washer-cap-photo.jpg`, removes `engine-bay.svg`.
- `src/data/subjects/vehicle-check.json`: `q-45` image, explanation and `sourceUrls`; one new entry in `sources`.
- `content/vehicle-check/photo-credits.md`: new row and updated notes.
- `src/data/subjects/vehicle-check.test.ts`: no change expected; its existing credit test applies to every non-SVG image and will start covering `q-45`.
