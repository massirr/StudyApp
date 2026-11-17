import { z } from 'zod';
import { Subject } from '../src/types/study';
import { validateSubject } from '../src/data/subjects/schema.js';
import { readSubject, commitSubject, listSubjectSlugs } from './github.js';
import * as m from './core/mutations.js';

export type ToolResult = { content: { type: 'text'; text: string }[]; isError?: boolean };

// ponytail: own minimal interface so this file is unit-testable without mcp-handler.
// Generic over the zod shape so each handler's args are typed from its own schema.
export type Server = {
  tool: <S extends z.ZodRawShape>(
    name: string,
    desc: string,
    schema: S,
    run: (args: z.infer<z.ZodObject<S>>) => Promise<ToolResult>,
  ) => void;
};

const ok = (data: unknown): ToolResult => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] });
const fail = (msg: string): ToolResult => ({ content: [{ type: 'text', text: `Error: ${msg}` }], isError: true });
const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));

// Read → mutate → validate → commit. validateSubject runs twice (trust boundary on read, policy on write).
async function edit(slug: string, message: string, fn: (s: Subject) => Subject) {
  const { subject, sha } = await readSubject(slug);
  const current = validateSubject(subject);
  const next = validateSubject(fn(current));
  await commitSubject(slug, next, sha, message);
  return next;
}

// Shape only. Content rules (a passage needs text, audio needs src) live in
// validateSubject, which edit() runs on every write. tools.test.ts asserts this
// infers to NewTopic, so a field added to Topic fails the build until it is added here.
export const TopicSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  subtopics: z.array(z.object({ id: z.string(), title: z.string(), summary: z.string() })),
  sourceLinks: z.array(z.object({ label: z.string(), url: z.string() })),
  studyOrder: z.number(),
  passage: z.object({ title: z.string().optional(), text: z.string() }).optional(),
  audio: z.object({ src: z.string(), title: z.string().optional() }).optional(),
});

// Derived, not hand-written, so it cannot fall behind TopicSchema again.
const TopicPatchSchema = TopicSchema.partial();

// Shape only. Per-type rules (shortText needs acceptedAnswers, freeText needs
// sampleAnswer, image needs non-empty src and alt) live in validateSubject, which
// edit() runs on every write. tools.test.ts asserts this infers to NewQuestion,
// so a field added to QuizQuestion fails the build until it is added here.
export const QuestionSchema = z.object({
  topicId: z.string(),
  prompt: z.string(),
  type: z.enum(['single', 'multiple', 'shortText', 'freeText']),
  options: z.array(z.object({ id: z.string(), label: z.string() })),
  correctOptionIds: z.array(z.string()),
  explanation: z.string(),
  sourceUrls: z.array(z.string()),
  codeSnippet: z.object({ language: z.string(), code: z.string() }).optional(),
  image: z.object({ src: z.string(), alt: z.string() }).optional(),
  level: z.number().optional(),
  sampleAnswer: z.string().optional(),
  acceptedAnswers: z.array(z.string()).optional(),
});

// Derived, not hand-written, so it cannot fall behind QuestionSchema again.
const QuestionPatchSchema = QuestionSchema.omit({ topicId: true }).partial();

export function registerTools(server: Server) {
  // ── reads ──────────────────────────────────────────────────────────────────

  server.tool('list_subjects', 'List all subject slugs', {},
    async () => {
      try { return ok(await listSubjectSlugs()); }
      catch (e) { return fail(errorMessage(e)); }
    });

  server.tool('get_subject', 'Read a subject by slug', { subject: z.string() },
    async ({ subject }) => {
      try { return ok((await readSubject(subject)).subject); }
      catch (e) { return fail(errorMessage(e)); }
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
      } catch (e) { return fail(errorMessage(e)); }
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
      catch (e) { return fail(errorMessage(e)); }
    });

  // ── topics ─────────────────────────────────────────────────────────────────

  // The client reads these descriptions, not the README, so the optional media fields are spelled out.
  const topicFields =
    'Optional study media, shown above the topic\'s questions: ' +
    'passage { title?, text } (a reading text), ' +
    'audio { src, title? } (a listening clip; src is a file already in public/, e.g. /audio/dutch/clip.mp3).';

  server.tool('add_topic', `Add a topic to a subject. ${topicFields}`,
    { subject: z.string(), topic: TopicSchema },
    async ({ subject, topic }) => {
      try { return ok(await edit(subject, `mcp: add topic`, (s) => m.addTopic(s, topic))); }
      catch (e) { return fail(errorMessage(e)); }
    });

  server.tool('update_topic', `Update fields on a topic; a patched passage or audio replaces the whole object. ${topicFields}`,
    { subject: z.string(), id: z.string(), patch: TopicPatchSchema },
    async ({ subject, id, patch }) => {
      try { return ok(await edit(subject, `mcp: update topic ${id}`, (s) => m.updateTopic(s, id, patch))); }
      catch (e) { return fail(errorMessage(e)); }
    });

  // ── questions ──────────────────────────────────────────────────────────────

  // The client reads these descriptions, not the README, so the per-type fields are spelled out.
  const questionFields =
    'single/multiple: options + correctOptionIds. ' +
    'shortText (typed answer, auto-graded): options [], correctOptionIds [], non-empty acceptedAnswers. ' +
    'freeText (self-graded): options [], correctOptionIds [], sampleAnswer. ' +
    'Optional on any type: image { src, alt } with non-empty alt, codeSnippet, level.';

  server.tool('add_question', `Add a question to a subject. ${questionFields}`,
    { subject: z.string(), question: QuestionSchema },
    async ({ subject, question }) => {
      try { return ok(await edit(subject, `mcp: add question`, (s) => m.addQuestion(s, question))); }
      catch (e) { return fail(errorMessage(e)); }
    });

  server.tool('update_question', `Update fields on a question; the patched question must still be valid. ${questionFields}`,
    { subject: z.string(), id: z.string(), patch: QuestionPatchSchema },
    async ({ subject, id, patch }) => {
      try { return ok(await edit(subject, `mcp: update question ${id}`, (s) => m.updateQuestion(s, id, patch))); }
      catch (e) { return fail(errorMessage(e)); }
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
      catch (e) { return fail(errorMessage(e)); }
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
      catch (e) { return fail(errorMessage(e)); }
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
      catch (e) { return fail(errorMessage(e)); }
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
      catch (e) { return fail(errorMessage(e)); }
    });
}
