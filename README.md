# StudyApp — Quiz-Based Exam Prep

A frontend-only study application for certification-exam prep. Study by topic, take quizzes, and track your progress — no account required. The app is **subject-agnostic**: the flagship subject is **Microsoft DP-750 (Azure Databricks Data Engineer)**, but any subject can be added as a JSON file.

**Live:** https://studyapp.irakozedarlo.be

---

## Features

- **Multiple subjects** — pick a subject on the landing page; each has its own topics, quizzes, sources, and notes (`src/data/subjects/<slug>.json`)
- **Two-level quiz system** — Level 1 (conceptual MCQs) unlocks Level 2 (code-snippet questions) at 70%+
- **Progress tracking** — per-subject, persisted to browser `localStorage`, no sign-up needed
- **Smart resume** — picks up where you left off, or jumps to the first incomplete topic
- **Grounded source links** — every quiz explanation links its source; a subject can enforce a `microsoft-only` source policy (DP-750 does)
- **AI content authoring (MCP)** — add/update questions, topics, sources, notes, and whole subjects by chatting with the Claude app, even from your phone (see `mcp/README.md`)
- **No backend for the app** — the study app is fully static; the MCP authoring server is an optional serverless function

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Animations | GSAP 3 |
| Styling | CSS Modules + CSS custom properties |
| Persistence | Browser `localStorage` |
| Content authoring | MCP server (`mcp-handler`) on a Vercel Function |
| E2E / unit tests | Playwright / Vitest |
| Analytics | Vercel Analytics |
| Deployment | Vercel (auto-deploy from `master`) |

---

## Running Locally

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone https://github.com/massirr/studyapp.git
cd studyapp
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

### All available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server (hot reload) |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run Playwright end-to-end tests |
| `npm run test:unit` | Run Vitest unit tests (app + MCP core) |
| `npm run lint` | ESLint (zero warnings policy) |
| `npm run format` | Prettier auto-format |

---

## Project Structure

```
src/
├── components/           # AppShell, subject switcher, quiz flow, shared UI
├── context/              # React Context (progress state)
├── data/subjects/        # One JSON file per subject (+ schema, loader)
├── hooks/                # useProgress, useQuizState
├── lib/                  # route parser, pixel-font renderer
├── pages/                # Picker, Dashboard, Topic, Quiz, NotFound
├── types/                # TypeScript type definitions
└── utils/                # localStorage helpers, resume logic, URL validation

mcp/                      # MCP content-authoring server (tools, auth, GitHub I/O)
api/mcp.ts                # Vercel Function that hosts the MCP server
tests/                    # Playwright e2e tests
openspec/                 # Specs and change history (dev workflow)
```

### Routes

| Path | Page |
|---|---|
| `/` | Subject picker |
| `/:subject` | Dashboard — progress summary, topic list, resume button |
| `/:subject/topics/:slug` | Topic page — subtopics, study notes, sources, quiz link |
| `/:subject/quiz?topic=<id>&level=<1\|2>` | Quiz — questions, feedback, scoring |

SPA routing is handled by `vercel.json`, which rewrites everything **except `/api/*`** (the MCP function) to `index.html`.

---

## Study Content

Content lives in `src/data/subjects/<slug>.json` and is validated against a schema at load time. Each subject declares a `sourcePolicy`:

- **`microsoft-only`** (e.g. `dp-750`) — every source URL must be an official Microsoft domain, or the app throws. No blogs, YouTube, or exam dumps.
- **`any`** — sources are unrestricted.

DP-750 primary source: https://learn.microsoft.com/en-us/training/courses/dp-750t00

---

## Architecture

```
User interaction
  → React components (CSS Modules + GSAP)
  → Custom hooks (useProgress, useQuizState)
  → Utility functions (storage, resume, validation)
  → Browser localStorage
  → React Context (ProgressContext)
  → Re-render
```

No server, no database, no authentication for the app itself. All state lives in the browser.

**Persistence key:** `studyapp_progress` in `localStorage` (progress is **per-subject**; a v1 payload auto-migrates to v2 under `dp-750`).

**Progress shape (v2):**
```ts
{
  version: 2,
  subjects: {
    [slug: string]: {
      completedTopicIds: string[],
      completedSubtopicIds: Record<string, string[]>,
      lastVisitedTopicSlug?: string
    }
  },
  preferences?: { compactMode?: boolean; showCompletedTopics?: boolean }
}
```

---

## MCP Content Authoring

An optional MCP server lets a tool-calling AI (e.g. the Claude app) read and add/update
content — subjects, topics, questions, sources, notes — by committing validated JSON to
this repo. It runs as a Vercel Function at `/api/mcp` and is gated by a secret token.

Setup, env vars, and how to connect it as a Claude custom connector are in **`mcp/README.md`**.

---

## Deployment

Push to `master` → Vercel auto-deploys. The study app needs **no environment variables**.
The MCP authoring server needs four (`GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`,
`MCP_AUTH_TOKEN`) — see `mcp/README.md`.

```bash
npm run build   # verify locally before pushing
git push origin master
```

---

## Development Workflow

This project uses **spec-driven development** via OpenSpec. No feature is implemented without an approved spec.

```
openspec/specs/<capability>/spec.md   ← published specifications
openspec/changes/<name>/              ← in-progress changes
openspec/changes/archive/             ← completed change history
```

See `AGENTS.md` for the agent roster and `CLAUDE.md` for project rules.

---

## Non-Goals (v1)

- Authentication or user accounts (for the app)
- Backend APIs or databases for app data
- Cloud synchronization
- AI features *inside* the app (authoring happens out-of-band via MCP)
- Mobile applications
- Real-time collaboration
- Payments

---

## License

Personal project — not affiliated with Microsoft.
