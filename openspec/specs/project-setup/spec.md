# Spec: Project Setup

## Purpose

Define the frontend project structure so code has a consistent, discoverable home. The app is a frontend-only React + Vite + TypeScript project with no backend, deployed to Vercel; content is bundled at build time and state persists in the browser.

## Requirements

### Requirement: Source is organized by responsibility
The application source SHALL live under `src/`, organized by responsibility: `components/` (UI), `context/` (React context providers), `hooks/` (reusable hooks), `pages/` (route-level screens), `utils/` (pure helpers), `lib/` (framework-agnostic logic), `types/` (shared types), and `data/` (study content).

#### Scenario: A new component has a home
- **WHEN** a new presentational component is added
- **THEN** it SHALL be placed under `src/components/` (or a subfolder) rather than inline in a page or util

#### Scenario: Pure logic is separated from UI
- **WHEN** framework-agnostic logic (e.g. routing parse, pixel font) is added
- **THEN** it SHALL live under `src/lib/` and be unit-testable without rendering

### Requirement: Study content lives in the data layer
Study content SHALL live under `src/data/` as structured data (per-subject JSON in `src/data/subjects/`), not hardcoded inside component logic.

#### Scenario: Content is not hardcoded in components
- **WHEN** a page needs topics or questions
- **THEN** it SHALL read them from the `src/data/subjects` loader rather than embedding content literals
