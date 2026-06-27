# StudyApp — DP-750 Exam Prep

A frontend-only study application for the **Microsoft DP-750 (Azure Databricks Data Engineer)** certification exam. Study by topic, take quizzes, track your progress — no account required.

**Live:** https://study-app-one-olive.vercel.app

---

## Features

- **5 structured study domains** — aligned to the official DP-750 exam outline
- **Two-level quiz system** — Level 1 (conceptual MCQs) unlocks Level 2 (code snippet questions) at 70%+
- **Progress tracking** — persisted to browser `localStorage`, no sign-up needed
- **Smart resume** — picks up where you left off, or jumps to the first incomplete topic
- **Official source links** — every quiz explanation is grounded in Microsoft Learn documentation
- **No backend** — fully static; deploys anywhere that serves a single HTML file

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Animations | GSAP 3 |
| Styling | CSS Modules + CSS custom properties |
| Persistence | Browser `localStorage` |
| E2E Tests | Playwright |
| Analytics | Vercel Analytics |
| Deployment | Vercel (auto-deploy from `master`) |

---

## Running Locally

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Clone the repo
git clone https://github.com/massirr/studyapp.git
cd studyapp

# 2. Install dependencies
npm install

# 3. Start the dev server
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
| `npm run lint` | ESLint (zero warnings policy) |
| `npm run format` | Prettier auto-format |

---

## Project Structure

```
src/
├── components/
│   ├── common/           # Shared UI (logo, background)
│   └── quiz/             # Quiz flow components
├── context/              # React Context (progress state)
├── data/                 # Topics, questions, sources, study notes
├── hooks/                # useProgress, useQuizState
├── pages/                # Route-level components
├── types/                # TypeScript type definitions
└── utils/                # localStorage helpers, resume logic, URL validation

tests/                    # Playwright e2e tests
openspec/                 # Specs and change history (dev workflow)
```

### Routes

| Path | Page |
|---|---|
| `/` | Dashboard — progress summary, topic list, resume button |
| `/topics/:slug` | Topic page — subtopics, study notes, official sources, quiz link |
| `/quiz?topic=<id>&level=<1|2>` | Quiz — questions, feedback, scoring |

SPA routing handled by `vercel.json` (all paths rewrite to `index.html`).

---

## Study Content

All DP-750 content is grounded in official Microsoft documentation only. No blogs, YouTube, or exam dumps.

**Primary source:** https://learn.microsoft.com/en-us/training/courses/dp-750t00

**Approved supporting sources:**
- https://learn.microsoft.com/en-us/azure/databricks/
- https://learn.microsoft.com/en-us/azure/data-factory/introduction
- https://learn.microsoft.com/en-us/entra/
- https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview

Source URLs are validated at runtime — the app will throw if any content references a non-Microsoft domain.

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

No server, no database, no authentication. All state lives in the browser.

**Persistence key:** `studyapp_progress` in `localStorage`.

**Progress shape:**
```ts
{
  version: 1,
  completedTopicIds: string[],
  completedSubtopicIds: Record<string, string[]>,
  lastVisitedTopicSlug?: string
}
```

---

## Deployment

Push to `master` → Vercel auto-deploys. No environment variables required for v1.

```bash
npm run build   # verify locally before pushing
git push origin master
```

---

## Development Workflow

This project uses **spec-driven development** via OpenSpec. No feature is implemented without an approved spec.

```
openspec/specs/<capability>/spec.md   ← active specifications
openspec/changes/archive/             ← completed change history
```

Agent workflow (via Claude Code):
1. `project-orchestrator-agent` — scope and coordinate
2. `spec-writer-agent` — write the spec
3. `spec-review-agent` — review for clarity and scope
4. `ui-flow-designer-agent` — design UI when needed
5. `study-content-builder-agent` — build content from official sources
6. Implementation
7. `source-grounded-answer-agent` — validate quiz answers

See `AGENTS.md` for the full agent roster and `CLAUDE.md` for project rules.

---

## Non-Goals (v1)

- Authentication or user accounts
- Backend APIs or databases
- Cloud synchronization
- AI features inside the app
- Mobile applications
- Real-time collaboration
- Payments

---

## License

Personal project — not affiliated with Microsoft.
