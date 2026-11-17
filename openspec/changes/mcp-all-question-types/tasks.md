## 1. Tool schemas
- [ ] 1.1 In `mcp/tools.ts`, extend `QuestionSchema`: `type` accepts `single | multiple | shortText | freeText`; add optional `acceptedAnswers: string[]`, `sampleAnswer: string`, `image: { src: string; alt: string }`
- [ ] 1.2 Replace the hand-written `update_question` patch with `QuestionSchema.omit({ topicId: true }).partial()`
- [ ] 1.3 Export `QuestionSchema`; add no per-type rules to the zod schemas (`validateSubject` stays the only rule set)

## 2. Tests (`mcp/tools.test.ts`)
- [ ] 2.1 A valid `shortText` question commits and the committed subject validates with `acceptedAnswers` intact
- [ ] 2.2 A `shortText` question without `acceptedAnswers` returns `isError` and does not commit
- [ ] 2.3 A `freeText` question with `sampleAnswer` commits; without it returns `isError` and does not commit
- [ ] 2.4 An image with empty `alt` returns `isError` and does not commit; an image with no `alt` is rejected by the schema and does not commit
- [ ] 2.5 A valid image passes the schema-validating server and is stored on the committed question
- [ ] 2.6 `update_question` switches a question to `shortText` and adds an image; the same switch without `acceptedAnswers` does not commit
- [ ] 2.7 Type-level: `z.infer<typeof QuestionSchema>` equals `NewQuestion`

## 3. Docs
- [ ] 3.1 Document the question fields per type in `mcp/README.md`

## 4. Verify
- [ ] 4.1 `npm run test:unit`
- [ ] 4.2 `npm run lint`
- [ ] 4.3 `npm run build` (includes `typecheck:mcp`)
- [ ] 4.4 Archive with `openspec archive mcp-all-question-types`
