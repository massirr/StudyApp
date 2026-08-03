import { describe, expect, it } from 'vitest';
import {
  parsePersistedQuizState,
  isAnswerSubmittable,
  gradeQuestion,
  scorePercent,
} from './useQuizState';
import { QuizQuestion } from '../types/quiz';

const mcq = (id: string): QuizQuestion => ({
  id, topicId: 't1', prompt: 'p', type: 'single',
  options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
  correctOptionIds: ['a'], explanation: 'e', sourceUrls: [],
});

const freeText = (id: string): QuizQuestion => ({
  id, topicId: 't1', prompt: 'Vertaal: the house', type: 'freeText',
  options: [], correctOptionIds: [], sampleAnswer: 'het huis',
  explanation: 'e', sourceUrls: [],
});

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

describe('isAnswerSubmittable', () => {
  it('requires a selection for MCQs', () => {
    expect(isAnswerSubmittable(mcq('q1'), [], '')).toBe(false);
    expect(isAnswerSubmittable(mcq('q1'), ['a'], '')).toBe(true);
  });
  it('requires non-blank text for free-text, not a selection', () => {
    expect(isAnswerSubmittable(freeText('q1'), [], '')).toBe(false);
    expect(isAnswerSubmittable(freeText('q1'), [], '   ')).toBe(false);
    expect(isAnswerSubmittable(freeText('q1'), [], 'het huis')).toBe(true);
  });
});

describe('gradeQuestion', () => {
  it('grades MCQs by option match, ignoring the self-grade', () => {
    expect(gradeQuestion(mcq('q1'), ['a'], null)).toBe(true);
    expect(gradeQuestion(mcq('q1'), ['b'], true)).toBe(false);
  });
  it('leaves free-text undecided until self-graded', () => {
    expect(gradeQuestion(freeText('q1'), [], null)).toBeNull();
  });
  it('takes the self-grade verbatim for free-text', () => {
    expect(gradeQuestion(freeText('q1'), [], true)).toBe(true);
    expect(gradeQuestion(freeText('q1'), [], false)).toBe(false);
  });
  it('never string-matches the typed answer against sampleAnswer', () => {
    // An exact-match answer is still wrong if the learner marked it wrong.
    expect(gradeQuestion(freeText('q1'), [], false)).toBe(false);
  });
});

describe('deck scoring', () => {
  // Folds the pure rules over a deck the way the hook does, one grade per question.
  const score = (deck: Array<{ q: QuizQuestion; selected: string[]; self: boolean | null }>) => {
    const graded = deck.map(({ q, selected, self }) => gradeQuestion(q, selected, self));
    return {
      complete: graded.every((g) => g !== null),
      correctCount: graded.filter((g) => g === true).length,
      percent: scorePercent(graded.filter((g) => g === true).length, deck.length),
    };
  };

  it('completes a pure free-text deck once every answer is self-graded', () => {
    const deck = [
      { q: freeText('q1'), selected: [], self: true },
      { q: freeText('q2'), selected: [], self: false },
    ];
    expect(score(deck)).toEqual({ complete: true, correctCount: 1, percent: 50 });
  });

  it('is incomplete while a free-text answer is still ungraded', () => {
    const deck = [
      { q: freeText('q1'), selected: [], self: true },
      { q: freeText('q2'), selected: [], self: null },
    ];
    expect(score(deck).complete).toBe(false);
  });

  it('✓ increments the score and ✗ does not', () => {
    expect(score([{ q: freeText('q1'), selected: [], self: true }]).correctCount).toBe(1);
    expect(score([{ q: freeText('q1'), selected: [], self: false }]).correctCount).toBe(0);
  });

  it('reports a passing percentage for a mixed deck at >=70%', () => {
    const deck = [
      { q: mcq('q1'), selected: ['a'], self: null },
      { q: mcq('q2'), selected: ['a'], self: null },
      { q: mcq('q3'), selected: ['b'], self: null },
      { q: freeText('q4'), selected: [], self: true },
      { q: freeText('q5'), selected: [], self: true },
    ];
    const { complete, correctCount, percent } = score(deck);
    expect(complete).toBe(true);
    expect(correctCount).toBe(4);
    expect(percent).toBe(80);
    expect(percent).toBeGreaterThanOrEqual(70); // unlocks Level 2
  });
});

describe('scorePercent', () => {
  it('rounds and guards an empty deck', () => {
    expect(scorePercent(0, 0)).toBe(0);
    expect(scorePercent(7, 10)).toBe(70);
    expect(scorePercent(2, 3)).toBe(67);
  });
});
