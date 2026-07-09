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
import { createMcpHandler, withMcpAuth } from 'mcp-handler';
import { registerTools } from '../mcp/tools.js';
import { verifyToken } from '../mcp/auth.js';

// createMcpHandler wires our tools onto an MCP server exposed over
// streamable-HTTP. withMcpAuth rejects any request whose bearer token does not
// match MCP_AUTH_TOKEN (see ../mcp/auth.ts), so only the owner can read/write.
const base = createMcpHandler(
  (server) => registerTools(server as never),
  {},
  { basePath: '/api' },
);

const handler = withMcpAuth(base, verifyToken, { required: true });

export { handler as GET, handler as POST, handler as DELETE };
