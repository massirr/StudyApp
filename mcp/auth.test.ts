import { describe, expect, it, beforeEach } from 'vitest';
import { verifyToken } from './auth';

beforeEach(() => { process.env.MCP_AUTH_TOKEN = 'secret123'; });

describe('verifyToken', () => {
  it('accepts the configured bearer token', async () => {
    const info = await verifyToken(new Request('http://x'), 'secret123');
    expect(info?.token).toBe('secret123');
  });
  it('rejects a wrong token', async () => {
    expect(await verifyToken(new Request('http://x'), 'nope')).toBeUndefined();
  });
  it('rejects a missing token', async () => {
    expect(await verifyToken(new Request('http://x'), undefined)).toBeUndefined();
  });
});
