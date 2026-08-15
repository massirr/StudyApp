## 1. Types & schema

- [x] 1.1 In `src/types/quiz.ts`, add `image?: { src: string; alt: string }` to `QuizQuestion`
- [x] 1.2 In `src/data/subjects/schema.ts`, reject a question whose `image` is present but not an object, or whose `src`/`alt` is missing or empty (trimmed), naming the question id
- [x] 1.3 Extend `schema.test.ts`: a well-formed image validates; missing `alt`, empty `alt`, missing `src` and a non-object `image` are each rejected; existing subjects still validate

## 2. Assets

- [x] 2.1 Extract the "Een tweeling" figure (PDF p.32) and the cooking-verbs plate (PDF p.48) as JPEG into `public/images/nl3/`
- [x] 2.2 Confirm both files are served by the dev server at their `/images/nl3/...` path

## 3. Rendering

- [x] 3.1 In `QuestionDisplay.tsx`, render `<img src alt>` above the answer area when `question.image` is present, and nothing when absent
- [x] 3.2 Style it in the module CSS with `max-width: 100%; height: auto; display: block` plus the existing border/shadow idiom
- [x] 3.3 Verify no horizontal overflow at 390px

## 4. Content

- [x] 4.1 Restore `q-53` to a look-at-the-photo task using the tweeling figure, with descriptive `alt` (ages, build, hair, distinguishing features) and the prose fallback kept in the explanation
- [x] 4.2 Attach the cooking-verbs plate to the H4 imperatief/recipe question(s) with descriptive `alt`
- [x] 4.3 Record image provenance in `content/dutch/README.md`

## 5. Verify

- [x] 5.1 `npx vitest run` and `npx tsc --noEmit` green; production build succeeds
- [x] 5.2 Through the Playwright MCP (project convention — no `playwright install`, no `tests/` specs): the image renders, its accessible name equals `image.alt`, and the image loads (naturalWidth > 0)
- [x] 5.3 At 390px: image fits its card, page does not scroll horizontally
- [x] 5.4 A question without an image is unchanged
