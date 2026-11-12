## 1. Content
- [ ] 1.1 Add source `src-22` (GOCA Doc. 133, version 18.08.2026, PDF URL) to `sources`
- [ ] 1.2 Add `q-82` to `q-88` to `t-4` (5 single-choice, 2 typed vocabulary) in the brochure's wording, each citing `src-22`
- [ ] 1.3 Keep the `t-4` answer-letter spread at 2 or less and option ids positional
- [ ] 1.4 Extend note `note-4` with what the examiner expects and the brochure URL
- [ ] 1.5 Update `content/vehicle-check/exam-procedure.md`

## 2. Verify
- [ ] 2.1 `npm run test:unit`
- [ ] 2.2 `npm run lint` and `npm run build`
- [ ] 2.3 View the new questions at phone width (Playwright, 390 px) and answer them
- [ ] 2.4 Re-read every option set against the brochure (no distractor that is also right)
- [ ] 2.5 Archive with `openspec archive vehicle-check-exam-wording`
