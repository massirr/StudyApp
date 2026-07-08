# Spec: Topic Pages and Routing

## Purpose

Provide one page per study topic, rendering the topic's overview, subtopics, and official source links, driven by a reusable topic catalog rather than hardcoded component logic. (Subject-scoped route shapes are defined in `subject-catalog`; this spec covers topic-page content and the not-found fallback.)

## Requirements

### Requirement: Each topic renders its own page from the catalog
A topic page SHALL render a single topic — its title, summary, subtopics, and source links — resolved from the subject's topic catalog by slug.

#### Scenario: Known topic renders
- **WHEN** the user opens a topic page for a known slug within a subject
- **THEN** the page SHALL render that topic's title, summary, subtopics, and source links

#### Scenario: Topic content comes from the catalog
- **WHEN** a topic page renders
- **THEN** its content SHALL come from the subject's topic data, not hardcoded component branches

### Requirement: Unknown routes and slugs show a not-found page
Unknown topic slugs and unknown routes SHALL render a friendly not-found page.

#### Scenario: Unknown slug
- **WHEN** the user opens a topic page for a slug that does not exist in the subject
- **THEN** the not-found page SHALL render

### Requirement: Topic pages link only to official sources for grounded subjects
For a subject whose `sourcePolicy` is `microsoft-only`, topic pages SHALL display only official Microsoft Learn / Microsoft product documentation source links.

#### Scenario: DP-750 topic shows only Microsoft sources
- **WHEN** a DP-750 topic page renders its source links
- **THEN** every link SHALL point to an official Microsoft domain
