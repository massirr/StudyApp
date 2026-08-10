import { describe, expect, it } from 'vitest';
import {
  parsePersistedQuizState,
  isAnswerSubmittable,
  gradeQuestion,
  normalizeAnswer,
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

const shortText = (id: string, accepted: string[] = ['zou']): QuizQuestion => ({
  id, topicId: 't1', prompt: "Vul in: 'Ik ____ graag ...'", type: 'shortText',
  options: [], correctOptionIds: [], acceptedAnswers: accepted,
  explanation: 'e', sourceUrls: [],
});

const grades = (typed: string, accepted: string[] = ['zou']) =>
  gradeQuestion(shortText('q1', accepted), [], null, typed);

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
  it('requires non-blank text for short-text too', () => {
    expect(isAnswerSubmittable(shortText('q1'), [], '')).toBe(false);
    expect(isAnswerSubmittable(shortText('q1'), [], '   ')).toBe(false);
    expect(isAnswerSubmittable(shortText('q1'), [], 'zou')).toBe(true);
  });
});

describe('normalizeAnswer', () => {
  it('ignores case and surrounding whitespace', () => {
    expect(normalizeAnswer('  Zou ')).toBe('zou');
  });
  it('collapses internal whitespace', () => {
    expect(normalizeAnswer('at   ik')).toBe('at ik');
  });
  it('maps curly apostrophes to straight', () => {
    expect(normalizeAnswer('’s morgens')).toBe("'s morgens");
  });
  it('strips trailing sentence punctuation', () => {
    expect(normalizeAnswer('zou.')).toBe('zou');
    expect(normalizeAnswer('zou!?')).toBe('zou');
  });
  it('leaves spelling and accents alone', () => {
    expect(normalizeAnswer('werkde')).toBe('werkde');
    expect(normalizeAnswer('één')).toBe('één');
  });
  it('does not strip punctuation that is not trailing', () => {
    expect(normalizeAnswer("'s morgens")).toBe("'s morgens");
  });
});

describe('gradeQuestion — shortText', () => {
  it('accepts an exact match', () => {
    expect(grades('zou')).toBe(true);
  });
  it('accepts case, spacing and punctuation variants', () => {
    expect(grades('Zou')).toBe(true);
    expect(grades('  zou  ')).toBe(true);
    expect(grades('zou.')).toBe(true);
  });
  it('accepts a curly apostrophe against a straight one', () => {
    expect(grades('’s morgens', ["'s morgens"])).toBe(true);
  });
  it('accepts any listed variant', () => {
    expect(grades('ging weg', ['ging', 'ging weg'])).toBe(true);
    expect(grades('ging', ['ging', 'ging weg'])).toBe(true);
  });
  it('does not forgive a misspelling', () => {
    // werkte/werkde is exactly the confusion being drilled — a fuzzy grader
    // that accepted this would teach the wrong thing (see design.md).
    expect(grades('werkde', ['werkte'])).toBe(false);
  });
  it('rejects a different word', () => {
    expect(grades('zal')).toBe(false);
  });
  it('is never undecided, so it never awaits a self-grade', () => {
    expect(grades('zou')).not.toBeNull();
    expect(grades('nonsense')).not.toBeNull();
  });
  it('ignores the self-grade entirely', () => {
    expect(gradeQuestion(shortText('q1'), [], true, 'zal')).toBe(false);
    expect(gradeQuestion(shortText('q1'), [], false, 'zou')).toBe(true);
  });
  it('is incorrect when acceptedAnswers is absent', () => {
    const broken = { ...shortText('q1'), acceptedAnswers: undefined };
    expect(gradeQuestion(broken, [], null, 'zou')).toBe(false);
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
  const score = (
    deck: Array<{ q: QuizQuestion; selected: string[]; self: boolean | null; typed?: string }>
  ) => {
    const graded = deck.map(({ q, selected, self, typed }) =>
      gradeQuestion(q, selected, self, typed ?? '')
    );
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

  it('completes a pure short-text deck with no self-grading at all', () => {
    const deck = [
      { q: shortText('q1'), selected: [], self: null, typed: 'Zou ' },
      { q: shortText('q2'), selected: [], self: null, typed: 'zal' },
    ];
    expect(score(deck)).toEqual({ complete: true, correctCount: 1, percent: 50 });
  });

  it('scores a deck mixing all three answer styles', () => {
    const deck = [
      { q: mcq('q1'), selected: ['a'], self: null },
      { q: shortText('q2'), selected: [], self: null, typed: 'zou.' },
      { q: freeText('q3'), selected: [], self: true },
      { q: shortText('q4'), selected: [], self: null, typed: 'werkde' },
    ];
    expect(score(deck)).toEqual({ complete: true, correctCount: 3, percent: 75 });
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
