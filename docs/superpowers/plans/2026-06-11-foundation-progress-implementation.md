# Foundation + Progress + Resume Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement route-driven dashboard/topic pages with shared topic data, LocalStorage-backed progress state, and resume behavior as defined in approved specs.

**Architecture:** Use a lightweight path-based router in `App.tsx` (no new dependencies), a typed content catalog in `src/data/topics.ts`, and a `ProgressProvider` with LocalStorage utilities for persistence. Dashboard and topic pages consume shared data and derived resume state.

**Tech Stack:** React 18, TypeScript, Vite, Playwright

---

### Task 1: Add typed content and progress contracts

**Files:**
- Create: `src/types/study.ts`
- Create: `src/data/topics.ts`

- [ ] Define topic, subtopic, source-link, and progress-state types.
- [ ] Add a canonical `TOPICS` catalog with stable ids/slugs/order.
- [ ] Export helper lookups (`getTopicBySlug`, ordered topics).

### Task 2: Add LocalStorage persistence and resume logic

**Files:**
- Create: `src/utils/progressStorage.ts`
- Create: `src/utils/resumeTopic.ts`

- [ ] Implement versioned load/save/reset for progress payload.
- [ ] Implement safe defaults for empty/malformed storage.
- [ ] Implement resume-selection helper (last visited incomplete -> first incomplete -> undefined).

### Task 3: Add progress context and hook

**Files:**
- Create: `src/context/ProgressContext.tsx`
- Create: `src/hooks/useProgress.ts`
- Modify: `src/main.tsx`

- [ ] Create provider state with persistence effects.
- [ ] Expose actions (`toggleTopicComplete`, `setLastVisitedTopic`, `resetProgress`).
- [ ] Wrap app root with provider.

### Task 4: Implement foundation pages and shell

**Files:**
- Create: `src/components/AppShell.tsx`
- Create: `src/pages/DashboardPage.tsx`
- Modify: `src/pages/TopicPage.tsx`
- Create: `src/pages/NotFoundPage.tsx`
- Modify: `src/App.tsx`

- [ ] Add app shell with shared title/nav.
- [ ] Render dashboard at `/` with progress summary and topic list.
- [ ] Render topic pages at `/topics/:slug` with subtopics and source links.
- [ ] Add route fallback for unknown path/topic.

### Task 5: Update styles and tests

**Files:**
- Modify: `src/index.css`
- Modify: `tests/dashboard.spec.ts`
- Modify: `tests/quiz-page.screenshot.test.ts`

- [ ] Replace legacy dashboard CSS with new app-shell/dashboard/topic styles.
- [ ] Update dashboard test assertions for route-driven UI.
- [ ] Keep quiz screenshot test valid under current route mapping.

### Task 6: Verify

**Files:**
- Modify (if needed from failures): affected files above

- [ ] Run: `npm run build`
- [ ] Run: `npm run test`
- [ ] Fix any regressions introduced by this implementation slice.
