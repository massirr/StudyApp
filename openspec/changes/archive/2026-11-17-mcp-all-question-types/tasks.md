## 1. Tool schemas
- [x] 1.1 In `mcp/tools.ts`, extend `QuestionSchema`: `type` accepts `single | multiple | shortText | freeText`; add optional `acceptedAnswers: string[]`, `sampleAnswer: string`, `image: { src: string; alt: string }`
- [x] 1.2 Replace the hand-written `update_question` patch with `QuestionSchema.omit({ topicId: true }).partial()`
- [x] 1.3 Export `QuestionSchema`; add no per-type rules to the zod schemas (`validateSubject` stays the only rule set). The `add_question`/`update_question` descriptions spell out the per-type fields, since MCP clients read those and not the README

## 2. Tests (`mcp/tools.test.ts`)
- [x] 2.1 A valid `shortText` question commits and the committed subject validates with `acceptedAnswers` intact
- [x] 2.2 A `shortText` question without `acceptedAnswers` returns `isError` and does not commit
- [x] 2.3 A `freeText` question with `sampleAnswer` commits; without it returns `isError` and does not commit
- [x] 2.4 An image with empty `alt` returns `isError` and does not commit; an image with no `alt` is rejected by the schema and does not commit
- [x] 2.5 A valid image passes the schema-validating server and is stored on the committed question
- [x] 2.6 `update_question` switches a question to `shortText` and adds an image; the same switch without `acceptedAnswers` does not commit; an empty `alt` in a patch does not commit
- [x] 2.7 Type-level: `z.infer<typeof QuestionSchema>` equals `NewQuestion` (checked by deleting `sampleAnswer` from the schema: `npm run typecheck:mcp` fails, and passes again once restored)

## 3. Docs
- [x] 3.1 Document the question fields per type in `mcp/README.md`

## 4. Verify
- [x] 4.1 `npm run test:unit` (165/165 pass; the 9 new runtime tests all fail against the previous `mcp/tools.ts`)
- [x] 4.2 `npm run lint` (0 problems)
- [x] 4.3 `npm run build` (includes `typecheck:mcp`)
- [x] 4.4 Through the real `@modelcontextprotocol/sdk` server over an in-memory transport (throwaway check, not committed): both tools advertise the new fields and the four-value `type` enum; a `shortText` question with an image commits intact; one without `acceptedAnswers` returns the `validateSubject` error; an image without `alt` fails the SDK's input validation
- [x] 4.5 Archive with `openspec archive mcp-all-question-types`
