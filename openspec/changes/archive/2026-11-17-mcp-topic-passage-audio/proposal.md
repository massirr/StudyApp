## Why

The MCP content-authoring server cannot write a topic's reading passage or listening clip. `add_topic` and `update_topic` in `mcp/tools.ts` define their topic fields by hand and neither has `passage` or `audio`.

The app has supported both since the Dutch study change: `Topic` (`src/types/study.ts`) has an optional `passage: { title?, text }` and `audio: { src, title? }`, the quiz page renders them above the topic's questions, and `validateSubject` checks them. That change listed updating the MCP schema as a non-goal, so the tools never followed. `yb1398.json` already has two topics with passages, and they can only be written or fixed by hand in the repo.

The failure is silent: zod strips unknown keys, so a `passage` or `audio` sent to `add_topic` or `update_topic` is dropped, the call succeeds, and the topic commits without it. This is the same gap the question tools had, fixed in `mcp-all-question-types`.

## What Changes

- `add_topic`'s topic schema moves out of the tool call into an exported `TopicSchema` in `mcp/tools.ts` and gains optional `passage: { title?: string; text: string }` and `audio: { src: string; title?: string }`.
- `update_topic`'s patch is derived from it (`TopicSchema.partial()`) instead of being a second hand-written list, so the two cannot drift.
- The zod schemas check shape only. `validateSubject`, which already runs on every write through `edit()`, stays the only rule set: a passage needs `text`, audio needs `src`.
- A compile-time check makes the tool schema's inferred type equal to the app's topic type, so a field added to `Topic` fails the build until the tool schema follows.
- The `add_topic`/`update_topic` descriptions and `mcp/README.md` document the topic fields.

## Capabilities

### Modified Capabilities
- `mcp-content-authoring`: the topic tools accept every topic field the app supports, with the app's validation as the only rule set.

## Impact

- `mcp/tools.ts`: the topic schema, and the `update_topic` patch derived from it.
- `mcp/tools.test.ts`: tests for passages and audio through the tools, and the type-level guard.
- `mcp/README.md`: the topic fields.
- No change to the app, its types, `validateSubject`, the mutations or any subject JSON.

## Non-Goals

- Clearing a field with `update_topic` (removing a `passage` or `audio`). A patch can set fields but not remove them, as for questions; removals are done by hand in the repo.
- Uploading audio files. `audio.src` points to a file already in `public/` (e.g. `/audio/dutch/...mp3`); adding the file itself is a repo change.
- Tightening `validateSubject` (for example, rejecting an empty `text` or `src`). That would change what the app accepts at load, which is a separate decision.
