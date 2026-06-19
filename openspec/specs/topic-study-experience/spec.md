# Topic Study Experience Spec

## Goal
Define the in-page study experience for a single DP-750 topic so users can read, scan, and act on the topic without the page feeling overloaded.

## User Problem
The foundation spec establishes routes and topic pages, but a topic page still needs a clear internal structure. Without a defined study experience, the page can become an unstructured wall of text or a disconnected set of cards.

## Proposed Solution
Turn each topic page into a focused study workspace with a predictable sequence: overview, subtopics, source links, learning prompts, and quiz entry.

The topic page should help users understand what the topic covers, where to go next, and how to continue studying without leaving the page’s context. It should feel compact and purposeful, not like a general content dump.

## User Flow
1. The user opens a topic page from the dashboard.
2. The page shows the topic title, summary, and a brief orientation.
3. The user scans the subtopics to understand the learning scope.
4. The user opens official source links when they want more detail.
5. The user uses the study prompts to decide what to review next.
6. The user moves into the quiz section when ready.

## Page / Component Structure
### Pages
- `TopicPage`: full study page for one DP-750 topic.

### Components
- `TopicHero`: summarizes the current topic and its purpose.
- `TopicScope`: shows what is covered and what is not.
- `SubtopicStack`: presents the ordered subtopics.
- `SourceRail`: groups official Microsoft source links.
- `StudyPromptPanel`: shows short next-step prompts.
- `QuizEntryCard`: links into the topic quiz section.

### Files and Responsibilities
- `src/pages/TopicPage.tsx`: page orchestration and layout.
- `src/components/topic/*`: topic-specific presentational pieces.
- `src/data/topics.ts`: topic metadata, subtopics, and source links.

## Data Model
The page needs a stable topic record that is reused throughout the app.

### Topic
- `id`: stable internal id.
- `slug`: route key.
- `title`: topic name.
- `summary`: short description.
- `scope`: brief description of what the topic covers.
- `subtopics`: ordered learning items.
- `sourceReferences`: official source links.
- `studyPrompts`: short prompts that steer review.

### StudyPrompt
- `id`: prompt identifier.
- `text`: prompt text.
- `intent`: the learning outcome the prompt supports.

## Interaction Rules
- The topic page must always make the current topic obvious.
- Source links should be visible without requiring a separate navigation path.
- Subtopics should be ordered and scannable.
- Study prompts should be short and action-oriented.
- The quiz entry should be available from the topic page, but it should not interrupt reading.

## Source Requirements
- All topic content must come from official Microsoft sources only.
- The page may summarize and organize source material, but it may not add unsupported facts.
- Source links must point to official Microsoft documentation or Microsoft Learn.
- Any study prompt that cannot be grounded in the source material should be removed.

## Acceptance Criteria
- Every topic page clearly shows the current topic title and summary.
- Every topic page shows its subtopics in a stable order.
- Every topic page shows official Microsoft source links.
- Every topic page includes short study prompts.
- The page provides a clear path into the topic quiz.
- Topic content is pulled from the shared topic catalog rather than hardcoded in the page component.

## Non-Goals
- Progress persistence.
- Dashboard summaries.
- Resume selection.
- Quiz scoring logic.
- Authentication.
- Backend APIs.
- Cloud sync.
- AI chat.

## Test Plan
- Verify the topic page shows the correct topic metadata for a known slug.
- Verify the page shows subtopics in the expected order.
- Verify official source links are visible and usable.
- Verify study prompts render with the topic.
- Verify the quiz entry is present but does not replace the topic content.

## Open Questions
- Should the topic page use a single-column reading layout or a two-column study layout on wide screens?
- Should study prompts be static or generated from a template per topic type?
