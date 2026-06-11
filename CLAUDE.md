# StudyApp - DP-750 Exam Prep

## Project Goal
Build a personal study web application to prepare for the Microsoft DP-750 exam.

## Core Principles
- Ship quickly and keep architecture simple.
- Optimize for developer productivity.
- Avoid premature optimization.
- Use AI extensively during development (but not exposed to end users in v1).
- Use official Microsoft documentation as the single source of truth.
- No implementation without an approved specification.
- No backend, authentication, user accounts, database, or cloud sync in v1.

## Tech Stack
- Frontend: React
- Build Tool: Vite
- Language: TypeScript
- Styling: TBD
- Animations: GSAP
- State Management: React Context + Hooks
- Persistence: Browser LocalStorage
- Deployment: Vercel

## Architecture
- Frontend only (no backend/database/auth in v1)
- Data stored in browser LocalStorage
- Future migration path: Supabase for auth, DB, sync

## Official Source Rule
DP-750 study content, quiz explanations, and technical answers must use official Microsoft sources only.

Primary source:
- https://learn.microsoft.com/en-us/training/courses/dp-750t00

Approved supporting sources:
- https://learn.microsoft.com/en-us/azure/databricks/
- https://learn.microsoft.com/en-us/azure/data-factory/introduction
- https://learn.microsoft.com/en-us/entra/
- https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview

Do not use community blogs, Reddit, YouTube, third-party summaries, or exam dump sites unless explicitly approved later.

## Development Methodology
Spec-driven development:
1. Gather requirements
2. Generate specifications
3. Define implementation plans
4. Define agents, skills, and tools
5. Break work into tasks
6. Implement
7. Test
8. Review
9. Iterate

Implementation rule:
- Do not implement a feature until a spec exists and has been approved.
- If a request is vague, create or update a spec before coding.
- Keep specs small enough to implement and test in focused changes.

## Success Criteria (v1)
Users can:
- Access the application publicly
- View DP-750 study domains
- Follow a structured preparation process
- Track their progress
- Return later and continue studying from the same browser
- Use the application without creating an account

## Non-Goals (v1)
- Authentication
- User accounts
- Cloud synchronization
- Backend APIs
- Server infrastructure
- Databases
- Payments
- Social features
- Real-time collaboration
- AI chat inside the application
- Mobile applications

## Agent List
Use agents manually through Claude Code when the task matches their responsibility.

### project-orchestrator-agent
Coordinates work, decides which specialist agent should be used, keeps project memory updated, and prevents scope creep. This agent owns workflow order, not implementation.

### spec-writer-agent
Turns rough feature ideas into implementation-ready specs with goals, user flow, data needs, UI behavior, acceptance criteria, non-goals, and test plan.

### spec-review-agent
Reviews specs for clarity, source grounding, v1 alignment, testability, and scope control before implementation begins.

### ui-flow-designer-agent
Designs page structure, component flow, answer picker behavior, interaction states, empty states, and accessibility expectations.

### study-content-builder-agent
Creates app-ready DP-750 study content, topics, modules, quiz questions, answer choices, explanations, and source links from official Microsoft sources.

### source-grounded-answer-agent
Answers DP-750 questions and validates explanations using official Microsoft sources, including source links and confidence level.

Recommended workflow:
1. project-orchestrator-agent
2. spec-writer-agent
3. spec-review-agent
4. ui-flow-designer-agent, when UI is involved
5. study-content-builder-agent, when study content is involved
6. Implementation by Claude Code
7. source-grounded-answer-agent, when checking quiz answers or explanations
8. Update memory if project rules, sources, or decisions changed

## Agent Guidelines
Agents must:
- Follow the spec-driven development process
- Never implement without approved specifications
- Use official Microsoft documentation for DP-750 content
- Include source links for factual DP-750 content and quiz explanations
- Keep changes minimal and focused
- Write tests for new functionality
- Run existing tests to ensure no regressions
- Keep the codebase clean and follow existing patterns
- Avoid backend/auth/cloud sync unless explicitly approved for a future version

## Hallucination Reduction
- Always verify information against official Microsoft documentation
- When unsure, ask for clarification rather than guessing
- Prefer reading existing code over assuming patterns
- Run tests frequently to validate behavior
- Keep implementations simple and aligned with project principles
