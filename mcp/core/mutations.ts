import { Subject } from '../../src/types/study';
import { nextId } from './ids.js';
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
