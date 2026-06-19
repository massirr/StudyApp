# StudyApp — DP-750 Exam Prep

A personal study web app for the **Microsoft DP-750 (Azure Databricks)** certification exam.

**Live:** https://study-app-one-olive.vercel.app

---

## Goals

- Help users study for DP-750 by domain and topic
- Track progress between sessions (no account required)
- Stay publicly accessible with zero backend in v1

**Non-goals (v1):** auth, backend APIs, cloud sync, mobile apps, real-time collaboration, AI chat inside the app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Animations | GSAP |
| E2E Tests | Playwright |
| Persistence | Browser LocalStorage |
| Deployment | Vercel (auto-deploy from `master`) |

**Planned additions (not yet decided):**
- Backend: Supabase or PocketBase (undecided)
- Auth: Auth0
- Second question type: code snippet MCQs
- MCQ answer distribution fix: current answers skew toward first/second option — needs redistribution
- More exam topics as content grows

---

## Design System

**Name:** Koze's Brown

Full design spec lives in the design skill (`obama-design` / `frontend-design`). Reference it when building or reviewing UI.

---

## File Structure

```
src/
├── assets/         # Icons, fonts, images
├── components/     # Reusable React components
├── context/        # React context providers (progress state)
├── hooks/          # Custom hooks (useProgress, etc.)
├── lib/            # Utility functions, shared logic
├── pages/          # Route-level page components
├── types/          # TypeScript type definitions
├── data/           # Topic catalog, questions, source references
├── App.tsx         # Root component + router
└── main.tsx        # Entry point
tests/              # Playwright e2e tests
openspec/           # Specs and changes (see below)
```

---

## Routing

| Path | Page |
|---|---|
| `/` | Dashboard (progress summary, resume) |
| `/topics/:slug` | Topic study page |

SPA routing handled by Vercel (`vercel.json` rewrites all to `index.html`).

---

## Development

```bash
npm install
npm run dev        # dev server at localhost:5173
npm run build      # production build
npm run test       # Playwright e2e tests
```

---

## Deployment

Push to `master` → Vercel auto-deploys.

No manual deploy steps needed. Vercel picks up `dist/` from `npm run build`.

---

## Development Workflow

Spec-driven via **OpenSpec**:

```
/opsx:propose "feature description"   # creates proposal + specs + tasks
/opsx:apply                           # implement
/opsx:archive                         # archive completed change into openspec/specs/
```

**Rule:** No implementation without an approved spec. See `AGENTS.md` for the agent roster and invocation order.

Canonical specs: `openspec/specs/<capability>/spec.md`
Active changes: `openspec/changes/<name>/`

---

## Official Sources

DP-750 content must come exclusively from:

- https://learn.microsoft.com/en-us/training/courses/dp-750t00 ← primary
- https://learn.microsoft.com/en-us/azure/databricks/
- https://learn.microsoft.com/en-us/azure/data-factory/introduction
- https://learn.microsoft.com/en-us/entra/
- https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview

No blogs, Reddit, YouTube, or exam dumps.

---

## Architecture Diagram

See `studyapp-architecture.html` at the root for the visual architecture diagram.

Data flow: User interaction → React components → utility functions → LocalStorage → React Context → re-render.
