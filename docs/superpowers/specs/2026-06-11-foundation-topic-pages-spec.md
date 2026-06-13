# Foundation Spec: Topic Pages and Routing

## Goal
Build the app shell, routing, and one page per DP-750 domain/topic so the study content has a clear place to live before progress tracking and resume behavior are added.

## User Problem
The current app is fragmented: the dashboard and topic content are not connected through a clear route structure, `App.tsx` is still hardwired to a quiz placeholder, and topic data lives inside component logic instead of a reusable content model. That makes it hard to grow the app into a clean study flow for one topic at a time.

## Proposed Solution
Create a small route-driven foundation with a dashboard at `/` and one page per DP-750 topic at `/topics/:slug`.

The dashboard will act as the index of all topics. Each topic page will render a single DP-750 domain/topic with its overview, subtopics, source links, and next-study prompts. The topic list will come from a dedicated data module so the app can scale without hardcoded component logic.

This foundation intentionally does not include progress persistence, streaks, quiz state, or authentication. Those belong in later specs.

## User Flow
1. The user opens the app at `/` and sees a dashboard that lists all DP-750 topics.
2. The user selects a topic from the dashboard.
3. The app navigates to `/topics/:slug` and shows the dedicated topic page.
4. The user reads the topic overview, scans subtopics, and follows the official Microsoft source links.
5. The user navigates back to the dashboard to choose another topic.

## Page / Component Structure
### Pages
- `DashboardPage`: lists all DP-750 topics and links into their pages.
- `TopicPage`: shows one topic at a time.
- `NotFoundPage`: handles unknown routes and missing topic slugs.

### Components
- `AppShell`: shared frame for the app, including title and global navigation.
- `TopicList`: renders the dashboard topic cards.
- `TopicCard`: shows a topic title, short description, and link to the topic page.
- `TopicHeader`: displays the current topic title and summary on the topic page.
- `SubtopicList`: renders the subtopics for the current topic.
- `SourceLinkList`: shows official Microsoft source links for the current topic.
- `Breadcrumbs`: provides simple navigation back to the dashboard.

### Files and Responsibilities
- `src/App.tsx`: route selection and app-level shell composition.
- `src/pages/DashboardPage.tsx`: dashboard page UI.
- `src/pages/TopicPage.tsx`: topic page UI.
- `src/pages/NotFoundPage.tsx`: fallback route UI.
- `src/data/topics.ts`: authoritative topic metadata for the foundation layer.
- `src/components/*`: reusable presentational pieces for dashboard and topic pages.

## Data Model
The foundation layer needs a static topic catalog that can drive both the dashboard and the topic page routes.

### Topic
- `id`: stable internal identifier.
- `slug`: URL-safe route segment used in `/topics/:slug`.
- `title`: display title for the topic.
- `summary`: short description shown on the dashboard and topic page.
- `subtopics`: ordered list of smaller study items for that topic.
- `sourceLinks`: official Microsoft URLs relevant to the topic.
- `studyOrder`: number used to control dashboard ordering.

### Subtopic
- `id`: stable identifier within the parent topic.
- `title`: short subtopic title.
- `summary`: one-line explanation of the subtopic.

### SourceLink
- `label`: human-readable link text.
- `url`: official Microsoft URL.

The topic catalog should be the single source of truth for the dashboard and topic pages. Component code should not hardcode the topic list.

## Source Requirements
- The topic catalog must be derived from the official DP-750 Microsoft source material.
- The dashboard and topic pages may only link to official Microsoft Learn or official Microsoft product documentation.
- No community blogs, forums, YouTube videos, or practice dump sites are allowed in the foundation data model.
- The exact topic list must be populated from the current official DP-750 outline before implementation is considered complete.

## Acceptance Criteria
- The app renders a dashboard at `/` that lists all DP-750 topics.
- Each topic has its own route at `/topics/:slug`.
- Each topic route renders the correct topic content for the selected slug.
- Unknown topic slugs and unknown routes show a friendly not-found page.
- Topic and dashboard content come from a reusable topic data module instead of hardcoded component branches.
- Topic pages display only official Microsoft source links.
- The app no longer depends on the quiz placeholder as the default render path.

## Non-Goals
- LocalStorage persistence.
- Resume state.
- Study streak tracking.
- Quiz flow and answer submission.
- Authentication.
- Backend APIs.
- Cloud sync.
- Mobile app support.
- AI features exposed to users.

## Test Plan
- Verify `/` loads the dashboard and shows all topic cards.
- Verify a known topic slug renders the expected topic page.
- Verify an unknown slug renders the not-found page.
- Verify dashboard links navigate to the matching topic route.
- Verify each topic page renders at least one official Microsoft source link.
- Verify the app does not default to the quiz placeholder on the root route.

## Open Questions
- None for the foundation slice. The route shape, page boundaries, and data model are intentionally fixed here so the next spec can focus only on persistence.
