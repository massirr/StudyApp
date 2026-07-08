import { timingSafeEqual } from 'node:crypto';

export interface AuthInfo { token: string; scopes: string[]; clientId: string; }

export async function verifyToken(_req: Request, bearer?: string): Promise<AuthInfo | undefined> {
  const expected = process.env.MCP_AUTH_TOKEN;
  if (!expected || !bearer) return undefined;
  const a = Buffer.from(bearer);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return undefined;
  return { token: bearer, scopes: ['write'], clientId: 'owner' };
}
