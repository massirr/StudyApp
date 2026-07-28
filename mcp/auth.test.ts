import { describe, expect, it, beforeEach } from 'vitest';
import { verifyToken, extractToken, guard } from './auth';

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

describe('extractToken', () => {
  it('reads a Bearer Authorization header', () => {
    const req = new Request('http://x', { headers: { authorization: 'Bearer secret123' } });
    expect(extractToken(req)).toBe('secret123');
  });
  it('reads a ?token= query param', () => {
    expect(extractToken(new Request('http://x/api/mcp?token=secret123'))).toBe('secret123');
  });
  it('returns undefined when neither is present', () => {
    expect(extractToken(new Request('http://x/api/mcp'))).toBeUndefined();
  });
});

describe('guard', () => {
  const ok = () => new Response('ok');
  it('passes a request with a valid query-param token', async () => {
    const res = await guard(ok)(new Request('http://x/api/mcp?token=secret123'));
    expect(res.status).toBe(200);
  });
  it('passes a request with a valid Bearer header', async () => {
    const res = await guard(ok)(new Request('http://x/api/mcp', { headers: { authorization: 'Bearer secret123' } }));
    expect(res.status).toBe(200);
  });
  it('rejects a request with no token', async () => {
    const res = await guard(ok)(new Request('http://x/api/mcp'));
    expect(res.status).toBe(401);
  });
  it('rejects a request with a wrong token', async () => {
    const res = await guard(ok)(new Request('http://x/api/mcp?token=nope'));
    expect(res.status).toBe(401);
  });
});
