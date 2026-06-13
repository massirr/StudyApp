# Dashboard and Resume Behavior Spec

## Goal
Give users a clear dashboard that summarizes their DP-750 study progress and provides a reliable way to resume from where they left off.

## User Problem
Once the app has topic pages and saved progress, users still need a single place to see their overall study status and return to the next meaningful step. Without a defined dashboard/resume pattern, the app feels like a pile of pages instead of a study workflow.

## Proposed Solution
Build the dashboard as the study home screen and make it the default landing page at `/`.

The dashboard will summarize the user’s progress across all topics, show what is incomplete, and provide a resume action that opens the most relevant next topic page. The resume action should prefer the most recently visited incomplete topic when available, and fall back to the first incomplete topic when there is no recent session.

The dashboard must stay lightweight and must not duplicate the full topic content. It is an overview and navigation surface, not a second copy of the study material.

## User Flow
1. The user opens the app and lands on the dashboard.
2. The dashboard shows overall progress, remaining topics, and the next recommended topic.
3. The user selects Resume to continue studying.
4. The app opens the most relevant topic page.
5. The user can also choose any other topic directly from the dashboard.
6. After completing work in a topic page, the dashboard reflects the updated state on return visit.

## Page / Component Structure
### Pages
- `DashboardPage`: primary home screen with progress summary and topic navigation.
- `TopicPage`: destination for resume navigation and manual topic selection.

### Components
- `DashboardHero`: shows the current study summary and resume call to action.
- `ProgressSummary`: shows completion counts and high-level study status.
- `TopicOverviewList`: lists topics with short status indicators.
- `ResumeButton`: navigates to the recommended next topic.
- `ContinueCard`: shows the single best next action for the user.

### Files and Responsibilities
- `src/pages/DashboardPage.tsx`: dashboard layout and orchestration.
- `src/components/dashboard/*`: dashboard-specific presentational components.
- `src/utils/resumeTopic.ts`: selects the best topic to resume.
- `src/context/ProgressContext.tsx`: supplies saved progress and last visited topic state.
- `src/data/topics.ts`: topic metadata used to build dashboard cards and resolve resume targets.

## Data Model
The dashboard needs access to persisted progress plus a small amount of derived state.

### Inputs
- `completedTopicIds`: topic ids the user has completed.
- `completedSubtopicIds`: per-topic subtopic completion data.
- `lastVisitedTopicSlug`: the last topic page the user opened.
- `topics`: the canonical topic catalog.

### Derived State
- `completedCount`: number of completed topics.
- `remainingCount`: number of incomplete topics.
- `completionPercent`: overall completion percentage.
- `nextTopicSlug`: the slug of the topic that Resume should open.

### Resume Selection Rule
1. If `lastVisitedTopicSlug` exists and that topic is still incomplete, resume there.
2. Otherwise, resume the first incomplete topic in study order.
3. If all topics are complete, show a completion state instead of a resume target.

## Source Requirements
- The dashboard and resume logic do not need direct Microsoft source content.
- The dashboard must display only topics that were generated from official Microsoft sources in the topic catalog.
- Dashboard labels or helper text must not introduce unsupported DP-750 facts.

## Acceptance Criteria
- The dashboard is the default page at `/`.
- The dashboard shows a progress summary using persisted study state.
- The dashboard shows a clear Resume action.
- Resume opens the most relevant incomplete topic page using the selection rule above.
- If all topics are complete, the dashboard shows a completion state instead of a broken resume target.
- The dashboard topic list is driven by the shared topic catalog, not by duplicated hardcoded content.
- Returning to the dashboard after studying reflects the saved state.

## Non-Goals
- LocalStorage implementation details.
- Topic page content structure.
- Quiz flow.
- Authentication.
- Backend APIs.
- Cloud sync.
- Cross-device sync.
- AI features.

## Test Plan
- Verify `/` loads the dashboard.
- Verify the dashboard renders the progress summary from persisted state.
- Verify Resume opens `lastVisitedTopicSlug` when that topic is still incomplete.
- Verify Resume falls back to the first incomplete topic when needed.
- Verify completed-only state shows a completion message instead of a bad link.
- Verify the dashboard topic list matches the shared catalog order.

## Open Questions
- Should the dashboard surface one recommended next topic card, or only the resume button plus the full topic list?
- Should fully completed users see a celebratory state or a neutral “all done” state?
