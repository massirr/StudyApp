## 1. Content
- [ ] 1.1 Draw sign SVGs (C1, C3, C31a, C33, D1, D3, D5, B1, B5, B9, B11, B15, B17, F19) in `public/images/road-test/`
- [ ] 1.2 Write `src/data/subjects/road-test.json`: sources, five topics (summary, subtopics, sourceLinks with VSV videos), notes, bilingual questions
- [ ] 1.3 Exam centre and interpreter rules in topic 1; no exam date
- [ ] 1.4 Keep answer letters balanced per topic (spread 2 or less) and option ids positional

## 2. Tests
- [ ] 2.1 `src/data/subjects/road-test.test.ts`: registered, five topics, sources listed, images exist, bilingual prompts, typed answers, C1 meaning, interpreter languages, video links listed

## 3. Verify
- [ ] 3.1 `npm run test:unit`, `npm run lint`, `npm run build`
- [ ] 3.2 View the topic page and a sign question at 390 px; check each sign by eye
- [ ] 3.3 Archive with `openspec archive road-test-subject`
