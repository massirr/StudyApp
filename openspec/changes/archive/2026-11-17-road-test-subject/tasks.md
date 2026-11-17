## 1. Content
- [x] 1.1 Draw sign SVGs (C1, C3, C31a, C33, D1, D3, D5, B1, B5, B9, B11, B15, B17, F19) in `public/images/road-test/` (checked by eye on a contact sheet; C31a arrow moved out from under the red bar)
- [x] 1.2 Write `src/data/subjects/road-test.json`: 4 document sources + 10 VSV videos (each checked with YouTube oEmbed: title and channel VSVVerkeerskunde), five topics, five notes, 63 bilingual questions
- [x] 1.3 Exam centre and interpreter rules in topic 1; no exam date
- [x] 1.4 Answer letters balanced per topic (generator rotates the correct position) and option ids positional

## 2. Tests
- [x] 2.1 `src/data/subjects/road-test.test.ts`: 20 tests (registered, topics, sources and video links listed, images exist, bilingual prompts, typed answers, C1 meaning, GPS vs sign, interpreter, companion, parallel parking). Mutation check: removing the Mollem address makes the intro test fail

## 3. Verify
- [x] 3.1 `npm run test:unit` (180 tests pass), `npm run lint` (0 errors), `npm run build`
- [x] 3.2 Playwright at 390 px: subject in the picker, intro topic with address and links, 5 manoeuvre video links, first sign question shows `c1.svg`; no failed requests
- [x] 3.3 Archive with `openspec archive road-test-subject`
