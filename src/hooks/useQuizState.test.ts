import { describe, expect, it } from 'vitest';
import { parsePersistedQuizState } from './useQuizState';

describe('parsePersistedQuizState', () => {
  it('round-trips a valid saved quiz position', () => {
    const saved = { index: 3, completedQuestionIds: ['q1', 'q2'], correctQuestionIds: ['q1'] };
    expect(parsePersistedQuizState(JSON.stringify(saved))).toEqual(saved);
  });
  it('returns null for empty/missing storage', () => {
    expect(parsePersistedQuizState(null)).toBeNull();
    expect(parsePersistedQuizState('')).toBeNull();
  });
  it('returns null for corrupt JSON', () => {
    expect(parsePersistedQuizState('{not json')).toBeNull();
  });
  it('returns null when the shape is wrong', () => {
    expect(parsePersistedQuizState(JSON.stringify({ index: '2' }))).toBeNull();
    expect(parsePersistedQuizState(JSON.stringify({ index: 2, completedQuestionIds: 'x', correctQuestionIds: [] }))).toBeNull();
  });
});
