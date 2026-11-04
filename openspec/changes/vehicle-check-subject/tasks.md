## 1. Research and sources
- [x] 1.1 Research the Flemish category-B exam structure from GOCA DOC. 133 and the Belgisch Staatsblad text
- [x] 1.2 Record sources, Belgian thresholds and the "not documented" list in `content/vehicle-check/exam-procedure.md`

## 2. Images
- [x] 2.1 Draw original SVG diagrams (front lights, rear lights, engine bay, dipstick levels, tyre tread, control symbols, warning lights) in `public/images/vehicle-check/`
- [x] 2.2 Check every diagram renders and the numbered markers do not overlap
- [x] 2.3 Make labelled NL/EN reference versions for the learner to save (not shipped in the app)

## 3. Subject content
- [x] 3.1 Author `src/data/subjects/vehicle-check.json` with 5 topics, notes, sources and questions (single, multiple, shortText, freeText)
- [x] 3.2 Give every prompt a Dutch phrasing and an English rendering
- [x] 3.3 Balance correct-answer letters per topic (spread of at most 2)
- [x] 3.4 Cite a listed source on every question

## 4. Tests
- [x] 4.1 Add `src/data/subjects/vehicle-check.test.ts` (topics resolve, sources listed, images exist, Belgian fog threshold, typed answers)
- [x] 4.2 Run `npm run test:unit` and fix failures
- [x] 4.3 Run `npm run build` (tsc, mcp typecheck, vite build)

## 5. Review and ship
- [x] 5.1 Open the app and check the picker, topic page and an image question at phone width
- [ ] 5.2 Commit on branch `vehicle-check-subject`, push and open a PR
- [ ] 5.3 After merge, archive the change with `openspec archive vehicle-check-subject`
