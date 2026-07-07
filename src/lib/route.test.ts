import { describe, expect, it } from 'vitest';
import { parseRoute } from './route';

describe('parseRoute', () => {
  it('/ → picker', () => expect(parseRoute('/')).toEqual({ kind: 'picker' }));
  it('/dp-750 → dashboard', () => expect(parseRoute('/dp-750')).toEqual({ kind: 'dashboard', subject: 'dp-750' }));
  it('trailing slash normalizes', () => expect(parseRoute('/dp-750/')).toEqual({ kind: 'dashboard', subject: 'dp-750' }));
  it('/dp-750/topics/x → topic', () => expect(parseRoute('/dp-750/topics/x')).toEqual({ kind: 'topic', subject: 'dp-750', topicSlug: 'x' }));
  it('/dp-750/quiz → quiz', () => expect(parseRoute('/dp-750/quiz')).toEqual({ kind: 'quiz', subject: 'dp-750' }));
  it('/dp-750/topic/x (singular) → redirect', () => expect(parseRoute('/dp-750/topic/x')).toEqual({ kind: 'redirect', to: '/dp-750/topics/x' }));
  it('junk → notFound', () => expect(parseRoute('/a/b/c/d')).toEqual({ kind: 'notFound' }));
});
