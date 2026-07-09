import { afterEach, describe, expect, it, vi } from 'vitest';
import { readSubject, commitSubject, listSubjectSlugs } from './github';

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; vi.restoreAllMocks(); });

function mockFetchOnce(json: unknown, ok = true, status = 200) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok, status, json: async () => json, text: async () => JSON.stringify(json),
  }) as unknown as typeof fetch;
}

describe('github layer', () => {
  it('readSubject decodes base64 content and returns sha', async () => {
    const subject = { slug: 'dp-750', questions: [] };
    mockFetchOnce({ content: Buffer.from(JSON.stringify(subject)).toString('base64'), sha: 'abc123' });
    const out = await readSubject('dp-750');
    expect(out.sha).toBe('abc123');
    expect((out.subject as any).slug).toBe('dp-750');
  });

  it('listSubjectSlugs returns slugs from git tree, excluding schema/index', async () => {
    mockFetchOnce({
      tree: [
        { path: 'src/data/subjects/dp-750.json' },
        { path: 'src/data/subjects/az-900.json' },
        { path: 'src/data/subjects/schema.ts' },
        { path: 'src/data/subjects/index.ts' },
        { path: 'src/components/Foo.tsx' },
      ],
    });
    const slugs = await listSubjectSlugs();
    expect(slugs).toEqual(['dp-750', 'az-900']);
  });

  it('commitSubject PUTs base64 content with the sha', async () => {
    const spy = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}), text: async () => '{}' });
    globalThis.fetch = spy as unknown as typeof fetch;
    await commitSubject('dp-750', { slug: 'dp-750' }, 'abc123', 'edit');
    const [, init] = spy.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(init.method).toBe('PUT');
    expect(body.sha).toBe('abc123');
    expect(Buffer.from(body.content, 'base64').toString()).toContain('dp-750');
  });

  it('readSubject rejects path-traversal slug and makes no fetch', async () => {
    const spy = vi.fn();
    globalThis.fetch = spy as unknown as typeof fetch;
    await expect(readSubject('../../etc/passwd')).rejects.toThrow(/Invalid subject slug/);
    expect(spy).not.toHaveBeenCalled();
  });

  it('commitSubject rejects dotdot slug and makes no fetch', async () => {
    const spy = vi.fn();
    globalThis.fetch = spy as unknown as typeof fetch;
    await expect(commitSubject('..', {}, 'sha', 'm')).rejects.toThrow(/Invalid subject slug/);
    expect(spy).not.toHaveBeenCalled();
  });
});
