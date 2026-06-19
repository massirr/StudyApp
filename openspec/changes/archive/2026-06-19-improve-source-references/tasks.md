## 1. Expand sources.ts registry

- [x] 1.1 Add `SourceReference` entry for Unity Catalog securable objects (`/data-governance/unity-catalog/securable-objects`)
- [x] 1.2 Add `SourceReference` entry for Unity Catalog permissions concepts (`/data-governance/unity-catalog/access-control/permissions-concepts`)
- [x] 1.3 Add `SourceReference` entry for workspace strategy (`/lakehouse-architecture/deployment-guide/workspace-strategy`)
- [x] 1.4 Add `SourceReference` entry for classic jobs compute (`/jobs/run-classic-jobs`)
- [x] 1.5 Add `SourceReference` entry for conditional task flow / run-if (`/jobs/run-if`)
- [x] 1.6 Add `SourceReference` entry for job configuration (`/jobs/configure-job`)
- [x] 1.7 Add `SourceReference` entry for Structured Streaming concepts (`/structured-streaming/concepts`)
- [x] 1.8 Add `SourceReference` entry for Auto Loader (`/ingestion/cloud-object-storage/auto-loader/`)
- [x] 1.9 Add `SourceReference` entry for Entra ID fundamentals (`/entra/fundamentals/what-is-entra`)

## 2. Update question sourceUrls in questions.ts

- [x] 2.1 Update `q-t1-1` (namespace format): replace `/data-governance/unity-catalog/` with `/data-governance/unity-catalog/securable-objects`
- [x] 2.2 Update `q-t1-2` (dev/prod separation): replace `/azure/databricks/` with `/lakehouse-architecture/deployment-guide/workspace-strategy`
- [x] 2.3 Update `q-t1-3` (job clusters): replace `/jobs/` with `/jobs/run-classic-jobs`
- [x] 2.4 Update `q-t1-4` (secure design): replace `/azure/databricks/` with `/data-governance/unity-catalog/access-control/permissions-concepts`
- [x] 2.5 Update `q-t1-7` (production isolation): replace `/jobs/` with `/jobs/run-classic-jobs`
- [x] 2.6 Update `q-t1-8` (security practices): replace `/azure/databricks/` with `/data-governance/unity-catalog/access-control/permissions-concepts`
- [x] 2.7 Update `q-t1-9` (environment promotion): replace `/azure/databricks/` with `/lakehouse-architecture/deployment-guide/workspace-strategy`
- [x] 2.8 Update `q-t2-2` (streaming design): replace `/ingestion/` with `/structured-streaming/concepts`
- [x] 2.9 Update `q-t2-4` (schema management): replace `/ingestion/` with `/ingestion/cloud-object-storage/auto-loader/`
- [x] 2.10 Update `q-t2-6` (near real-time streaming): replace `/ingestion/` with `/structured-streaming/concepts`
- [x] 2.11 Update `q-t2-8` (schema evolution): replace `/ingestion/` with `/ingestion/cloud-object-storage/auto-loader/`
- [x] 2.12 Update `q-t3-2` (least privilege): replace `/data-governance/unity-catalog/` with `/data-governance/unity-catalog/access-control/permissions-concepts`
- [x] 2.13 Update `q-t3-3` (catalog hierarchy): replace `/data-governance/unity-catalog/` with `/data-governance/unity-catalog/securable-objects`
- [x] 2.14 Update `q-t3-4` (Entra ID): replace `/entra/` with `/entra/fundamentals/what-is-entra`
- [x] 2.15 Update `q-t3-7` (least privilege scenario): replace `/data-governance/unity-catalog/` with `/data-governance/unity-catalog/access-control/permissions-concepts`
- [x] 2.16 Update `q-t3-9` (Entra identity lifecycle): replace `/entra/` with `/entra/fundamentals/what-is-entra`
- [x] 2.17 Update `q-t4-2` (task dependencies): replace `/jobs/` with `/jobs/run-if`
- [x] 2.18 Update `q-t4-3` (retry policies): replace `/jobs/` with `/jobs/configure-job`
- [x] 2.19 Update `q-t4-6` (retry behavior scenario): replace `/jobs/` with `/jobs/configure-job`
- [x] 2.20 Update `q-t4-7` (dependency/conditional flow): replace `/jobs/` with `/jobs/run-if`

## 3. Update FeedbackPanel to show source labels

- [x] 3.1 Import `getSourceByUrl` from `../../data/sources` in `FeedbackPanel.tsx`
- [x] 3.2 Update source link rendering: call `getSourceByUrl(sourceUrl)` and use `source?.label ?? 'View Official Source'` as link text
- [x] 3.3 Verify `target="_blank"` and `rel="noopener noreferrer"` remain on all links

## 4. Verification

- [x] 4.1 Run `npm run build` (or `tsc`) — no TypeScript errors
- [x] 4.2 Confirm `assertOfficialMicrosoftUrls` passes for all new URLs (no runtime errors on app load)
- [x] 4.3 Visually confirm FeedbackPanel shows labeled links (not generic "View Official Source") for at least one question per topic
