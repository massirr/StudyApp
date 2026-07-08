import { describe, expect, it } from 'vitest';
import { Subject } from '../../src/types/study';
import { addTopic, addQuestion, updateQuestion, createSubject } from './mutations';
import { validateSubject } from '../../src/data/subjects/schema';

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

  it('mutation results pass app validation', () => {
    const s = addQuestion(base, {
      topicId: 't-1', prompt: 'p', type: 'single',
      options: [{ id: 'a', label: 'A' }], correctOptionIds: ['a'], explanation: 'e', sourceUrls: [],
    });
    expect(() => validateSubject(s)).not.toThrow();
  });
});
