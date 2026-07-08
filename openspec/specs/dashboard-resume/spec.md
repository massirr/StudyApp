# Spec: Dashboard and Resume Behavior

## Purpose

Give users a clear per-subject dashboard that summarizes study progress and provides a reliable way to resume from where they left off. The dashboard is an overview and navigation surface, not a second copy of the study material. (Subject-scoped routing is defined in `subject-catalog`.)

## Requirements

### Requirement: Dashboard shows a progress summary from persisted state
Each subject's dashboard SHALL display a progress summary — completed count, remaining count, and completion percentage — derived from that subject's persisted progress and its topic catalog.

#### Scenario: Summary reflects saved progress
- **WHEN** a subject dashboard loads with some topics marked complete
- **THEN** it SHALL show the completed count, remaining count, and percentage for that subject

#### Scenario: Returning reflects updated state
- **WHEN** the user completes work in a topic and returns to the dashboard
- **THEN** the summary SHALL reflect the updated completion state

### Requirement: Resume opens the most relevant incomplete topic
The dashboard SHALL provide a Resume action that opens the most relevant next topic using this rule: (1) if `lastVisitedTopicSlug` exists and that topic is still incomplete, resume there; (2) otherwise resume the first incomplete topic in study order.

#### Scenario: Resume prefers last visited incomplete topic
- **WHEN** `lastVisitedTopicSlug` is set and that topic is still incomplete
- **THEN** Resume SHALL open that topic

#### Scenario: Resume falls back to first incomplete topic
- **WHEN** there is no valid last-visited incomplete topic
- **THEN** Resume SHALL open the first incomplete topic in study order

### Requirement: Completion state replaces the resume target when all topics are complete
When every topic in a subject is complete, the dashboard SHALL show a completion state instead of a resume link.

#### Scenario: All topics complete
- **WHEN** all of a subject's topics are marked complete
- **THEN** the dashboard SHALL show a completion state and SHALL NOT render a broken resume link

### Requirement: Dashboard content is catalog-driven
The dashboard topic list SHALL be built from the subject's topic catalog, not from duplicated hardcoded content.

#### Scenario: Topic list matches the catalog
- **WHEN** the dashboard renders its topic list
- **THEN** the list SHALL match the subject's topics in study order
