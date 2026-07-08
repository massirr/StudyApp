## MODIFIED Requirements

### Requirement: Source policy is per subject
The Official Source Rule SHALL be expressed per subject via `Subject.sourcePolicy` (`"microsoft-only" | "any"`) rather than enforced globally. `dp-750` SHALL use `"microsoft-only"`; subjects without an explicit policy SHALL default to `"any"`.

#### Scenario: DP-750 enforces Microsoft sources
- **WHEN** a `dp-750` question or source has a URL not on `learn.microsoft.com`
- **THEN** validation SHALL reject it

#### Scenario: Other subjects allow any source
- **WHEN** a subject with `sourcePolicy: "any"` includes a non-Microsoft source URL
- **THEN** validation SHALL accept it

#### Scenario: Missing policy defaults to any
- **WHEN** a subject JSON omits `sourcePolicy`
- **THEN** it SHALL be treated as `"any"`
