## Why

The learner failed the category B practical exam in Flanders. They drove into a no-entry street (sign C1) right after a stop sign, and the exam was stopped. Their parallel ("S") parking also failed. They are nervous with the examiner and will retake the exam on 2026-12-07 at the exam centre in Mollem, with a sworn interpreter. They asked for a new subject covering:

1. the signs they must never miss,
2. the mistakes that end the exam immediately,
3. how to stop watching the examiner and drive calmly,
4. videos on parking and the manoeuvres,
5. an intro with the exam centre's location.

The existing `vehicle-check` subject only covers the checks at the start of the exam, not the drive itself.

## What Changes

- Add a new subject `road-test` ("Praktijkexamen: de rit (Road test)"), bilingual Dutch/English like `vehicle-check`, with five topics:
  1. **Examendag in Mollem** — exam centre address and contact, interpreter rules, how the drive is scored.
  2. **Borden die je nooit mag missen** — the signs whose violation means an immediate fail (C1, C3, C31, C33, D1, D3, D5) and the priority signs (B1, B5, B9, B11, B15, B17), with drawn sign images.
  3. **Fouten die je examen stoppen** — every "niet geslaagd" / "stopgezet" rule in the GOCA brochure.
  4. **Rustig rijden met de examinator** — what the examiner does and does not do, so the learner can focus on the road.
  5. **Manoeuvres en video's** — the official rules per manoeuvre and the VSV (Vlaamse Stichting Verkeerskunde) video series.
- Add simple SVG drawings of the signs under `public/images/road-test/`.
- Add `src/data/subjects/road-test.test.ts` with content guards.

Out of scope: changes to `vehicle-check`, the app engine, schema or MCP; embedding videos in the page (they are links); the interpreter list (blocked in this session).

## Capabilities

### New Capabilities
- `road-test-subject`: a study subject for the road part of the Flemish category B practical exam.

## Impact

- New: `src/data/subjects/road-test.json` (auto-registered by `src/data/subjects/index.ts`), `src/data/subjects/road-test.test.ts`, `public/images/road-test/*.svg`.
- No code changes. The existing schema, answer-distribution and subject-index tests cover the new file automatically.
