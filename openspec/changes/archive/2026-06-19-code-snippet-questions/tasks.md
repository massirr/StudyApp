## 1. Type Extension

- [x] 1.1 Add `codeSnippet?: { language: string; code: string }` to `QuizQuestion` in `src/types/quiz.ts`

## 2. Component Update

- [x] 2.1 Update `QuestionDisplay` to conditionally render a `<pre><code>` block when `codeSnippet` is present, with `role="region"` and `aria-label="Code snippet"`
- [x] 2.2 Add CSS styles for the code block in `QuestionDisplay.module.css` (monospace font, muted background, `overflow-x: auto`, padding)

## 3. Question Content — Topic 01 (Plan and Design)

- [x] 3.1 Add 4–5 code-snippet MCQ questions for topic-01 to `src/data/questions.ts`, grounded in official Azure Databricks docs, with source URLs

## 4. Question Content — Topic 02 (Ingest and Transform)

- [x] 4.1 Add 4–5 code-snippet MCQ questions for topic-02 to `src/data/questions.ts`, grounded in official Azure Databricks ingestion/transformation docs, with source URLs

## 5. Question Content — Topic 03 (Governance)

- [x] 5.1 Add 4–5 code-snippet MCQ questions for topic-03 to `src/data/questions.ts`, grounded in Unity Catalog and access control docs, with source URLs

## 6. Question Content — Topic 04 (Pipelines)

- [x] 6.1 Add 4–5 code-snippet MCQ questions for topic-04 to `src/data/questions.ts`, grounded in Databricks Jobs and pipeline operation docs, with source URLs

## 7. Question Content — Topic 05 (Monitor and Optimize)

- [x] 7.1 Add 4–5 code-snippet MCQ questions for topic-05 to `src/data/questions.ts`, grounded in Azure Monitor and Databricks optimizations docs, with source URLs

## 8. Verification

- [x] 8.1 Run `npm run build` — confirm TypeScript compiles without errors
- [x] 8.2 Visually verify code block renders correctly in the quiz UI for at least one question per topic
