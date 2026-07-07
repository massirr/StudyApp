## 1. Content model & loader

- [ ] 1.1 Add `Subject` type to `src/types/study.ts` (`id`, `slug`, `name`, `shortLabel`, `tagline`, `sourcePolicy`, `topics`, `questions`, `sources`, `notes`) and `level?: number` to `QuizQuestion` in `src/types/quiz.ts`
- [ ] 1.2 Write a throwaway Node script that converts `src/data/{topics,questions,sources,contentNotes}.ts` into `src/data/subjects/dp-750.json` (shortLabel `"DP-750"`, `sourcePolicy: "microsoft-only"`)
- [ ] 1.3 Create `src/data/subjects/index.ts` that imports every subject JSON, validates each, and exposes `getSubjects()` and `getSubjectBySlug(slug)`
- [ ] 1.4 Extend `src/utils/contentValidation.ts` to validate a subject against the schema and enforce its `sourcePolicy` (microsoft-only ⇒ all source URLs are `learn.microsoft.com`)
- [ ] 1.5 Remove `src/data/{topics,questions,sources,contentNotes}.ts` and repoint imports at the loader

## 2. Routing & subject picker

- [ ] 2.1 Add `SubjectPickerPage` at `src/pages/SubjectPickerPage.tsx` listing `getSubjects()` as cards linking to `/:subject`
- [ ] 2.2 Update `App.tsx` to parse a leading subject segment: `/` → picker, `/:subject` → Dashboard, `/:subject/topics/:slug` → Topic, `/:subject/quiz` → Quiz, unknown → NotFound
- [ ] 2.3 Preserve the `/topic/` → `/topics/` redirect, now under the subject segment
- [ ] 2.4 Make `DashboardPage`, `TopicPage`, `QuizPage` resolve the active subject from the URL and pass it down; scope all internal links to include the subject slug

## 3. Pixel-font hero

- [ ] 3.1 Add a 5×7 pixel-font glyph map (A–Z, 0–9, hyphen, space) and refactor `PixelLogo` to take a `text` prop, emitting the same `<rect>` structure the GSAP animation targets
- [ ] 3.2 Validate `shortLabel` at load contains only supported glyphs (fail the loader otherwise)
- [ ] 3.3 Drive the header wordmark and dashboard hero from `subject.shortLabel`; add a "Subjects" link (→ `/`) in `AppShell`
- [ ] 3.4 Replace the 4 hardcoded `"DP-750 Quiz"` strings in `components/quiz/QuizPage.tsx` with `${subject.shortLabel} Quiz`

## 4. Progress (subject-scoped + migration)

- [ ] 4.1 Update `progressStorage.ts` to v2 shape (`subjects: { [id]: {...} }`) and migrate a v1 blob under `dp-750`
- [ ] 4.2 Add `activeSubjectId` to `ProgressContext`; scope `toggleTopicComplete` / `markTopicComplete` / `setLastVisitedTopic` to the active subject
- [ ] 4.3 Update `useProgress` and consumers to read the active subject's slice

## 5. Verification

- [ ] 5.1 `npm run build` — TypeScript compiles, no errors
- [ ] 5.2 Test: pixel-font renderer produces expected glyphs for a known string
- [ ] 5.3 Test: a malformed subject JSON fails the loader validation
- [ ] 5.4 Test: a v1 progress blob migrates under `dp-750` with no data loss
- [ ] 5.5 Update Playwright tests to subject-scoped routes (`/dp-750/quiz`, etc.) and confirm they pass
- [ ] 5.6 Visually verify: picker at `/`, DP-750 hero renders via pixel font, quiz works
