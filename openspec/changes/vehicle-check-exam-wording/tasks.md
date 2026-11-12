## 1. Content
- [x] 1.1 Add source `src-22` (GOCA Doc. 133, version 18.08.2026, PDF URL) to `sources`
- [x] 1.2 Add `q-82` to `q-88` to `t-4` (5 single-choice, 2 typed vocabulary) in the brochure's wording, each citing the brochure
- [x] 1.3 Keep the `t-4` answer-letter spread at 2 or less and option ids positional (a/b/c/d = 7/6/7/6)
- [x] 1.4 Extend note `note-4` with what the examiner expects and the brochure URL
- [x] 1.5 Update `content/vehicle-check/exam-procedure.md` (new "What the examiner expects" section; section 4 marked as background)

## 2. Verify
- [x] 2.1 `npm run test:unit` (155/155 pass; the data-driven tests cover the new questions)
- [x] 2.2 `npm run lint` (0 errors) and `npm run build`
- [x] 2.3 View the new questions at phone width (Playwright, 390 px) and answer them: all seven were marked correct with their correct answer, including the typed `ventiel` and `motorkap`; the topic quiz now has 38 questions
- [x] 2.4 Re-read every option set against the brochure (no distractor that is also right)
- [x] 2.5 Archive with `openspec archive vehicle-check-exam-wording`
