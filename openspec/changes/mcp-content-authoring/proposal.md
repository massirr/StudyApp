## Why

Feature #3 of the roadmap: author study content — questions (including code snippets and the level/tier field), plus topics, sources, notes, and whole new subjects — by talking to a tool-calling AI model, **including from a phone**. A local stdio MCP cannot be reached from a phone, so a remote, authenticated MCP is required. Content already lives as per-subject JSON in the repo (from the multi-subject change), so the MCP edits that JSON via validated commits.

## What Changes

- Add a **remote MCP server as a Vercel Function** (streamable-HTTP transport, `mcp-handler`) in this repo, deployed with the app on the free tier. Usable from the Claude app as a **custom connector** (phone-friendly).
- Expose **subject-scoped tools**: read (`list_subjects`, `get_subject`) and **add/update** for subjects, topics, questions (code snippets and `level` are fields on a question), sources, and notes. **No delete tools** in v1.
- **Content I/O via the GitHub API**: reads fetch the current file from `master`; writes validate the whole subject with `validateSubject` (reused from `src/`) and then **commit** the JSON → Vercel auto-rebuilds → live in ~1 min.
- **Authenticate** the endpoint so only the owner can write.
- Introduce a small serverless authoring backend + a GitHub token. The study app's user-facing runtime stays a static frontend; content stays build-time JSON.

## Capabilities

### New Capabilities

- `mcp-content-authoring`: a remote, authenticated MCP server that lets a tool-calling AI read and add/update a subject's content in the repo through schema-validated GitHub commits, subject-scoped and discovery-first.

## Impact

- `api/mcp/route.ts` (or equivalent) — new; Vercel Function hosting the MCP server via `mcp-handler`
- `mcp/core/*` — new; pure mutation functions (add/update per entity) + ID generation + referential-integrity checks
- `mcp/github.ts` — new; GitHub read (get file + sha) and write (commit) client
- `mcp/tools.ts` — new; MCP tool definitions wired to the core + github layer
- `mcp/auth.ts` — new; endpoint authentication (OAuth or token guard)
- `src/data/subjects/schema.ts`, `src/types/*` — reused (imported) for validation and types; no change
- `package.json` — add `mcp-handler`, `@modelcontextprotocol/sdk`, a GitHub client (or use `fetch`)
- Vercel env vars — `GITHUB_TOKEN` (fine-grained, contents read/write for this repo), auth config
- `README` / docs — connector setup instructions
