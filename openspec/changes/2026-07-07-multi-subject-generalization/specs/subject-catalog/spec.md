## ADDED Requirements

### Requirement: Subjects coexist and are selectable
The app SHALL support multiple study subjects at once. A subject picker at `/` SHALL list all available subjects, each linking to its own dashboard at `/:subject`.

#### Scenario: Picker lists subjects
- **WHEN** the user visits `/`
- **THEN** a card for each available subject SHALL be shown, each linking to `/<subject-slug>`

#### Scenario: DP-750 remains available
- **WHEN** the app loads after migration
- **THEN** `dp-750` SHALL appear in the picker and its dashboard SHALL render at `/dp-750`

### Requirement: Routes are scoped under a subject segment
All study routes SHALL be nested under the active subject: `/:subject` (dashboard), `/:subject/topics/:slug` (topic), `/:subject/quiz?topic=:slug` (quiz). The `/:subject/topic/:slug` (singular) path SHALL redirect to the plural form.

#### Scenario: Subject dashboard
- **WHEN** the user visits `/dp-750`
- **THEN** the DP-750 dashboard SHALL render with DP-750 topics

#### Scenario: Scoped topic route
- **WHEN** the user visits `/dp-750/topics/<known-slug>`
- **THEN** that topic page SHALL render

#### Scenario: Unknown subject
- **WHEN** the user visits `/<unknown-subject>`
- **THEN** the NotFound page SHALL render

#### Scenario: Singular topic redirect is preserved
- **WHEN** the user visits `/dp-750/topic/<slug>`
- **THEN** the URL SHALL be replaced with `/dp-750/topics/<slug>` and the topic page SHALL render

### Requirement: Active subject drives branding
The header wordmark, dashboard hero, and quiz titles SHALL reflect the active subject's `shortLabel`. The picker page SHALL show a neutral app brand rather than a subject wordmark.

#### Scenario: Wordmark follows subject
- **WHEN** the user is anywhere under `/dp-750`
- **THEN** the header wordmark SHALL read "DP-750"

#### Scenario: Switching subjects re-brands
- **WHEN** the user navigates from one subject to another
- **THEN** the header wordmark and hero SHALL re-render to the new subject's short label
