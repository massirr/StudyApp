import { QuizQuestion } from '../types/quiz';
import { assertOfficialMicrosoftUrls } from '../utils/contentValidation';

const QUESTION_BANK: QuizQuestion[] = [
    {
        id: 'q-t1-1',
        topicId: 'topic-01',
        prompt: 'Which namespace format is used by Unity Catalog objects?',
        type: 'single',
        options: [
            { id: 'a', label: 'workspace.database.table' },
            { id: 'b', label: 'catalog.schema.object' },
            { id: 'c', label: 'metastore.table.column' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Unity Catalog uses a three-level namespace with catalog, schema, and object.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/securable-objects'
        ]
    },
    {
        id: 'q-t1-2',
        topicId: 'topic-01',
        prompt: 'What is the primary advantage of separating dev and prod Databricks workspaces?',
        type: 'single',
        options: [
            { id: 'a', label: 'It guarantees zero cloud costs' },
            { id: 'b', label: 'It improves isolation for governance and change control' },
            { id: 'c', label: 'It removes the need for permissions' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Separate environments improve operational isolation and reduce accidental production impact.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/lakehouse-architecture/deployment-guide/workspace-strategy']
    },
    {
        id: 'q-t1-3',
        topicId: 'topic-01',
        prompt: 'Which compute pattern is typically preferred for scheduled production pipelines?',
        type: 'single',
        options: [
            { id: 'a', label: 'Ephemeral job clusters' },
            { id: 'b', label: 'Long-running all-purpose clusters for all workloads' },
            { id: 'c', label: 'Developer laptops only' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Job clusters are commonly used for scheduled workloads to improve workload isolation and cost control.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/run-classic-jobs']
    },
    {
        id: 'q-t1-4',
        topicId: 'topic-01',
        prompt: 'Which practice aligns with designing secure Databricks workloads?',
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
        prompt: 'What does a metastore in Unity Catalog provide?',
        type: 'single',
        options: [
            { id: 'a', label: 'A replacement for all SQL queries' },
            { id: 'b', label: 'A central metadata and governance layer for data assets' },
            { id: 'c', label: 'A browser extension for notebooks' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'The metastore is the top-level governance boundary for catalogs and their objects.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
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
    {
        id: 'q-t2-1',
        topicId: 'topic-02',
        prompt: 'Which approaches are typical ingestion options in modern data pipelines?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Batch ingestion' },
            { id: 'b', label: 'Streaming ingestion' },
            { id: 'c', label: 'Manual clipboard-only ingestion' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Data engineering solutions commonly combine both batch and streaming ingestion patterns.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/data-factory/introduction',
            'https://learn.microsoft.com/en-us/azure/databricks/ingestion/'
        ]
    },
    {
        id: 'q-t2-2',
        topicId: 'topic-02',
        prompt: 'In a streaming ingestion design, what is usually most important?',
        type: 'single',
        options: [
            { id: 'a', label: 'Low-latency processing with checkpointing and reliability' },
            { id: 'b', label: 'Manual copy-and-paste updates' },
            { id: 'c', label: 'Ignoring schema changes forever' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Streaming pipelines prioritize reliable, incremental processing with recoverable state.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/structured-streaming/concepts']
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
        prompt: 'Why is schema management important in ingestion pipelines?',
        type: 'single',
        options: [
            { id: 'a', label: 'To disable all transformations' },
            { id: 'b', label: 'To keep data quality and downstream transformations stable' },
            { id: 'c', label: 'To avoid using source systems' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Schema handling reduces pipeline failures and supports controlled evolution in production systems.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/cloud-object-storage/auto-loader/']
    },
    {
        id: 'q-t2-5',
        topicId: 'topic-02',
        prompt: 'Which statement best describes batch ingestion?',
        type: 'single',
        options: [
            { id: 'a', label: 'Always processes every event instantly' },
            { id: 'b', label: 'Cannot be automated' },
            { id: 'c', label: 'Processes data at scheduled intervals' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Batch ingestion handles data in periodic runs and is commonly used for many enterprise workloads.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/data-factory/introduction',
            'https://learn.microsoft.com/en-us/azure/databricks/ingestion/'
        ]
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
    {
        id: 'q-t3-1',
        topicId: 'topic-03',
        prompt: 'Which capability in Azure Databricks is focused on centralized data governance?',
        type: 'single',
        options: [
            { id: 'a', label: 'Unity Catalog' },
            { id: 'b', label: 'Workspace browser theme' },
            { id: 'c', label: 'Notebook markdown renderer' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Unity Catalog provides centralized governance for data and AI assets in Databricks.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
    },
    {
        id: 'q-t3-2',
        topicId: 'topic-03',
        prompt: 'Which approach supports least-privilege governance?',
        type: 'single',
        options: [
            { id: 'a', label: 'Assign full admin rights to all users' },
            { id: 'b', label: 'Grant only the minimum required permissions' },
            { id: 'c', label: 'Use no access controls' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Least privilege limits risk by granting only permissions needed for a role.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/access-control/permissions-concepts'
        ]
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
        prompt: 'Which identity platform is commonly used with Azure services for authentication and authorization?',
        type: 'single',
        options: [
            { id: 'a', label: 'A local spreadsheet only' },
            { id: 'b', label: 'Microsoft Entra ID' },
            { id: 'c', label: 'Browser bookmarks' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Microsoft Entra provides identity and access capabilities across Azure workloads.',
        sourceUrls: ['https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra']
    },
    {
        id: 'q-t3-5',
        topicId: 'topic-03',
        prompt: 'Which governance capabilities are associated with Unity Catalog?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Centralized access controls' },
            { id: 'b', label: 'Data lineage visibility' },
            { id: 'c', label: 'Automatic replacement of all ETL logic' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Unity Catalog provides centralized governance features including permissions and lineage tracking.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
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
    {
        id: 'q-t4-1',
        topicId: 'topic-04',
        prompt: 'Databricks Jobs are primarily used for which purpose?',
        type: 'single',
        options: [
            { id: 'a', label: 'Scheduling and orchestrating workloads' },
            { id: 'b', label: 'Replacing source control systems' },
            { id: 'c', label: 'Managing desktop operating system updates' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Databricks Jobs orchestrate, schedule, and manage task execution for pipelines.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
    },
    {
        id: 'q-t4-2',
        topicId: 'topic-04',
        prompt: 'Why are task dependencies useful in pipeline orchestration?',
        type: 'single',
        options: [
            { id: 'a', label: 'They eliminate all failures permanently' },
            { id: 'b', label: 'They enforce execution order between related tasks' },
            { id: 'c', label: 'They remove the need for source data' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Dependencies model data and process order so downstream tasks run only after prerequisites succeed.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/run-if']
    },
    {
        id: 'q-t4-3',
        topicId: 'topic-04',
        prompt: 'Which feature improves reliability for transient failures in scheduled jobs?',
        type: 'single',
        options: [
            { id: 'a', label: 'Removing monitoring' },
            { id: 'b', label: 'Retry policies' },
            { id: 'c', label: 'Disabling logs' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Retries help recover from temporary issues without manual intervention.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/configure-job']
    },
    {
        id: 'q-t4-4',
        topicId: 'topic-04',
        prompt: 'Which operational practice is recommended for production data pipelines?',
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
        prompt: 'What is a key objective when operating recurring pipelines?',
        type: 'single',
        options: [
            { id: 'a', label: 'Frequent manual restarts for every run' },
            { id: 'b', label: 'Consistent, repeatable execution with observability' },
            { id: 'c', label: 'No logging to reduce storage' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Production operations prioritize repeatability, reliability, and visibility.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
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
    {
        id: 'q-t5-1',
        topicId: 'topic-05',
        prompt: 'Which Azure service helps monitor workload health and alerts?',
        type: 'single',
        options: [
            { id: 'a', label: 'Azure Monitor' },
            { id: 'b', label: 'Paint 3D' },
            { id: 'c', label: 'Device Manager' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Azure Monitor provides telemetry, logs, and alerting capabilities for cloud workloads.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview'
        ]
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
        prompt: 'What is the purpose of workload performance tuning in Databricks?',
        type: 'single',
        options: [
            { id: 'a', label: 'Make all queries intentionally slower' },
            { id: 'b', label: 'Improve throughput and efficiency for data processing' },
            { id: 'c', label: 'Avoid using compute resources entirely' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Optimization focuses on improving runtime efficiency, reliability, and resource usage.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/']
    },
    {
        id: 'q-t5-4',
        topicId: 'topic-05',
        prompt: 'Why are alert rules important in workload operations?',
        type: 'single',
        options: [
            { id: 'a', label: 'They replace all logging and dashboards' },
            { id: 'b', label: 'They notify teams when critical thresholds are breached' },
            { id: 'c', label: 'They only apply to local desktop apps' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Alerts shorten response times by surfacing operational problems quickly.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview']
    },
    {
        id: 'q-t5-5',
        topicId: 'topic-05',
        prompt: 'Which actions can contribute to workload optimization?',
        type: 'multiple',
        options: [
            { id: 'a', label: 'Review performance telemetry regularly' },
            { id: 'b', label: 'Tune query and compute settings based on evidence' },
            { id: 'c', label: 'Ignore monitoring trends over time' }
        ],
        correctOptionIds: ['a', 'b'],
        explanation:
            'Evidence-based tuning and continuous telemetry review are central to long-term optimization.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/optimizations/',
            'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview'
        ]
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

    // ── Topic 01: Lab-scenario code-snippet questions (Labs 1 & 2) ───────────
    {
        id: 'q-t1-cs1',
        topicId: 'topic-01',
        prompt: 'Lab 1 — You create a cluster for the workspace exploration exercise. The config below uses autoscaling between 1 and 8 workers. What triggers the cluster to add worker nodes?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'cluster_config = {\n    "cluster_name": "lab1-cluster",\n    "spark_version": "14.3.x-scala2.12",\n    "node_type_id": "Standard_DS3_v2",\n    "autoscale": {\n        "min_workers": 1,\n        "max_workers": 8\n    },\n    "autotermination_minutes": 30\n}'
        },
        options: [
            { id: 'a', label: 'Spark detects pending tasks that current workers cannot handle and adds nodes up to max_workers' },
            { id: 'b', label: 'The cluster scales up at a fixed 5-minute interval regardless of workload' },
            { id: 'c', label: 'Autoscaling only applies to all-purpose clusters attached to SQL warehouses' },
            { id: 'd', label: 'The cluster adds workers whenever a new notebook is attached to it' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Autoscaling monitors pending Spark tasks. When current workers are overloaded, Databricks adds nodes up to max_workers. When idle, it scales back down to min_workers, balancing cost and performance automatically.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/clusters/configure']
    },
    {
        id: 'q-t1-cs2',
        topicId: 'topic-01',
        prompt: 'Lab 2 — Your notebook needs to mount Azure Data Lake. A teammate hardcoded the storage key directly. You refactor it to use a secret scope. If you accidentally call print() on the retrieved value, what appears in the notebook cell output?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'storage_key = dbutils.secrets.get(\n    scope="lab-workspace-secrets",\n    key="adls-storage-key"\n)\n\nprint(storage_key)  # what appears here?'
        },
        options: [
            { id: 'a', label: 'The full storage key in plaintext — secrets are decrypted for the calling notebook' },
            { id: 'b', label: '[REDACTED] — Databricks masks secret values in all notebook outputs and driver logs' },
            { id: 'c', label: 'A Python PermissionError because print() is blocked for secret-backed variables' },
            { id: 'd', label: 'An empty string because the key was not yet assigned a value in the scope' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Databricks Secrets redacts resolved values in notebook outputs, replacing them with [REDACTED]. This prevents accidental exposure in cell output, driver logs, and notebook revision history regardless of how the value is used.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/security/secrets/']
    },
    {
        id: 'q-t1-cs3',
        topicId: 'topic-01',
        prompt: 'Lab 2 — During workspace exploration you query a table that was registered in Unity Catalog during lab setup. Which three-level namespace format does this SQL statement use?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: "SELECT student_id, course_code, enrolled_at\nFROM training_catalog.academic.enrollments\nWHERE academic_year = 2024\nORDER BY enrolled_at DESC;"
        },
        options: [
            { id: 'a', label: 'workspace.database.table — the legacy Hive metastore three-level format' },
            { id: 'b', label: 'metastore.catalog.object — used only for cross-workspace federation queries' },
            { id: 'c', label: 'catalog.schema.table — the Unity Catalog three-level namespace' },
            { id: 'd', label: 'catalog.database.view — used exclusively for external and materialized tables' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Unity Catalog organizes data assets in a three-level hierarchy: catalog.schema.object. Here training_catalog is the catalog, academic is the schema, and enrollments is the table.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/']
    },
    {
        id: 'q-t1-cs4',
        topicId: 'topic-01',
        prompt: 'Lab 1 — Before provisioning your lab cluster, your organization requires cost attribution metadata on all compute. You add the tags below to the cluster config. Where do these tags appear after the cluster runs workloads?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'custom_tags = {\n    "project": "dp-750-training",\n    "environment": "lab",\n    "cost-center": "TRAINING-001"\n}'
        },
        options: [
            { id: 'a', label: 'In the Databricks audit log as an access-control event for each cluster start' },
            { id: 'b', label: 'As metadata columns automatically added to every Delta table written by the cluster' },
            { id: 'c', label: 'In Unity Catalog lineage graphs to trace which cluster produced each table' },
            { id: 'd', label: 'In Azure cost management and billing reports, enabling spend attribution by project or team' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Cluster tags propagate to Azure resource billing data. Teams use them to attribute cloud spend by environment, team, or cost center. They do not affect permissions, table metadata, or lineage tracking.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/clusters/configure']
    },
    {
        id: 'q-t1-cs5',
        topicId: 'topic-01',
        prompt: 'Lab 2 — Your deployment notebook uses a widget to route code to different Unity Catalog assets depending on the target environment. What architectural principle does this pattern demonstrate?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'env = dbutils.widgets.get("environment")  # "dev" or "prod"\n\ncatalog = f"{env}_catalog"\nschema  = f"{env}_bronze"\n\nspark.sql(f"USE CATALOG {catalog}")\nspark.sql(f"USE SCHEMA {schema}")\nprint(f"Targeting: {catalog}.{schema}")'
        },
        options: [
            { id: 'a', label: 'Catalog-level environment isolation — the same code targets separate data assets per environment within Unity Catalog' },
            { id: 'b', label: 'Workspace parity — dev and prod share one workspace and differ only in schema names' },
            { id: 'c', label: 'Schema-less design — catalogs are bypassed and objects are referenced by short name only' },
            { id: 'd', label: 'Metastore federation — the widget selects which external metastore to query' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Using environment-prefixed catalog names (dev_catalog, prod_catalog) is a Unity Catalog pattern that isolates development and production data assets within the same metastore. The same notebook runs in both environments without code changes.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/']
    },

    // ── Topic 02: Lab-scenario code-snippet questions (Labs 7 & 8) ───────────
    {
        id: 'q-t2-cs1',
        topicId: 'topic-02',
        prompt: 'Lab 7 — You build an incremental ingestion pipeline that picks up new JSON event files dropped into ADLS by an upstream system. Your instructor asks why cloudFiles is preferred over a scheduled full directory read. What is the main advantage?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'df_raw = (spark.readStream\n    .format("cloudFiles")\n    .option("cloudFiles.format", "json")\n    .option("cloudFiles.schemaLocation",\n            "/checkpoints/lab7/schema")\n    .option("cloudFiles.inferColumnTypes", "true")\n    .load("abfss://raw@labstorage.dfs.core.windows.net/events/"))'
        },
        options: [
            { id: 'a', label: 'cloudFiles deduplicates rows by content hash; a full directory read does not' },
            { id: 'b', label: 'Auto Loader uses Azure Event Grid or incremental listing to track new files, eliminating expensive full directory scans at scale' },
            { id: 'c', label: 'cloudFiles automatically applies Delta MERGE to upsert events rather than appending duplicates' },
            { id: 'd', label: 'Auto Loader requires no schemaLocation; schema is inferred from a static JSON manifest each run' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Auto Loader (cloudFiles format) tracks which files have been processed using file notifications or incremental directory listing. At scale this is far more efficient than listing millions of files on every microbatch, and the schemaLocation enables incremental schema evolution.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/cloud-object-storage/auto-loader/']
    },
    {
        id: 'q-t2-cs2',
        topicId: 'topic-02',
        prompt: 'Lab 8 — You load daily sales CSV files from ADLS into a bronze Delta table using COPY INTO. A colleague runs the same statement twice and asks whether data will be duplicated. What actually happens on the second run?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: "COPY INTO bronze.daily_sales\nFROM 'abfss://raw@labstorage.dfs.core.windows.net/sales/2024/'\nFILEFORMAT = CSV\nFORMAT_OPTIONS (\n    'header' = 'true',\n    'inferSchema' = 'true'\n);"
        },
        options: [
            { id: 'a', label: 'Only files not yet successfully loaded are ingested; already-processed files are skipped, making COPY INTO idempotent' },
            { id: 'b', label: 'The second run re-ingests all files and creates duplicate rows in bronze.daily_sales' },
            { id: 'c', label: 'The second run fails with a FilesAlreadyLoadedException and rolls back the first load' },
            { id: 'd', label: 'COPY INTO truncates the target table before each run and reloads all source files from scratch' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'COPY INTO tracks which files have already been loaded in the Delta transaction log. Running it again is safe — new files are ingested and already-loaded files are skipped. This idempotency makes it reliable for scheduled batch jobs.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/copy-into']
    },
    {
        id: 'q-t2-cs3',
        topicId: 'topic-02',
        prompt: 'Lab 7 — Your Auto Loader stream writes parsed events to a Delta silver table. The cluster restarts mid-batch. On recovery you observe no duplicate rows. What makes fault-tolerant exactly-once delivery possible here?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: '(df_parsed\n    .writeStream\n    .format("delta")\n    .outputMode("append")\n    .option("checkpointLocation",\n            "/checkpoints/lab7/silver-events")\n    .trigger(availableNow=True)\n    .start("abfss://silver@labstorage.dfs.core.windows.net/events"))'
        },
        options: [
            { id: 'a', label: 'Delta Lake locks the output path preventing any concurrent write that could cause duplication' },
            { id: 'b', label: 'trigger(availableNow=True) replays only the last batch on restart and discards partial writes' },
            { id: 'c', label: 'The checkpointLocation stores committed offsets and processed file state so the stream resumes exactly where it stopped, preventing data loss or duplication' },
            { id: 'd', label: 'outputMode("append") automatically deduplicates rows via Delta MERGE on restart' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'The checkpointLocation persists stream progress — which offsets and source files were committed. On restart Spark reads this state and continues from the last successful commit, delivering exactly-once semantics with Delta Lake.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/structured-streaming/delta-lake']
    },
    {
        id: 'q-t2-cs4',
        topicId: 'topic-02',
        prompt: 'Lab 8 — Joining three DataFrames, you apply a broadcast hint only to the small regions lookup (200 rows), not to df_customers (5 M rows). Join time drops from 4 minutes to 18 seconds. Why does broadcasting only df_regions give the best result?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'from pyspark.sql.functions import broadcast\n\ndf_result = (df_orders\n    .join(df_customers, on="customer_id", how="left")\n    .join(broadcast(df_regions), on="region_code", how="left"))'
        },
        options: [
            { id: 'a', label: 'Spark allows only one broadcast per query; df_regions is chosen because it has fewer columns' },
            { id: 'b', label: 'Broadcasting requires Delta Lake format; df_customers is stored as Parquet and cannot be broadcast' },
            { id: 'c', label: 'df_customers has a primary key enabling a sort-merge join that is faster than broadcasting it' },
            { id: 'd', label: 'df_regions fits in executor memory so it is replicated to all workers, eliminating the shuffle of df_orders; df_customers at 5 M rows would exhaust executor memory if broadcast' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'A broadcast join copies the small table to every executor, so the large table never shuffles across the network. Broadcasting a 200-row lookup is safe and eliminates an expensive exchange stage. Attempting to broadcast a 5 M-row table risks out-of-memory errors on executors.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/']
    },
    {
        id: 'q-t2-cs5',
        topicId: 'topic-02',
        prompt: 'Lab 8 — The reporting team needs one row per product with a separate revenue column for each quarter. You use a Spark pivot. What is the shape of df_quarterly compared with the original df_sales?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'df_quarterly = (df_sales\n    .groupBy("product_name")\n    .pivot("quarter", ["Q1", "Q2", "Q3", "Q4"])\n    .agg({"net_revenue": "sum"}))\n\ndf_quarterly.show()'
        },
        options: [
            { id: 'a', label: 'Same shape as df_sales — pivot is a display transformation that does not change the DataFrame structure' },
            { id: 'b', label: 'One row per unique product_name with columns Q1, Q2, Q3, and Q4 each containing the summed revenue for that quarter' },
            { id: 'c', label: 'One row per (product_name, quarter) pair — the same granularity as df_sales but sorted by quarter' },
            { id: 'd', label: 'The DataFrame is transposed so product names become column headers and quarters become the row index' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Pivot rotates the distinct values of the pivot column (quarter) into separate output columns. The result has one row per product_name and four revenue columns (Q1–Q4), reducing row count but widening the schema.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/getting-started/dataframes-python']
    },

    // ── Topic 03: Lab-scenario code-snippet questions (Labs 3, 4 & 5) ─────────
    {
        id: 'q-t3-cs1',
        topicId: 'topic-03',
        prompt: 'Lab 3 — You set up the data namespace for a university student platform. After running the SQL below, which Unity Catalog hierarchy has been established?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'CREATE CATALOG IF NOT EXISTS university_prod;\n\nCREATE SCHEMA IF NOT EXISTS university_prod.student_data;\n\nCREATE TABLE IF NOT EXISTS university_prod.student_data.enrollments (\n    student_id  STRING NOT NULL,\n    course_id   STRING NOT NULL,\n    status      STRING,\n    enrolled_at TIMESTAMP\n)\nUSING DELTA;'
        },
        options: [
            { id: 'a', label: 'university_prod (metastore) → student_data (database) → enrollments (external table)' },
            { id: 'b', label: 'student_data (catalog) → university_prod (schema) → enrollments (managed table)' },
            { id: 'c', label: 'university_prod (catalog) → student_data (schema) → enrollments (Delta table)' },
            { id: 'd', label: 'university_prod (workspace) → student_data (volume) → enrollments (view)' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Unity Catalog uses a three-level hierarchy: catalog → schema → table. The DDL creates university_prod as the catalog, student_data as the schema inside it, and enrollments as a managed Delta table in that schema.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/']
    },
    {
        id: 'q-t3-cs2',
        topicId: 'topic-03',
        prompt: 'Lab 4 — You implement row-level security so department advisors can only see students in their own department. A CS advisor (not in registrar-admin) queries the table. What rows are returned?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: "CREATE OR REPLACE FUNCTION dept_row_filter(dept_code STRING)\nRETURNS BOOLEAN\nRETURN is_account_group_member('registrar-admin')\n    OR dept_code = session_context('current_department');\n\nALTER TABLE university_prod.student_data.enrollments\nSET ROW FILTER dept_row_filter ON (dept_code);"
        },
        options: [
            { id: 'a', label: 'Only rows where dept_code = \'CS\' — matching the advisor\'s own department' },
            { id: 'b', label: 'All rows in the table regardless of dept_code' },
            { id: 'c', label: 'No rows — non-admin users are blocked from querying row-filtered tables entirely' },
            { id: 'd', label: 'All rows except those where dept_code = \'CS\', as the filter excludes the current user\'s own department' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Unity Catalog row filters are evaluated at query time. Non-admin users see only rows where the filter function returns TRUE — here, rows where dept_code matches their session department. The CS advisor sees only CS enrollments.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/row-and-column-filters']
    },
    {
        id: 'q-t3-cs3',
        topicId: 'topic-03',
        prompt: 'Lab 4 — You protect the national_id column so only members of the pii-access group can see full values. A member of that group queries the column for a student with national_id = \'NID-123456\'. What value do they receive?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: "CREATE OR REPLACE FUNCTION mask_national_id(nid STRING)\nRETURNS STRING\nRETURN CASE\n    WHEN is_account_group_member('pii-access') THEN nid\n    ELSE CONCAT('****-', RIGHT(nid, 4))\nEND;\n\nALTER TABLE university_prod.student_data.enrollments\nALTER COLUMN national_id SET MASK mask_national_id;"
        },
        options: [
            { id: 'a', label: '\'****-3456\' — pii-access members still see the masked version for auditing purposes' },
            { id: 'b', label: '\'NID-123456\' — the full unmasked value, because the member is in the pii-access group' },
            { id: 'c', label: 'NULL — column masks return NULL for all users including privileged groups' },
            { id: 'd', label: 'A PermissionError — the query fails because masked columns block access at the SQL layer' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'The CASE in the mask function returns the original nid when the caller is in pii-access. Unity Catalog column masks are evaluated per caller at query time, so privileged users receive unmasked data while others see \'****-3456\'.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/row-and-column-filters']
    },
    {
        id: 'q-t3-cs4',
        topicId: 'topic-03',
        prompt: 'Lab 5 — You create a secret scope to store the university database connection string so it never appears in notebooks or Git history. What security risk does this pattern eliminate compared with hardcoding the credential?',
        type: 'single',
        codeSnippet: {
            language: 'bash',
            code: '# Databricks CLI\ndatabricks secrets create-scope --scope uni-db-scope\n\ndatabricks secrets put-secret \\\n    --scope uni-db-scope \\\n    --key postgres-conn-string'
        },
        options: [
            { id: 'a', label: 'Network interception — the secret scope stores credentials behind a private VNet endpoint' },
            { id: 'b', label: 'Audit gap — secret scope reads are now written to a detailed public access log' },
            { id: 'c', label: 'Encryption at rest — the secret file is separately encrypted on DBFS beyond standard storage encryption' },
            { id: 'd', label: 'Credential exposure in notebook cell output, driver logs, cluster event history, and Git repository commits' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Hardcoded credentials appear in notebook revision history, cluster logs, and Git commits. Databricks Secret Scopes keep the value out of code; dbutils.secrets.get() returns the value at runtime with the result redacted in all outputs.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/security/secrets/']
    },
    {
        id: 'q-t3-cs5',
        topicId: 'topic-03',
        prompt: 'Lab 5 — The compliance team asks you to document who has access to the enrollments table before the semester audit. You run the SQL below. What information does it return?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'SHOW GRANTS ON TABLE university_prod.student_data.enrollments;'
        },
        options: [
            { id: 'a', label: 'The table\'s owner, creation timestamp, last modified date, and storage location' },
            { id: 'b', label: 'The row-level filter functions and column masks currently applied to the table' },
            { id: 'c', label: 'All principals (users, groups, service principals) and the specific privileges each holds on the table' },
            { id: 'd', label: 'The Delta transaction log history showing who performed the most recent DML operations' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'SHOW GRANTS ON TABLE returns a result set listing every principal and the privilege they hold on the specified table — SELECT, MODIFY, ALL PRIVILEGES, etc. This is the starting point for access audits in Unity Catalog.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/manage-privileges/']
    },

    // ── Topic 04: Lab-scenario code-snippet questions (Labs 9, 10 & 11) ───────
    {
        id: 'q-t4-cs1',
        topicId: 'topic-04',
        prompt: 'Lab 9 — You build the bronze layer of a Lakeflow Declarative Pipeline that incrementally ingests enrollment JSON files from ADLS. What is the role of the @dlt.table decorator on this function?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'import dlt\n\n@dlt.table(\n    comment="Raw enrollment events — bronze layer",\n    table_properties={"quality": "bronze"}\n)\ndef bronze_enrollments():\n    return (spark.readStream\n        .format("cloudFiles")\n        .option("cloudFiles.format", "json")\n        .option("cloudFiles.schemaLocation",\n                "/pipelines/lab9/checkpoints/schema")\n        .load("abfss://raw@labstorage.dfs.core.windows.net/enrollments/"))'
        },
        options: [
            { id: 'a', label: 'Creates a standard PySpark RDD transformation that runs on each executor independently' },
            { id: 'b', label: 'Marks the function as a Databricks Jobs task that can be scheduled independently of the pipeline' },
            { id: 'c', label: 'Defines a DLT live view that is not persisted and exists only during the pipeline run' },
            { id: 'd', label: 'Registers the function as a DLT pipeline dataset — managed, versioned, and monitored by the DLT runtime with lineage tracking' }
        ],
        correctOptionIds: ['d'],
        explanation:
            '@dlt.table declares the function as a Delta Live Tables dataset. The DLT runtime manages its execution order, tracks lineage, enforces expectations, and exposes run metrics in the pipeline graph — none of which a plain PySpark function provides.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta-live-tables/']
    },
    {
        id: 'q-t4-cs2',
        topicId: 'topic-04',
        prompt: 'Lab 10 — You add a silver layer table that validates incoming enrollment records. A record with student_id = NULL arrives in the stream. What does the pipeline do?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: '@dlt.table(comment="Valid enrollment records — silver layer")\n@dlt.expect_or_drop(\n    "valid_student_id",\n    "student_id IS NOT NULL AND LENGTH(student_id) = 10"\n)\ndef silver_enrollments():\n    return dlt.read_stream("bronze_enrollments")'
        },
        options: [
            { id: 'a', label: 'Stops the entire pipeline run and surfaces a quality failure alert in the pipeline graph' },
            { id: 'b', label: 'Drops the invalid record silently and continues processing all remaining records' },
            { id: 'c', label: 'Routes the invalid record to an auto-generated quarantine table for manual review' },
            { id: 'd', label: 'Logs a data quality warning but writes the NULL record to silver_enrollments anyway' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'expect_or_drop removes rows that fail the quality rule without halting the pipeline. The null-student_id record is excluded from silver_enrollments and counted as a dropped record in the DLT event log, while valid records continue flowing.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta-live-tables/expectations']
    },
    {
        id: 'q-t4-cs3',
        topicId: 'topic-04',
        prompt: 'Lab 11 — You model a four-task medallion pipeline as a Databricks Job. The transform_silver task fails. What happens to aggregate_gold and notify_team?',
        type: 'single',
        codeSnippet: {
            language: 'json',
            code: '{\n  "tasks": [\n    { "task_key": "ingest_bronze" },\n    {\n      "task_key": "transform_silver",\n      "depends_on": [{ "task_key": "ingest_bronze" }]\n    },\n    {\n      "task_key": "aggregate_gold",\n      "depends_on": [{ "task_key": "transform_silver" }]\n    },\n    {\n      "task_key": "notify_team",\n      "depends_on": [{ "task_key": "aggregate_gold" }]\n    }\n  ]\n}'
        },
        options: [
            { id: 'a', label: 'Both aggregate_gold and notify_team are skipped and marked as failed due to the unmet upstream dependency' },
            { id: 'b', label: 'aggregate_gold runs using cached data from the last successful run; notify_team is skipped' },
            { id: 'c', label: 'notify_team runs immediately to alert the team while aggregate_gold is skipped' },
            { id: 'd', label: 'aggregate_gold retries transform_silver automatically before attempting to run' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Databricks Jobs propagates failures through the dependency graph. When transform_silver fails, any task with a transitive depends_on relationship to it — aggregate_gold and notify_team — is marked as Skipped/Failed. No downstream task executes.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
    },
    {
        id: 'q-t4-cs4',
        topicId: 'topic-04',
        prompt: 'Lab 10 — The gold layer requires that every enrollment record has a non-null course_id; a NULL would corrupt downstream reports. The team chooses expect_or_fail. How does expect_or_fail differ from expect_or_drop when a quality violation occurs?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: '@dlt.table(comment="Gold enrollment aggregates")\n@dlt.expect_or_fail(\n    "non_null_course_id",\n    "course_id IS NOT NULL"\n)\ndef gold_enrollment_summary():\n    return (\n        dlt.read("silver_enrollments")\n        .groupBy("course_id", "academic_year")\n        .count()\n    )'
        },
        options: [
            { id: 'a', label: 'expect_or_fail routes the violating row to a quarantine table; expect_or_drop drops it from the dataset' },
            { id: 'b', label: 'Both decorators behave identically — the naming difference is only cosmetic' },
            { id: 'c', label: 'expect_or_fail stops the entire pipeline run on the first quality violation; expect_or_drop removes only the violating rows and continues' },
            { id: 'd', label: 'expect_or_fail drops the violating row silently; expect_or_drop halts the pipeline' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'expect_or_fail is a strict gate: one bad row stops the whole pipeline run, signalling a data contract breach that must be resolved before output is produced. expect_or_drop is lenient: it filters out bad rows and lets the pipeline continue with clean data.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta-live-tables/expectations']
    },
    {
        id: 'q-t4-cs5',
        topicId: 'topic-04',
        prompt: 'Lab 11 — The ingest_bronze task connects to an external API that returns HTTP 503 intermittently. You configure retry behavior as shown. The API returns 503 on every attempt. After the initial run plus 2 retries all fail, what happens?',
        type: 'single',
        codeSnippet: {
            language: 'json',
            code: '{\n  "task_key": "ingest_bronze",\n  "max_retries": 2,\n  "min_retry_interval_millis": 120000,\n  "retry_on_timeout": true,\n  "timeout_seconds": 300\n}'
        },
        options: [
            { id: 'a', label: 'The task retries indefinitely with exponential backoff until the API becomes available' },
            { id: 'b', label: 'The task falls back to reading a cached dataset from the most recent successful run' },
            { id: 'c', label: 'Databricks pages the on-call engineer and waits for manual approval before any further attempt' },
            { id: 'd', label: 'The task is marked as failed after max_retries is exhausted; dependent downstream tasks do not execute' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'After max_retries (2) consecutive failures — meaning 3 total attempts (1 initial + 2 retries) — Databricks marks the task as Failed. The job run ends in a failed state and any tasks with depends_on on ingest_bronze are skipped.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
    },

    // ── Topic 05: Lab-scenario code-snippet questions (Lab 13) ────────────────
    {
        id: 'q-t5-cs1',
        topicId: 'topic-05',
        prompt: 'Lab 13 — Inspecting the Spark UI you see a large sort-merge join taking 8 minutes. You add a broadcast hint to the small course lookup table (200 rows). In the revised Spark UI stage plan, what change do you observe?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'from pyspark.sql.functions import broadcast\n\ndf_result = (\n    df_enrollment_facts        # 50 M rows\n    .join(\n        broadcast(df_course_lookup),   # 200 rows\n        on="course_id",\n        how="left"\n    )\n)'
        },
        options: [
            { id: 'a', label: 'The Exchange (shuffle) stage for df_course_lookup is replaced by a BroadcastHashJoin, eliminating network data movement for that table' },
            { id: 'b', label: 'The join still appears as SortMergeJoin but with a BroadcastHashJoin as a fallback stage' },
            { id: 'c', label: 'The stage count doubles because broadcasting adds an extra data-preparation stage before the join' },
            { id: 'd', label: 'The plan shows CartesianProduct because broadcasting removes the join key constraint' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Broadcast joins send the small table to every executor in-memory, removing the Exchange (shuffle) stage entirely for that table. In the Spark UI physical plan you see BroadcastHashJoin instead of SortMergeJoin with two Exchange stages, which is the source of the 8-minute bottleneck.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/']
    },
    {
        id: 'q-t5-cs2',
        topicId: 'topic-05',
        prompt: 'Lab 13 — You enable AQE before running a large enrollment aggregation. The Spark UI shows some tasks taking 45 seconds while others finish in 2 seconds — a classic data-skew pattern. What does AQE\'s skewJoin feature do when it detects one partition is 5× larger than the median?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'spark.conf.set("spark.sql.adaptive.enabled", "true")\nspark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")\nspark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")\n\ndf_agg = (\n    df_enrollments\n    .groupBy("course_id")\n    .agg({"student_id": "count"})\n)'
        },
        options: [
            { id: 'a', label: 'Moves the skewed partition to the driver node for single-threaded processing to avoid executor OOM' },
            { id: 'b', label: 'Drops the skewed partition and logs a DataSkewWarning in the Spark event log' },
            { id: 'c', label: 'Splits the skewed partition into smaller sub-partitions and replicates matching keys, distributing the load across more tasks and reducing straggler time' },
            { id: 'd', label: 'Forces all partitions to exactly equal size before the join begins, preventing future skew' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'AQE\'s skew join optimization detects oversized partitions at runtime and splits them into smaller pieces, replicating the matching side as needed. This converts one slow 45-second task into many fast sub-tasks, eliminating the straggler bottleneck.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/aqe']
    },
    {
        id: 'q-t5-cs3',
        topicId: 'topic-05',
        prompt: 'Lab 13 — After months of streaming appends, the gold enrollments table has thousands of small files. You run OPTIMIZE followed by VACUUM. What does VACUUM RETAIN 168 HOURS specifically do?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'OPTIMIZE gold.enrollments\nZORDER BY (academic_year, course_id);\n\nVACUUM gold.enrollments RETAIN 168 HOURS;'
        },
        options: [
            { id: 'a', label: 'Deletes all live data rows in gold.enrollments that were inserted more than 7 days ago' },
            { id: 'b', label: 'Removes orphaned data files no longer referenced in the Delta transaction log that are older than 7 days, while preserving time-travel access within that window' },
            { id: 'c', label: 'Retains exactly 168 historical table versions for time travel and deletes all older versions' },
            { id: 'd', label: 'Compacts all table files into one Parquet file and keeps 168 backup copies of the pre-compaction state' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'VACUUM removes orphaned files — data files that are no longer referenced by the Delta transaction log — older than the retention threshold (168 h = 7 days). Live data rows are untouched. Time travel to any commit within the 7-day window still works.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta/vacuum']
    },
    {
        id: 'q-t5-cs4',
        topicId: 'topic-05',
        prompt: 'Lab 13 — You compare the same SQL aggregation on a standard cluster versus a Photon-enabled cluster configured as shown. Which workload type benefits most from the Photon runtime?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'photon_cluster = {\n    "cluster_name": "lab13-photon",\n    "spark_version": "14.3.x-photon-scala2.12",\n    "node_type_id": "Standard_DS4_v2",\n    "num_workers": 4\n}'
        },
        options: [
            { id: 'a', label: 'Python UDFs and custom pandas transformations that run on the driver node' },
            { id: 'b', label: 'MLflow model training jobs using scikit-learn or PyTorch estimators' },
            { id: 'c', label: 'Kafka consumer microservices that process fewer than 100 events per second' },
            { id: 'd', label: 'SQL aggregations, DataFrame operations, and Delta Lake reads/writes using vectorised native execution' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Photon is a vectorised C++ query engine that accelerates SQL and DataFrame operations on Delta Lake. It does not accelerate Python UDFs (which run in the Python interpreter), ML training, or low-throughput streaming workloads.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/runtime/photon']
    },
    {
        id: 'q-t5-cs5',
        topicId: 'topic-05',
        prompt: 'Lab 13 — You profile a notebook that reads the same gold Delta table three times across different cells. Your instructor shows you how caching eliminates redundant scans. Why is df_gold.count() called immediately after .cache()?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'df_gold = spark.read.format("delta").load(\n    "abfss://gold@labstorage.dfs.core.windows.net/enrollments"\n)\n\ndf_gold.cache()\ndf_gold.count()  # materialise the cache\n\n# Later cells reuse df_gold without re-reading Delta\nagg_by_year = df_gold.groupBy("academic_year").count()\nagg_by_dept = df_gold.groupBy("dept_code").count()'
        },
        options: [
            { id: 'a', label: '.count() is required by the Spark API to register a DataFrame for caching — without it, .cache() has no effect' },
            { id: 'b', label: '.cache() is lazy and only marks the DataFrame for caching; .count() is an action that triggers the full scan and loads data into executor memory so later actions skip the Delta source read' },
            { id: 'c', label: '.count() validates that the Delta table has no null rows before allowing the cache to be populated' },
            { id: 'd', label: 'Calling .count() after .cache() flushes any stale cached data and forces a fresh re-read from Delta' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Spark transformations including .cache() are lazy — they describe a computation plan without executing it. Only an action such as .count() triggers actual execution. The .count() scan populates the in-memory cache so agg_by_year and agg_by_dept reuse cached data instead of re-reading the Delta source.',
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
    {
        match: /performance|optimize/i, label: 'Tune nothing and rely on guesswork'
    }
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
