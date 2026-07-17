## Context

After the multi-subject change, all study content lives as per-subject JSON in `src/data/subjects/<slug>.json`, validated at load by `validateSubject` (`src/data/subjects/schema.ts`), and bundled at build time. The app is a static frontend on Vercel with no backend. The user wants to author this content by talking to a tool-calling AI model, including from a phone.

A phone cannot reach a local stdio MCP (no network endpoint), so this change adds a remote, authenticated MCP server. Because content is build-time JSON in the repo, the server edits it by committing to GitHub, which triggers a Vercel rebuild.

## Goals / Non-Goals

**Goals:**
- Remote MCP server reachable over HTTPS, usable from the Claude app as a custom connector (phone).
- Subject-scoped, discovery-first tools: read + add/update for subjects, topics, questions, sources, notes.
- Every write validated against the app's real schema and source policy before it lands.
- Content stays build-time JSON in the repo (no database), edited via GitHub commits.
- Only the owner can write (authenticated endpoint).

**Non-Goals:**
- Delete/destructive tools (v1 omits them; removal is done by hand in the repo).
- Moving content into a runtime database/blob store.
- A general public API — this is a single-owner authoring tool.
- Editing the app's code/config via the MCP (content only).
- Branch/PR review workflow in v1 (commits go to `master`; can be added later).

## Decisions

### D1: Remote Vercel Function over local stdio
The MCP is hosted as a Vercel Function (streamable-HTTP via `mcp-handler`) rather than a local stdio server.

Rationale: the driving requirement is phone use, which stdio cannot serve. Vercel is already the app's platform, has first-class MCP support on the free tier, and lets the function import `validateSubject`/types from `src/` directly. Azure Functions would work identically (same FaaS model) but add a second platform for no benefit.

### D2: Writes are GitHub commits; content stays build-time JSON
The server reads/writes content through the GitHub API against `master`; it does not use a runtime data store.

Rationale: preserves the "no database / build-time bundled" model. An edit is a commit → Vercel redeploys → content live in ~1 min. The alternative (runtime store) rearchitects content out of the repo and is overkill for occasionally-edited content.

### D3: Reuse `validateSubject`; validate the whole subject before every commit
Every mutation builds the full updated subject in memory, runs `validateSubject`, and only commits if valid.

Rationale: guarantees the file on disk is always app-loadable and policy-compliant (DP-750 microsoft-only; `shortLabel` within pixel-font glyphs; required fields). No duplicated validation.

### D4: Content I/O via GitHub API, not the function's bundle
Reads fetch the current file (and its blob `sha`) from GitHub rather than the function's bundled copy.

Rationale: after a commit the deploy lags; reading from GitHub always reflects the latest `master`, avoiding stale reads and giving the `sha` needed for a conflict-safe write.

### D5: Add/update only — no delete tools in v1
Tools cover read + create/update per entity; no delete.

Rationale: user decision. Removing content is destructive; git history plus hand-editing covers the rare case. Guarded deletes can be added later.

### D6: Commit to `master` by default
Validated writes commit directly to `master` and auto-deploy.

Rationale: simplest, phone-friendly. Validation guarantees schema validity (not answer correctness); git revert covers mistakes. An optional branch/PR mode is a later enhancement.

### D7: Authenticated endpoint (owner-only)
The MCP endpoint SHALL require authentication so only the owner can invoke tools. Plan targets OAuth (what Claude custom connectors expect, supported by Vercel MCP tooling); fallback is a bearer-token guard for clients that send custom headers.

Rationale: the endpoint can commit to the owner's repo — it must not be open. Exact mechanism is finalized in the plan against current Vercel + Anthropic MCP docs (auth is the highest-uncertainty piece).

## Architecture units

- `mcp/core/*` — pure mutation functions per entity (`addQuestion(subject, input) -> subject`, `updateTopic(...)`, etc.), ID generation, referential-integrity checks. No I/O; unit-tested with vitest.
- `mcp/github.ts` — `readSubject(slug) -> { subject, sha }`, `commitSubject(slug, subject, sha, message)`. Tested against a mocked GitHub API.
- `mcp/tools.ts` — MCP tool definitions mapping tool calls → core mutation → `validateSubject` → github commit; formats actionable errors.
- `mcp/auth.ts` — endpoint authentication.
- `api/mcp/route.ts` — Vercel Function wiring `mcp-handler` + tools + auth.

## Rollout (phased)

1. Mutation core + validation (pure, unit-tested; no network).
2. GitHub read/write layer (mocked in tests).
3. MCP server + tool definitions wired to core + github.
4. Auth on the endpoint.
5. Deploy to Vercel + Claude custom-connector setup docs.
