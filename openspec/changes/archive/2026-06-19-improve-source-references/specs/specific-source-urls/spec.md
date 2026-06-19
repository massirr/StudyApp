## ADDED Requirements

### Requirement: All quiz question sourceUrls SHALL reference specific Microsoft Learn pages
Every `sourceUrl` in `questions.ts` MUST link to a specific Microsoft Learn documentation page directly relevant to the concept being tested by that question. Generic landing pages (e.g., `/azure/databricks/`, `/entra/`) are not acceptable.

#### Scenario: Unity Catalog namespace question links to securable-objects page
- **WHEN** a question tests the three-level namespace (`catalog.schema.object`) format
- **THEN** its `sourceUrls` SHALL include `https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/securable-objects`

#### Scenario: Workspace separation question links to workspace strategy page
- **WHEN** a question tests dev/prod workspace separation or SDLC isolation
- **THEN** its `sourceUrls` SHALL include `https://learn.microsoft.com/en-us/azure/databricks/lakehouse-architecture/deployment-guide/workspace-strategy`

#### Scenario: Job cluster questions link to classic compute jobs page
- **WHEN** a question tests the choice of job clusters vs all-purpose clusters for production pipelines
- **THEN** its `sourceUrls` SHALL include `https://learn.microsoft.com/en-us/azure/databricks/jobs/run-classic-jobs`

#### Scenario: Task dependency questions link to conditional task flow page
- **WHEN** a question tests task dependencies or conditional execution flow in Databricks Jobs
- **THEN** its `sourceUrls` SHALL include `https://learn.microsoft.com/en-us/azure/databricks/jobs/run-if`

#### Scenario: Streaming ingestion questions link to Structured Streaming concepts page
- **WHEN** a question tests streaming ingestion design, checkpointing, or low-latency processing
- **THEN** its `sourceUrls` SHALL include `https://learn.microsoft.com/en-us/azure/databricks/structured-streaming/concepts`

#### Scenario: Schema evolution questions link to Auto Loader page
- **WHEN** a question tests schema management or schema evolution in ingestion pipelines
- **THEN** its `sourceUrls` SHALL include `https://learn.microsoft.com/en-us/azure/databricks/ingestion/cloud-object-storage/auto-loader/`

#### Scenario: Entra identity questions link to Entra fundamentals page
- **WHEN** a question tests Microsoft Entra ID for identity and access management
- **THEN** its `sourceUrls` SHALL include `https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra`

#### Scenario: Permissions/least-privilege questions link to Unity Catalog permissions concepts page
- **WHEN** a question tests least-privilege access or Unity Catalog access control design
- **THEN** its `sourceUrls` SHALL include `https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/access-control/permissions-concepts`

### Requirement: sources.ts registry SHALL contain entries for all URLs used in questions
Every URL appearing in any question's `sourceUrls` MUST have a corresponding entry in the `SOURCES` array in `sources.ts` with a meaningful `label` and `usageNote`.

#### Scenario: New deep-link URLs have registry entries
- **WHEN** a new specific URL is added to `questions.ts`
- **THEN** a `SourceReference` entry with the same URL, a descriptive `label`, and a `usageNote` SHALL exist in `sources.ts`

#### Scenario: Validation passes after URL changes
- **WHEN** the application builds
- **THEN** `assertOfficialMicrosoftUrls` SHALL pass for all source URLs in both `sources.ts` and `questions.ts`
