# StudyApp MCP Content-Authoring Server

A remote [MCP](https://modelcontextprotocol.io) server that lets a tool-calling AI
read and **add/update** StudyApp content — subjects, topics, questions (with code
snippets and level/tier), sources, and notes — by committing validated JSON to
this repo. Hosted as a Vercel Function alongside the app, so you can author
content by chatting with the Claude app, including from your phone.

- **Subject-scoped, discovery-first.** Start with `list_subjects`, then every
  tool takes a `subject` slug.
- **Add/update only — no deletes.** Removing content is done by hand in the repo.
- **Every write is validated** against the app's real schema and source policy
  (`validateSubject`) before it commits. A commit triggers a Vercel rebuild, so
  the change is live in ~1 minute.

## In plain English

You chat with Claude on your phone. Claude sends your request to a small program
of yours running on Vercel. That program checks the secret token in the URL (so
only you can use it), makes the change to your quiz content stored on GitHub, and
GitHub redeploys the site — the change is live in about a minute.

**Four steps:** you ask → your server checks the token → GitHub saves it → the
site updates.

You did **not** have to write the "streaming"/protocol code the Microsoft repo
teaches: a library (`mcp-handler`) implements all of that inside the one
`createMcpHandler(...)` call. That repo was the textbook that explains what's
happening under the hood; the library is the pre-built engine. You only wrote the
two things unique to your app: the **tools** (`mcp/tools.ts`) and the **auth
guard** (`mcp/auth.ts`).

## How it works

```
Claude (phone/desktop)  ──MCP/HTTPS──▶  api/mcp.ts (Vercel Function)
                                          │  guard (header OR ?token=)
                                          │  read subject JSON  ◀─┐
                                          │  mutate + validateSubject
                                          └─ commit to GitHub ────┘ ──▶ Vercel redeploy
```

Content lives at `src/data/subjects/<slug>.json`. The server reads/writes it via
the GitHub Contents API against `master`; it never uses a database.

## Required environment variables (set in Vercel → Project → Settings → Environment Variables)

| Var | What it is |
|-----|-----------|
| `GITHUB_TOKEN` | A **fine-grained** GitHub PAT scoped to **this repo only**, with **Contents: Read and write**. Nothing else. Create at GitHub → Settings → Developer settings → Fine-grained tokens. |
| `GITHUB_REPO` | `massirr/StudyApp` |
| `GITHUB_BRANCH` | `master` |
| `MCP_AUTH_TOKEN` | A long random secret (e.g. `openssl rand -hex 32`). The token the MCP client must send — as an `Authorization: Bearer` header **or** a `?token=` query param on the URL. Keep it private. |

## Deploy

The function deploys automatically with the app (it's `api/mcp.ts` in this repo).
After setting the env vars above, trigger a deploy (push, or `vercel deploy`).
The endpoint will be `https://<your-app>.vercel.app/api/mcp`.

> First-deploy check: this is a Vite (non-Next) project. If the endpoint 404s or
> the transport misbehaves, see the comment atop `api/mcp.ts` — the function may
> need to be at `api/[transport].ts`. Confirm with `vercel dev` against
> https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel

## Connect from the Claude app (phone or desktop)

Claude's custom-connector UI only supports OAuth and has **no field for a static
bearer token**, so the token rides in the URL instead:

1. Claude → Settings → **Connectors** → **Add custom connector**.
2. URL: `https://<your-app>.vercel.app/api/mcp?token=<MCP_AUTH_TOKEN>`.
3. Leave the OAuth Client ID / Secret fields **blank**.
4. Ask Claude e.g. *"List my study subjects"* → it calls `list_subjects`.

> **Security note:** the `?token=` URL is the credential (single-user grade — it
> lands in server logs). Rotate by changing `MCP_AUTH_TOKEN` in Vercel. Clients
> that can set headers may instead send `Authorization: Bearer <MCP_AUTH_TOKEN>`.

**To go multi-user,** swap the `guard` in `api/mcp.ts` for full OAuth via the
WorkOS AuthKit + Vercel MCP template (~5-minute setup):
https://workos.com/blog/vercel-mcp-workos-authkit-template

## Tools

**Read:** `list_subjects`, `get_subject`
**Add/update:** `create_subject`, `update_subject`, `add_topic`, `update_topic`,
`add_question`, `update_question`, `add_source`, `update_source`, `add_note`,
`update_note`

Each write commits one change to `master`. Review the resulting commit in your
git history; revert there if a change was wrong. For a `microsoft-only` subject
(e.g. `dp-750`), a non-Microsoft source URL is rejected before it can commit.
