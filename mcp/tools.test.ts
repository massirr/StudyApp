import { describe, expect, it, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { registerTools } from './tools';
import { validateSubject } from '../src/data/subjects/schema';

// Mock the github layer so tests never touch the network
vi.mock('./github', () => ({
  readSubject: vi.fn(),
  commitSubject: vi.fn(),
  listSubjectSlugs: vi.fn(),
}));

import { readSubject, commitSubject } from './github';

// Minimal in-memory subject that passes validateSubject
const baseSubject = {
  id: 's1',
  slug: 'test-subject',
  name: 'Test Subject',
  shortLabel: 'TEST',
  tagline: 'A test subject',
  sourcePolicy: 'any' as const,
  sources: [],
  topics: [{ id: 't1', slug: 'topic-1', title: 'Topic 1', summary: 'Summary', subtopics: [], sourceLinks: [], studyOrder: 1 }],
  questions: [],
  notes: [],
};

// Fake server that records registered handlers by tool name
function makeFakeServer() {
  const handlers: Record<string, (args: any) => Promise<any>> = {};
  const server = {
    tool(_name: string, _desc: string, _schema: unknown, run: (args: any) => Promise<any>) {
      handlers[_name] = run;
    },
  };
  return { server, handlers };
}

// Schema-validating server: mimics real MCP behavior (schema parsed before handler runs)
function makeValidatingServer() {
  const handlers: Record<string, (args: any) => Promise<any>> = {};
  const schemas: Record<string, z.ZodTypeAny> = {};
  const server = {
    tool(_name: string, _desc: string, _schema: unknown, run: (args: any) => Promise<any>) {
      handlers[_name] = run;
      schemas[_name] = z.object(_schema as Record<string, z.ZodTypeAny>);
    },
  };
  const call = async (name: string, args: any) => {
    const parsed = schemas[name].safeParse(args);
    if (!parsed.success) return { content: [{ type: 'text', text: parsed.error.message }], isError: true };
    return handlers[name](parsed.data);
  };
  return { server, call };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(readSubject).mockResolvedValue({ subject: structuredClone(baseSubject), sha: 'sha1' });
  vi.mocked(commitSubject).mockResolvedValue(undefined);
});

describe('registerTools', () => {
  it('registers all expected tool names', () => {
    const { server, handlers } = makeFakeServer();
    registerTools(server);
    const names = Object.keys(handlers).sort();
    expect(names).toEqual([
      'add_note', 'add_question', 'add_source', 'add_topic',
      'create_subject', 'get_subject', 'list_subjects',
      'update_note', 'update_question', 'update_source', 'update_subject', 'update_topic',
    ]);
  });

  it('add_question commits a subject that passes validateSubject', async () => {
    const { server, handlers } = makeFakeServer();
    registerTools(server);

    const result = await handlers['add_question']({
      subject: 'test-subject',
      question: {
        topicId: 't1',
        prompt: 'What is X?',
        type: 'single',
        options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
        correctOptionIds: ['a'],
        explanation: 'Because A.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/'],
      },
    });

    expect(result.isError).toBeUndefined();
    expect(vi.mocked(commitSubject)).toHaveBeenCalledOnce();

    // The committed subject must pass validateSubject
    const [, committedSubject] = vi.mocked(commitSubject).mock.calls[0];
    expect(() => validateSubject(committedSubject)).not.toThrow();
    const validated = validateSubject(committedSubject);
    expect(validated.questions).toHaveLength(1);
    expect(validated.questions[0].topicId).toBe('t1');
  });

  it('add_question with non-Microsoft URL on microsoft-only subject returns isError and does NOT commit', async () => {
    const msOnlySubject = {
      ...baseSubject,
      sourcePolicy: 'microsoft-only' as const,
    };
    vi.mocked(readSubject).mockResolvedValue({ subject: structuredClone(msOnlySubject), sha: 'sha2' });

    const { server, handlers } = makeFakeServer();
    registerTools(server);

    const result = await handlers['add_question']({
      subject: 'test-subject',
      question: {
        topicId: 't1',
        prompt: 'What is X?',
        type: 'single',
        options: [{ id: 'a', label: 'A' }],
        correctOptionIds: ['a'],
        explanation: 'Because.',
        sourceUrls: ['https://example.com/not-microsoft'],
      },
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('non-Microsoft');
    expect(vi.mocked(commitSubject)).not.toHaveBeenCalled();
  });

  it('get_subject returns subject JSON', async () => {
    const { server, handlers } = makeFakeServer();
    registerTools(server);

    const result = await handlers['get_subject']({ subject: 'test-subject' });
    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.slug).toBe('test-subject');
  });

  it('update_question on unknown id returns isError and does NOT commit', async () => {
    const { server, handlers } = makeFakeServer();
    registerTools(server);

    const result = await handlers['update_question']({
      subject: 'test-subject',
      id: 'q-nonexistent',
      patch: { prompt: 'Updated?' },
    });

    expect(result.isError).toBe(true);
    expect(vi.mocked(commitSubject)).not.toHaveBeenCalled();
  });

  it('update_question with wrong-typed correctOptionIds is rejected by zod schema and does NOT commit', async () => {
    const { server, call } = makeValidatingServer();
    registerTools(server);

    // correctOptionIds must be array of string; passing a plain string is rejected by the typed patch schema
    const result = await call('update_question', {
      subject: 'test-subject',
      id: 'q1',
      patch: { correctOptionIds: 'x' },
    });

    expect(result.isError).toBe(true);
    expect(vi.mocked(commitSubject)).not.toHaveBeenCalled();
  });
});
