# Delta: Topic Pages and Routing

## ADDED Requirements

### Requirement: Sources heading reflects the subject's source policy

The topic page's source-links section heading SHALL read "Official Microsoft
Sources" only for subjects whose `sourcePolicy` is `microsoft-only`. For any
other subject it SHALL read "Sources".

#### Scenario: Microsoft-grounded subject

- **WHEN** a topic page renders for a subject with `sourcePolicy: 'microsoft-only'`
  (e.g. DP-750)
- **THEN** the sources section heading SHALL be "Official Microsoft Sources"

#### Scenario: General subject

- **WHEN** a topic page renders for a subject with `sourcePolicy: 'any'`
  (e.g. Nederlands 3)
- **THEN** the sources section heading SHALL be "Sources"
