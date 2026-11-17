## Why

The MCP content-authoring server can only write single- and multiple-choice questions. Its question schema in `mcp/tools.ts` restricts `type` to `single | multiple` and has no fields for `acceptedAnswers`, `sampleAnswer` or `image`. The `update_question` patch schema has the same gaps.

The app has supported more than that for a while. `QuizQuestion` (`src/types/quiz.ts`) also has `shortText` (graded against `acceptedAnswers`), `freeText` (self-graded against `sampleAnswer`) and an optional `image: { src, alt }`, and `validateSubject` enforces their rules. `vehicle-check.json` and `yb1398.json` use all of them: 54 typed-answer questions, 24 free-text questions and dozens of images between them. None of that content can be written or fixed through the MCP today, so it has to be edited by hand in the repo.

Two failures today:

- `add_question` with `type: "shortText"` is rejected by the schema before it reaches the handler.
- An `image` sent with a single-choice question is **silently dropped**: zod strips unknown keys, so the question commits without its picture and nothing reports it.

## What Changes

- `QuestionSchema` in `mcp/tools.ts` accepts `type` `shortText` and `freeText`, plus optional `acceptedAnswers: string[]`, `sampleAnswer: string` and `image: { src: string; alt: string }`.
- The `update_question` patch schema accepts the same fields. It is derived from `QuestionSchema` (all fields optional, `topicId` excluded) instead of being a second hand-written list, so the two cannot drift again.
- The per-type rules stay in `validateSubject` alone, which already runs on every write through `edit()`: a `shortText` question needs a non-empty `acceptedAnswers`, a `freeText` question needs `sampleAnswer`, and an `image` needs a non-empty `src` and `alt`. The zod schemas check shape only.
- A compile-time check makes the MCP tool schema's inferred type equal to the app's question type, so a new question type or field added to `QuizQuestion` fails the build until the tool schema follows.
- `mcp/README.md` documents the question fields per type.

## Capabilities

### Modified Capabilities
- `mcp-content-authoring`: the question tools accept every question type and field the app supports, with the app's validation as the only per-type rule set.

## Impact

- `mcp/tools.ts`: the question schema, and the `update_question` patch derived from it.
- `mcp/tools.test.ts`: tests for typed-answer, free-text and image questions through the tools.
- `mcp/README.md`: the question fields.
- No change to the app, its types, `validateSubject`, the mutations or any subject JSON.

## Non-Goals

- Clearing a field with `update_question` (removing an `image`, or dropping `acceptedAnswers` after changing a question's type). A patch can set fields but not remove them, which matches the existing add/update-only rule; removals are done by hand in the repo.
- Uploading image files. `image.src` points to a file already in `public/`; adding the file itself is a repo change.
- Topic `passage` and `audio` fields, which `add_topic`/`update_topic` also lack. That is a separate change.
