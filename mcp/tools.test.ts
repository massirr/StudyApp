import { describe, expect, expectTypeOf, it, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { registerTools, QuestionSchema, type ToolResult } from './tools';
import type { NewQuestion } from './core/types';
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

// Handlers as the tests call them: loosely typed args, typed result.
// The server hands each handler args typed from its own zod schema; `never` accepts any of them.
type Handler = (args: Record<string, unknown>) => Promise<ToolResult>;

// Fake server that records registered handlers by tool name
function makeFakeServer() {
  const handlers: Record<string, Handler> = {};
  const server = {
    tool(name: string, _desc: string, _schema: unknown, run: (args: never) => Promise<ToolResult>) {
      handlers[name] = run as Handler;
    },
  };
  return { server, handlers };
}

// Schema-validating server: mimics real MCP behavior (schema parsed before handler runs)
function makeValidatingServer() {
  const handlers: Record<string, Handler> = {};
  const schemas: Record<string, z.ZodTypeAny> = {};
  const server = {
    tool(name: string, _desc: string, schema: unknown, run: (args: never) => Promise<ToolResult>) {
      handlers[name] = run as Handler;
      schemas[name] = z.object(schema as Record<string, z.ZodTypeAny>);
    },
  };
  const call = async (name: string, args: unknown): Promise<ToolResult> => {
    const parsed = schemas[name].safeParse(args);
    if (!parsed.success) return { content: [{ type: 'text', text: parsed.error.message }], isError: true };
    return handlers[name](parsed.data as Record<string, unknown>);
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

describe('question types beyond single/multiple', () => {
  const shortText = {
    topicId: 't1',
    prompt: "What is 'headrest' in Dutch?",
    type: 'shortText',
    options: [],
    correctOptionIds: [],
    explanation: 'Hoofdsteun.',
    sourceUrls: ['https://example.com/source'],
    acceptedAnswers: ['hoofdsteun', 'de hoofdsteun'],
  };
  const freeText = {
    ...shortText,
    type: 'freeText',
    prompt: 'Explain the preliminary checks.',
    acceptedAnswers: undefined,
    sampleAnswer: 'Engine off, get out, get back in, lock the car.',
  };
  const single = {
    topicId: 't1',
    prompt: 'Which part is number 1?',
    type: 'single',
    options: [{ id: 'a', label: 'Headlamp' }, { id: 'b', label: 'Indicator' }],
    correctOptionIds: ['a'],
    explanation: 'Number 1 is the headlamp.',
    sourceUrls: ['https://example.com/source'],
  };
  const image = { src: '/images/vehicle-check/front-lights.svg', alt: 'Front of a car with numbered parts.' };

  // The question as it lands in the committed subject
  const committedQuestion = () => {
    const [, committed] = vi.mocked(commitSubject).mock.calls[0];
    return validateSubject(committed).questions.at(-1)!;
  };

  it('QuestionSchema infers exactly the app question type', () => {
    // Compile-time: fails `npm run build` if QuizQuestion gains a type or field the tool schema lacks
    expectTypeOf<z.infer<typeof QuestionSchema>>().toEqualTypeOf<NewQuestion>();
  });

  it('add_question with a valid shortText question commits it with its acceptedAnswers', async () => {
    const { server, call } = makeValidatingServer();
    registerTools(server);

    const result = await call('add_question', { subject: 'test-subject', question: shortText });

    expect(result.isError).toBeUndefined();
    expect(vi.mocked(commitSubject)).toHaveBeenCalledOnce();
    expect(committedQuestion()).toMatchObject({ type: 'shortText', acceptedAnswers: ['hoofdsteun', 'de hoofdsteun'] });
  });

  it('add_question with a shortText question without acceptedAnswers returns isError and does NOT commit', async () => {
    const { server, call } = makeValidatingServer();
    registerTools(server);

    const result = await call('add_question', {
      subject: 'test-subject',
      question: { ...shortText, acceptedAnswers: undefined },
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('acceptedAnswers');
    expect(vi.mocked(commitSubject)).not.toHaveBeenCalled();
  });

  it('add_question with a freeText question commits only when sampleAnswer is present', async () => {
    const { server, call } = makeValidatingServer();
    registerTools(server);

    const ok = await call('add_question', { subject: 'test-subject', question: freeText });
    expect(ok.isError).toBeUndefined();
    expect(committedQuestion()).toMatchObject({ type: 'freeText', sampleAnswer: freeText.sampleAnswer });

    vi.mocked(commitSubject).mockClear();
    const missing = await call('add_question', {
      subject: 'test-subject',
      question: { ...freeText, sampleAnswer: undefined },
    });
    expect(missing.isError).toBe(true);
    expect(missing.content[0].text).toContain('sampleAnswer');
    expect(vi.mocked(commitSubject)).not.toHaveBeenCalled();
  });

  it('add_question stores a valid image instead of dropping it', async () => {
    const { server, call } = makeValidatingServer();
    registerTools(server);

    const result = await call('add_question', { subject: 'test-subject', question: { ...single, image } });

    expect(result.isError).toBeUndefined();
    expect(committedQuestion().image).toEqual(image);
  });

  it('add_question with an image whose alt is empty returns isError and does NOT commit', async () => {
    const { server, call } = makeValidatingServer();
    registerTools(server);

    const result = await call('add_question', {
      subject: 'test-subject',
      question: { ...single, image: { src: image.src, alt: '  ' } },
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('alt');
    expect(vi.mocked(commitSubject)).not.toHaveBeenCalled();
  });

  it('add_question with an image that has no alt is rejected by the schema and does NOT commit', async () => {
    const { server, call } = makeValidatingServer();
    registerTools(server);

    const result = await call('add_question', {
      subject: 'test-subject',
      question: { ...single, image: { src: image.src } },
    });

    expect(result.isError).toBe(true);
    expect(vi.mocked(commitSubject)).not.toHaveBeenCalled();
  });

  describe('update_question', () => {
    beforeEach(() => {
      vi.mocked(readSubject).mockResolvedValue({
        subject: structuredClone({ ...baseSubject, questions: [{ id: 'q-1', ...single }] }),
        sha: 'sha3',
      });
    });

    it('switches a question to shortText and adds an image', async () => {
      const { server, call } = makeValidatingServer();
      registerTools(server);

      const result = await call('update_question', {
        subject: 'test-subject',
        id: 'q-1',
        patch: { type: 'shortText', options: [], correctOptionIds: [], acceptedAnswers: ['koplamp'], image },
      });

      expect(result.isError).toBeUndefined();
      expect(committedQuestion()).toMatchObject({
        id: 'q-1', type: 'shortText', options: [], acceptedAnswers: ['koplamp'], image,
      });
    });

    it('rejects a switch to shortText without acceptedAnswers and does NOT commit', async () => {
      const { server, call } = makeValidatingServer();
      registerTools(server);

      const result = await call('update_question', {
        subject: 'test-subject',
        id: 'q-1',
        patch: { type: 'shortText', options: [], correctOptionIds: [] },
      });

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('acceptedAnswers');
      expect(vi.mocked(commitSubject)).not.toHaveBeenCalled();
    });

    it('rejects an image with an empty alt and does NOT commit', async () => {
      const { server, call } = makeValidatingServer();
      registerTools(server);

      const result = await call('update_question', {
        subject: 'test-subject',
        id: 'q-1',
        patch: { image: { src: image.src, alt: '' } },
      });

      expect(result.isError).toBe(true);
      expect(vi.mocked(commitSubject)).not.toHaveBeenCalled();
    });
  });
});
