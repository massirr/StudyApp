import { describe, expect, it } from 'vitest';
import {
  getSubjects,
  getSubjectBySlug,
  getAllQuestions,
  getQuestionsForTopic,
  getCodeSnippetQuestionsForTopic,
} from './index';

describe('subject registry', () => {
  it('loads dp-750', () => {
    const s = getSubjectBySlug('dp-750');
    expect(s?.name).toMatch(/DP-750/);
    expect(s?.topics).toHaveLength(5);
    expect(s?.questions.length).toBeGreaterThan(0);
  });
  it('lists dp-750 among subjects', () => {
    expect(getSubjects().map((s) => s.slug)).toContain('dp-750');
  });
  it('returns undefined for unknown slug', () => {
    expect(getSubjectBySlug('nope')).toBeUndefined();
  });
});

describe('code-snippet tier split (D8)', () => {
  const s = getSubjectBySlug('dp-750')!;
  const topicId = s.topics[0].id;
  it('getAllQuestions excludes code-snippet questions', () => {
    expect(getAllQuestions(s).every((q) => !q.codeSnippet)).toBe(true);
  });
  it('getQuestionsForTopic returns only regular questions for that topic', () => {
    const regs = getQuestionsForTopic(s, topicId);
    expect(regs.every((q) => q.topicId === topicId && !q.codeSnippet)).toBe(true);
    expect(regs.length).toBeGreaterThan(0);
  });
  it('getCodeSnippetQuestionsForTopic returns only code questions for that topic', () => {
    const code = getCodeSnippetQuestionsForTopic(s, topicId);
    expect(code.every((q) => q.topicId === topicId && !!q.codeSnippet)).toBe(true);
  });
});
