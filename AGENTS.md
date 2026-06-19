# Agents

This project uses Claude Code agents invoked manually via the Agent tool. The workflow is spec-driven via OpenSpec.

## Workflow

```
/opsx:propose "feature description"   → proposal + specs + tasks created
/opsx:apply                           → implement the tasks
/opsx:archive                         → archive completed change into openspec/specs/
```

Canonical specs live in `openspec/specs/<capability>/spec.md`.
Active changes (in-progress work) live in `openspec/changes/<name>/`.

---

## Agent Roster

### project-orchestrator-agent
**When to use:** Coordinating work, choosing which specialist to use, checking scope.

Responsibilities:
- Align all work to the v1 goal: simple local-first DP-750 study app
- Route tasks to the right specialist
- Block scope creep (no backend/auth/cloud sync in v1)
- Enforce spec-before-code rule
- Require official Microsoft sources for DP-750 content

Output includes: recommended next agent, why it fits, inputs to give it, scope risks.

---

### spec-writer-agent
**When to use:** Turning a rough feature idea into an implementation-ready spec.

Writes specs with these sections: Goal, User Problem, Proposed Solution, User Flow, Page/Component Structure, Data Model, Source Requirements, Acceptance Criteria, Non-Goals, Test Plan, Open Questions.

Rules: small v1 scope, LocalStorage for persistence, no backend/auth, official Microsoft sources only, no code.

---

### spec-review-agent
**When to use:** Reviewing a spec before implementation begins.

Reviews for: clarity, completeness, testability, v1 scope, React/TypeScript/LocalStorage alignment, no backend/auth, official Microsoft sourcing.

Output format:
```json
{
  "status": "Approved | Needs revision",
  "blockingIssues": [],
  "suggestedImprovements": [],
  "implementationRisks": [],
  "requiredTests": []
}
```

---

### ui-flow-designer-agent
**When to use:** Designing or refining pages, components, and interaction flows.

Designs: page structure, components, user flow, interaction states, answer picker behavior, LocalStorage-aware UI state, accessibility.

Avoids: marketing-style decorative complexity. Does not write code unless explicitly asked.

---

### study-content-builder-agent
**When to use:** Creating DP-750 study content — topics, quiz questions, explanations.

Approved sources only:
- https://learn.microsoft.com/en-us/training/courses/dp-750t00
- https://learn.microsoft.com/en-us/azure/databricks/
- https://learn.microsoft.com/en-us/azure/data-factory/introduction
- https://learn.microsoft.com/en-us/entra/
- https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview

Output per question: `id`, `topic`, `difficulty`, `question`, `choices`, `correctChoiceId`, `explanation`, `sourceLinks`, `confidence`.

---

### source-grounded-answer-agent
**When to use:** Validating DP-750 quiz answers or explanations against official Microsoft docs.

Rules: official Microsoft sources only, DP-750 course page first, no guessing, honest confidence.

Output format:
```
Correct Answer: [answer]

Explanation:
[Source-backed reasoning. Why other options are wrong when useful.]

Source Links:
- [full URL]

Confidence: High | Medium | Low
```

---

## Recommended Invocation Order

1. `project-orchestrator-agent` — scope check
2. `spec-writer-agent` — write the spec
3. `spec-review-agent` — review before coding
4. `ui-flow-designer-agent` — when UI is involved
5. `study-content-builder-agent` — when study content is involved
6. Implementation (Claude Code directly via `/opsx:apply`)
7. `source-grounded-answer-agent` — validate quiz answers/explanations
8. `/opsx:archive` — archive completed change
