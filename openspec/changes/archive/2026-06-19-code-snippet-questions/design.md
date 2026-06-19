## Context

The quiz system renders `QuizQuestion` objects from `src/data/questions.ts`. Each question has a `prompt` string and optional `mediaUrl` for images. The `QuestionDisplay` component already conditionally renders `mediaUrl`. There is no code rendering path today.

## Goals / Non-Goals

**Goals:**
- Add an optional `codeSnippet` field to `QuizQuestion` (type + language metadata)
- Render code snippets in a styled monospace block above the answer choices
- Add ~4–5 harder MCQ questions per topic (25 total) that use code snippets
- Keep the question data structure backwards-compatible (field is optional)

**Non-Goals:**
- Full syntax highlighting with a library (Prism/Shiki) — adds bundle weight for marginal benefit in a study tool
- Code execution or interactivity
- A code editor component
- Changing quiz scoring or flow logic

## Decisions

### D1: No syntax-highlighting library

Use a styled `<pre><code>` block with CSS custom properties instead of adding Prism or Shiki.

Rationale: The app already avoids heavy dependencies. Monospace font + background color is sufficient for readability at exam-prep difficulty. Can migrate to Shiki later if desired.

### D2: `codeSnippet` as an optional field, not a question sub-type

Alternative: create `type: 'code-snippet'` as a new question variant.

Chosen: optional field on existing type. Code-snippet questions are still MCQ questions — the snippet is part of the question body, not a new interaction mode. No changes to quiz flow, scoring, or navigation logic.

### D3: Language stored as a string (not enum)

Allows `'python'`, `'sql'`, `'bash'`, `'text'` without a schema migration. Used for display label only (no runtime parsing).

## Risks / Trade-offs

- [Code block accessibility] `<pre><code>` without ARIA labels is not ideal for screen readers → Mitigation: add `role="region"` and `aria-label="Code snippet"` to the wrapper.
- [Long code lines] Wide snippets will scroll horizontally on mobile → Mitigation: `overflow-x: auto` on the pre element; keep snippets short (≤10 lines).
- [Content accuracy] Code snippets must match official Azure Databricks / DP-750 API behavior → Mitigation: all snippets verified against Microsoft Learn docs; source URLs required per question.

## Migration Plan

1. Extend `QuizQuestion` type (non-breaking, field is optional)
2. Update `QuestionDisplay` to render code block when field is present
3. Add CSS styles for code block
4. Add 25 new questions to `questions.ts`

No rollback complexity — data is static and bundled; reverting means removing the questions and field.
