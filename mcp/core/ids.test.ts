import { describe, expect, it } from 'vitest';
import { nextId } from './ids';

describe('nextId', () => {
  it('starts at 1 for an empty set', () => {
    expect(nextId('q', [])).toBe('q-1');
  });
  it('increments past the highest existing numeric suffix', () => {
    expect(nextId('q', ['q-1', 'q-2', 'q-5'])).toBe('q-6');
  });
  it('ignores ids of other prefixes', () => {
    expect(nextId('t', ['q-9', 't-1'])).toBe('t-2');
  });
  it('never collides with an existing id', () => {
    const ids = ['q-1', 'q-2'];
    expect(ids).not.toContain(nextId('q', ids));
  });
});
