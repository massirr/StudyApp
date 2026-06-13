# LocalStorage Progress Model Spec

## Goal
Persist study progress locally so the app can remember topic completion, subtopic completion, and user preferences between browser sessions.

## User Problem
A topic-page-only app is not enough on its own: users need their study progress to survive refreshes and return visits without requiring an account or backend. The current prototype stores some state directly inside components, which makes persistence fragile and hard to reuse across pages.

## Proposed Solution
Create a dedicated LocalStorage-backed progress layer with a single storage contract for the app.

The layer will own reading, writing, and resetting study progress data. It will be used by the dashboard and topic pages later, but the persistence logic itself will live in reusable utilities and hooks rather than inside page components.

The storage model should be simple, versioned, and tolerant of missing or partial data so the app can recover cleanly if browser storage is empty or stale.

## User Flow
1. The user opens the app in a browser that already has saved progress.
2. The app loads persisted study data from LocalStorage.
3. The app restores completed topics, topic-level completion, and saved preferences.
4. The user completes more study items.
5. The app writes the updated state back to LocalStorage automatically.
6. If the user clears browser storage, the app falls back to a clean initial state.

## Page / Component Structure
### Pages
- `DashboardPage`: reads persisted progress and shows current completion state.
- `TopicPage`: reads and updates persisted progress for the active topic.

### Components
- `ProgressProvider`: owns in-memory progress state for the app.
- `useProgress`: exposes progress state and update helpers to pages and components.
- `storage.ts`: performs the actual LocalStorage read/write/reset operations.
- `progressSerializer.ts`: normalizes data into a safe versioned format.

### Files and Responsibilities
- `src/context/ProgressContext.tsx`: shared progress state and update entry point.
- `src/hooks/useProgress.ts`: hook used by UI components to access progress.
- `src/utils/storage.ts`: raw LocalStorage access.
- `src/utils/progressSerializer.ts`: versioning, normalization, and migration helpers.
- `src/types/progress.ts`: shared progress types.

## Data Model
The app needs one persisted object that represents user progress.

### ProgressState
- `version`: storage schema version.
- `completedTopicIds`: list of topic ids the user has marked complete.
- `completedSubtopicIds`: list of completed subtopic ids keyed by topic.
- `lastVisitedTopicSlug`: optional topic slug for the user’s most recent study session.
- `preferences`: optional object for saved UI choices.

### Preferences
- `theme`: optional display preference if the app later needs one.
- `compactMode`: optional layout preference.
- `showCompletedTopics`: optional dashboard filter preference.

### Storage Key
Use one stable app key for the whole progress object, plus an explicit version number inside the payload.

The persisted shape should tolerate missing fields and default them safely when loaded.

## Source Requirements
- This spec is about app state only and does not require Microsoft source content.
- The storage model must support DP-750 topic content produced from official Microsoft sources, but it must not itself introduce or validate study facts.
- No persistence fields may encode unsupported exam content or unofficial study data.

## Acceptance Criteria
- The app can save progress to LocalStorage without user action.
- The app can load saved progress on refresh or return visit.
- The app can recover from an empty, missing, or malformed LocalStorage payload.
- The storage format includes a version field so future migrations are possible.
- The persistence layer is separated from page components and is reusable across the dashboard and topic pages.
- Clearing browser storage resets the app to a clean default state.

## Non-Goals
- Routing.
- Dashboard layout.
- Resume behavior.
- Quiz flow.
- Authentication.
- Backend APIs.
- Cloud synchronization.
- Multi-device sync.
- AI features.

## Test Plan
- Verify a fresh browser session loads default progress state.
- Verify completed topics persist after a refresh.
- Verify malformed LocalStorage data is ignored safely.
- Verify clearing storage restores the initial state.
- Verify versioned payloads can be parsed without breaking the app.
- Verify the progress hook returns the same data shape to dashboard and topic pages.

## Open Questions
- Should preferences be stored in the same payload as progress, or split into a separate key?
- Should the app track only topic-level progress in v1, or also subtopic-level completion from the start?
