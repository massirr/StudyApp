## Context

`mcp/tools.ts` defines the topic fields twice: inline in `add_topic`'s `topic` object, and again as an all-optional `patch` object in `update_topic`. Both predate `Topic.passage` and `Topic.audio`, and neither was updated when those landed in the app.

Each write goes through `edit()`: read the subject, validate it, apply the mutation, run `validateSubject` on the result, commit. `validateSubject` already checks the new fields (`src/data/subjects/schema.ts`): a present `passage` must have a string `text`, a present `audio` must have a string `src`. The mutations (`mcp/core/mutations.ts`) are typed from `Topic` (`NewTopic`, `TopicPatch` in `mcp/core/types.ts`) and already pass any field through.

The question tools had the same gap and were fixed in `mcp-all-question-types`. This change applies the same decisions to the topic tools.

## Decisions

1. **Zod checks shape, `validateSubject` checks rules.** The tool schema says which fields exist and their types: `passage` is an object with string `text` and optional string `title`; `audio` is an object with string `src` and optional string `title`. A passage sent without `text`, or audio without `src`, fails the schema because the key is required in the object's shape, and the handler never runs. Anything conditional or content-level stays in `validateSubject`, which runs on every write. No `.min(1)`, no `.refine()`.

2. **Name the topic schema and derive the patch from it.** The inline `topic` object becomes an exported `TopicSchema`, and `update_topic`'s patch becomes `TopicSchema.partial()`. `TopicSchema` has no `id` (the mutation assigns it), so this matches `TopicPatch` (`Partial<Omit<Topic, 'id'>>`) and removes the second list that went out of date. `.partial()` is shallow, so a patched `passage` or `audio` must still be complete: to change a passage's title, send its `text` too. That matches how `image` and `codeSnippet` patch on questions.

3. **Compile-time guard against drift.** The tests assert `z.infer<typeof TopicSchema>` equals `NewTopic` with `expectTypeOf(...).toEqualTypeOf()`. `tsconfig.mcp.json` includes `mcp/`, so `npm run build` fails if `Topic` gains a field the tool schema lacks. The guard is how `QuestionSchema` is kept in step; the topic schema gets the same one.

4. **Patches set, never unset.** `update_topic` can add or replace a `passage` or `audio`, not remove one. Removing fields is out of scope (see proposal non-goals), as it is for questions.

5. **Tool descriptions spell out the optional fields.** MCP clients read the tool descriptions, not the README, so `add_topic` and `update_topic` name `passage` and `audio`, their shape, and that `audio.src` must already be in `public/`.

## Risks

- `validateSubject` checks only that `passage.text` and `audio.src` are strings, so an empty string passes both the schema and the validator, as it does when the app loads a subject. The MCP accepts exactly what the app accepts; tightening that rule is a separate change.
- A client that relied on an unknown `passage` or `audio` being dropped now gets it stored. That is the intended behaviour.
- `expectTypeOf(...).toEqualTypeOf()` is strict about optional-vs-`undefined` differences. It already holds for `QuestionSchema` with nested optional objects, so the same pattern is expected to hold here; if it does not, the check is adjusted, not removed.

## Test plan

In `mcp/tools.test.ts`, using the mocked GitHub layer and the schema-validating fake server (schema parsed before the handler runs, as the real MCP server does):

- `add_topic` with a `passage` (with title) and `audio` (with title) commits, and the committed subject passes `validateSubject` with both stored intact (the regression for the silent strip).
- `add_topic` with a `passage` that has no `text` returns `isError` and does not commit.
- `add_topic` with `audio` that has no `src` returns `isError` and does not commit.
- `update_topic` adds a `passage` and `audio` to an existing topic and commits them.
- `update_topic` with a `passage` without `text`, or `audio` without `src`, returns `isError` and does not commit.
- Type-level: the tool schema's inferred type equals `NewTopic`.
