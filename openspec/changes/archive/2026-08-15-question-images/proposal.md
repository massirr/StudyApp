## Why

Two NL3 exercises are visual in the course and cannot be expressed in words without losing what they teach.

`q-53` (oral question 2) asks the learner to compare two people. It was written as "kijk naar twee personen" with nothing on screen, which made it unanswerable; it has since been patched to describe two women in prose, but that removes the actual skill — on the day the examiner hands over a photo and the learner has to look at it and produce Dutch. Reading a description and paraphrasing it is a different task.

The H4 cooking exercise has the same shape: the course teaches `bakken / braden / gieten / koken / kruiden / smelten / roeren / schillen / smeren / toevoegen` against a plate of photos, because the whole point is attaching a verb to a thing you can see. Oral question 3 then asks the learner to give recipe instructions from photos.

`QuizQuestion` currently supports `codeSnippet` for DP-750 but has no way to show an image, so neither exercise can be modelled.

## What Changes

- Add an optional `image` to `QuizQuestion`: `{ src: string; alt: string }`.
- `alt` is **required** whenever `image` is present — a describe-the-photo question is exactly where a missing alt attribute strands a screen-reader user, and `validateSubject` rejects an image without one.
- Render the image above the answer area in `QuestionDisplay`, constrained so it never overflows on a phone.
- Ship two images extracted from the course PDF under `public/images/nl3/`: the "Een tweeling" figure (H3 3.4, p.32) and the cooking-verbs plate (H4 4.5, p.48).
- Restore `q-53` to a genuine look-at-the-photo task using the tweeling figure, keeping the prose description as a fallback in the explanation.
- Attach the cooking-verbs plate to the H4 imperatief/recipe questions.
- Record image provenance in `content/dutch/README.md`: these are figures from the Thomas More course PDF, reproduced in a personal, unofficial study aid.

## Capabilities

### New Capabilities
- `question-images`: An optional image on a quiz question, with mandatory alternative text, rendered with the question and constrained to its container.

### Modified Capabilities
- `subject-content-model`: `QuizQuestion` gains an optional `image` field; `validateSubject` rejects an `image` whose `src` or `alt` is missing or empty. Existing questions without an image are unaffected.

## Impact

- **Types**: `src/types/quiz.ts` — `image?: { src: string; alt: string }`.
- **Validation**: `src/data/subjects/schema.ts` — a presence check mirroring the existing `freeText`/`shortText` ones.
- **UI**: `src/components/quiz/QuestionDisplay.tsx` and its module CSS.
- **Assets**: two JPEGs under `public/images/nl3/`, ~160 KB total, served statically by Vite.
- **Content**: `src/data/subjects/yb1398.json` — `q-53` and the H4 recipe questions.
- **Tests**: schema validation cases; the render is verified through the Playwright MCP as usual.
- **No impact** on DP-750 or on any existing question type.

## Non-Goals

- No image on answer options, no image-based answering (pick the right picture). Both are larger and neither maps to a retake task.
- No lightbox, zoom or gallery — one image, shown inline.
- No bulk import of the PDF's remaining ~100 images; only the two that make an exercise work.
