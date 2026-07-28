# Proposal: Auto-register subjects and policy-aware sources heading

## Why

Two gaps surfaced when the Nederlands 3 (yb1398) subject was added through the MCP:

1. **New subjects don't appear in the app.** The MCP `create_subject` tool commits
   `src/data/subjects/<slug>.json`, but the registry (`src/data/subjects/index.ts`)
   only loads subjects that are hand-imported into its `RAW` array. Every future
   MCP-created subject silently fails to show up until someone edits the registry
   (this is exactly what happened with yb1398, fixed manually in commit 83a4307).

2. **Topic pages say "Official Microsoft Sources" for every subject.** The heading
   is hardcoded in `TopicPage.tsx`, so non-Microsoft subjects (`sourcePolicy: 'any'`,
   e.g. Nederlands 3) render a Microsoft-branded sources card that makes no sense.
   The footer in `AppShell.tsx` already branches on `sourcePolicy`; the topic page
   should too.

## What Changes

- The subject registry auto-discovers every `src/data/subjects/*.json` via Vite's
  `import.meta.glob` (eager), validating each with `validateSubject` as today.
  Adding a subject file — by hand or through the MCP — is all that's needed for it
  to appear in the app. No registry edit, no code change.
- The topic page sources heading becomes policy-aware: "Official Microsoft Sources"
  when the subject's `sourcePolicy` is `microsoft-only`, plain "Sources" otherwise.

## Impact

- Affected specs: `subject-content-model` (registry loading), `topic-pages`
  (sources heading).
- Affected code: `src/data/subjects/index.ts`, `src/pages/TopicPage.tsx`,
  `src/vite-env.d.ts` (add `vite/client` types for `import.meta.glob`),
  `src/data/subjects/index.test.ts`.
- No MCP server changes needed — its contract (commit a JSON file) is now
  sufficient end-to-end.
- Non-goals: subject ordering UI, deleting subjects, MCP tool changes.
