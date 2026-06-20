import { QuizQuestion } from '../types/quiz';
import { assertOfficialMicrosoftUrls } from '../utils/contentValidation';

const QUESTION_BANK: QuizQuestion[] = [

    // ── Topic 01 Level 1: Plan & Design ─────────────────────────────────────────
    {
        id: 'q-t1-1',
        topicId: 'topic-01',
        prompt: 'You run GRANT SELECT ON SCHEMA main.analytics TO GROUP data_analysts. A colleague creates a new Delta table main.analytics.q4_results the following day. Members of data_analysts query the new table. What happens?',
        type: 'single',
        options: [
            { id: 'a', label: 'Query fails — GRANT SELECT ON SCHEMA covers only objects existing at grant time; new tables require an additional explicit grant' },
            { id: 'b', label: 'Query succeeds — GRANT ON SCHEMA automatically cascades to all current and future child objects' },
            { id: 'c', label: 'Query succeeds only if the table creator also belongs to data_analysts' },
            { id: 'd', label: 'Query fails because analysts need GRANT SELECT ON CATALOG, not on the schema level' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'In Unity Catalog, GRANT SELECT ON SCHEMA grants access to objects that existed at grant time. New tables created after the grant are not automatically covered. Administrators must issue an additional grant or configure default privileges for future objects.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/manage-privileges/']
    },
    {
        id: 'q-t1-2',
        topicId: 'topic-01',
        prompt: 'Your team runs hourly ETL pipelines that each take 8 minutes to complete. A senior engineer proposes keeping one all-purpose cluster running 24/7 to eliminate the 4-minute job-cluster startup time. What is the primary cost argument against this approach?',
        type: 'single',
        options: [
            { id: 'a', label: 'All-purpose clusters cannot execute scheduled Databricks Jobs — only interactive notebook sessions are supported' },
            { id: 'b', label: 'The cluster accrues 52 minutes of idle DBU billing per hour to avoid 4 minutes of startup; job clusters start on demand and terminate immediately after each run' },
            { id: 'c', label: 'Continuous clusters are restricted to a single concurrent Spark job, serializing the hourly pipeline runs' },
            { id: 'd', label: 'All-purpose clusters reset Spark session state between tasks, causing non-deterministic behavior in scheduled pipelines' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'All-purpose clusters accrue DBU costs every minute they run. A 24/7 cluster running 8-minute hourly jobs spends ~88% of its time idle. Job clusters avoid this cost profile by starting fresh per run and terminating immediately upon completion.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/run-classic-jobs']
    },
    {
        id: 'q-t1-3',
        topicId: 'topic-01',
        prompt: 'A service principal is granted SELECT on table prod.finance.invoices but has no other Unity Catalog grants. It runs SELECT * FROM prod.finance.invoices and receives a SCHEMA_NOT_FOUND error. What is the most likely missing privilege?',
        type: 'single',
        options: [
            { id: 'a', label: 'CREATE TABLE on prod.finance — required even for read-only access to managed Delta tables' },
            { id: 'b', label: 'MODIFY on prod.finance.invoices — SELECT alone does not allow row-level data access in Unity Catalog' },
            { id: 'c', label: 'USE CATALOG on prod and USE SCHEMA on prod.finance — without these the three-level namespace cannot be traversed to reach the table' },
            { id: 'd', label: 'GRANT SELECT must be re-approved by a workspace admin after each cluster restart before it takes effect' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Unity Catalog requires USE CATALOG and USE SCHEMA in addition to SELECT on the target table. Without the traversal privileges the SQL engine cannot resolve the fully qualified name even when SELECT is granted, raising a namespace-not-found error.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/manage-privileges/']
    },
    {
        id: 'q-t1-4',
        topicId: 'topic-01',
        prompt: 'Which practices align with designing secure Databricks workloads?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Apply least-privilege access' },
            { id: 'b', label: 'Use centralized governance with Unity Catalog' },
            { id: 'c', label: 'Grant broad owner rights to all users' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Least privilege and centralized governance are core security design patterns for enterprise data platforms.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/',
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/access-control/permissions-concepts'
        ]
    },
    {
        id: 'q-t1-5',
        topicId: 'topic-01',
        prompt: 'A data engineer retrieves a database connection string from a Databricks secret scope and passes it to a Python logging function that writes to the cluster driver log. What does Databricks do with the secret value in that log output?',
        type: 'single',
        options: [
            { id: 'a', label: 'Logs the full plaintext value — Databricks only redacts secrets in notebook cell output, not in driver logs' },
            { id: 'b', label: 'Replaces the secret value with [REDACTED] in driver logs, cluster event history, and notebook cell output' },
            { id: 'c', label: 'Raises a PermissionError before the secret is passed to the logging function' },
            { id: 'd', label: 'Encrypts the value in-place with a workspace key before appending it to the log file' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Databricks Secret Scopes redact secret values wherever they appear in Databricks-managed output — notebook cells, driver logs, and cluster event history — replacing them with [REDACTED]. This prevents accidental credential exposure regardless of how the secret is used in code.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/security/secrets/']
    },
    {
        id: 'q-t1-6',
        topicId: 'topic-01',
        prompt: 'Scenario: Your team needs stricter separation of duties across data domains. Which approach best supports this goal?',
        type: 'single',
        options: [
            { id: 'a', label: 'Store all assets in one unrestricted schema' },
            { id: 'b', label: 'Disable access control reviews' },
            { id: 'c', label: 'Use separate catalogs and permissions per domain' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Domain-based catalogs with scoped permissions support clear ownership and governance boundaries.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
    },
    {
        id: 'q-t1-7',
        topicId: 'topic-01',
        prompt: 'Scenario: A production workload must avoid impact from ad-hoc notebook activity. What is the best design choice?',
        type: 'single',
        options: [
            { id: 'a', label: 'Share one all-purpose cluster with all developers' },
            { id: 'b', label: 'Run all workloads manually' },
            { id: 'c', label: 'Enable interactive mode on all production clusters' },
            { id: 'd', label: 'Run production jobs on dedicated job clusters' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Dedicated job clusters isolate production execution from interactive development workloads.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/run-classic-jobs']
    },
    {
        id: 'q-t1-8',
        topicId: 'topic-01',
        prompt: 'Which actions improve secure platform design for Databricks workloads?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Use centralized governance controls' },
            { id: 'b', label: 'Restrict privileges to required roles' },
            { id: 'c', label: 'Assign broad permanent admin access to everyone' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Centralized controls and least privilege are key security and governance foundations.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/access-control/permissions-concepts',
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
    },
    {
        id: 'q-t1-9',
        topicId: 'topic-01',
        prompt: 'Scenario: You need clear environment promotion from dev to prod. Which pattern is most aligned?',
        type: 'single',
        options: [
            { id: 'a', label: 'Environment-specific workspaces with controlled deployment steps' },
            { id: 'b', label: 'Direct edits in production only' },
            { id: 'c', label: 'No separation between environments' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Separate environments with controlled promotion reduce risk and improve operational confidence.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/lakehouse-architecture/deployment-guide/workspace-strategy']
    },
    {
        id: 'q-t1-10',
        topicId: 'topic-01',
        prompt: 'Scenario: A data platform lead asks for scalable governance with discoverability. What should be prioritized?',
        type: 'single',
        options: [
            { id: 'a', label: 'Unified governance model with structured object hierarchy' },
            { id: 'b', label: 'Independent unmanaged naming conventions per team' },
            { id: 'c', label: 'Removing catalogs to simplify metadata' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Structured hierarchy and centralized governance improve scalability, discoverability, and control.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
    },

    // ── Topic 02 Level 1: Ingest & Transform ─────────────────────────────────────
    {
        id: 'q-t2-1',
        topicId: 'topic-02',
        prompt: 'Your team must ingest JSON event files arriving continuously at ~1,000 files per minute from Azure Data Lake into a Delta table. Which ingestion approach is most appropriate and why?',
        type: 'single',
        options: [
            { id: 'a', label: 'COPY INTO — optimized for high-frequency streaming and tracks each file for exactly-once delivery' },
            { id: 'b', label: 'PySpark spark.read.json() in a scheduled Job — scales by parallelizing reads across Spark executors' },
            { id: 'c', label: 'Auto Loader with cloudFiles format — uses file notifications or incremental listing to track new files without rescanning the full directory each microbatch' },
            { id: 'd', label: 'Azure Data Factory Copy Activity — handles JSON natively and writes directly to Delta format without Databricks compute' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Auto Loader (cloudFiles) is designed for continuous file ingestion at scale. It tracks which files have been processed using Azure Event Grid notifications or incremental directory listing, avoiding expensive full-directory scans. COPY INTO is better suited for scheduled batch loads.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/cloud-object-storage/auto-loader/']
    },
    {
        id: 'q-t2-2',
        topicId: 'topic-02',
        prompt: 'Your Auto Loader pipeline has cloudFiles.inferColumnTypes enabled and a schemaLocation configured. After three months, source Parquet files begin including a new field temperature_c that was absent from the original schema. What does Auto Loader do on the next microbatch?',
        type: 'single',
        options: [
            { id: 'a', label: 'The pipeline fails immediately with a schema mismatch error and must be manually restarted with a schema reset flag' },
            { id: 'b', label: 'Detects the evolved schema, updates the checkpoint at schemaLocation, triggers a controlled stream restart to apply the new schema; prior rows receive NULL for the new column' },
            { id: 'c', label: 'Silently drops temperature_c to preserve backward schema compatibility with the existing Delta table' },
            { id: 'd', label: 'Promotes all existing columns to STRING to accommodate the new field without modifying the schema checkpoint' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Auto Loader detects schema evolution and updates the schema checkpoint. It raises a SchemaEvolutionException to trigger a controlled stream restart so the new schema is applied cleanly. After restart, existing rows get NULL for the new column and new rows include temperature_c.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/cloud-object-storage/auto-loader/schema']
    },
    {
        id: 'q-t2-3',
        topicId: 'topic-02',
        prompt: 'Which tools can orchestrate data movement into Databricks workloads?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Azure Data Factory' },
            { id: 'b', label: 'Databricks Jobs' },
            { id: 'c', label: 'A local text editor only' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Both ADF and Databricks-native orchestration can be used to move and process data.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/data-factory/introduction',
            'https://learn.microsoft.com/en-us/azure/databricks/jobs/'
        ]
    },
    {
        id: 'q-t2-4',
        topicId: 'topic-02',
        prompt: 'Your pipeline receives daily sales CSV files via COPY INTO. The source occasionally re-delivers the prior day\'s file with corrections using the same filename. What is the key limitation of COPY INTO when corrections arrive as re-delivered files with the same path?',
        type: 'single',
        options: [
            { id: 'a', label: 'COPY INTO re-reads all previously loaded files on every run, creating duplicates each time a file is re-delivered' },
            { id: 'b', label: 'COPY INTO tracks loaded files by path in the Delta transaction log; a re-delivered file with the same path is treated as already loaded and skipped, so corrections are silently ignored' },
            { id: 'c', label: 'COPY INTO cannot process CSV files from ADLS — Parquet or Delta format is required for cloud storage sources' },
            { id: 'd', label: 'COPY INTO requires a primary key column to detect corrections; without it the command is rejected at parse time' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'COPY INTO maintains idempotency by tracking loaded file paths in the Delta transaction log. A corrected file reusing the same path is considered already loaded and skipped. For correction workflows, MERGE INTO is the appropriate approach as it can upsert based on a key.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/copy-into']
    },
    {
        id: 'q-t2-5',
        topicId: 'topic-02',
        prompt: 'Your Spark Structured Streaming job aggregates click events into 5-minute tumbling windows. You add .withWatermark("event_time", "10 minutes") to handle late data. What does the 10-minute watermark specifically control?',
        type: 'single',
        options: [
            { id: 'a', label: 'The maximum delay between microbatches — if no new data arrives within 10 minutes the stream stops automatically' },
            { id: 'b', label: 'How long Spark retains intermediate aggregation state for open windows; events arriving more than 10 minutes past their window\'s close time are dropped' },
            { id: 'c', label: 'The checkpoint flush interval — state files older than 10 minutes are garbage-collected from the checkpoint directory' },
            { id: 'd', label: 'The trigger interval — the stream processes one microbatch every 10 minutes regardless of file arrival cadence' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'A watermark tells Spark the maximum lateness it should tolerate. State for a 5-minute window is kept until the event-time clock advances past (window-end + 10 min). Events arriving after that threshold are dropped. The watermark also lets Spark safely clean up old state to bound memory usage.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/structured-streaming/watermarks']
    },
    {
        id: 'q-t2-6',
        topicId: 'topic-02',
        prompt: 'Scenario: Business users need near real-time dashboards. Which ingestion pattern should be emphasized?',
        type: 'single',
        options: [
            { id: 'a', label: 'Monthly manual CSV uploads only' },
            { id: 'b', label: 'No ingestion scheduling' },
            { id: 'c', label: 'Streaming ingestion with reliable state handling' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Near real-time reporting usually requires streaming-oriented ingestion and resilient processing.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/structured-streaming/concepts']
    },
    {
        id: 'q-t2-7',
        topicId: 'topic-02',
        prompt: 'Scenario: You are selecting orchestration for a multi-source ingest flow. Which options are valid?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Azure Data Factory pipelines' },
            { id: 'b', label: 'Databricks Jobs scheduling' },
            { id: 'c', label: 'Untracked manual reruns only' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Both ADF and Databricks Jobs can orchestrate enterprise ingestion workflows.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/data-factory/introduction',
            'https://learn.microsoft.com/en-us/azure/databricks/jobs/'
        ]
    },
    {
        id: 'q-t2-8',
        topicId: 'topic-02',
        prompt: 'Scenario: A source adds optional fields unexpectedly. What should your ingestion design account for?',
        type: 'single',
        options: [
            { id: 'a', label: 'Ignore all schema metadata forever' },
            { id: 'b', label: 'Disable data quality checks permanently' },
            { id: 'c', label: 'Reject all writes when source schema changes' },
            { id: 'd', label: 'Controlled schema evolution and validation' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Schema evolution strategy is critical for resilient ingestion when source contracts change.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/cloud-object-storage/auto-loader/']
    },
    {
        id: 'q-t2-9',
        topicId: 'topic-02',
        prompt: 'Which statements are generally true about ingestion architecture?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Batch and streaming can coexist in one platform' },
            { id: 'b', label: 'Orchestration is important for dependency management' },
            { id: 'c', label: 'Ingestion never requires monitoring' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Modern platforms often mix batch and streaming, with orchestration and observability across both.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/data-factory/introduction',
            'https://learn.microsoft.com/en-us/azure/databricks/ingestion/'
        ]
    },
    {
        id: 'q-t2-10',
        topicId: 'topic-02',
        prompt: 'Scenario: Data arrivals are hourly and latency tolerance is 90 minutes. Which approach is most practical?',
        type: 'single',
        options: [
            { id: 'a', label: 'Scheduled batch ingestion' },
            { id: 'b', label: 'Always-on sub-second stream requirement' },
            { id: 'c', label: 'Manual desktop imports' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Latency requirements and arrival cadence should guide whether batch or streaming is appropriate.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/data-factory/introduction',
            'https://learn.microsoft.com/en-us/azure/databricks/ingestion/'
        ]
    },

    // ── Topic 03 Level 1: Data Governance ────────────────────────────────────────
    {
        id: 'q-t3-1',
        topicId: 'topic-03',
        prompt: 'The group analysts has SELECT on table main.sales.revenue. analysts is a child of group data_consumers, which also holds SELECT on the same table. You run REVOKE SELECT ON TABLE main.sales.revenue FROM GROUP analysts. Can members of analysts still query the table?',
        type: 'single',
        options: [
            { id: 'a', label: 'No — REVOKE propagates transitively through parent groups and removes inherited access as well' },
            { id: 'b', label: 'Yes — REVOKE removes only the direct grant from analysts; members who inherit SELECT through data_consumers retain access' },
            { id: 'c', label: 'No — Unity Catalog applies the most restrictive grant when a direct revoke conflicts with an inherited grant' },
            { id: 'd', label: 'Yes — but only until the next metastore sync, after which the inherited access is also revoked' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Revoking a privilege from a group removes only that direct grant. Users who belong to multiple groups retain access if another group still holds the privilege. Unity Catalog privilege evaluation is additive — the most permissive applicable grant wins.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/manage-privileges/']
    },
    {
        id: 'q-t3-2',
        topicId: 'topic-03',
        prompt: 'A service principal has SELECT on table prod.finance.invoices but no other Unity Catalog grants. It runs SELECT * FROM prod.finance.invoices and receives SCHEMA_NOT_FOUND. What privilege is missing?',
        type: 'single',
        options: [
            { id: 'a', label: 'Service principals cannot use SQL SELECT — they must call the Databricks REST API to read tables' },
            { id: 'b', label: 'SELECT on a managed table requires a separate EXTERNAL LOCATION grant for the underlying cloud storage path' },
            { id: 'c', label: 'USE CATALOG on prod and USE SCHEMA on prod.finance — without these the three-level namespace cannot be traversed' },
            { id: 'd', label: 'The SELECT grant must be approved by a workspace admin within 24 hours before it takes effect' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Unity Catalog namespace traversal requires USE CATALOG at the catalog level and USE SCHEMA at the schema level. Even with SELECT on the table, without these traversal privileges the SQL engine cannot resolve the fully qualified name.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/manage-privileges/']
    },
    {
        id: 'q-t3-3',
        topicId: 'topic-03',
        prompt: 'Which hierarchy correctly represents Unity Catalog securable organization?',
        type: 'single',
        options: [
            { id: 'a', label: 'catalog -> schema -> table/view' },
            { id: 'b', label: 'table -> catalog -> schema' },
            { id: 'c', label: 'workspace -> dashboard -> file explorer' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Unity Catalog objects are organized under catalogs and schemas before lower-level assets.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/securable-objects'
        ]
    },
    {
        id: 'q-t3-4',
        topicId: 'topic-03',
        prompt: 'You apply a Unity Catalog row filter function to a 500-million-row Delta table. A Spark job reads the table with a predicate on the filtered column. How does Unity Catalog apply the row filter relative to the Spark scan?',
        type: 'single',
        options: [
            { id: 'a', label: 'The row filter function runs on the driver in Python after Spark reads all 500M rows into memory, then filters' },
            { id: 'b', label: 'Unity Catalog materializes a filtered snapshot daily; Spark always reads from that daily snapshot' },
            { id: 'c', label: 'The row filter predicate is pushed down into the Delta scan so only qualifying rows are read from storage, avoiding a full table scan' },
            { id: 'd', label: 'The filter is enforced by the Azure storage layer before data reaches Databricks; the cluster never sees unauthorized rows' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Unity Catalog row filters are translated into predicates that are pushed down into the underlying Delta table scan. Only the rows the caller is permitted to see are returned from storage — no post-scan filtering on the driver.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/row-and-column-filters']
    },
    {
        id: 'q-t3-5',
        topicId: 'topic-03',
        prompt: 'A Unity Catalog Delta table is populated by a DLT pipeline that reads from three upstream tables. A data steward needs to trace which source tables contributed to a specific downstream output. Which Unity Catalog capability provides this?',
        type: 'single',
        options: [
            { id: 'a', label: 'DESCRIBE HISTORY — shows the source table names used in each write operation to the output table' },
            { id: 'b', label: 'Unity Catalog data lineage — automatically captured when jobs run in Databricks, showing upstream and downstream dataset relationships across notebooks, jobs, and pipelines' },
            { id: 'c', label: 'SHOW GRANTS ON TABLE — includes a lineage section listing all upstream sources and their owners' },
            { id: 'd', label: 'DLT expectations event log — records source tracking metadata alongside each quality check result' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Unity Catalog automatically captures table-level and column-level lineage when jobs and pipelines run in Databricks. The lineage graph shows read/write relationships from raw sources through transformations to output tables without additional instrumentation.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/data-lineage']
    },
    {
        id: 'q-t3-6',
        topicId: 'topic-03',
        prompt: 'Scenario: Auditors require clear object ownership and permissions review. Which approach best aligns?',
        type: 'single',
        options: [
            { id: 'a', label: 'Shared credentials and undocumented access' },
            { id: 'b', label: 'No defined data ownership' },
            { id: 'c', label: 'Centralized governance model with explicit grants' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Explicit grants and centralized governance simplify auditability and accountability.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
    },
    {
        id: 'q-t3-7',
        topicId: 'topic-03',
        prompt: 'Scenario: A new analyst needs read-only access to a specific schema. What principle applies?',
        type: 'single',
        options: [
            { id: 'a', label: 'Grant full admin rights for convenience' },
            { id: 'b', label: 'Avoid role-based access controls' },
            { id: 'c', label: 'Grant minimum required permissions for the role' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Least privilege grants only what is required for a defined responsibility.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/access-control/permissions-concepts'
        ]
    },
    {
        id: 'q-t3-8',
        topicId: 'topic-03',
        prompt: 'Which governance-related outcomes are expected from proper Unity Catalog adoption?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Standardized object hierarchy' },
            { id: 'b', label: 'Centralized access management' },
            { id: 'c', label: 'Elimination of all operational monitoring needs' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Unity Catalog standardizes governance structure and centralizes access control.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
    },
    {
        id: 'q-t3-9',
        topicId: 'topic-03',
        prompt: 'Scenario: Identity lifecycle and access policies must be centrally managed. Which platform is foundational?',
        type: 'single',
        options: [
            { id: 'a', label: 'A spreadsheet on a shared drive' },
            { id: 'b', label: 'Local browser settings' },
            { id: 'c', label: 'Workspace-level user groups without central policy' },
            { id: 'd', label: 'Microsoft Entra ID' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Microsoft Entra provides centralized identity and access management capabilities.',
        sourceUrls: ['https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra']
    },
    {
        id: 'q-t3-10',
        topicId: 'topic-03',
        prompt: 'Scenario: A team requests direct table grants without schema governance. What is the governance risk?',
        type: 'single',
        options: [
            { id: 'a', label: 'Guaranteed stronger governance outcomes' },
            { id: 'b', label: 'No impact to compliance posture' },
            { id: 'c', label: 'Reduced number of objects to manage in Unity Catalog' },
            { id: 'd', label: 'Inconsistent access patterns and weaker control boundaries' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Skipping structured governance layers can create fragmented and harder-to-audit access models.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
    },

    // ── Topic 04 Level 1: Pipelines ──────────────────────────────────────────────
    {
        id: 'q-t4-1',
        topicId: 'topic-04',
        prompt: 'You add @dlt.expect("valid_date", "event_date IS NOT NULL") to a DLT silver table. A record arrives with event_date = NULL. What does the pipeline do with this record?',
        type: 'single',
        options: [
            { id: 'a', label: 'Drops the record from the output and increments the dropped_records counter in the DLT event log' },
            { id: 'b', label: 'Stops the entire pipeline run and raises a DataQualityError that must be resolved before the next run' },
            { id: 'c', label: 'Records the violation in the DLT event log and marks it in the pipeline graph, but still writes the invalid record to the silver table' },
            { id: 'd', label: 'Routes the invalid record to an auto-generated quarantine table named _expectations_failures' }
        ],
        correctOptionIds: ['c'],
        explanation:
            '@dlt.expect (warn mode) records the data quality violation in the event log and increments the failed_records counter in the pipeline graph, but does NOT drop the record or halt the pipeline. The invalid row is still written to the output table. Use @dlt.expect_or_drop or @dlt.expect_or_fail to filter or halt.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta-live-tables/expectations']
    },
    {
        id: 'q-t4-2',
        topicId: 'topic-04',
        prompt: 'Task ingest_bronze determines that 15,423 new records were loaded and must pass this count to downstream task transform_silver for metric logging. How should ingest_bronze pass this value?',
        type: 'single',
        options: [
            { id: 'a', label: 'Write the count to a Delta table row that transform_silver reads at startup using spark.read' },
            { id: 'b', label: 'Use dbutils.jobs.taskValues.set(key="record_count", value=15423) in ingest_bronze, then dbutils.jobs.taskValues.get(taskKey="ingest_bronze", key="record_count") in transform_silver' },
            { id: 'c', label: 'Call dbutils.notebook.exit("15423") from ingest_bronze — the Job runtime automatically passes the exit value to the next task\'s input parameters' },
            { id: 'd', label: 'Store the count in a Spark accumulator — accumulators persist across task boundaries in the same Job run' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'dbutils.jobs.taskValues is the native Databricks mechanism for inter-task data sharing within a Job run. Task A sets a typed value with .set(); Task B retrieves it with .get(taskKey=, key=). It is more robust than Delta workarounds and avoids the side effects of accumulators or notebook exit values.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/share-task-context']
    },
    {
        id: 'q-t4-3',
        topicId: 'topic-04',
        prompt: 'Your data team is choosing between triggered and continuous mode for a Lakeflow Declarative Pipeline. New files arrive every 15 minutes and the SLA requires results within 5 minutes of file arrival. Which mode is correct and why?',
        type: 'single',
        options: [
            { id: 'a', label: 'Triggered mode — it processes all available data in a single run and is more cost-efficient for file-based workloads' },
            { id: 'b', label: 'Continuous mode — it maintains a live stream that processes new files as they arrive, enabling sub-15-minute latency; triggered mode only runs on a fixed schedule or manual invocation' },
            { id: 'c', label: 'Triggered mode with a 1-minute cron schedule — this approximates continuous behavior while avoiding persistent streaming cluster overhead' },
            { id: 'd', label: 'Neither — standard Databricks Jobs with Structured Streaming must be used to meet sub-15-minute latency SLAs on file sources' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'DLT continuous mode keeps the pipeline running and processes new data as it arrives, delivering low-latency results. Triggered mode processes a batch of available data and stops — on a 15-minute schedule it could leave up to a 14-minute gap and miss the 5-minute SLA.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta-live-tables/updates']
    },
    {
        id: 'q-t4-4',
        topicId: 'topic-04',
        prompt: 'Which operational practices are recommended for production data pipelines?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Monitor runs and failures' },
            { id: 'b', label: 'Use alerting for critical failures' },
            { id: 'c', label: 'Ignore run history after deployment' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Operational visibility and alerting are key to maintaining reliable production workflows.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/jobs/',
            'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview'
        ]
    },
    {
        id: 'q-t4-5',
        topicId: 'topic-04',
        prompt: 'In a Databricks Job you want task send_alert to run ONLY when task validate_quality fails, and task publish_report to run ONLY when validate_quality succeeds. Which configuration achieves this without custom code?',
        type: 'single',
        options: [
            { id: 'a', label: 'Add a Python if/else block in a parent orchestrator notebook that reads the prior task result and conditionally triggers downstream notebooks' },
            { id: 'b', label: 'Configure send_alert with depends_on validate_quality and run_if = "ALL_FAILED"; configure publish_report with depends_on validate_quality and run_if = "ALL_SUCCESS"' },
            { id: 'c', label: 'Use two separate Job definitions triggered by a parent Job that branches on the child Job\'s exit code' },
            { id: 'd', label: 'Place a conditional "if/else" node between validate_quality and the two downstream tasks using the DLT pipeline editor' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Databricks Jobs supports run_if conditions on task dependencies. Setting run_if = "ALL_FAILED" on send_alert causes it to execute only when the upstream dependency fails. run_if = "ALL_SUCCESS" on publish_report limits it to successful upstream runs. No custom code is required.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/run-if']
    },
    {
        id: 'q-t4-6',
        topicId: 'topic-04',
        prompt: 'Scenario: A nightly pipeline occasionally fails due to temporary network issues. What should be configured?',
        type: 'single',
        options: [
            { id: 'a', label: 'Retry behavior with appropriate limits' },
            { id: 'b', label: 'Manual rerun only, no automation' },
            { id: 'c', label: 'Disable failure notifications' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Retry policies can recover transient failures while preserving operational automation.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/configure-job']
    },
    {
        id: 'q-t4-7',
        topicId: 'topic-04',
        prompt: 'Scenario: A downstream task must run only if upstream validation passes. What should be used?',
        type: 'single',
        options: [
            { id: 'a', label: 'Task dependencies and conditional flow' },
            { id: 'b', label: 'Randomized task order' },
            { id: 'c', label: 'Independent unsynchronized triggers' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Dependency-aware orchestration ensures correct ordering and guardrails for downstream execution.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/run-if']
    },
    {
        id: 'q-t4-8',
        topicId: 'topic-04',
        prompt: 'Which capabilities are important for operating production pipelines?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Monitoring and run history visibility' },
            { id: 'b', label: 'Alerting on critical failures' },
            { id: 'c', label: 'Removing observability data' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Run visibility and alerting support reliability, supportability, and incident response.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/jobs/',
            'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview'
        ]
    },
    {
        id: 'q-t4-9',
        topicId: 'topic-04',
        prompt: 'Scenario: Stakeholders request evidence that recurring jobs are meeting SLAs. What should you rely on?',
        type: 'single',
        options: [
            { id: 'a', label: 'Personal memory of past runs' },
            { id: 'b', label: 'No historical run records' },
            { id: 'c', label: 'Manual job logs maintained in a spreadsheet' },
            { id: 'd', label: 'Operational telemetry and job run metrics' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'SLA validation requires reliable telemetry and measurable run-history data.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/jobs/',
            'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview'
        ]
    },
    {
        id: 'q-t4-10',
        topicId: 'topic-04',
        prompt: 'Scenario: A pipeline has frequent downstream failures due to upstream quality issues. What is the best first improvement?',
        type: 'single',
        options: [
            { id: 'a', label: 'Increase downstream retries indefinitely' },
            { id: 'b', label: 'Hide failure alerts from operators' },
            { id: 'c', label: 'Remove data quality checks from the upstream task' },
            { id: 'd', label: 'Add validation gates before dependent tasks run' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Validation gates prevent bad data from cascading through dependent pipeline stages.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
    },

    // ── Topic 05 Level 1: Monitor & Optimize ─────────────────────────────────────
    {
        id: 'q-t5-1',
        topicId: 'topic-05',
        prompt: 'A Spark job with spark.sql.shuffle.partitions = 200 produces many near-empty shuffle partitions on a 500MB dataset. You enable AQE with spark.sql.adaptive.coalescePartitions.enabled = true. What does AQE change at runtime?',
        type: 'single',
        options: [
            { id: 'a', label: 'Reduces spark.sql.shuffle.partitions permanently by rewriting the session config before execution begins' },
            { id: 'b', label: 'Merges adjacent small shuffle partitions dynamically at runtime without requiring manual tuning or a job restart' },
            { id: 'c', label: 'Splits larger partitions into exactly 200 equal-sized pieces to maximize available executor parallelism' },
            { id: 'd', label: 'Disables the shuffle stage entirely for datasets below 1GB and switches to a broadcast join strategy' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'AQE coalescePartitions examines actual partition sizes after the shuffle and merges adjacent small partitions into fewer, larger ones at runtime. This reduces task overhead for small or skewed datasets without requiring per-job manual tuning of shuffle.partitions.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/aqe']
    },
    {
        id: 'q-t5-2',
        topicId: 'topic-05',
        prompt: 'Which signals are commonly used to monitor data workloads?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Metrics' },
            { id: 'b', label: 'Logs' },
            { id: 'c', label: 'Random desktop wallpaper changes' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Metrics and logs are core telemetry inputs for monitoring and troubleshooting.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview']
    },
    {
        id: 'q-t5-3',
        topicId: 'topic-05',
        prompt: 'Your Delta table receives 200K new rows per hour via streaming appends. Each morning, the daily OPTIMIZE + ZORDER BY (customer_id, event_date) job takes 90 minutes because it re-clusters the entire table. What should you evaluate as an alternative?',
        type: 'single',
        options: [
            { id: 'a', label: 'Increase spark.sql.shuffle.partitions to create fewer output files per OPTIMIZE run' },
            { id: 'b', label: 'Switch to OPTIMIZE with a larger targetFileSize to reduce file count without changing clustering strategy' },
            { id: 'c', label: 'Enable liquid clustering on customer_id and event_date — it reorganizes data incrementally on write, eliminating the need for a scheduled OPTIMIZE + ZORDER job' },
            { id: 'd', label: 'Set delta.autoOptimize.optimizeWrite = true to compact files at write time, which makes ZORDER unnecessary' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Liquid clustering replaces ZORDER by clustering data incrementally during writes rather than requiring periodic full-table OPTIMIZE runs. For tables with frequent appends, this drastically reduces or eliminates the daily maintenance window.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta/clustering']
    },
    {
        id: 'q-t5-4',
        topicId: 'topic-05',
        prompt: 'You run VACUUM main.analytics.events without specifying a RETAIN period. A data analyst then queries main.analytics.events VERSION AS OF 8 days ago using Delta time travel. What happens?',
        type: 'single',
        options: [
            { id: 'a', label: 'The time-travel query succeeds — VACUUM preserves the last 30 Delta versions regardless of their age' },
            { id: 'b', label: 'The time-travel query fails — the default retention is 7 days (168 hours) and VACUUM removed the data files needed to restore the 8-day-old version' },
            { id: 'c', label: 'VACUUM without RETAIN runs in dry-run mode only and makes no file changes, so time travel is unaffected' },
            { id: 'd', label: 'The query returns the most recent version as a fallback when the requested historical version no longer exists' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Delta Lake\'s default VACUUM retention is 7 days (168 hours). Running VACUUM without RETAIN uses this default and removes orphaned files older than 7 days. Time-travel queries referencing data files outside the retention window fail because those files no longer exist on storage.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta/vacuum']
    },
    {
        id: 'q-t5-5',
        topicId: 'topic-05',
        prompt: 'AQE is enabled but Spark chooses SortMergeJoin instead of automatically broadcasting a 15MB lookup table during a join. What is the most likely explanation?',
        type: 'single',
        options: [
            { id: 'a', label: 'Broadcast joins require Delta format; the 15MB table is stored as Parquet and cannot be broadcast automatically' },
            { id: 'b', label: 'spark.sql.autoBroadcastJoinThreshold defaults to 10MB; the 15MB table exceeds the threshold so AQE does not automatically broadcast it' },
            { id: 'c', label: 'AQE never broadcasts tables larger than 1MB — SortMergeJoin is always used above that size threshold' },
            { id: 'd', label: 'The lookup table has a primary key which forces Spark to use SortMergeJoin to guarantee correct join semantics' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'spark.sql.autoBroadcastJoinThreshold (default 10MB) controls the size threshold for automatic broadcast. A 15MB table exceeds this default so Spark falls back to SortMergeJoin. Increase the threshold or add an explicit broadcast() hint to force the optimization.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/']
    },
    {
        id: 'q-t5-6',
        topicId: 'topic-05',
        prompt: 'Scenario: Query runtimes increased after a data growth event. What is the best initial action?',
        type: 'single',
        options: [
            { id: 'a', label: 'Disable all monitoring' },
            { id: 'b', label: 'Assume the issue resolves itself without analysis' },
            { id: 'c', label: 'Review telemetry and optimize based on measured bottlenecks' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Evidence-based tuning starts with telemetry to identify true bottlenecks before changes.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/optimizations/',
            'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview'
        ]
    },
    {
        id: 'q-t5-7',
        topicId: 'topic-05',
        prompt: 'Scenario: Operations wants proactive detection of failing ingestion jobs. What should be added?',
        type: 'single',
        options: [
            { id: 'a', label: 'Manual daily visual checks only' },
            { id: 'b', label: 'Silencing failure notifications' },
            { id: 'c', label: 'Alert rules tied to critical metrics and logs' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Proactive alerting is essential for reducing detection and response time.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview']
    },
    {
        id: 'q-t5-8',
        topicId: 'topic-05',
        prompt: 'Which combinations support sustainable optimization practices?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Continuous performance review using metrics' },
            { id: 'b', label: 'Adjusting compute and query strategies from observed behavior' },
            { id: 'c', label: 'Ignoring trend changes after deployment' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Sustainable optimization requires feedback loops between telemetry and tuning decisions.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/optimizations/',
            'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview'
        ]
    },
    {
        id: 'q-t5-9',
        topicId: 'topic-05',
        prompt: 'Scenario: You need to reduce mean time to detect workload incidents. What should be prioritized?',
        type: 'single',
        options: [
            { id: 'a', label: 'Disabling historical logs' },
            { id: 'b', label: 'Removing all threshold rules' },
            { id: 'c', label: 'Sending all metrics to a single email alias without automation' },
            { id: 'd', label: 'Actionable dashboards and well-scoped alerts' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Focused telemetry views and alerting criteria improve incident detection speed and quality.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview']
    },
    {
        id: 'q-t5-10',
        topicId: 'topic-05',
        prompt: 'Scenario: Leadership asks whether optimization efforts are working over time. What evidence should you present?',
        type: 'single',
        options: [
            { id: 'a', label: 'Trend metrics for performance, reliability, and alert outcomes' },
            { id: 'b', label: 'Anecdotal comments without telemetry' },
            { id: 'c', label: 'No monitoring artifacts' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Optimization impact is best demonstrated through trend-based telemetry and operational indicators.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/optimizations/',
            'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview'
        ]
    },

    // ── Topic 01 Level 2: Labs 1 & 2 — CityMoves Transit + patient records ───────
    {
        id: 'q-t1-cs1',
        topicId: 'topic-01',
        prompt: 'You are a data engineer at CityMoves Transit. You provision a cluster for the workspace exploration lab. The cluster is idle for 40 minutes with no active Spark jobs or notebook connections. What happens?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'cluster_config = {\n    "cluster_name": "citymoves-analytics",\n    "spark_version": "14.3.x-scala2.12",\n    "node_type_id": "Standard_DS3_v2",\n    "autoscale": {"min_workers": 1, "max_workers": 8},\n    "autotermination_minutes": 30\n}'
        },
        options: [
            { id: 'a', label: 'Cluster terminates automatically because it has been idle longer than autotermination_minutes (30)' },
            { id: 'b', label: 'Cluster scales down to 0 workers but keeps running to preserve the Spark session context' },
            { id: 'c', label: 'Cluster switches to SQL Warehouse mode after the autotermination window expires' },
            { id: 'd', label: 'Cluster sends an idle alert to the workspace admin but continues running indefinitely' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'autotermination_minutes = 30 means the cluster shuts down automatically after 30 minutes of inactivity. At 40 minutes idle the cluster will have already terminated, freeing compute and stopping DBU accrual.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/clusters/configure']
    },
    {
        id: 'q-t1-cs2',
        topicId: 'topic-01',
        prompt: 'You are a data engineer building a patient records pipeline. A junior developer adds a print() call after retrieving the PostgreSQL password from a secret scope to debug a connection failure. What appears in the notebook output?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'db_password = dbutils.secrets.get(\n    scope="patient-records-scope",\n    key="postgres-password"\n)\nprint(db_password)'
        },
        options: [
            { id: 'a', label: 'The full plaintext password — Databricks decrypts secrets for the calling notebook and print() outputs the result' },
            { id: 'b', label: '[REDACTED] — Databricks masks secret values in all notebook outputs and driver logs' },
            { id: 'c', label: 'A Python PermissionError because print() is blocked for secret-backed variables in secure workspaces' },
            { id: 'd', label: 'An empty string because the key has not yet been populated in the scope' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Databricks Secret Scopes redact resolved values wherever they appear in Databricks-managed output, replacing them with [REDACTED]. This prevents accidental credential exposure in cell output, driver logs, and notebook revision history regardless of how the secret is used in code.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/security/secrets/']
    },
    {
        id: 'q-t1-cs3',
        topicId: 'topic-01',
        prompt: 'You are a data engineer at CityMoves Transit. Your team registered public transit data in Unity Catalog. What three-level namespace does this query use?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'SELECT route_id, stop_name, daily_ridership\nFROM citymoves_prod.transit_ops.daily_ridership\nWHERE trip_date = \'2024-03-15\'\nORDER BY daily_ridership DESC;'
        },
        options: [
            { id: 'a', label: 'workspace.database.table — the legacy Hive metastore format used before Unity Catalog' },
            { id: 'b', label: 'metastore.catalog.object — used for cross-workspace federation queries only' },
            { id: 'c', label: 'catalog.schema.table — the Unity Catalog three-level namespace: citymoves_prod → transit_ops → daily_ridership' },
            { id: 'd', label: 'environment.domain.object — used exclusively for external tables backed by cloud storage' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Unity Catalog organizes all data assets in a three-level hierarchy: catalog.schema.object. Here citymoves_prod is the catalog, transit_ops is the schema, and daily_ridership is the table.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/']
    },
    {
        id: 'q-t1-cs4',
        topicId: 'topic-01',
        prompt: 'You are building a parameterized deployment notebook for a patient records platform. A Databricks Job task runs this notebook with target_env = \'prod\'. What does dbutils.notebook.exit() do in this context?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'env = dbutils.widgets.get("target_env")\ncatalog = f"{env}_catalog"\nschema = f"{env}_patient_data"\nspark.sql(f"USE CATALOG {catalog}")\nspark.sql(f"USE SCHEMA {schema}")\ndbutils.notebook.exit(f"Targeting: {catalog}.{schema}")'
        },
        options: [
            { id: 'a', label: 'Terminates the Databricks cluster that the notebook is running on' },
            { id: 'b', label: 'Commits all pending Spark transactions and closes open Delta table writers' },
            { id: 'c', label: 'Deletes the target_env widget from the current session to prevent reuse in subsequent runs' },
            { id: 'd', label: 'Returns the string \'Targeting: prod_catalog.prod_patient_data\' to the calling Job task so downstream tasks can read it via dbutils.jobs.taskValues' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'dbutils.notebook.exit() exits the notebook and returns a string value to the calling context — either a parent notebook that used dbutils.notebook.run() or a Databricks Job task. The calling Job task can then access this exit value through task values for downstream orchestration decisions.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/share-task-context']
    },
    {
        id: 'q-t1-cs5',
        topicId: 'topic-01',
        prompt: 'You are a data engineer at CityMoves Transit. Your finance team requires cost attribution on all compute resources. You add these tags to the lab cluster configuration. Where do these tags appear after the cluster runs workloads?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'custom_tags = {\n    "project": "citymoves-dp750-lab",\n    "environment": "lab",\n    "cost-center": "TRANSIT-OPS-001"\n}'
        },
        options: [
            { id: 'a', label: 'In Azure cost management and billing reports, enabling spend attribution by project and cost center' },
            { id: 'b', label: 'As metadata columns automatically appended to every Delta table written by the cluster' },
            { id: 'c', label: 'In Unity Catalog data lineage graphs to track which cluster produced each output table' },
            { id: 'd', label: 'In Databricks audit logs as access-control events attached to each cluster start and stop' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Cluster tags propagate to Azure resource billing data. Teams use them to attribute cloud spend by environment, team, or cost center in Azure Cost Management. They do not affect permissions, table metadata, or lineage tracking.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/clusters/configure']
    },

    // ── Topic 02 Level 2: Labs 7 & 8 — Solaris Energy + real estate listings ─────
    {
        id: 'q-t2-cs1',
        topicId: 'topic-02',
        prompt: 'You are a data engineer at Solaris Energy building an Auto Loader pipeline to ingest turbine sensor CSV files. The pipeline runs successfully, but after adding 500 new files you observe that some files are processed twice. What is the most likely cause?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'df_turbine = (spark.readStream\n    .format("cloudFiles")\n    .option("cloudFiles.format", "csv")\n    .option("cloudFiles.schemaLocation",\n            "/checkpoints/solaris/schema")\n    .load("abfss://raw@solarisstorage.dfs.core.windows.net/turbines/"))\n\n(df_turbine.writeStream\n    .format("delta")\n    .option("checkpointLocation",\n            "/checkpoints/solaris/bronze")\n    .trigger(availableNow=True)\n    .start("abfss://bronze@solarisstorage.dfs.core.windows.net/turbines"))'
        },
        options: [
            { id: 'a', label: 'trigger(availableNow=True) forces Auto Loader to replay all source files from the beginning on each run' },
            { id: 'b', label: 'The checkpointLocation was deleted or changed between runs, causing Auto Loader to lose track of which files were already processed' },
            { id: 'c', label: 'cloudFiles.format = \'csv\' does not support incremental file tracking; only JSON and Parquet formats maintain file state' },
            { id: 'd', label: 'Delta Lake does not support idempotent appends — duplicate files must be deduplicated manually with MERGE INTO downstream' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Auto Loader tracks processed files using the checkpointLocation. If this path is deleted, moved, or changed between runs, Auto Loader loses its state and re-processes files it already loaded. trigger(availableNow=True) is safe and does not cause replays when the checkpoint is intact.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/cloud-object-storage/auto-loader/']
    },
    {
        id: 'q-t2-cs2',
        topicId: 'topic-02',
        prompt: 'You are a data engineer ingesting daily real estate listing CSV files into a bronze Delta table. A scheduled job runs this statement twice in the same day due to a retry. What happens to the data in bronze.real_estate_listings on the second run?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'COPY INTO bronze.real_estate_listings\nFROM \'abfss://raw@realestatestorage.dfs.core.windows.net/listings/2024/\'\nFILEFORMAT = CSV\nFORMAT_OPTIONS (\n    \'header\' = \'true\',\n    \'inferSchema\' = \'true\'\n);'
        },
        options: [
            { id: 'a', label: 'The second run truncates the target table and reloads all files from scratch' },
            { id: 'b', label: 'The second run raises a FilesAlreadyLoadedException and the job fails immediately' },
            { id: 'c', label: 'Only files not yet successfully loaded are ingested; already-processed files are skipped, making COPY INTO idempotent' },
            { id: 'd', label: 'Duplicate rows are inserted because COPY INTO does not track previously loaded files' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'COPY INTO tracks which files have been successfully loaded in the Delta transaction log. Running it again is safe — new files are ingested and already-loaded files are skipped. This idempotency makes it reliable for scheduled batch jobs with retry logic.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/copy-into']
    },
    {
        id: 'q-t2-cs3',
        topicId: 'topic-02',
        prompt: 'You are a data engineer at Solaris Energy. Your Auto Loader stream writes parsed turbine sensor readings to a silver Delta table. The cluster restarts mid-batch. After recovery, you observe no duplicate rows and no data loss. What makes exactly-once delivery possible?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: '(df_parsed\n    .writeStream\n    .format("delta")\n    .outputMode("append")\n    .option("checkpointLocation",\n            "/checkpoints/solaris/silver-turbines")\n    .trigger(availableNow=True)\n    .start("abfss://silver@solarisstorage.dfs.core.windows.net/turbines"))'
        },
        options: [
            { id: 'a', label: 'trigger(availableNow=True) replays only the last incomplete batch and discards any partial writes on cluster recovery' },
            { id: 'b', label: 'Delta Lake automatically locks the output path during recovery to prevent concurrent writes that could cause duplication' },
            { id: 'c', label: 'outputMode("append") deduplicates rows by matching them against existing Delta records on each restart' },
            { id: 'd', label: 'checkpointLocation stores committed source offsets and processed file state so the stream resumes exactly where it left off without reprocessing or losing data' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'The checkpointLocation persists stream progress — which source offsets and files were committed. On restart, Spark reads this state and continues from the last successful commit, delivering exactly-once semantics when combined with Delta Lake\'s transactional writes.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/structured-streaming/delta-lake']
    },
    {
        id: 'q-t2-cs4',
        topicId: 'topic-02',
        prompt: 'You are a data engineer at a real estate analytics company joining df_listings (8M rows), df_agents (200K rows), and df_zip_codes (800 rows). You apply a broadcast hint only to df_zip_codes. Join time drops from 5 minutes to 22 seconds. Why does broadcasting only df_zip_codes give the best result?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'from pyspark.sql.functions import broadcast\n\ndf_result = (df_listings\n    .join(df_agents, on="agent_id", how="left")\n    .join(broadcast(df_zip_codes), on="zip_code", how="left"))'
        },
        options: [
            { id: 'a', label: 'df_zip_codes fits in executor memory and is replicated to all workers, eliminating the shuffle of df_listings; broadcasting df_agents at 200K rows would risk executor OOM and negate the benefit' },
            { id: 'b', label: 'Spark allows only one broadcast hint per query; df_zip_codes is selected because it has the fewest columns' },
            { id: 'c', label: 'Broadcasting requires Delta Lake format; df_agents is stored as Parquet and cannot be broadcast automatically' },
            { id: 'd', label: 'df_agents has a surrogate primary key enabling an optimized sort-merge strategy that is faster than broadcasting for medium-sized tables' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'A broadcast join copies the small table to every executor so the large table never shuffles across the network. An 800-row lookup is safe and eliminates an expensive Exchange stage. Attempting to broadcast a 200K-row table risks out-of-memory errors on executors and can be slower than a sort-merge join.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/']
    },
    {
        id: 'q-t2-cs5',
        topicId: 'topic-02',
        prompt: 'You are a data engineer at a real estate analytics firm producing a quarterly average listing-price report. After running this transformation, what is the shape of df_quarterly compared with the original df_listings?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'df_quarterly = (df_listings\n    .groupBy("city")\n    .pivot("quarter", ["Q1", "Q2", "Q3", "Q4"])\n    .agg({"list_price": "avg"}))\n\ndf_quarterly.show()'
        },
        options: [
            { id: 'a', label: 'Same row count as df_listings — pivot is a display transformation that does not change DataFrame structure' },
            { id: 'b', label: 'One row per (city, quarter) pair — same granularity as the original, sorted by quarter' },
            { id: 'c', label: 'One row per unique city with four new columns Q1, Q2, Q3, Q4 each containing the average list price for that quarter' },
            { id: 'd', label: 'The DataFrame is transposed so city names become column headers and quarters become the row index' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Pivot rotates the distinct values of the pivot column (quarter) into separate output columns. The result has one row per city and four revenue columns (Q1–Q4) each containing the aggregated value, reducing row count compared to the original while widening the schema.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/getting-started/dataframes-python']
    },

    // ── Topic 03 Level 2: Labs 4 & 5 — NorthMart Retail + connected vehicle ───────
    {
        id: 'q-t3-cs1',
        topicId: 'topic-03',
        prompt: 'You are a data engineer at NorthMart Retail implementing row-level security on customer transaction data. A regional manager for the WEST region who is NOT in data-admin queries the table. What rows are returned?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'CREATE OR REPLACE FUNCTION northmart_region_filter(region_code STRING)\nRETURNS BOOLEAN\nRETURN is_account_group_member(\'data-admin\')\n    OR region_code = session_context(\'user_region\');\n\nALTER TABLE northmart_prod.customer_data.transactions\nSET ROW FILTER northmart_region_filter ON (region_code);'
        },
        options: [
            { id: 'a', label: 'Only rows where region_code = \'WEST\', matching the manager\'s user_region session context' },
            { id: 'b', label: 'All rows regardless of region_code — non-admin users bypass row filters that reference session_context()' },
            { id: 'c', label: 'No rows — non-admin users are blocked from querying any table that has a row filter applied' },
            { id: 'd', label: 'All rows except those in \'WEST\' — the filter excludes the current user\'s own region for privacy' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Unity Catalog row filters are evaluated at query time per caller. Non-admin users see only rows where the filter function returns TRUE — here, rows where region_code matches their session_context user_region. The WEST manager sees only WEST transactions.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/row-and-column-filters']
    },
    {
        id: 'q-t3-cs2',
        topicId: 'topic-03',
        prompt: 'You are a data engineer at NorthMart Retail. A business analyst who is NOT in the pii-analysts group queries the loyalty_id column for a member with loyalty_id = \'LID-2024-9876\'. What value do they receive?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'CREATE OR REPLACE FUNCTION mask_loyalty_id(lid STRING)\nRETURNS STRING\nRETURN CASE\n    WHEN is_account_group_member(\'pii-analysts\') THEN lid\n    ELSE CONCAT(\'LID-****-\', RIGHT(lid, 4))\nEND;\n\nALTER TABLE northmart_prod.customer_data.members\nALTER COLUMN loyalty_id SET MASK mask_loyalty_id;'
        },
        options: [
            { id: 'a', label: '\'LID-2024-9876\' — column masks only apply at the storage layer and do not affect query results for authenticated users' },
            { id: 'b', label: 'NULL — column mask functions always return NULL for callers outside the privileged group' },
            { id: 'c', label: 'A PermissionError — the column is inaccessible to non-members of pii-analysts' },
            { id: 'd', label: '\'LID-****-9876\' — the ELSE branch executes because the analyst is not in pii-analysts' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Unity Catalog column masks are evaluated per caller at query time. The CASE expression returns the ELSE branch (\'LID-****-\' + last 4 digits) when the caller is not in pii-analysts. Only pii-analysts members receive the unmasked \'LID-2024-9876\' value.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/row-and-column-filters']
    },
    {
        id: 'q-t3-cs3',
        topicId: 'topic-03',
        prompt: 'You are a data engineer at NorthMart Retail. A code reviewer flags this JDBC URL construction as risky despite using a secret scope. What is the specific risk?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'db_password = dbutils.secrets.get(\n    scope="northmart-db-scope",\n    key="customer-db-password"\n)\njdbc_url = (\n    f"jdbc:postgresql://northmart-db.postgres.database.azure.com:5432"\n    f"/customers?password={db_password}"\n)'
        },
        options: [
            { id: 'a', label: 'dbutils.secrets.get is not supported inside JDBC connection strings — only Azure Key Vault URI references work in jdbc_url' },
            { id: 'b', label: 'Embedding the secret in the jdbc_url string causes the full password to appear in Spark logs, job run artifacts, and notebook history when the URL is printed or logged' },
            { id: 'c', label: 'The scope name must match the database hostname exactly for the credential lookup to succeed at runtime' },
            { id: 'd', label: 'Secrets retrieved from a scope expire after 30 minutes and cannot be embedded in a connection URL used across multiple Spark tasks' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'While dbutils.secrets.get() itself returns [REDACTED] in cell output, once the secret is interpolated into a plain string like jdbc_url, Databricks can no longer track it as a secret. Printing or logging jdbc_url will expose the password in plaintext. Pass the secret directly to the JDBC options dict rather than building a URL string.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/security/secrets/']
    },
    {
        id: 'q-t3-cs4',
        topicId: 'topic-03',
        prompt: 'You are a data engineer on a connected vehicle platform. The compliance team requires the ability to audit trip event data from the past 5 days. After running this command, a data analyst immediately queries connected_vehicles.audit.trip_events VERSION AS OF 3 days ago. What happens?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'VACUUM connected_vehicles.audit.trip_events RETAIN 168 HOURS;'
        },
        options: [
            { id: 'a', label: 'The time-travel query fails — VACUUM removes all historical file versions and preserves only the current table state' },
            { id: 'b', label: 'The time-travel query fails — RETAIN must be at least 720 HOURS for time travel to function in production tables' },
            { id: 'c', label: 'The time-travel query succeeds — RETAIN 168 HOURS (7 days) preserves all Delta files referenced by commits within that window, and 3 days is within range' },
            { id: 'd', label: 'The time-travel query returns the current table state as a fallback because VACUUM merged historical versions into the latest snapshot' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'VACUUM removes only orphaned data files — files no longer referenced in the Delta transaction log — that are older than the retention threshold (168 h = 7 days). All commits and their referenced files within the 7-day window are preserved, so time travel at 3 days ago succeeds.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta/vacuum']
    },
    {
        id: 'q-t3-cs5',
        topicId: 'topic-03',
        prompt: 'You are a data engineer at NorthMart Retail. The audit team requests a review of who can access the customer transactions table before a compliance review. You run this statement. What does it return?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'SHOW GRANTS ON TABLE northmart_prod.customer_data.transactions;'
        },
        options: [
            { id: 'a', label: 'All principals (users, groups, service principals) and the specific privileges each holds on the table' },
            { id: 'b', label: 'The row filter functions and column masks currently applied to the table and their owning principals' },
            { id: 'c', label: 'The table\'s owner, creation timestamp, last modified date, and cloud storage location path' },
            { id: 'd', label: 'The Delta transaction log showing who performed the most recent INSERT, UPDATE, or DELETE operations' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'SHOW GRANTS ON TABLE returns a result set listing every principal and the privilege they hold on the specified table — SELECT, MODIFY, ALL PRIVILEGES, etc. This is the starting point for access audits in Unity Catalog and shows the complete effective grant list for the object.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/manage-privileges/']
    },

    // ── Topic 04 Level 2: Labs 9, 10 & 11 — ClearCover, GlobStay, TelConnect ─────
    {
        id: 'q-t4-cs1',
        topicId: 'topic-04',
        prompt: 'You are a data engineer at ClearCover Insurance building a Lakeflow Declarative Pipeline for claims processing. A claim record arrives with claim_id = NULL. What does the pipeline do with this record?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'import dlt\n\n@dlt.table(comment="Raw claims — bronze layer")\ndef bronze_claims():\n    return (spark.readStream\n        .format("cloudFiles")\n        .option("cloudFiles.format", "json")\n        .option("cloudFiles.schemaLocation",\n                "/pipelines/clearcover/schema")\n        .load("abfss://raw@clearcoverstorage.dfs.core.windows.net/claims/"))\n\n@dlt.table(comment="Valid claims — silver layer")\n@dlt.expect_or_drop(\n    "valid_claim_id",\n    "claim_id IS NOT NULL AND claim_id LIKE \'CLM-%\'"\n)\ndef silver_claims():\n    return dlt.read_stream("bronze_claims")'
        },
        options: [
            { id: 'a', label: 'Stops the entire pipeline run and raises a DataQualityError that must be resolved before the next run' },
            { id: 'b', label: 'Routes the invalid record to an auto-generated quarantine table named _bad_records_silver_claims' },
            { id: 'c', label: 'Records the violation in the DLT event log and still writes the NULL record to silver_claims' },
            { id: 'd', label: 'Drops the record from silver_claims and increments the dropped_records counter in the DLT event log; the pipeline continues processing remaining records' }
        ],
        correctOptionIds: ['d'],
        explanation:
            '@dlt.expect_or_drop removes rows that fail the quality rule without halting the pipeline. The null-claim_id record is excluded from silver_claims and counted as a dropped record in the DLT event log, while all valid records continue flowing through the pipeline.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta-live-tables/expectations']
    },
    {
        id: 'q-t4-cs2',
        topicId: 'topic-04',
        prompt: 'You are a data engineer at ClearCover Insurance. A NULL policy_number would corrupt monthly reporting aggregates so the team uses expect_or_fail on the gold layer. How does expect_or_fail differ from expect_or_drop when a quality violation occurs?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: '@dlt.table(comment="Gold claims summary for monthly reporting")\n@dlt.expect_or_fail(\n    "non_null_policy_number",\n    "policy_number IS NOT NULL"\n)\ndef gold_claims_summary():\n    return (\n        dlt.read("silver_claims")\n        .groupBy("policy_number", "claim_month")\n        .count()\n    )'
        },
        options: [
            { id: 'a', label: 'expect_or_fail stops the entire pipeline run on the first violation; expect_or_drop removes only the violating rows and continues processing remaining records' },
            { id: 'b', label: 'expect_or_fail routes the violating row to a quarantine table; expect_or_drop permanently deletes it from the pipeline graph' },
            { id: 'c', label: 'Both decorators behave identically in DLT — the naming difference is cosmetic only' },
            { id: 'd', label: 'expect_or_fail drops the violating row silently and increments a counter; expect_or_drop halts the pipeline run' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'expect_or_fail is a strict gate: one bad row stops the whole pipeline run, signalling a data contract breach that must be resolved before output is produced. expect_or_drop is lenient: it filters out bad rows and lets the pipeline continue with clean data. Choose based on whether invalid data is tolerable or catastrophic.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta-live-tables/expectations']
    },
    {
        id: 'q-t4-cs3',
        topicId: 'topic-04',
        prompt: 'You are a data engineer at GlobStay building a parameterized medallion pipeline for hotel booking data. A calling Databricks Job task runs this notebook with deployment_env=\'prod\' and medallion_layer=\'silver\'. What does dbutils.notebook.exit() do?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'env   = dbutils.widgets.get("deployment_env")     # \'dev\' or \'prod\'\nlayer = dbutils.widgets.get("medallion_layer")  # \'bronze\', \'silver\', \'gold\'\n\ncatalog = f"globstay_{env}"\ntarget  = f"{catalog}.{layer}_bookings"\n\nspark.sql(f"USE CATALOG {catalog}")\ndbutils.notebook.exit(target)'
        },
        options: [
            { id: 'a', label: 'Shuts down the cluster that the notebook is currently running on after completing execution' },
            { id: 'b', label: 'Returns the string \'globstay_prod.silver_bookings\' to the calling Job task; downstream tasks can read it via dbutils.jobs.taskValues.get()' },
            { id: 'c', label: 'Commits all open Spark transactions and closes all Delta table writers before the notebook session ends' },
            { id: 'd', label: 'Unregisters the deployment_env and medallion_layer widgets to prevent them from persisting into the next pipeline run' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'dbutils.notebook.exit() exits the current notebook and returns a string result to the calling context. When called from a Databricks Job task, the exit value is captured and can be retrieved by downstream tasks using dbutils.jobs.taskValues.get(). The cluster keeps running — only the notebook session ends.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/share-task-context']
    },
    {
        id: 'q-t4-cs4',
        topicId: 'topic-04',
        prompt: 'You are a data engineer at TelConnect. Your CDR ingestion task connects to an upstream telecom API that returns HTTP 429 (rate limited) on every attempt. What happens after max_retries is exhausted?',
        type: 'single',
        codeSnippet: {
            language: 'json',
            code: '{\n  "task_key": "ingest_cdr_records",\n  "max_retries": 3,\n  "min_retry_interval_millis": 60000,\n  "retry_on_timeout": true,\n  "timeout_seconds": 600\n}'
        },
        options: [
            { id: 'a', label: 'The task retries indefinitely with exponential backoff until the API returns HTTP 200' },
            { id: 'b', label: 'The task reads CDR records from the most recent successful run\'s output and continues the pipeline' },
            { id: 'c', label: 'The task is marked as Failed after 4 total attempts (1 initial + 3 retries); all dependent downstream tasks are skipped' },
            { id: 'd', label: 'Databricks pages the on-call engineer and pauses the task until manual operator approval is given for another attempt' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'After max_retries (3) consecutive failures — 4 total attempts including the initial run — Databricks marks the task as Failed. The job run ends in a failed state and any tasks with a depends_on relationship to ingest_cdr_records are skipped. No automatic escalation or indefinite retry occurs.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/configure-job']
    },
    {
        id: 'q-t4-cs5',
        topicId: 'topic-04',
        prompt: 'You are a data engineer at GlobStay. Your hotel booking pipeline runs as a Databricks Job with four dependent tasks. The transform_silver_bookings task fails due to a schema mismatch. What happens to aggregate_gold_revenue and notify_revenue_team?',
        type: 'single',
        codeSnippet: {
            language: 'json',
            code: '{\n  "tasks": [\n    { "task_key": "ingest_bronze_bookings" },\n    {\n      "task_key": "transform_silver_bookings",\n      "depends_on": [{ "task_key": "ingest_bronze_bookings" }]\n    },\n    {\n      "task_key": "aggregate_gold_revenue",\n      "depends_on": [{ "task_key": "transform_silver_bookings" }]\n    },\n    {\n      "task_key": "notify_revenue_team",\n      "depends_on": [{ "task_key": "aggregate_gold_revenue" }]\n    }\n  ]\n}'
        },
        options: [
            { id: 'a', label: 'aggregate_gold_revenue runs using cached silver data from the last successful run; notify_revenue_team is skipped' },
            { id: 'b', label: 'notify_revenue_team runs immediately to alert the team while aggregate_gold_revenue is held in a pending state' },
            { id: 'c', label: 'aggregate_gold_revenue automatically retries transform_silver_bookings before attempting to run' },
            { id: 'd', label: 'Both are skipped and marked as failed — Databricks propagates the failure through the dependency graph to all tasks with transitive depends_on on the failed task' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Databricks Jobs propagates failures through the dependency graph. When transform_silver_bookings fails, any task with a transitive depends_on relationship to it — aggregate_gold_revenue and notify_revenue_team — is marked as Skipped/Failed. No downstream task executes.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
    },

    // ── Topic 05 Level 2: Lab 13 — data skew / shuffle / optimization ─────────────
    {
        id: 'q-t5-cs1',
        topicId: 'topic-05',
        prompt: 'You are optimizing a clickstream analytics pipeline. The Spark UI shows some tasks taking 90 seconds while others finish in 3 seconds — a classic data-skew pattern on \'page_view\' events. With AQE enabled, what does the skewJoin optimization do when it detects one partition is 8× larger than the median?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'spark.conf.set("spark.sql.adaptive.enabled", "true")\nspark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")\nspark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")\n\ndf_agg = (\n    df_click_events     # 200M rows, heavily skewed on event_type=\'page_view\'\n    .groupBy("event_type", "session_id")\n    .agg({"duration_ms": "sum"})\n)'
        },
        options: [
            { id: 'a', label: 'Splits the skewed partition into smaller sub-partitions and replicates matching join keys, distributing the load across more tasks and reducing straggler time' },
            { id: 'b', label: 'Moves the skewed partition to the driver node for single-threaded processing to avoid executor out-of-memory errors' },
            { id: 'c', label: 'Drops the skewed partition and records a DataSkewWarning in the Spark event log' },
            { id: 'd', label: 'Forces all partitions to equal size before the join by pre-sorting and redistributing in a preparatory stage' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'AQE\'s skew join optimization detects oversized partitions at runtime and splits them into smaller pieces, replicating the matching side as needed. This converts one slow 90-second straggler task into many fast sub-tasks, eliminating the bottleneck without manual repartitioning.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/aqe']
    },
    {
        id: 'q-t5-cs2',
        topicId: 'topic-05',
        prompt: 'You are optimizing a clickstream pipeline. Before the broadcast hint, the Spark UI shows a SortMergeJoin with two Exchange (shuffle) stages taking 12 minutes. After adding broadcast(df_campaign_lookup), what change do you observe in the Spark UI physical plan?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'from pyspark.sql.functions import broadcast\n\ndf_result = (\n    df_click_events               # 200M rows\n    .join(\n        broadcast(df_campaign_lookup),  # 150 rows\n        on="campaign_id",\n        how="left"\n    )\n)'
        },
        options: [
            { id: 'a', label: 'The join still shows as SortMergeJoin but with a BroadcastHashJoin listed as an alternative fallback stage' },
            { id: 'b', label: 'The Exchange (shuffle) stage for df_campaign_lookup is replaced by BroadcastHashJoin, eliminating network data movement for that table' },
            { id: 'c', label: 'The stage count doubles because broadcasting adds an extra data-preparation broadcast stage before the join' },
            { id: 'd', label: 'The plan shows CartesianProduct because adding broadcast() removes the join-key constraint from the optimizer' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'A broadcast join sends the small table to every executor in-memory, removing the Exchange (shuffle) stage for that table entirely. In the Spark UI physical plan you see BroadcastHashJoin instead of SortMergeJoin with two Exchange stages, which was the source of the 12-minute bottleneck.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/']
    },
    {
        id: 'q-t5-cs3',
        topicId: 'topic-05',
        prompt: 'You are a data engineer optimizing a large clickstream events table. After running these commands, a data analyst queries analytics.clickstream.events VERSION AS OF 4 days ago using Delta time travel. What happens?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'OPTIMIZE analytics.clickstream.events\nZORDER BY (event_date, event_type);\n\nVACUUM analytics.clickstream.events RETAIN 168 HOURS;'
        },
        options: [
            { id: 'a', label: 'The time-travel query fails — VACUUM always removes all historical Delta versions regardless of the retention period specified' },
            { id: 'b', label: 'The time-travel query fails — RETAIN must be at least 720 HOURS in production environments for time travel to function' },
            { id: 'c', label: 'The time-travel query succeeds — RETAIN 168 HOURS (7 days) preserves all Delta files referenced by commits within that window, and 4 days is within range' },
            { id: 'd', label: 'The query returns no rows because VACUUM physically deleted the event data rows older than the retention threshold' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'VACUUM removes only orphaned data files — those no longer referenced in the Delta transaction log — older than the retention threshold. Live data rows are untouched. RETAIN 168 HOURS = 7 days, so time travel to any commit within the last 7 days (including 4 days ago) still works.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta/vacuum']
    },
    {
        id: 'q-t5-cs4',
        topicId: 'topic-05',
        prompt: 'You are comparing a standard Databricks cluster with a Photon-enabled cluster for several workloads. Which workload type benefits most from the Photon runtime?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'photon_cluster = {\n    "cluster_name": "analytics-photon",\n    "spark_version": "14.3.x-photon-scala2.12",\n    "node_type_id": "Standard_DS4_v2",\n    "num_workers": 8\n}'
        },
        options: [
            { id: 'a', label: 'Python UDFs and custom pandas transformations that run in the Python interpreter on each executor' },
            { id: 'b', label: 'MLflow model training jobs using scikit-learn or PyTorch with GPU-accelerated tensor operations' },
            { id: 'c', label: 'Kafka consumer microservices processing fewer than 200 events per second with sub-100ms latency requirements' },
            { id: 'd', label: 'SQL aggregations, DataFrame transformations, and Delta Lake reads and writes using vectorised native C++ execution' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Photon is a vectorised C++ query engine that accelerates SQL and DataFrame operations on Delta Lake. It does not accelerate Python UDFs (which run in the Python interpreter on the JVM boundary), ML training workloads, or low-throughput streaming microservices.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/runtime/photon']
    },
    {
        id: 'q-t5-cs5',
        topicId: 'topic-05',
        prompt: 'You are optimizing a reporting notebook that reads the same gold Delta table three times. After adding .cache() and immediately calling .count(), subsequent aggregations run much faster. Why is calling .count() immediately after .cache() necessary?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'df_events = spark.read.format("delta").load(\n    "abfss://gold@analyticsstorage.dfs.core.windows.net/clickstream"\n)\n\ndf_events.cache()\ndf_events.count()  # materialise the cache\n\nagg_by_date = df_events.groupBy("event_date").count()\nagg_by_type = df_events.groupBy("event_type").count()\nagg_by_hour = df_events.groupBy("hour_of_day").count()'
        },
        options: [
            { id: 'a', label: '.cache() is lazy — it only marks the DataFrame for caching; .count() is an action that triggers the full scan and loads data into executor memory so later actions skip the Delta source read' },
            { id: 'b', label: '.count() is required by the Spark API to register a DataFrame for caching — without it, .cache() has no effect' },
            { id: 'c', label: '.count() validates that the Delta table has no corrupted rows before allowing the cache to be populated in executor memory' },
            { id: 'd', label: 'Calling .count() after .cache() flushes stale cached data and forces a fresh read from Delta, replacing any existing cache entries' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Spark transformations including .cache() are lazy — they describe a computation plan without executing it. Only an action such as .count() triggers actual execution. The count scan populates the in-memory cache so agg_by_date, agg_by_type, and agg_by_hour reuse cached executor memory instead of re-reading the Delta source three times.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/']
    }
];

const topicDistractors: Record<string, string[]> = {
    'topic-01': [
        'Share one all-purpose cluster with all developers',
        'Disable access control reviews',
        'Store all assets in one unrestricted schema',
        'Grant broad owner rights to all users',
        'Run production jobs on the same cluster as ad-hoc notebooks',
        'Use developer laptops only',
        'Remove catalogs to simplify metadata',
        'Skip environment separation entirely'
    ],
    'topic-02': [
        'Manual clipboard-only ingestion',
        'Monthly CSV uploads only',
        'Disable checkpointing in streams',
        'Treat schema changes as always ignored',
        'Orchestrate with a local text editor only',
        'Run streaming without reliability controls',
        'Use batch ingestion for near real-time dashboards',
        'Load data only from notebooks'
    ],
    'topic-03': [
        'Grant broad owner rights to all users',
        'Store governance settings in a spreadsheet',
        'Skip centralized access controls',
        'Use one unmanaged schema for every domain',
        'Replace Unity Catalog with ad hoc file shares',
        'Use workspace folders instead of catalogs',
        'Put secrets in source code',
        'Share all data across all teams'
    ],
    'topic-04': [
        'Run every pipeline manually',
        'Ignore retries and dependencies',
        'Keep production jobs unmonitored',
        'Schedule jobs without recovery steps',
        'Use a single notebook with no orchestration',
        'Disable failure notifications',
        'Trigger jobs only from developer laptops',
        'Delete run history after each execution'
    ],
    'topic-05': [
        'Silence failure notifications',
        'Rely on anecdotal comments without telemetry',
        'Disable logs after deployment',
        'Remove threshold rules entirely',
        'Use manual daily visual checks only',
        'Avoid action on bottlenecks',
        'Ignore trend changes after release',
        'Optimize without metrics'
    ]
};

const keywordDistractors: Array<{ match: RegExp; label: string }> = [
    { match: /namespace/i, label: 'catalog.object.schema' },
    { match: /dev and prod|separating dev and prod/i, label: 'Keep all environments in one shared workspace' },
    { match: /production pipelines|scheduled production/i, label: 'Use one long-running all-purpose cluster for every job' },
    { match: /metastore/i, label: 'A notebook extension for browsing tables' },
    { match: /separation of duties|separate.*domains/i, label: 'Put every domain into a single unrestricted schema' },
    { match: /ad-hoc notebook activity|production workload/i, label: 'Run production jobs on the same cluster as interactive notebooks' },
    { match: /ingestion options|batch ingestion|streaming ingestion/i, label: 'Handle all data movement with manual uploads' },
    { match: /streaming design/i, label: 'Remove checkpointing to reduce operational overhead' },
    { match: /tools can orchestrate/i, label: 'Use only a local editor to move data into production' },
    { match: /schema management/i, label: 'Accept any schema change without validation' },
    { match: /batch ingestion/i, label: 'Process every event the moment it appears' },
    { match: /near real-time dashboards/i, label: 'Use monthly manual CSV uploads' },
    { match: /Unity Catalog|governance/i, label: 'Rely on workspace folders instead of governed objects' },
    { match: /access controls|secrets/i, label: 'Store secrets in source code and share broad access' },
    { match: /job orchestration/i, label: 'Launch each step independently without dependencies' },
    { match: /reliability|recoverability/i, label: 'Skip retries and make failures manual to inspect' },
    { match: /monitor|alerts|telemetry/i, label: 'Use silent operations without metrics or alerts' },
    { match: /performance|optimize/i, label: 'Tune nothing and rely on guesswork' }
];

const pickDiverseDistractor = (question: QuizQuestion): string => {
    const existingLabels = new Set(question.options.map((option) => option.label));
    const keywordMatch = keywordDistractors.find(({ match }) => match.test(question.prompt));

    if (keywordMatch && !existingLabels.has(keywordMatch.label)) {
        return keywordMatch.label;
    }

    const pool = topicDistractors[question.topicId] ?? [];
    const startIndex = question.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);

    for (let offset = 0; offset < pool.length; offset += 1) {
        const candidate = pool[(startIndex + offset) % pool.length];
        if (!existingLabels.has(candidate)) {
            return candidate;
        }
    }

    return 'Use an unrelated approach';
};

const enrichQuestion = (question: QuizQuestion): QuizQuestion => {
    if (question.options.length >= 4) {
        return question;
    }

    return {
        ...question,
        options: [
            ...question.options,
            { id: 'd', label: pickDiverseDistractor(question) }
        ]
    };
};

QUESTION_BANK.forEach((question) => {
    assertOfficialMicrosoftUrls(question.sourceUrls, `Question ${question.id}`);
});

const NORMALIZED_QUESTION_BANK = QUESTION_BANK.map(enrichQuestion);

export const getQuestionsForTopic = (topicId: string): QuizQuestion[] =>
    NORMALIZED_QUESTION_BANK.filter((q) => q.topicId === topicId && !q.codeSnippet);

export const getCodeSnippetQuestionsForTopic = (topicId: string): QuizQuestion[] =>
    NORMALIZED_QUESTION_BANK.filter((q) => q.topicId === topicId && !!q.codeSnippet);

export const getQuestionCountForTopic = (topicId: string): number =>
    getQuestionsForTopic(topicId).length;

export const getAllQuestions = (): QuizQuestion[] =>
    NORMALIZED_QUESTION_BANK.filter((q) => !q.codeSnippet);
