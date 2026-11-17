## 1. Tool schemas
- [x] 1.1 In `mcp/tools.ts`, move `add_topic`'s inline topic object into an exported `TopicSchema` and add optional `passage: { title?: string; text: string }` and `audio: { src: string; title?: string }`
- [x] 1.2 Replace the hand-written `update_topic` patch with `TopicSchema.partial()`
- [x] 1.3 Add no content rules to the zod schemas (`validateSubject` stays the only rule set). The `add_topic`/`update_topic` descriptions name `passage` and `audio` and their shape, since MCP clients read those and not the README

## 2. Tests (`mcp/tools.test.ts`, schema-validating fake server)
- [x] 2.1 `add_topic` with a `passage` and `audio` commits, and the committed subject validates with both intact
- [x] 2.2 `add_topic` with a `passage` without `text` returns `isError` and does not commit
- [x] 2.3 `add_topic` with `audio` without `src` returns `isError` and does not commit
- [x] 2.4 `update_topic` adds a `passage` and `audio` to an existing topic and commits them
- [x] 2.5 `update_topic` with a `passage` without `text`, or `audio` without `src`, returns `isError` and does not commit
- [x] 2.6 Type-level: `z.infer<typeof TopicSchema>` equals `NewTopic` (checked by removing `audio` from the schema: `npm run typecheck:mcp` fails with TS2344 at the `expectTypeOf` line, and passes again once restored)

## 3. Docs
- [x] 3.1 Document the topic fields in `mcp/README.md`

## 4. Verify
- [x] 4.1 `npm run test:unit` (172/172 pass; the 6 new runtime tests all fail against the previous `mcp/tools.ts`)
- [x] 4.2 `npm run lint` (0 problems)
- [x] 4.3 `npm run build` (includes `typecheck:mcp`)
- [x] 4.4 Through the real `@modelcontextprotocol/sdk` server over an in-memory transport (throwaway check, not committed): both tools advertise `passage` (`text` required) and `audio` (`src` required); a topic with both commits intact; a passage without `text` fails the SDK's input validation (`-32602`) and does not commit
- [x] 4.5 Archive with `openspec archive mcp-topic-passage-audio`
