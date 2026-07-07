## Why

StudyApp is hardcoded to DP-750. Content lives in flat TypeScript arrays (`src/data/*.ts`), the string "DP-750" and its pixel-art logo are baked into the header, hero, and quiz titles, the Official Source Rule is enforced globally, and progress assumes a single subject. The user wants to reuse the same app for other study subjects, switch between them in-app, and (a later feature) author content via an MCP. That requires making the app subject-agnostic and moving content into a structured, machine-editable format the MCP can safely read and write.

## What Changes

- Introduce a `Subject` entity. Content is grouped **per subject as JSON files** (`src/data/subjects/<slug>.json`), validated against a schema at load, replacing the flat `src/data/*.ts` arrays. Existing DP-750 content is migrated by a one-time script.
- Add a **subject picker** at `/` and scope all routes under a subject segment: `/:subject`, `/:subject/topics/:slug`, `/:subject/quiz?topic=:slug`. The `/topic/` → `/topics/` redirect is preserved, now subject-scoped.
- Make **progress subject-scoped** in localStorage (`version: 2`) with an automatic migration that wraps existing v1 single-subject data under `dp-750`, losing nothing.
- Replace the hardcoded "DP-750" pixel SVG with a **pixel-font renderer** that draws any subject's short label (A–Z, 0–9, hyphen, space) using the same GSAP random-stagger + float animation.
- Drive the header wordmark, dashboard hero, and quiz titles from the **active subject**. Replace the global Microsoft-only source rule with a per-subject `sourcePolicy` (`dp-750` keeps `microsoft-only`).
- Add an optional `level?` field to the question schema now (unused in this change) so the MCP's future "level 2 quizzes" need no schema migration.

## Capabilities

### New Capabilities

- `subject-catalog`: Multiple subjects coexist. A picker at `/` lists them; routes are scoped under `/:subject`; the active subject drives header/hero/quiz branding.
- `subject-content-model`: Per-subject JSON content files with a validated schema and a build-time loader/registry, replacing hand-written TypeScript data arrays.
- `pixel-font-hero`: The animated pixel wordmark renders any subject short label from a reusable pixel-font glyph map.

### Modified Capabilities

- `localstorage-progress`: Progress is stored per subject (v2) with automatic migration of v1 single-subject data under `dp-750`.
- `content-grounding`: Source-URL policy becomes a per-subject setting (`sourcePolicy`); `dp-750` retains `microsoft-only`.

## Impact

- `src/data/subjects/dp-750.json` — new; migrated DP-750 content (topics, questions, sources, notes)
- `src/data/subjects/index.ts` — new; loads + validates all subject JSON, exposes `getSubjects()` / `getSubjectBySlug()`
- `src/data/topics.ts`, `questions.ts`, `sources.ts`, `contentNotes.ts` — removed after migration
- `src/types/study.ts`, `src/types/quiz.ts` — add `Subject` type, `sourcePolicy`, optional `level?`
- `src/utils/contentValidation.ts` — validate a subject against schema + its `sourcePolicy`
- `src/App.tsx` — subject-scoped routing + `SubjectPickerPage`
- `src/pages/SubjectPickerPage.tsx` — new
- `src/pages/DashboardPage.tsx`, `TopicPage.tsx`, `QuizPage.tsx` — read active subject; scoped links
- `src/components/quiz/QuizPage.tsx` — quiz titles from `subject.shortLabel`
- `src/components/common/PixelLogo.tsx` — pixel-font renderer with a `text` prop
- `src/components/AppShell.tsx` — subject wordmark + "Subjects" link
- `src/context/ProgressContext.tsx`, `src/hooks/useProgress.ts`, `src/utils/progressStorage.ts` — subject-scoped state + v1→v2 migration
- `tests/*.spec.ts` — updated to subject-scoped routes; new pixel-font + migration checks
