## Context

`q-45` is the only question that still uses `engine-bay.svg`. The numbered-marker questions use the numbers of the main engine-bay photo (`engine-bay-photo.jpg`: 1 dipstick, 2 oil filler cap, 3 coolant reservoir, 4 brake fluid reservoir, 6 battery). Marker 5 (washer fluid) was never on that photo. The previous change (`vehicle-check-real-photos`) left this as a documented gap; the learner chose to close it with a second photo.

## Decisions

1. **Photo: "Opel Corsa-e engine bay seen from top.jpg"** (Harald Linden, CC BY-SA 4.0, Wikimedia Commons). It is the only free photo found where the blue washer cap with the windscreen-spray symbol is sharp, unobstructed and next to the coolant reservoir. Rejected: photos of someone pouring washer fluid (the jug hides the scene; one shows an identifiable person, which we do not want in the app), and the "seen from front" photo of the same car (cap too small).
2. **Different car, on purpose.** It is an electric Corsa (no dipstick or oil cap), not the car of the main photo. That is acceptable because the learner is already told the photos are not the exam car and that layouts differ; the washer cap is recognisable by its blue colour and windscreen symbol on both. Note it in the credit and in `alt`.
3. **One marker only.** Draw marker 5 on the washer cap and nothing else, so the photo does not imply that markers 1-4 and 6 exist here (same approach as the TWI photo, which has only marker 1).
4. **Crop to the cap.** Crop the left part of the photo (washer cap plus coolant reservoir for context) so the cap is large enough at 400 px wide. Resize to at most 1200 px wide, JPEG, target under 250 KB.
5. **Marker style** copies `engine-bay-photo.jpg`: gold circle, white outline, dark bold number, thin leader line.
6. **Credit** follows the existing convention (no schema change): `Foto / Photo: Harald Linden, CC BY-SA 4.0, Wikimedia Commons (uitsnede en nummer toegevoegd / cropped, number added)` in the explanation, the File: page in `sourceUrls`, and a new `sources` entry with the licence URL. CC BY-SA needs attribution, a note of changes and the licence link, and the modified image stays under the same licence; all three are recorded in `photo-credits.md`.
7. **Delete `engine-bay.svg`.** Following the earlier rule, an SVG is removed once no question references it. Check with grep before deleting.
8. **No download from Commons at runtime.** The file is copied into `public/images/vehicle-check/` so the app works offline.

## Risks

- Wikimedia rate-limits shared IPs (HTTP 429): use the `Retry-After` header and set a descriptive User-Agent.
- The marker could sit on the wrong object: check the finished image by eye at full size and at 400 px.
- A second CC BY-SA photo means one more credit to keep correct: the existing unit test already requires author, licence and a listed Commons source for every non-SVG image.
