## Context

`src/data/questions.ts` holds all MCQ questions as a static TypeScript array. Each `QuizQuestion` has an `options` array (ordered A, B, C, D) and a `correctOptionIds` array. Currently 37 of the single-correct single-select questions point to option `'a'`, compared to 9 each for `'b'` and `'c'` and 7 for `'d'`. This makes it trivially easy to guess answers by position.

## Goals / Non-Goals

**Goals:**
- Redistribute correct answers across A, B, C, D for single-correct single-select questions within each topic.
- Target: roughly equal counts per letter within each topic (≤2 questions difference between most and least frequent correct letter per topic).
- Zero content changes — only option order rotates.

**Non-Goals:**
- Multi-select questions (bias is less meaningful when multiple options are correct).
- Randomising options at runtime (adds complexity, breaks localStorage answer tracking by option id).
- Changing any question text, explanation, or source URL.
- Touching types, components, hooks, or build config.

## Decisions

### D1: Rotate option arrays, not runtime shuffle

**Chosen:** Reorder the `options` array in the static data so the correct answer lands on the target letter, then update `correctOptionIds` to match the new position.

**Alternative considered:** Shuffle at render time in the component. Rejected because `correctOptionIds` stores the letter (e.g., `'a'`), not a stable content ID, so runtime shuffle would require correlating content to the original index on every render and break the existing localStorage answer-tracking schema.

### D2: Target distribution — rotate by topic, not globally

Within each topic's single-select questions, assign target letters in round-robin order (A → B → C → D → A …). This guarantees local balance without touching question content relationships across topics.

### D3: Manual edit in `questions.ts`, no script

The edit is a one-time data correction, not a recurring operation. Writing a migration script adds complexity and a new artifact. Editing the static array directly is auditable, reviewable, and requires no tooling.

## Risks / Trade-offs

- [Option ids are positional, not semantic] If a future migration assigns stable option ids (e.g. uuid), this rotation will need to be revisited → Mitigation: document the positional id contract in the spec.
- [Human error during rotation] Swapping options could accidentally change the correct answer → Mitigation: after edit, run `npm run build` and grep to verify the new distribution counts match targets.

## Migration Plan

1. Edit `src/data/questions.ts`: for each affected single-select question, rotate the `options` array so the correct answer lands on the assigned target letter, and update `correctOptionIds` to match.
2. Run `npm run build` to confirm TypeScript compiles.
3. Verify distribution via grep: `grep "correctOptionIds: \['a'\]"` etc. per topic.

No rollback complexity — change is a static data edit in a version-controlled file.
