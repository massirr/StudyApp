# Official Content Grounding Spec

## Goal
Define how DP-750 study content is collected, normalized, and linked so the app stays strictly grounded in official Microsoft sources.

## User Problem
The app needs more than a list of topics. It needs trustworthy study content that can power topic pages, source links, and quiz questions without drifting into unofficial summaries or invented facts. Without a dedicated grounding spec, content quality will become inconsistent and hard to audit.

## Proposed Solution
Create a content grounding pipeline that turns official Microsoft DP-750 material into a structured topic catalog with summaries, subtopics, source links, and learning notes.

The pipeline should not generate novel facts. It should organize, shorten, and connect official source material into app-ready content objects that the UI can render consistently. Each content item should be traceable back to one or more official Microsoft sources.

This spec covers the content model itself, not the UI that displays it.

## User Flow
1. A maintainer selects official Microsoft DP-750 source material.
2. The source material is broken into topics and subtopics.
3. Each topic is assigned official source links and short app-ready summaries.
4. Supporting notes and quiz references are written only from the source material.
5. The structured content is added to the app’s topic catalog.
6. The dashboard, topic pages, and quiz flow consume the same grounded content set.

## Page / Component Structure
### Data Modules
- `topics.ts`: canonical topic catalog.
- `sources.ts`: source metadata and official URL registry.
- `contentNotes.ts`: short grounded notes for topic pages.
- `questionBank.ts`: quiz content derived from the grounded material.

### Content Objects
- `TopicContent`: full content record for one DP-750 topic.
- `SourceReference`: official Microsoft link plus a label and usage note.
- `ContentNote`: short explanation or reminder grounded in a source reference.
- `QuestionSourceMap`: relation between a quiz question and the content items that support it.

### Files and Responsibilities
- `src/data/topics.ts`: topic metadata and ordering.
- `src/data/sources.ts`: official Microsoft URLs and labels.
- `src/data/contentNotes.ts`: grounded topic summaries and notes.
- `src/data/questions.ts`: quiz questions and their source mappings.
- `src/utils/contentValidation.ts`: guardrails for source completeness and allowed domains.

## Data Model
The content layer needs records that are easy to validate and hard to misuse.

### TopicContent
- `id`: stable internal identifier.
- `slug`: route-safe topic key.
- `title`: topic title.
- `summary`: short app-friendly description derived from the official sources.
- `subtopics`: ordered list of grounded subtopics.
- `sourceReferences`: official Microsoft URLs used for this topic.
- `quizQuestionIds`: questions supported by this topic’s source material.

### SourceReference
- `id`: stable source identifier.
- `label`: human-readable source label.
- `url`: official Microsoft Learn or official Microsoft documentation URL.
- `usageNote`: short description of how the source supports the topic.

### ContentNote
- `id`: stable note identifier.
- `topicId`: topic it belongs to.
- `text`: app-ready note text.
- `sourceReferenceIds`: source references used to create the note.

### QuestionSourceMap
- `questionId`: quiz question id.
- `sourceReferenceIds`: official source references that support the question.
- `topicId`: owning topic.

## Grounding Rules
- Only official Microsoft sources are allowed.
- The content layer may summarize, reorganize, and trim source material, but it may not introduce unsupported claims.
- Every topic must have at least one official source reference.
- Every quiz question must be traceable to one or more source references.
- If a content item cannot be tied back to the source material, it should not ship.
- URLs outside the approved Microsoft domains must be rejected.

## Source Requirements
- Primary source: the official DP-750 course page and official Microsoft documentation.
- Supporting sources must stay within Microsoft-owned documentation and product pages.
- No blogs, community forums, social media posts, or exam dump sources are permitted.
- The content layer should preserve enough traceability that a reviewer can audit where each topic summary and quiz question came from.

## Acceptance Criteria
- The app has a reusable topic catalog sourced only from official Microsoft content.
- Each topic includes a short summary, subtopics, and official source references.
- Each quiz question can be mapped back to one or more source references.
- The content layer rejects unsupported URLs and ungrounded notes.
- Dashboard, topic pages, and quiz content all consume the same grounded content objects.
- The content model remains simple enough to edit by hand.

## Non-Goals
- UI layout.
- Routing.
- Progress persistence.
- Resume behavior.
- Authentication.
- Backend APIs.
- AI-generated user chat.
- Automatic web scraping from arbitrary websites.

## Test Plan
- Verify only approved Microsoft domains are accepted in source references.
- Verify each topic has at least one source reference.
- Verify each quiz question has at least one source mapping.
- Verify an ungrounded content note is rejected or flagged.
- Verify dashboard and topic data can be read from the same catalog without duplication.

## Open Questions
- Should source notes store direct quotes, short paraphrases, or both?
- Should the content layer track source freshness or only validate allowed domains and traceability?
