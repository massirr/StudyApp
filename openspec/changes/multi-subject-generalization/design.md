## Context

Today all study content is hand-written TypeScript in `src/data/{topics,questions,sources,contentNotes}.ts` (~1,818 lines), imported directly and bundled at build time. Routing is a manual `pathname` matcher in `App.tsx` (no react-router). The hero/header logo (`PixelLogo`) is a hardcoded SVG of "DP-750" pixel glyphs; the animation (GSAP random-stagger reveal + gentle float) is generic but the glyphs are hand-placed. Progress is a single `ProgressState` in localStorage under `studyapp_progress`. The app is a static frontend on Vercel with no backend.

This change makes the app subject-agnostic so it can host multiple study subjects, and moves content into a JSON format that a future MCP can read/write. The subject model is "switch between many": several subjects coexist and the user picks one on the dashboard.

## Goals / Non-Goals

**Goals:**
- Multiple subjects coexist; a picker at `/` selects one; routes scoped under `/:subject`
- Content stored as per-subject JSON, validated at load, replacing hand-written TS
- Progress scoped per subject, with lossless migration of existing DP-750 progress
- Reusable pixel-font hero that renders any subject's short label with the current animation
- Per-subject source policy (DP-750 stays Microsoft-only)

**Non-Goals:**
- The MCP server itself (separate later feature; this change only makes content MCP-ready)
- An in-app content editor UI
- Runtime content loading / a backend / a database (content stays build-time bundled JSON)
- Tiered "level 2" quiz UI (only the optional schema field is added now)
- Per-topic pixel wordmarks (topics remain regular styled text)
- Redesigning quiz logic, scoring, or the answer picker

## Decisions

### D1: JSON content bundled at build time, not fetched at runtime

Subject JSON files are imported by `src/data/subjects/index.ts` and bundled, exactly like today's TS arrays. Adding a subject means adding a JSON file and redeploying.

Rationale: preserves the current no-backend static model and keeps build-time schema validation. Runtime fetch from `/public` would remove the rebuild step but lose type/validation guarantees and complicate the static import model — not worth it for a personal study app. The MCP (later) edits these JSON files locally; changes go live via git push → Vercel rebuild. The MCP never talks to the live site.

### D2: Per-subject `sourcePolicy` instead of a global Microsoft-only rule

`Subject.sourcePolicy` is `"microsoft-only" | "any"`. Validation applies the subject's own policy. `dp-750` is `"microsoft-only"`; other subjects default to `"any"`.

Rationale: the Official Source Rule is meaningful for a Microsoft exam but wrong for arbitrary subjects. Making it per-subject keeps DP-750 rigorous without blocking reuse. (Judgment call surfaced to and confirmed by the user.)

### D3: Progress schema v2 — subject-keyed, with automatic migration

```
v2: { version: 2, subjects: { [subjectId]: { completedTopicIds, completedSubtopicIds, lastVisitedTopicSlug } }, preferences? }
```
On load, if a v1 (flat) blob is found, its topic data is wrapped under `subjects["dp-750"]` and version bumped to 2. `ProgressContext` gains an `activeSubjectId`; mutators operate on that subject's slice; `useProgress()` reads the active slice.

Rationale: topic IDs may collide across subjects, so progress must be namespaced. Wrapping v1 under `dp-750` preserves the user's existing completed topics with zero manual steps.

### D4: Pixel-font renderer replaces hardcoded glyphs

`PixelLogo` takes a `text` prop and renders each character from a 5×7 pixel-font glyph map (A–Z, 0–9, hyphen, space), emitting the same `<rect>` structure the GSAP animation already targets. `Subject.shortLabel` is validated at load to contain only supported glyphs.

Rationale: this is the "animations for any subject" the user asked for. A 5×7 font over ~38 glyphs is bounded, testable work, and keeps the existing animation untouched (it targets `rect` elements generically). Alternative — a fixed app-brand logo with subjects as plain text — was rejected by the user in favor of per-subject wordmarks.

### D5: One-time scripted content migration, then delete the `.ts` files

DP-750 content is converted from `src/data/*.ts` to `src/data/subjects/dp-750.json` by a throwaway Node script (run once, not kept), after which the old `.ts` data files are removed.

Rationale: 1,818 lines converted by hand is error-prone. Scripting the conversion guarantees fidelity; a schema-validation test then proves the JSON is well-formed. (Judgment call surfaced to and confirmed by the user.)

### D6: `level?` field added now, unused

`QuizQuestion` gains optional `level?: number`. No UI or filtering uses it in this change.

Rationale: the MCP's planned "level 2 quizzes" would otherwise force a schema + data migration later. Adding the optional field now is free and forward-compatible.

### D7: Subjects are arbitrary; switch via a header menu and a home picker

Subjects are unrelated study domains — DP-750 (a Microsoft exam) and, say, "Dutch" (a language, non-Microsoft sources) are peers. Switching happens two ways: a header switcher control (☰) on every page for jumping between subjects without leaving the current one, and the full picker landing at `/`.

Rationale: the platform is subject-agnostic, so nothing Microsoft-specific may live outside a subject's own data (`sourcePolicy` per D2 handles source rules). A persistent header switcher matches the mental model of "pick what I'm studying right now"; the home picker remains the discoverable landing. The two share `getSubjects()` and are not in conflict.

## Rollout (phased, each phase keeps the app working)

1. Content model: schema/types, loader/registry, scripted DP-750 migration, validation, remove old `.ts`.
2. Routing: subject-scoped routes + `SubjectPickerPage`; internal links carry the active subject.
3. Pixel-font hero: `PixelLogo` `text` prop + glyph map; drive header/hero/quiz titles from subject.
4. Progress: v2 subject-scoped store + v1 migration; `ProgressContext`/`useProgress` updates.
5. Verification: build, tests (pixel font, schema, migration, routes), visual check.
