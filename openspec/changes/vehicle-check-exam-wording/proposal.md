## Why

The learner supplied the official exam brochure, GOCA Doc. 133 Cat. B Vlaams Gewest, version 18.08.2026. Section "3. Controles" (page 7) says exactly what the examiner expects for each random check. Comparing it with the "Banden en vloeistoffen" quiz shows gaps and a mismatch of emphasis:

- Tyre pressure: the examiner wants you to **show the valve**; no question mentions the valve, and the three pressure questions are about measuring cold and finding the value, which is not asked.
- Tyre wear: turn the wheels, get out, show the grooves, **one front wheel only**, TWI optional. Not covered.
- Every bonnet check ends with **closing the bonnet and making sure it is properly closed**; skipping it is a fault. Not covered.
- Cars with only an **electronic meter on the dashboard**: show the meter. Not covered.
- Oil: the examiner does **not** ask you to actually check the level; the quiz has about seven questions on reading the dipstick.

The exam is on 2026-11-13, so this is a focused addition, not a rewrite.

## What Changes

- Add 7 questions to the "Banden en vloeistoffen" topic (`t-4`): 5 single-choice and 2 vocabulary drills, in the brochure's wording.
- Add the brochure as a source (`src-22`) and cite it in the new questions.
- Extend the `t-4` topic note and `content/vehicle-check/exam-procedure.md` with what the examiner expects.

Out of scope: removing or rewriting existing questions (the oil-level questions stay as background knowledge), the free-text sample answers, other topics, schema or engine changes.

## Capabilities

### Modified Capabilities
- `vehicle-check-subject`: a new requirement that the random-check questions cover what the official brochure says the examiner expects.

## Impact

- `src/data/subjects/vehicle-check.json`: 7 new questions (`q-82` to `q-88`), 1 new source, 1 edited note.
- `content/vehicle-check/exam-procedure.md`: updated check descriptions.
- No code, test or schema changes; the existing unit tests (distribution, bilingual prompts, typed answers) cover the new questions.
