## Why

The current MCQ bank only tests conceptual recall. Harder DP-750 exam questions require reading and reasoning about Python, SQL, and Databricks-specific code, so learners need practice interpreting code snippets before exam day.

## What Changes

- Extend `QuizQuestion` type with an optional `codeSnippet` field (`{ language: string; code: string }`)
- Update `QuestionDisplay` component to render syntax-highlighted code blocks when `codeSnippet` is present
- Add a second tier of harder MCQ questions (one set per topic, ~4–5 questions each) that embed code snippets in the question body
- All new questions grounded in official Microsoft/Azure Databricks documentation

## Capabilities

### New Capabilities

- `code-snippet-questions`: A set of harder MCQ questions per topic that include a code block (Python, SQL, or Databricks-specific syntax) as part of the question body, displayed in a styled `<pre><code>` block above the answer choices

### Modified Capabilities

- `quiz-flow`: `QuizQuestion` type gains an optional `codeSnippet` field; no behavioral changes to quiz logic

## Impact

- `src/types/quiz.ts` — add `codeSnippet?: { language: string; code: string }` to `QuizQuestion`
- `src/components/quiz/QuestionDisplay.tsx` — render code block when `codeSnippet` present
- `src/components/quiz/QuestionDisplay.module.css` — add monospace code block styles
- `src/data/questions.ts` — add ~4–5 new code-snippet questions per topic (25 total across 5 topics)
