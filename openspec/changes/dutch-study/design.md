## Context

StudyApp is a frontend-only React/Vite app: each subject is a validated JSON file (`src/data/subjects/<slug>.json`) compiled into the bundle, progress lives in `localStorage`, no backend. Quizzes are MCQ-only today (`single`/`multiple`), with an optional `codeSnippet` and a `level` field, and a Level-1 ≥70% gate that unlocks Level-2 code questions. The user needs Dutch exam prep — specifically producing written Dutch, plus reading and listening — which the current model cannot express.

## Goals / Non-Goals

**Goals:**
- Add a Dutch subject and the three practice modes it needs (reading passage, audio, free-text) with the smallest additive change to the existing model.
- Keep the change backward-compatible: `dp-750.json`, the schema, and all current tests stay valid without edits.
- Make free-text grading robust for a language learner (no false "wrong").

**Non-Goals:**
- NotebookLM MCP or any live API pull; updating the StudyApp MCP schema; auto-grading Dutch text; any backend or runtime audio generation; fixing the Safari-ITP progress-durability problem (tracked separately).

## Decisions

- **Free-text grading = self-grade, not auto-match.** The learner types, the app reveals `sampleAnswer` + explanation, and the learner marks ✓/✗. Rationale: Dutch near-misses (accents, `de/het`, word order, synonyms) make string matching brittle, and a wrong "incorrect" trains the wrong reflex. *Alternative considered:* normalized accept-lists — rejected as high authoring cost with false negatives. Self-grade doubles as honest self-assessment.
- **Media lives on `Topic`, not `Question`.** Add optional `Topic.passage` and `Topic.audio`; render both above the topic's question deck. Rationale: a passage/audio clip is shared context for several questions; per-question duplication is wasteful, and it mirrors the per-topic audio scope the user chose. *Alternative:* per-question media — rejected as more files and duplication for the common case.
- **Native `<audio controls>` for playback.** No audio library (rung-4 "native platform feature"). Files are static mp3s in `public/audio/dutch/`, produced by the user in NotebookLM's web UI and dropped in; the app only references `audio.src`.
- **All schema changes are additive & optional**, so `validateSubject` gains checks only for present fields and existing content is untouched. `QuizQuestionType` gains `'freeText'`; `QuizQuestion` gains optional `sampleAnswer`; `Topic` gains optional `passage`/`audio`.
- **Scoring reuse.** A self-graded free-text result flows through the same `correctCount`/completion path that already drives the ≥70% `markLevel2Unlocked`, so unlock logic needs no special-casing beyond treating the self-grade as the question's correctness.
- **Vertical slice first.** Seed one Dutch topic end-to-end (passage + audio placeholder + MCQ + free-text) to validate the full pipeline, then expand content.

## Risks / Trade-offs

- **Self-grade is honesty-dependent** (learner can mark themselves right) → acceptable and intended for solo study; it is self-assessment, not proctoring.
- **Audio files bloat the bundle / repo** if many large mp3s land in `public/` → keep clips short, per-topic; revisit hosting only if size becomes a real problem (YAGNI).
- **Self-grade results persist to `localStorage`** → still evictable by Safari ITP, same as all progress. No worse than today; explicitly deferred to the durability fix.
- **`useQuizState` currently assumes option selection** → free-text needs a distinct "answered" signal (self-grade tap) feeding the same completion/score machinery; keep the branch small and localized to avoid regressing MCQ behavior.

## Migration Plan

Purely additive — no data migration. New optional fields default to absent; existing subjects and progress are unaffected. Ships as a normal Vercel auto-deploy from `master`. Rollback is reverting the change; no persisted-shape change to undo.

## Open Questions

- Exact number of Dutch topics and how content is chunked — resolved during authoring from the dropped source files (default: 1 topic as the first slice).
- Whether free-text should later support an optional hint field — deferred unless the user asks.
