## Context

Quiz questions use `sourceUrls: string[]` referencing Microsoft Learn pages. The `FeedbackPanel` renders each URL as a generic "View Official Source" link. `sources.ts` holds a registry of `SourceReference` objects (id, label, url, usageNote), and `getSourceByUrl()` exists but is unused in the UI.

Current problems:
1. Several `sourceUrls` point to broad landing pages (`/azure/databricks/`, `/entra/`) rather than the specific concept pages that directly address each question.
2. `FeedbackPanel` ignores the registry — all links read "View Official Source" regardless of topic.

Specific root-level URLs needing replacement (with their target replacements):
- `https://learn.microsoft.com/en-us/azure/databricks/` → context-specific:
  - Workspace separation questions → `https://learn.microsoft.com/en-us/azure/databricks/lakehouse-architecture/deployment-guide/workspace-strategy`
  - Secure design / access control questions → `https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/access-control/permissions-concepts`
- `https://learn.microsoft.com/en-us/entra/` → `https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra`
- `https://learn.microsoft.com/en-us/azure/databricks/jobs/` for task-dependency questions → `https://learn.microsoft.com/en-us/azure/databricks/jobs/run-if`
- `https://learn.microsoft.com/en-us/azure/databricks/jobs/` for compute/job-cluster questions → `https://learn.microsoft.com/en-us/azure/databricks/jobs/run-classic-jobs`
- `https://learn.microsoft.com/en-us/azure/databricks/ingestion/` for streaming/schema-evolution questions → `https://learn.microsoft.com/en-us/azure/databricks/structured-streaming/concepts` or `https://learn.microsoft.com/en-us/azure/databricks/ingestion/cloud-object-storage/auto-loader/`
- Unity Catalog namespace/securable hierarchy → `https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/securable-objects`

## Goals / Non-Goals

**Goals:**
- Replace all generic root-URL `sourceUrls` with specific Microsoft Learn deep-links per question
- Expand `sources.ts` with entries for all new URLs
- Show the source label (from registry) next to the URL in FeedbackPanel

**Non-Goals:**
- Changing the `sourceUrls: string[]` type — no schema changes
- Adding per-question source objects or replacing URL arrays with IDs
- Modifying how `contentValidation` works
- Changing the number of sources shown per question

## Decisions

### 1. URL granularity: page-level, not fragment-level

Use clean page URLs (`/data-governance/unity-catalog/securable-objects`) without `#` anchors. Fragment anchors break when doc sections are reorganized; page URLs are more stable.

**Alternative considered**: Fragment-level deep links (e.g., `#three-level-namespace`) — rejected because Microsoft Learn docs reorganize sections frequently and broken anchors still load the page but without visual indication of the error.

### 2. Label resolution: import `getSourceByUrl` into FeedbackPanel directly

`FeedbackPanel` will import `getSourceByUrl` from `../../data/sources` and call it for each `sourceUrl`. If the URL matches a registry entry, show `{source.label}` as the link text. If not (URL not in registry), fall back to `"View Official Source"`.

**Alternative considered**: Passing a `sources` prop or a resolver function prop into `FeedbackPanel` — rejected because it spreads registry concerns to parent components. `FeedbackPanel` already owns the rendering logic; a direct import is simpler and consistent with how other data files are used in the codebase.

### 3. Registry expansion: add, don't replace existing entries

New `SourceReference` entries will be added for each new deep-link URL. Existing entries remain (downstream code may reference them). `assertOfficialMicrosoftUrls` will continue to validate all entries.

### 4. Question URL mapping strategy

Questions grouped by conceptual category, not question ID, to ensure URL choices are semantically consistent:

| Concept | New URL |
|---|---|
| Unity Catalog namespace / securable objects | `/data-governance/unity-catalog/securable-objects` |
| Unity Catalog permissions / least-privilege | `/data-governance/unity-catalog/access-control/permissions-concepts` |
| Unity Catalog governance (general) | `/data-governance/unity-catalog/` (keep) |
| Dev/prod workspace separation | `/lakehouse-architecture/deployment-guide/workspace-strategy` |
| Job clusters vs all-purpose | `/jobs/run-classic-jobs` |
| Task dependencies / conditional flow | `/jobs/run-if` |
| Job creation / retry / scheduling | `/jobs/configure-job` |
| Streaming ingestion / checkpointing | `/structured-streaming/concepts` |
| Schema evolution / Auto Loader | `/ingestion/cloud-object-storage/auto-loader/` |
| Batch + streaming ingestion mix | `/ingestion/` (keep) |
| ADF orchestration | `/azure/data-factory/introduction` (keep) |
| Entra identity | `/entra/fundamentals/what-is-entra` |
| Azure Monitor | `/azure-monitor/fundamentals/overview` (keep) |
| Databricks optimization | `/azure/databricks/optimizations/` (keep) |

## Risks / Trade-offs

- **URL rot risk** → Mitigation: All URLs verified against live Microsoft Learn search results at time of authoring. `contentValidation` enforces `learn.microsoft.com` domain prefix, not URL existence. A future enhancement could add link-check CI, but that's out of scope here.
- **Registry size growth** → Adding ~8 new entries is manageable. The registry is not user-facing and file size is negligible.
- **Label display crowding** → Some questions have 2 source links. With labels, the FeedbackPanel will show 2 labeled links. CSS `.sourceLink` already handles multiple links acceptably; no layout change needed.
