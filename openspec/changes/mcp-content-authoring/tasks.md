# Tasks — MCP Content Authoring

High-level phases. The detailed, step-by-step implementation plan is produced by the writing-plans skill and lands here as numbered tasks before implementation.

## 1. Mutation core (pure, unit-tested)
- [ ] 1.1 `mcp/core` mutation functions per entity (add/update for subject, topic, question, source, note) operating on an in-memory subject
- [ ] 1.2 Stable, collision-checked ID generation for `add_*`
- [ ] 1.3 Referential-integrity checks (e.g. `add_question` requires an existing `topicId`)
- [ ] 1.4 Vitest: mutations produce a valid subject (`validateSubject` passes) and reject invalid input (policy, missing topic)

## 2. GitHub read/write layer
- [ ] 2.1 `readSubject(slug) -> { subject, sha }` via GitHub API against `master`
- [ ] 2.2 `commitSubject(slug, subject, sha, message)` (one commit per edit); stale-`sha` → refetch-and-retry
- [ ] 2.3 Vitest against a mocked GitHub API

## 3. MCP server + tools
- [ ] 3.1 Tool definitions (`list_subjects`, `get_subject`, add/update per entity) wired: core mutation → `validateSubject` → commit
- [ ] 3.2 Actionable error formatting for validation/integrity/conflict failures
- [ ] 3.3 `api/mcp/route.ts` Vercel Function hosting the server via `mcp-handler`

## 4. Authentication
- [ ] 4.1 Endpoint auth (owner-only); finalize OAuth vs token-guard against current Vercel + Anthropic MCP docs
- [ ] 4.2 Reject unauthenticated requests before any read/write

## 5. Deploy + connector setup
- [ ] 5.1 Configure Vercel env (`GITHUB_TOKEN` fine-grained contents R/W, auth config)
- [ ] 5.2 Deploy; verify a tool call from an MCP client performs a validated commit
- [ ] 5.3 Docs: add the endpoint as a Claude custom connector (phone) + usage notes
