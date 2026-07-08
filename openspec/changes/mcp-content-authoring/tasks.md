# Tasks — MCP Content Authoring

> **For agentic workers:** implement task-by-task (superpowers:subagent-driven-development or executing-plans). Steps use `- [ ]` checkboxes. TDD: failing test → watch fail → minimal code → watch pass → commit.

**Goal:** A remote, authenticated MCP server (Vercel Function) that lets a tool-calling AI read and add/update a subject's content via schema-validated GitHub commits — usable from the Claude app on a phone.

**Architecture:** A Vercel Function hosts an MCP server (`mcp-handler`). Tool calls run a pure mutation on the in-memory subject, re-validate the whole subject with the app's `validateSubject`, then commit the JSON to GitHub (which triggers a Vercel rebuild). Content I/O goes through the GitHub API against `master`; the study app stays a static frontend.

**Tech Stack:** TypeScript, `@modelcontextprotocol/sdk`, `mcp-handler` (Vercel MCP adapter), GitHub REST API (via `fetch`), Zod (tool input schemas), Vitest.

## Global Constraints

- Reuse `validateSubject` from `src/data/subjects/schema.ts` — do NOT duplicate validation. Every write validates the whole subject before committing.
- Subject-scoped, discovery-first tools; every write tool takes `subject` (except `create_subject`). No flat cross-subject pool.
- **No delete/destructive tools** in this version.
- Content I/O via GitHub API against `master` (read current file + `sha`; write = one commit). No runtime database.
- Endpoint MUST reject unauthenticated requests (owner-only).
- Mutation functions are pure (`Subject -> Subject`), no I/O — unit-tested. Network layers tested against mocks.
- New deps only where a task adds them: `@modelcontextprotocol/sdk`, `mcp-handler`, `zod`.

## File Structure

- `mcp/core/ids.ts` — `nextId(prefix, existingIds)` collision-safe id generation
- `mcp/core/mutations.ts` — pure `Subject -> Subject` mutations (create/update subject; add/update topic, question, source, note) + referential-integrity checks
- `mcp/core/types.ts` — input types for mutations (`NewQuestion`, `QuestionPatch`, …)
- `mcp/github.ts` — `readSubject(slug)`, `commitSubject(slug, subject, sha, message)` via GitHub REST
- `mcp/tools.ts` — MCP tool definitions: parse input → mutation → `validateSubject` → commit; actionable errors
- `mcp/auth.ts` — `verifyToken` bearer-token guard
- `api/mcp.ts` (or `api/[transport].ts` — confirm per deploy doc) — Vercel Function wiring `mcp-handler` + tools + auth
- Tests colocated: `mcp/core/mutations.test.ts`, `mcp/core/ids.test.ts`, `mcp/github.test.ts`, `mcp/auth.test.ts`

**Build order:** 1 (ids) → 2 (mutations) → 3 (github) → 4 (tools) → 5 (auth) → 6 (route + deploy + docs). Sections 1–5 are pure/mocked and fully testable without deploying.

---

## 1. ID generation

Files: create `mcp/core/ids.ts`, `mcp/core/ids.test.ts`.
Produces: `nextId(prefix: string, existing: string[]): string`.

- [ ] 1.1 Write failing test `mcp/core/ids.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { nextId } from './ids';

describe('nextId', () => {
  it('starts at 1 for an empty set', () => {
    expect(nextId('q', [])).toBe('q-1');
  });
  it('increments past the highest existing numeric suffix', () => {
    expect(nextId('q', ['q-1', 'q-2', 'q-5'])).toBe('q-6');
  });
  it('ignores ids of other prefixes', () => {
    expect(nextId('t', ['q-9', 't-1'])).toBe('t-2');
  });
  it('never collides with an existing id', () => {
    const ids = ['q-1', 'q-2'];
    expect(ids).not.toContain(nextId('q', ids));
  });
});
```

- [ ] 1.2 Run `npm run test:unit -- ids` — expect FAIL (no module).
- [ ] 1.3 Implement `mcp/core/ids.ts`:

```ts
// Collision-safe sequential id: `${prefix}-${n}` where n is one past the
// highest existing numeric suffix for that prefix.
export function nextId(prefix: string, existing: string[]): string {
  const re = new RegExp(`^${prefix}-(\\d+)$`);
  const max = existing.reduce((m, id) => {
    const match = id.match(re);
    return match ? Math.max(m, Number(match[1])) : m;
  }, 0);
  return `${prefix}-${max + 1}`;
}
```

- [ ] 1.4 Run `npm run test:unit -- ids` — expect PASS.
- [ ] 1.5 Commit: `feat(mcp): collision-safe id generation`.

## 2. Mutation core (pure Subject -> Subject)

Files: create `mcp/core/types.ts`, `mcp/core/mutations.ts`, `mcp/core/mutations.test.ts`. Reuses `Subject`/`Topic`/`QuizQuestion`/`SourceReference`/`ContentNote` from `src/types/study.ts` and `src/types/quiz.ts`; `nextId` from Task 1.
Produces: `createSubject`, `updateSubject`, `addTopic`, `updateTopic`, `addQuestion`, `updateQuestion`, `addSource`, `updateSource`, `addNote`, `updateNote` — each `(subject, …) => Subject`, throwing `Error` on referential-integrity violations.

- [ ] 2.1 Write `mcp/core/types.ts` (input shapes; ids are server-generated so omitted on add):

```ts
import { QuizQuestion, QuizOption } from '../../src/types/quiz';
import { Topic, Subtopic, SourceReference, ContentNote, SourcePolicy } from '../../src/types/study';

export interface NewSubject {
  id: string; slug: string; name: string; shortLabel: string;
  tagline: string; sourcePolicy?: SourcePolicy;
}
export type SubjectPatch = Partial<Omit<NewSubject, 'id' | 'slug'>>;

export type NewTopic = Omit<Topic, 'id'>;
export type TopicPatch = Partial<Omit<Topic, 'id'>>;

export type NewQuestion = Omit<QuizQuestion, 'id'>;
export type QuestionPatch = Partial<Omit<QuizQuestion, 'id' | 'topicId'>>;

export type NewSource = Omit<SourceReference, 'id'>;
export type SourcePatch = Partial<Omit<SourceReference, 'id'>>;

export type NewNote = Omit<ContentNote, 'id'>;
export type NotePatch = Partial<Omit<ContentNote, 'id' | 'topicId'>>;

export type { QuizOption, Subtopic };
```

- [ ] 2.2 Write failing test `mcp/core/mutations.test.ts` (covers id-gen, referential integrity, immutability):

```ts
import { describe, expect, it } from 'vitest';
import { Subject } from '../../src/types/study';
import { addTopic, addQuestion, updateQuestion, createSubject } from './mutations';

const base: Subject = {
  id: 'demo', slug: 'demo', name: 'Demo', shortLabel: 'DEMO',
  tagline: 't', sourcePolicy: 'any', sources: [], notes: [],
  topics: [{ id: 't-1', slug: 'a', title: 'A', summary: 's', subtopics: [], sourceLinks: [], studyOrder: 1 }],
  questions: [],
};

describe('mutations', () => {
  it('createSubject yields empty arrays', () => {
    const s = createSubject({ id: 'x', slug: 'x', name: 'X', shortLabel: 'X', tagline: 't' });
    expect(s.topics).toEqual([]);
    expect(s.questions).toEqual([]);
    expect(s.sourcePolicy).toBe('any');
  });

  it('addQuestion assigns an id and appends', () => {
    const s = addQuestion(base, {
      topicId: 't-1', prompt: 'p', type: 'single',
      options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
      correctOptionIds: ['a'], explanation: 'e', sourceUrls: [],
    });
    expect(s.questions).toHaveLength(1);
    expect(s.questions[0].id).toBe('q-1');
  });

  it('addQuestion rejects an unknown topicId', () => {
    expect(() => addQuestion(base, {
      topicId: 'nope', prompt: 'p', type: 'single',
      options: [{ id: 'a', label: 'A' }], correctOptionIds: ['a'], explanation: 'e', sourceUrls: [],
    })).toThrow(/topic/i);
  });

  it('updateQuestion merges a patch without mutating the input', () => {
    const withQ = addQuestion(base, {
      topicId: 't-1', prompt: 'p', type: 'single',
      options: [{ id: 'a', label: 'A' }], correctOptionIds: ['a'], explanation: 'e', sourceUrls: [],
    });
    const updated = updateQuestion(withQ, 'q-1', { prompt: 'new' });
    expect(updated.questions[0].prompt).toBe('new');
    expect(withQ.questions[0].prompt).toBe('p'); // original untouched
  });

  it('updateQuestion throws on unknown id', () => {
    expect(() => updateQuestion(base, 'q-99', { prompt: 'x' })).toThrow(/not found/i);
  });

  it('addTopic assigns a topic id', () => {
    const s = addTopic(base, { slug: 'b', title: 'B', summary: 's', subtopics: [], sourceLinks: [], studyOrder: 2 });
    expect(s.topics.at(-1)!.id).toBe('t-2');
  });
});
```

- [ ] 2.3 Run `npm run test:unit -- mutations` — expect FAIL.
- [ ] 2.4 Implement `mcp/core/mutations.ts` (all entities; pure, integrity-checked):

```ts
import { Subject } from '../../src/types/study';
import { nextId } from './ids';
import {
  NewSubject, SubjectPatch, NewTopic, TopicPatch, NewQuestion, QuestionPatch,
  NewSource, SourcePatch, NewNote, NotePatch,
} from './types';

const topicExists = (s: Subject, topicId: string) => s.topics.some((t) => t.id === topicId);

export function createSubject(input: NewSubject): Subject {
  return {
    ...input,
    sourcePolicy: input.sourcePolicy ?? 'any',
    sources: [], topics: [], questions: [], notes: [],
  };
}

export function updateSubject(s: Subject, patch: SubjectPatch): Subject {
  return { ...s, ...patch };
}

export function addTopic(s: Subject, input: NewTopic): Subject {
  const id = nextId('t', s.topics.map((t) => t.id));
  return { ...s, topics: [...s.topics, { ...input, id }] };
}

export function updateTopic(s: Subject, id: string, patch: TopicPatch): Subject {
  if (!topicExists(s, id)) throw new Error(`Topic not found: ${id}`);
  return { ...s, topics: s.topics.map((t) => (t.id === id ? { ...t, ...patch } : t)) };
}

export function addQuestion(s: Subject, input: NewQuestion): Subject {
  if (!topicExists(s, input.topicId)) throw new Error(`Unknown topicId: ${input.topicId}`);
  const id = nextId('q', s.questions.map((q) => q.id));
  return { ...s, questions: [...s.questions, { ...input, id }] };
}

export function updateQuestion(s: Subject, id: string, patch: QuestionPatch): Subject {
  if (!s.questions.some((q) => q.id === id)) throw new Error(`Question not found: ${id}`);
  return { ...s, questions: s.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)) };
}

export function addSource(s: Subject, input: NewSource): Subject {
  const id = nextId('src', s.sources.map((x) => x.id));
  return { ...s, sources: [...s.sources, { ...input, id }] };
}

export function updateSource(s: Subject, id: string, patch: SourcePatch): Subject {
  if (!s.sources.some((x) => x.id === id)) throw new Error(`Source not found: ${id}`);
  return { ...s, sources: s.sources.map((x) => (x.id === id ? { ...x, ...patch } : x)) };
}

export function addNote(s: Subject, input: NewNote): Subject {
  if (!topicExists(s, input.topicId)) throw new Error(`Unknown topicId: ${input.topicId}`);
  const id = nextId('note', s.notes.map((n) => n.id));
  return { ...s, notes: [...s.notes, { ...input, id }] };
}

export function updateNote(s: Subject, id: string, patch: NotePatch): Subject {
  if (!s.notes.some((n) => n.id === id)) throw new Error(`Note not found: ${id}`);
  return { ...s, notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)) };
}
```

- [ ] 2.5 Run `npm run test:unit -- mutations` — expect PASS.
- [ ] 2.6 Verify a mutation result passes app validation: add a test importing `validateSubject` from `src/data/subjects/schema.ts` that asserts `validateSubject(addQuestion(base, validInput))` does not throw. Run it; expect PASS.
- [ ] 2.7 Commit: `feat(mcp): pure subject mutation core with referential integrity`.

## 3. GitHub read/write layer

Files: create `mcp/github.ts`, `mcp/github.test.ts`.
Produces: `readSubject(slug): Promise<{ subject: unknown; sha: string }>`; `commitSubject(slug, subject, sha, message): Promise<void>`. Consumes env `GITHUB_TOKEN`, `GITHUB_REPO` (`owner/repo`), `GITHUB_BRANCH` (default `master`).

- [ ] 3.1 Write failing test `mcp/github.test.ts` using a mocked `fetch` (verify path, base64 decode/encode, sha passthrough):

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readSubject, commitSubject } from './github';

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; vi.restoreAllMocks(); });

function mockFetchOnce(json: unknown, ok = true, status = 200) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok, status, json: async () => json, text: async () => JSON.stringify(json),
  }) as unknown as typeof fetch;
}

describe('github layer', () => {
  it('readSubject decodes base64 content and returns sha', async () => {
    const subject = { slug: 'dp-750', questions: [] };
    mockFetchOnce({ content: Buffer.from(JSON.stringify(subject)).toString('base64'), sha: 'abc123' });
    const out = await readSubject('dp-750');
    expect(out.sha).toBe('abc123');
    expect((out.subject as any).slug).toBe('dp-750');
  });

  it('commitSubject PUTs base64 content with the sha', async () => {
    const spy = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}), text: async () => '{}' });
    globalThis.fetch = spy as unknown as typeof fetch;
    await commitSubject('dp-750', { slug: 'dp-750' }, 'abc123', 'edit');
    const [, init] = spy.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(init.method).toBe('PUT');
    expect(body.sha).toBe('abc123');
    expect(Buffer.from(body.content, 'base64').toString()).toContain('dp-750');
  });
});
```

- [ ] 3.2 Run `npm run test:unit -- github` — expect FAIL.
- [ ] 3.3 Implement `mcp/github.ts` (GitHub Contents API; `fetch`, no extra deps):

```ts
const API = 'https://api.github.com';

function cfg() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // "owner/repo"
  const branch = process.env.GITHUB_BRANCH ?? 'master';
  if (!token || !repo) throw new Error('GITHUB_TOKEN and GITHUB_REPO are required');
  return { token, repo, branch };
}

const filePath = (slug: string) => `src/data/subjects/${slug}.json`;

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export async function readSubject(slug: string): Promise<{ subject: unknown; sha: string }> {
  const { token, repo, branch } = cfg();
  const url = `${API}/repos/${repo}/contents/${filePath(slug)}?ref=${branch}`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) throw new Error(`GitHub read failed (${res.status}) for ${slug}`);
  const data = (await res.json()) as { content: string; sha: string };
  const json = Buffer.from(data.content, 'base64').toString('utf8');
  return { subject: JSON.parse(json), sha: data.sha };
}

// sha omitted => create new file; provided => update existing.
export async function commitSubject(
  slug: string, subject: unknown, sha: string | undefined, message: string,
): Promise<void> {
  const { token, repo, branch } = cfg();
  const url = `${API}/repos/${repo}/contents/${filePath(slug)}`;
  const content = Buffer.from(JSON.stringify(subject, null, 2) + '\n').toString('base64');
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content, branch, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) throw new Error(`GitHub commit failed (${res.status}) for ${slug}: ${await res.text()}`);
}
```

- [ ] 3.4 Run `npm run test:unit -- github` — expect PASS.
- [ ] 3.5 Commit: `feat(mcp): github read/commit layer for subject JSON`.

## 4. MCP tools (mutation → validate → commit)

Files: create `mcp/tools.ts`. Add deps: `npm i @modelcontextprotocol/sdk mcp-handler zod`. Consumes core mutations, `github.ts`, and `validateSubject` from `src/data/subjects/schema.ts`.
Produces: `registerTools(server)` that defines every tool on an mcp-handler `server`.

- [ ] 4.1 Add deps: `npm i @modelcontextprotocol/sdk mcp-handler zod` (commit the lockfile change with the code).
- [ ] 4.2 Implement `mcp/tools.ts`. Each write tool: `readSubject` → mutate → `validateSubject` → `commitSubject`. Reads return JSON. Zod schemas validate tool input. Sketch (define all tools; `list_subjects` reads slugs from the repo `src/data/subjects/` directory listing via GitHub, or from a maintained index — use the GitHub git-tree listing):

```ts
import { z } from 'zod';
import { validateSubject } from '../src/data/subjects/schema';
import { readSubject, commitSubject } from './github';
import * as m from './core/mutations';

type Server = { tool: (name: string, desc: string, schema: unknown, run: (args: any) => Promise<any>) => void };
const ok = (data: unknown) => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] });
const fail = (msg: string) => ({ content: [{ type: 'text', text: `Error: ${msg}` }], isError: true });

// Read current subject, apply fn, validate, commit. Returns the saved subject.
// validateSubject runs twice: on read (trust boundary — GitHub returns unknown)
// and after the mutation (schema/policy enforcement before commit).
import { Subject } from '../src/types/study';
async function edit(slug: string, message: string, fn: (s: Subject) => Subject) {
  const { subject, sha } = await readSubject(slug);
  const current = validateSubject(subject);     // unknown -> Subject
  const next = validateSubject(fn(current));    // throws on schema/policy violation
  await commitSubject(slug, next, sha, message);
  return next;
}

export function registerTools(server: Server) {
  server.tool('get_subject', 'Read a subject by slug', { subject: z.string() },
    async ({ subject }) => { try { return ok((await readSubject(subject)).subject); } catch (e: any) { return fail(e.message); } });

  server.tool('add_question', 'Add a question to a subject',
    { subject: z.string(), question: z.object({
        topicId: z.string(), prompt: z.string(), type: z.enum(['single', 'multiple']),
        options: z.array(z.object({ id: z.string(), label: z.string() })),
        correctOptionIds: z.array(z.string()), explanation: z.string(),
        sourceUrls: z.array(z.string()), codeSnippet: z.object({ language: z.string(), code: z.string() }).optional(),
        level: z.number().optional(),
      }) },
    async ({ subject, question }) => {
      try { return ok(await edit(subject, `mcp: add question`, (s) => m.addQuestion(s, question))); }
      catch (e: any) { return fail(e.message); }
    });

  server.tool('update_question', 'Update fields on a question',
    { subject: z.string(), id: z.string(), patch: z.record(z.any()) },
    async ({ subject, id, patch }) => {
      try { return ok(await edit(subject, `mcp: update ${id}`, (s) => m.updateQuestion(s, id, patch))); }
      catch (e: any) { return fail(e.message); }
    });

  // ... define create_subject, update_subject, add_topic, update_topic,
  //     add_source, update_source, add_note, update_note following the same
  //     read→mutate→validate→commit shape (create_subject uses commitSubject
  //     with sha=undefined). list_subjects lists src/data/subjects/*.json via
  //     the GitHub git-tree API. Repeat the full body for each — no shortcuts.
}
```

> `list_subjects` implementation: GET `/repos/{repo}/git/trees/{branch}?recursive=1`, filter paths matching `src/data/subjects/*.json`, strip to slugs.

- [ ] 4.3 Test `mcp/tools.test.ts`: register tools on a fake `server` that records handlers; mock `github.ts` (`vi.mock`) so `add_question` on an in-memory subject calls `commitSubject` with a validated subject, and a policy-violating add returns `isError`. Run `npm run test:unit -- tools`; expect PASS.
- [ ] 4.4 Commit: `feat(mcp): tool definitions (read + add/update, validated commits)`.

## 5. Authentication

Files: create `mcp/auth.ts`, `mcp/auth.test.ts`.
Produces: `verifyToken(req: Request, bearer?: string): Promise<AuthInfo | undefined>` for `mcp-handler`'s `withMcpAuth`.

- [ ] 5.1 Write failing test `mcp/auth.test.ts`:

```ts
import { describe, expect, it, beforeEach } from 'vitest';
import { verifyToken } from './auth';

beforeEach(() => { process.env.MCP_AUTH_TOKEN = 'secret123'; });

describe('verifyToken', () => {
  it('accepts the configured bearer token', async () => {
    const info = await verifyToken(new Request('http://x'), 'secret123');
    expect(info?.token).toBe('secret123');
  });
  it('rejects a wrong token', async () => {
    expect(await verifyToken(new Request('http://x'), 'nope')).toBeUndefined();
  });
  it('rejects a missing token', async () => {
    expect(await verifyToken(new Request('http://x'), undefined)).toBeUndefined();
  });
});
```

- [ ] 5.2 Run `npm run test:unit -- auth` — expect FAIL.
- [ ] 5.3 Implement `mcp/auth.ts` (constant-time compare against `MCP_AUTH_TOKEN`):

```ts
import { timingSafeEqual } from 'node:crypto';

export interface AuthInfo { token: string; scopes: string[]; clientId: string; }

export async function verifyToken(_req: Request, bearer?: string): Promise<AuthInfo | undefined> {
  const expected = process.env.MCP_AUTH_TOKEN;
  if (!expected || !bearer) return undefined;
  const a = Buffer.from(bearer);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return undefined;
  return { token: bearer, scopes: ['write'], clientId: 'owner' };
}
```

- [ ] 5.4 Run `npm run test:unit -- auth` — expect PASS.
- [ ] 5.5 Commit: `feat(mcp): bearer-token auth guard`.

## 6. Vercel Function wiring, deploy & connector docs

Files: create `api/mcp.ts` (confirm the exact path/convention for a non-Next Vercel project — see doc below). Add `zod` peer if not present.

- [ ] 6.1 **Confirm the Vercel function convention for this Vite (non-Next) project** against https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel and https://vercel.com/docs/functions — the docs' `createMcpHandler` example uses Next.js `app/[transport]/route.ts`; for this repo use an `api/` function. Wire it:

```ts
// api/mcp.ts  (adjust filename/exports to the confirmed Vercel convention)
import { createMcpHandler, withMcpAuth } from 'mcp-handler';
import { registerTools } from '../mcp/tools';
import { verifyToken } from '../mcp/auth';

const base = createMcpHandler((server) => registerTools(server as any), {}, { basePath: '/api' });
const handler = withMcpAuth(base, verifyToken, { required: true });

export { handler as GET, handler as POST, handler as DELETE };
```

- [ ] 6.2 Configure Vercel env vars: `GITHUB_TOKEN` (fine-grained PAT, Contents read/write on this repo only), `GITHUB_REPO` (`massirr/StudyApp`), `GITHUB_BRANCH` (`master`), `MCP_AUTH_TOKEN` (a long random secret).
- [ ] 6.3 Deploy (push to a branch → Vercel preview, or `vercel deploy`). Verify the endpoint responds to an MCP client and that unauthenticated calls are rejected.
- [ ] 6.4 End-to-end check via the Playwright MCP is not applicable (server-side); instead verify with an MCP client (e.g. `claude mcp add --transport http studyapp <url>` with the auth token) that `get_subject` returns dp-750 and `add_question` produces a commit + deploy. Confirm the new question renders in the app after redeploy.
- [ ] 6.5 **Docs:** add `mcp/README.md` — how to set the env vars, deploy, and register the endpoint as a **custom connector in the Claude app** (phone). Note: if the Claude connector requires full OAuth (not a bearer token), follow the WorkOS AuthKit + Vercel MCP template (https://workos.com/blog/vercel-mcp-workos-authkit-template) as the upgrade path; the bearer-token guard remains valid for clients that send an Authorization header.
- [ ] 6.6 Commit: `feat(mcp): vercel function endpoint + deploy/connector docs`.

## Coverage map

- Remote HTTPS server / connector → §6 · Auth required → §5, §6.1 · Subject-scoped discovery-first tools → §4 · Read + add/update, no deletes → §4 · Validated writes → §4 (`edit()` calls `validateSubject`) · Referential integrity → §2 · GitHub commits + fresh-read → §3, §4.

## Notes / risks

- **Auth is the highest-uncertainty piece.** The bearer-token guard (§5) secures the endpoint and is fully testable. Whether the Claude *mobile* custom connector accepts a bearer token vs. requires OAuth discovery must be confirmed on-device in §6.5; the OAuth upgrade path (WorkOS/Vercel template) is linked.
- **Vite vs Next file convention (§6.1)** is the other confirm-against-docs step; the tool/mutation/github/auth logic (§1–§5) is framework-independent and unit-tested regardless.
- Concurrency: `edit()` reads a fresh `sha` immediately before committing; a rare stale-`sha` 409 surfaces as an actionable error and the caller retries. A built-in one-shot retry can be added in §4 if it proves needed.
