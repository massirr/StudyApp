import { describe, expect, it } from 'vitest';
import { getSubjects } from './index';
import { QuizQuestion } from '../../types/quiz';

// Enforces openspec/specs/answer-distribution-policy. This regressed once already:
// the June 2026 rebalance was undone as questions were added through the MCP, leaving
// case-study-lakehouse at A/B/C/D = 6/0/0/0 (scoreable without reading the question).
// The policy only has teeth if something fails when it drifts.

const LETTERS = ['a', 'b', 'c', 'd'];

/** Single-select, exactly one correct option — the only shape the policy covers. */
const isSingleCorrect = (q: QuizQuestion) =>
  q.type === 'single' && q.correctOptionIds.length === 1;

describe('answer distribution policy', () => {
  const subjects = getSubjects();

  it('has subjects to check', () => {
    expect(subjects.length).toBeGreaterThan(0);
  });

  for (const subject of subjects) {
    for (const topic of subject.topics) {
      const questions = subject.questions.filter(
        (q) => q.topicId === topic.id && isSingleCorrect(q)
      );
      if (questions.length === 0) continue;

      it(`${subject.slug}/${topic.slug}: correct answers spread across A-D (n=${questions.length})`, () => {
        const counts = LETTERS.map(
          (letter) => questions.filter((q) => q.correctOptionIds[0] === letter).length
        );
        const spread = Math.max(...counts) - Math.min(...counts);
        expect(
          spread,
          `A/B/C/D = ${counts.join('/')} — spread ${spread} exceeds 2. Reorder options ` +
            `(and repoint correctOptionIds) so no letter dominates.`
        ).toBeLessThanOrEqual(2);
      });
    }
  }

  it('option ids are positional and correctOptionIds resolve', () => {
    for (const subject of subjects) {
      for (const q of subject.questions) {
        const ids = q.options.map((o) => o.id);
        // Ids identify position in the array, not answer content.
        expect(ids, `${subject.slug}/${q.id} option ids must be positional`).toEqual(
          q.options.map((_, i) => LETTERS[i] ?? String(i))
        );
        for (const correct of q.correctOptionIds) {
          expect(ids, `${subject.slug}/${q.id} correctOptionIds must resolve`).toContain(correct);
        }
      }
    }
  });
});
