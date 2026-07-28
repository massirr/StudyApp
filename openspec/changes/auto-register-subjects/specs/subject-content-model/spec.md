# Delta: Subject Content Model

## MODIFIED Requirements

### Requirement: Subjects loaded and validated at build time

A registry `src/data/subjects/index.ts` SHALL automatically discover every
`src/data/subjects/*.json` file at build time (via eager glob import), validate
each against the schema, and expose `getSubjects()` and `getSubjectBySlug(slug)`.
Adding a subject JSON file SHALL be sufficient for the subject to appear in the
app — no registry code edit is required. Invalid subject data SHALL fail the
build/load. Subject order SHALL be deterministic (sorted by file path).

#### Scenario: Valid subject loads

- **WHEN** a well-formed subject JSON is present
- **THEN** `getSubjectBySlug` SHALL return it

#### Scenario: New subject file appears without registry edit

- **WHEN** a new well-formed `src/data/subjects/<slug>.json` is added (for
  example committed by the MCP `create_subject` tool)
- **THEN** the subject SHALL be returned by `getSubjects()` on the next build
  with no change to `index.ts`

#### Scenario: Malformed subject rejected

- **WHEN** a subject JSON is missing a required field or has a `shortLabel` with
  unsupported glyphs
- **THEN** validation SHALL throw rather than silently loading partial content
