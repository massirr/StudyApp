import { describe, expect, it } from 'vitest';
import {
  ATTEMPT_LIMIT,
  appendAttempt,
  bestAttempt,
  latestAttempt,
  migrate,
  readAttempts
} from './progressStorage';
import { SubjectProgress } from '../types/study';

const base = (): SubjectProgress => ({ completedTopicIds: [], completedSubtopicIds: {} });
const at = (percent: number, iso: string, correct = percent, total = 100) => ({
  finishedAt: iso, correct, total, percent
});

describe('progress migration', () => {
  it('wraps a v1 blob under dp-750', () => {
    const v1 = { version: 1, completedTopicIds: ['t1', 't2'], completedSubtopicIds: { t1: ['s1'] }, lastVisitedTopicSlug: 'plan' };
    const v2 = migrate(v1);
    expect(v2.version).toBe(2);
    expect(v2.subjects['dp-750'].completedTopicIds).toEqual(['t1', 't2']);
    expect(v2.subjects['dp-750'].lastVisitedTopicSlug).toBe('plan');
  });
  it('is idempotent on v2', () => {
    const v2 = { version: 2, subjects: { 'dp-750': { completedTopicIds: ['t1'], completedSubtopicIds: {} } } };
    expect(migrate(v2)).toEqual(v2);
  });
  it('falls back to default on garbage', () => {
    expect(migrate(null).version).toBe(2);
    expect(migrate({ foo: 1 }).subjects).toBeDefined();
  });
});

describe('attempt history', () => {
  it('reads empty for a topic with no attempts', () => {
    expect(readAttempts(base(), 't1')).toEqual([]);
  });

  it('appends attempts oldest-first and keeps earlier ones', () => {
    let p = appendAttempt(base(), 't1', at(50, '2026-08-01T10:00:00.000Z'));
    p = appendAttempt(p, 't1', at(80, '2026-08-02T10:00:00.000Z'));
    expect(readAttempts(p, 't1').map((a) => a.percent)).toEqual([50, 80]);
  });

  it('keeps topics independent', () => {
    let p = appendAttempt(base(), 't1', at(50, '2026-08-01T10:00:00.000Z'));
    p = appendAttempt(p, 't2', at(90, '2026-08-01T11:00:00.000Z'));
    expect(readAttempts(p, 't1')).toHaveLength(1);
    expect(readAttempts(p, 't2')).toHaveLength(1);
  });

  it('caps at ATTEMPT_LIMIT, dropping the oldest', () => {
    let p = base();
    for (let i = 0; i < ATTEMPT_LIMIT + 1; i++) {
      p = appendAttempt(p, 't1', at(i, new Date(Date.UTC(2026, 7, 1, i)).toISOString()));
    }
    const kept = readAttempts(p, 't1');
    expect(kept).toHaveLength(ATTEMPT_LIMIT);
    expect(kept[0].percent).toBe(1); // the 0th was dropped
  });

  it('ignores an immediate duplicate (StrictMode double-invoke)', () => {
    const p1 = appendAttempt(base(), 't1', at(70, '2026-08-01T10:00:00.000Z'));
    const p2 = appendAttempt(p1, 't1', at(70, '2026-08-01T10:00:00.500Z'));
    expect(readAttempts(p2, 't1')).toHaveLength(1);
  });

  it('does record the same score taken again later', () => {
    const p1 = appendAttempt(base(), 't1', at(70, '2026-08-01T10:00:00.000Z'));
    const p2 = appendAttempt(p1, 't1', at(70, '2026-08-01T10:05:00.000Z'));
    expect(readAttempts(p2, 't1')).toHaveLength(2);
  });

  it('reads malformed attempts as empty instead of throwing', () => {
    for (const attempts of [null, 'nope', 42, { t1: 'not-an-array' }, { t1: [{ bad: 1 }] }]) {
      const p = { ...base(), attempts } as unknown as SubjectProgress;
      expect(() => readAttempts(p, 't1')).not.toThrow();
      expect(readAttempts(p, 't1')).toEqual([]);
    }
  });

  it('selects best by percent and latest by position', () => {
    const list = [at(40, 'a'), at(90, 'b'), at(60, 'c')];
    expect(bestAttempt(list)?.percent).toBe(90);
    expect(latestAttempt(list)?.percent).toBe(60);
    expect(bestAttempt([])).toBeUndefined();
    expect(latestAttempt([])).toBeUndefined();
  });

  it('leaves a v2 payload without attempts loadable and unchanged', () => {
    const v2 = { version: 2, subjects: { nl: { completedTopicIds: ['t1'], completedSubtopicIds: {} } } };
    expect(migrate(v2)).toEqual(v2);
    expect(readAttempts(migrate(v2).subjects.nl, 't1')).toEqual([]);
  });

  it('migration stays idempotent once attempts exist', () => {
    const withAttempts = {
      version: 2,
      subjects: { nl: { ...base(), attempts: { t1: [at(80, '2026-08-01T10:00:00.000Z')] } } }
    };
    expect(migrate(withAttempts)).toEqual(withAttempts);
  });
});
