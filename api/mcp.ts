// Vercel Function hosting the StudyApp MCP content-authoring server.
//
// ┌─ CONFIRM ON FIRST DEPLOY ────────────────────────────────────────────────┐
// │ This repo is a Vite SPA, NOT Next.js. The mcp-handler docs show the       │
// │ Next.js App Router form (`app/[transport]/route.ts`, named GET/POST/      │
// │ DELETE exports). On a non-Next Vercel project, serverless functions live  │
// │ in `api/`. If the streamable-HTTP transport requires a dynamic segment,   │
// │ rename this file to `api/[transport].ts`. Verify with `vercel dev` per    │
// │ https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel                  │
// └──────────────────────────────────────────────────────────────────────────┘
import { createMcpHandler } from 'mcp-handler';
import { registerTools } from '../mcp/tools.js';
import { guard } from '../mcp/auth.js';

// createMcpHandler wires our tools onto an MCP server exposed over
// streamable-HTTP. `guard` rejects any request whose token (Authorization
// header OR ?token= query param) does not match MCP_AUTH_TOKEN, so only the
// owner can read/write. The query-param path exists because Claude's custom
// connector UI only supports OAuth and has no static-bearer-token field.
const base = createMcpHandler(
  (server) => registerTools(server as never),
  {},
  { basePath: '/api' },
);

const handler = guard(base);

export { handler as GET, handler as POST, handler as DELETE };
