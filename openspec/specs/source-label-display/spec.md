# Spec: Source Label Display

## Purpose

Define how `FeedbackPanel` renders source links after a quiz answer is submitted. Source links must display human-readable labels resolved from the `sources.ts` registry rather than a generic fallback string, improving user comprehension and navigation to official Microsoft documentation.

## Requirements

### Requirement: FeedbackPanel SHALL display source label alongside each source link
When rendering source links after an answer is submitted, `FeedbackPanel` MUST show the human-readable label for each source URL (resolved from the `sources.ts` registry) as the link text, rather than the static string "View Official Source".

#### Scenario: Registered URL shows its label as link text
- **WHEN** a question's `sourceUrls` contains a URL present in the `SOURCES` registry
- **THEN** the rendered link text SHALL be the `label` of the matching `SourceReference` (e.g., "Unity Catalog Securable Objects")

#### Scenario: Unregistered URL falls back to generic text
- **WHEN** a question's `sourceUrls` contains a URL not present in the `SOURCES` registry
- **THEN** the rendered link text SHALL be "View Official Source"

#### Scenario: Source links open in a new tab
- **WHEN** a user clicks any source link in the FeedbackPanel
- **THEN** the link SHALL open in a new browser tab (`target="_blank"`) with `rel="noopener noreferrer"`

#### Scenario: Multiple sources render individually labeled links
- **WHEN** a question has two `sourceUrls`
- **THEN** each SHALL render as a separate labeled link (not merged into one)

#### Scenario: Source label is visually distinct from explanation text
- **WHEN** source links are displayed in FeedbackPanel
- **THEN** existing `.sourceLink` CSS class SHALL apply to all source links regardless of label text
