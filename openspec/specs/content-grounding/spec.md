# Spec: Official Content Grounding

## Purpose

Keep study content trustworthy and auditable: content is organized from source material into app-ready objects (topics, sources, notes, questions) without inventing facts, and each subject declares a source policy that governs which URLs are acceptable. For DP-750 the policy is Microsoft-only; other subjects may allow any source.

## Requirements

### Requirement: Source policy is per subject
The Official Source Rule SHALL be expressed per subject via `Subject.sourcePolicy` (`"microsoft-only" | "any"`) rather than enforced globally. `dp-750` SHALL use `"microsoft-only"`; subjects without an explicit policy SHALL default to `"any"`.

#### Scenario: DP-750 enforces Microsoft sources
- **WHEN** a `dp-750` question or source has a URL not on an official Microsoft domain
- **THEN** validation SHALL reject it

#### Scenario: Other subjects allow any source
- **WHEN** a subject with `sourcePolicy: "any"` includes a non-Microsoft source URL
- **THEN** validation SHALL accept it

#### Scenario: Missing policy defaults to any
- **WHEN** a subject JSON omits `sourcePolicy`
- **THEN** it SHALL be treated as `"any"`

### Requirement: Content is grounded, not invented
The content layer may summarize, reorganize, and trim source material, but SHALL NOT introduce unsupported claims. Content that cannot be tied to its subject's sources SHALL NOT ship.

#### Scenario: Ungrounded content is not shipped
- **WHEN** a note or question cannot be traced to a source
- **THEN** it SHALL be removed rather than shipped

### Requirement: Every topic has at least one source
Each topic SHALL include at least one source reference.

#### Scenario: Topic without a source is invalid
- **WHEN** a topic has no source links
- **THEN** it SHALL be treated as invalid content

### Requirement: Questions cite official documentation
Each quiz question SHALL include at least one `sourceUrl`, and for a `microsoft-only` subject those URLs SHALL point to official Microsoft documentation.

#### Scenario: DP-750 question cites a Microsoft source
- **WHEN** a DP-750 question is validated
- **THEN** it SHALL have at least one `sourceUrl` on an official Microsoft domain
