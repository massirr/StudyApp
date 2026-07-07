import { describe, expect, it } from 'vitest';
import { migrate } from './progressStorage';

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
