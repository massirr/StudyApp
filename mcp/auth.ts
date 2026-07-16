import { timingSafeEqual } from 'node:crypto';

export interface AuthInfo { token: string; scopes: string[]; clientId: string; }

/** Constant-time comparison of a candidate token against MCP_AUTH_TOKEN. */
export function checkToken(token?: string): boolean {
  const expected = process.env.MCP_AUTH_TOKEN;
  if (!expected || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * The token from either `Authorization: Bearer <token>` or a `?token=` query
 * param. Claude's custom-connector UI only speaks OAuth and has no field for a
 * static bearer token, so the query param lets the connector URL itself carry
 * the secret. ponytail: token-in-URL is single-user grade (it lands in server
 * logs); upgrade to OAuth if this ever goes multi-user.
 */
export function extractToken(req: Request): string | undefined {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return new URL(req.url).searchParams.get('token') ?? undefined;
}

type Handler = (req: Request) => Response | Promise<Response>;

/** Wrap an MCP handler so only requests carrying the owner token get through. */
export function guard(handler: Handler): Handler {
  return (req: Request) => {
    if (!checkToken(extractToken(req))) {
      return new Response(
        JSON.stringify({ error: 'invalid_token', error_description: 'Invalid or missing token' }),
        { status: 401, headers: { 'content-type': 'application/json' } },
      );
    }
    return handler(req);
  };
}

/** Retained for mcp-handler's withMcpAuth signature and unit tests. */
export async function verifyToken(_req: Request, bearer?: string): Promise<AuthInfo | undefined> {
  if (!checkToken(bearer)) return undefined;
  return { token: bearer as string, scopes: ['write'], clientId: 'owner' };
}
