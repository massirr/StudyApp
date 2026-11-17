## Context

`mcp/tools.ts` defines two question schemas by hand: `QuestionSchema` for `add_question` and an inline `patch` object for `update_question`. Both predate `freeText`, `shortText` and question images, and neither was updated when those landed in the app.

Each write goes through `edit()`: read the subject, validate it, apply the mutation, run `validateSubject` on the result, commit. `validateSubject` already holds the per-type rules for the new fields (`src/data/subjects/schema.ts`). The mutations (`mcp/core/mutations.ts`) are typed from `QuizQuestion` and already pass any field through.

## Decisions

1. **Zod checks shape, `validateSubject` checks rules.** The tool schema says which fields exist and their types: `type` is one of the four values, `acceptedAnswers` is a string array, `sampleAnswer` is a string, `image` is an object with string `src` and `alt`. It does not say that `shortText` needs `acceptedAnswers`, that `alt` must be non-empty, or anything else conditional. Those rules live in `validateSubject` alone, which runs on every write, so the MCP cannot accept something the app would reject at load, and there is one place to change a rule. No discriminated union, no `.min(1)`, no `.refine()`.

2. **Derive the patch from the question schema.** `update_question`'s patch becomes `QuestionSchema.omit({ topicId: true }).partial()`. It matches `QuestionPatch` (`Partial<Omit<QuizQuestion, 'id' | 'topicId'>>`) and removes the second list that went out of date. `.partial()` is shallow, so a patched `image` or `codeSnippet` must still be complete, same as today for `codeSnippet`.

3. **Compile-time guard against drift.** `QuestionSchema` is exported and the tests assert `z.infer<typeof QuestionSchema>` equals `NewQuestion` with `expectTypeOf(...).toEqualTypeOf()`. `tsconfig.mcp.json` includes `mcp/`, so `npm run build` fails if `QuizQuestion` gains a type or field the tool schema lacks. That is how this gap arose; the guard makes it a build error rather than a silent strip.

4. **`options` and `correctOptionIds` stay required.** Typed and free-text questions send `[]` for both, which is what every existing such question in the subject files has and what `QuizQuestion` requires. Defaulting them would make the tool's input type differ from the app type and break decision 3 for a small saving.

5. **Patches set, never unset.** Changing a question from `single` to `shortText` in one `update_question` call works if the patch carries `acceptedAnswers` and `options: []`/`correctOptionIds: []`; without `acceptedAnswers`, `validateSubject` rejects it and nothing commits. Going the other way leaves a stale `acceptedAnswers` on the question. The app ignores it for non-`shortText` types, and removing fields is out of scope (see proposal non-goals).

## Risks

- A client that relied on an unknown `image` key being dropped now gets it stored and validated. That is the intended behaviour; an image without alt text now fails the write instead of committing a question without its picture.
- `expectTypeOf(...).toEqualTypeOf()` is strict about optional-vs-`undefined` differences. If zod's inferred type and the hand-written interface differ only in such a detail, the check needs adjusting, not removing.

## Test plan

In `mcp/tools.test.ts`, using the existing mocked GitHub layer:

- `add_question` with a valid `shortText` question commits, and the committed subject passes `validateSubject` with `acceptedAnswers` intact.
- `add_question` with a `shortText` question without `acceptedAnswers` returns `isError`, names the problem, and does not commit.
- `add_question` with a `freeText` question carrying `sampleAnswer` commits; without `sampleAnswer` it returns `isError` and does not commit.
- `add_question` with an `image` whose `alt` is empty returns `isError` from `validateSubject` and does not commit; with `alt` missing, the schema rejects it before the handler runs.
- `add_question` with a valid `image` commits and the image is stored (the regression for the silent strip, run through the schema-validating fake server).
- `update_question` can switch a question to `shortText` with `acceptedAnswers` and add an `image`; the same switch without `acceptedAnswers` is rejected and does not commit.
- Type-level: the tool schema's inferred type equals `NewQuestion`.
