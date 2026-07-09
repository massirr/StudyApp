import { z } from 'zod';
import { Subject } from '../src/types/study';
import { validateSubject } from '../src/data/subjects/schema';
import { readSubject, commitSubject, listSubjectSlugs } from './github';
import * as m from './core/mutations';

// ponytail: own minimal interface so this file is unit-testable without mcp-handler
type Server = {
  tool: (name: string, desc: string, schema: unknown, run: (args: any) => Promise<any>) => void;
};

const ok = (data: unknown) => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] });
const fail = (msg: string) => ({ content: [{ type: 'text', text: `Error: ${msg}` }], isError: true });

// Read → mutate → validate → commit. validateSubject runs twice (trust boundary on read, policy on write).
async function edit(slug: string, message: string, fn: (s: Subject) => Subject) {
  const { subject, sha } = await readSubject(slug);
  const current = validateSubject(subject);
  const next = validateSubject(fn(current));
  await commitSubject(slug, next, sha, message);
  return next;
}

const QuestionSchema = z.object({
  topicId: z.string(),
  prompt: z.string(),
  type: z.enum(['single', 'multiple']),
  options: z.array(z.object({ id: z.string(), label: z.string() })),
  correctOptionIds: z.array(z.string()),
  explanation: z.string(),
  sourceUrls: z.array(z.string()),
  codeSnippet: z.object({ language: z.string(), code: z.string() }).optional(),
  level: z.number().optional(),
});

export function registerTools(server: Server) {
  // ── reads ──────────────────────────────────────────────────────────────────

  server.tool('list_subjects', 'List all subject slugs', {},
    async () => {
      try { return ok(await listSubjectSlugs()); }
      catch (e: any) { return fail(e.message); }
    });

  server.tool('get_subject', 'Read a subject by slug', { subject: z.string() },
    async ({ subject }) => {
      try { return ok((await readSubject(subject)).subject); }
      catch (e: any) { return fail(e.message); }
    });

  // ── subject ────────────────────────────────────────────────────────────────

  server.tool('create_subject', 'Create a new subject file',
    {
      id: z.string(),
      slug: z.string(),
      name: z.string(),
      shortLabel: z.string(),
      tagline: z.string(),
      sourcePolicy: z.enum(['microsoft-only', 'any']).optional(),
    },
    async (input) => {
      try {
        const next = validateSubject(m.createSubject(input));
        await commitSubject(input.slug, next, undefined, `mcp: create subject ${input.slug}`);
        return ok(next);
      } catch (e: any) { return fail(e.message); }
    });

  server.tool('update_subject', 'Update top-level fields on a subject',
    {
      subject: z.string(),
      patch: z.object({
        name: z.string().optional(),
        shortLabel: z.string().optional(),
        tagline: z.string().optional(),
        sourcePolicy: z.enum(['microsoft-only', 'any']).optional(),
      }),
    },
    async ({ subject, patch }) => {
      try { return ok(await edit(subject, `mcp: update subject ${subject}`, (s) => m.updateSubject(s, patch))); }
      catch (e: any) { return fail(e.message); }
    });

  // ── topics ─────────────────────────────────────────────────────────────────

  server.tool('add_topic', 'Add a topic to a subject',
    {
      subject: z.string(),
      topic: z.object({
        slug: z.string(),
        title: z.string(),
        summary: z.string(),
        subtopics: z.array(z.object({ id: z.string(), title: z.string(), summary: z.string() })),
        sourceLinks: z.array(z.object({ label: z.string(), url: z.string() })),
        studyOrder: z.number(),
      }),
    },
    async ({ subject, topic }) => {
      try { return ok(await edit(subject, `mcp: add topic`, (s) => m.addTopic(s, topic))); }
      catch (e: any) { return fail(e.message); }
    });

  server.tool('update_topic', 'Update fields on a topic',
    {
      subject: z.string(),
      id: z.string(),
      patch: z.object({
        slug: z.string().optional(),
        title: z.string().optional(),
        summary: z.string().optional(),
        studyOrder: z.number().optional(),
        subtopics: z.array(z.object({ id: z.string(), title: z.string(), summary: z.string() })).optional(),
        sourceLinks: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
      }),
    },
    async ({ subject, id, patch }) => {
      try { return ok(await edit(subject, `mcp: update topic ${id}`, (s) => m.updateTopic(s, id, patch))); }
      catch (e: any) { return fail(e.message); }
    });

  // ── questions ──────────────────────────────────────────────────────────────

  server.tool('add_question', 'Add a question to a subject',
    { subject: z.string(), question: QuestionSchema },
    async ({ subject, question }) => {
      try { return ok(await edit(subject, `mcp: add question`, (s) => m.addQuestion(s, question))); }
      catch (e: any) { return fail(e.message); }
    });

  server.tool('update_question', 'Update fields on a question',
    {
      subject: z.string(),
      id: z.string(),
      patch: z.object({
        prompt: z.string().optional(),
        type: z.enum(['single', 'multiple']).optional(),
        options: z.array(z.object({ id: z.string(), label: z.string() })).optional(),
        correctOptionIds: z.array(z.string()).optional(),
        explanation: z.string().optional(),
        sourceUrls: z.array(z.string()).optional(),
        codeSnippet: z.object({ language: z.string(), code: z.string() }).optional(),
        level: z.number().optional(),
      }),
    },
    async ({ subject, id, patch }) => {
      try { return ok(await edit(subject, `mcp: update question ${id}`, (s) => m.updateQuestion(s, id, patch))); }
      catch (e: any) { return fail(e.message); }
    });

  // ── sources ────────────────────────────────────────────────────────────────

  server.tool('add_source', 'Add a source reference to a subject',
    {
      subject: z.string(),
      source: z.object({
        label: z.string(),
        url: z.string(),
        usageNote: z.string(),
      }),
    },
    async ({ subject, source }) => {
      try { return ok(await edit(subject, `mcp: add source`, (s) => m.addSource(s, source))); }
      catch (e: any) { return fail(e.message); }
    });

  server.tool('update_source', 'Update fields on a source',
    {
      subject: z.string(),
      id: z.string(),
      patch: z.object({
        label: z.string().optional(),
        url: z.string().optional(),
        usageNote: z.string().optional(),
      }),
    },
    async ({ subject, id, patch }) => {
      try { return ok(await edit(subject, `mcp: update source ${id}`, (s) => m.updateSource(s, id, patch))); }
      catch (e: any) { return fail(e.message); }
    });

  // ── notes ──────────────────────────────────────────────────────────────────

  server.tool('add_note', 'Add a content note to a subject',
    {
      subject: z.string(),
      note: z.object({
        topicId: z.string(),
        text: z.string(),
        sourceUrls: z.array(z.string()),
      }),
    },
    async ({ subject, note }) => {
      try { return ok(await edit(subject, `mcp: add note`, (s) => m.addNote(s, note))); }
      catch (e: any) { return fail(e.message); }
    });

  server.tool('update_note', 'Update fields on a note',
    {
      subject: z.string(),
      id: z.string(),
      patch: z.object({
        text: z.string().optional(),
        sourceUrls: z.array(z.string()).optional(),
      }),
    },
    async ({ subject, id, patch }) => {
      try { return ok(await edit(subject, `mcp: update note ${id}`, (s) => m.updateNote(s, id, patch))); }
      catch (e: any) { return fail(e.message); }
    });
}
