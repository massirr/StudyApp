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

    // ── Topic 01: Code-snippet questions ──────────────────────────────────────
    {
        id: 'q-t1-cs1',
        topicId: 'topic-01',
        prompt: 'What does this Python code retrieve from the Databricks secret scope?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'jdbc_password = dbutils.secrets.get(\n    scope="prod-secrets",\n    key="jdbc-password"\n)'
        },
        options: [
            { id: 'a', label: 'A JDBC connection string stored in a notebook cell' },
            { id: 'b', label: 'A plaintext password echoed to the notebook output' },
            { id: 'c', label: 'A secret value retrieved securely without exposing it in plaintext' },
            { id: 'd', label: 'An environment variable from the host operating system' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Databricks Secrets lets you store and access sensitive information securely. The value returned by dbutils.secrets.get() is redacted in logs and notebook outputs, preventing accidental exposure.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/security/secrets/']
    },
    {
        id: 'q-t1-cs2',
        topicId: 'topic-01',
        prompt: 'A cluster is configured as shown. What is the effect of setting autotermination_minutes to 0?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'cluster_config = {\n    "cluster_name": "dev-shared",\n    "spark_version": "14.3.x-scala2.12",\n    "node_type_id": "Standard_DS3_v2",\n    "num_workers": 2,\n    "autotermination_minutes": 0\n}'
        },
        options: [
            { id: 'a', label: 'The cluster terminates immediately on creation' },
            { id: 'b', label: 'The cluster auto-terminates after 0 seconds of inactivity' },
            { id: 'c', label: 'Auto-termination is disabled and the cluster runs indefinitely' },
            { id: 'd', label: 'The cluster terminates after every job run' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Setting autotermination_minutes to 0 disables auto-termination entirely. This is not recommended for cost control; production clusters should use a finite timeout.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/clusters/configure']
    },
    {
        id: 'q-t1-cs3',
        topicId: 'topic-01',
        prompt: 'Given this SQL statement run on Databricks, which three-level namespace format does it follow?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: "SELECT order_id, total\nFROM prod_catalog.sales.orders\nWHERE order_date >= '2024-01-01'"
        },
        options: [
            { id: 'a', label: 'workspace.database.table — the standard Hive metastore format' },
            { id: 'b', label: 'catalog.schema.table — the Unity Catalog three-level namespace' },
            { id: 'c', label: 'metastore.catalog.object — the Databricks legacy format' },
            { id: 'd', label: 'database.schema.view — used only for external tables' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Unity Catalog uses a three-level namespace: catalog.schema.object. In this query, prod_catalog is the catalog, sales is the schema, and orders is the table.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
    },
    {
        id: 'q-t1-cs4',
        topicId: 'topic-01',
        prompt: 'A team applies these tags when creating a cluster. What is the primary operational benefit?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'custom_tags = {\n    "team": "data-engineering",\n    "environment": "production",\n    "cost-center": "DE-001"\n}'
        },
        options: [
            { id: 'a', label: 'Tags enforce network isolation between clusters' },
            { id: 'b', label: 'Tags restrict which notebooks can attach to the cluster' },
            { id: 'c', label: 'Tags replace the need for Unity Catalog governance' },
            { id: 'd', label: 'Tags enable cloud cost attribution and resource tracking per team or project' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Cluster tags propagate to cloud resource billing reports, enabling accurate cost attribution by team, environment, or project. They do not affect cluster permissions or network isolation.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/clusters/configure#cluster-tags']
    },
    {
        id: 'q-t1-cs5',
        topicId: 'topic-01',
        prompt: 'This code pattern is used in a deployment pipeline. Which design principle does it demonstrate?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'import os\nenv = os.getenv("ENV", "dev")\n\ncatalog = f"{env}_catalog"\nschema  = f"{env}_schema"\n\nspark.sql(f"USE CATALOG {catalog}")\nspark.sql(f"USE SCHEMA {schema}")'
        },
        options: [
            { id: 'a', label: 'Environment parity — using identical catalog names in dev and prod' },
            { id: 'b', label: 'Workspace separation — running dev and prod in distinct Databricks workspaces' },
            { id: 'c', label: 'Catalog-level environment isolation — routing code to separate catalogs per environment' },
            { id: 'd', label: 'Schema-less design — avoiding governance boundaries between environments' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Using environment-specific catalog and schema names (dev_catalog, prod_catalog) is a Unity Catalog pattern for isolating development and production data assets within the same metastore.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
    },

    // ── Topic 02: Code-snippet questions ──────────────────────────────────────
    {
        id: 'q-t2-cs1',
        topicId: 'topic-02',
        prompt: 'What ingestion pattern does this Spark Structured Streaming code use?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'df = (spark.readStream\n    .format("cloudFiles")\n    .option("cloudFiles.format", "json")\n    .option("cloudFiles.schemaLocation", "/mnt/checkpoints/schema")\n    .load("/mnt/raw/events/"))'
        },
        options: [
            { id: 'a', label: 'COPY INTO — batch ingestion that deduplicates files already loaded' },
            { id: 'b', label: 'Auto Loader — incremental streaming ingestion that detects new files automatically' },
            { id: 'c', label: 'Delta MERGE — upsert-based streaming that replaces matched rows' },
            { id: 'd', label: 'Kafka connector — reads from a Kafka topic using cloudFiles format' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'The cloudFiles format is Databricks Auto Loader. It detects new files in cloud storage incrementally using file notifications or directory listing, making it ideal for scalable streaming ingestion.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/cloud-object-storage/auto-loader/']
    },
    {
        id: 'q-t2-cs2',
        topicId: 'topic-02',
        prompt: 'What does this Delta Lake SQL statement do when a matching customer_id already exists in the target table?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'MERGE INTO silver.customers AS target\nUSING bronze.customer_updates AS source\nON target.customer_id = source.customer_id\nWHEN MATCHED THEN\n    UPDATE SET *\nWHEN NOT MATCHED THEN\n    INSERT *'
        },
        options: [
            { id: 'a', label: 'Inserts a duplicate row alongside the existing record' },
            { id: 'b', label: 'Updates all columns of the matching target row with source values' },
            { id: 'c', label: 'Deletes the matching row and inserts a new one' },
            { id: 'd', label: 'Skips the row because it already exists' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'In a Delta Lake MERGE, WHEN MATCHED THEN UPDATE SET * updates all columns of the matching row in the target table with the corresponding columns from the source. This is the standard upsert pattern.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta/merge']
    },
    {
        id: 'q-t2-cs3',
        topicId: 'topic-02',
        prompt: 'A pipeline appends new product records with this code. What does the mergeSchema option control?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: '(df_products\n    .write\n    .format("delta")\n    .option("mergeSchema", "true")\n    .mode("append")\n    .save("/delta/silver/products"))'
        },
        options: [
            { id: 'a', label: 'It replaces the existing schema entirely on every write' },
            { id: 'b', label: 'It prevents any schema changes from being written to the table' },
            { id: 'c', label: 'It merges incoming data with existing rows using a primary key' },
            { id: 'd', label: 'It allows new columns in the source to be added to the existing Delta table schema' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'The mergeSchema option enables schema evolution in Delta Lake. When new columns are present in the incoming DataFrame, they are added to the existing table schema rather than causing a write failure.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta/update-schema']
    },
    {
        id: 'q-t2-cs4',
        topicId: 'topic-02',
        prompt: 'Why is the checkpointLocation required in this streaming write?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: '(stream_df\n    .writeStream\n    .format("delta")\n    .outputMode("append")\n    .option("checkpointLocation", "/checkpoints/orders-stream")\n    .trigger(availableNow=True)\n    .start("/delta/silver/orders"))'
        },
        options: [
            { id: 'a', label: 'It stores intermediate Spark shuffle data to improve performance' },
            { id: 'b', label: 'It locks the output path so no other writer can access the table' },
            { id: 'c', label: 'It tracks stream progress and processed offsets to enable fault-tolerant restart' },
            { id: 'd', label: 'It controls partitioning of output files across worker nodes' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'The checkpointLocation stores stream progress metadata (offsets, committed batches). On restart after a failure, Spark resumes exactly where processing left off, ensuring exactly-once semantics with Delta Lake.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/structured-streaming/delta-lake']
    },
    {
        id: 'q-t2-cs5',
        topicId: 'topic-02',
        prompt: 'What does the ZORDER BY clause do in this Delta Lake OPTIMIZE command?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'OPTIMIZE silver.events\nZORDER BY (event_date, user_id);'
        },
        options: [
            { id: 'a', label: 'Partitions the table into directories by event_date and user_id' },
            { id: 'b', label: 'Creates a composite primary key on event_date and user_id' },
            { id: 'c', label: 'Sorts data chronologically and removes duplicate rows' },
            { id: 'd', label: 'Co-locates related values in the same data files to reduce files scanned in queries filtering on those columns' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Z-Ordering is a Delta Lake data-skipping technique that co-locates related data in the same files. Queries filtering on Z-Ordered columns can skip large numbers of files, significantly reducing read I/O.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta/data-skipping']
    },

    // ── Topic 03: Code-snippet questions ──────────────────────────────────────
    {
        id: 'q-t3-cs1',
        topicId: 'topic-03',
        prompt: 'What level of access does this GRANT statement provide to the data-analyst-group?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'GRANT SELECT\nON TABLE prod_catalog.sales.orders\nTO `data-analyst-group`;'
        },
        options: [
            { id: 'a', label: 'Read-only SELECT access to the orders table in Unity Catalog' },
            { id: 'b', label: 'Full ownership of the orders table including MODIFY and DELETE' },
            { id: 'c', label: 'Access to all tables in the sales schema' },
            { id: 'd', label: 'Admin rights over the prod_catalog catalog' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'GRANT SELECT on a Unity Catalog table provides read-only access. The group can query the table but cannot modify, delete, or manage its permissions without additional grants.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/manage-privileges/'
        ]
    },
    {
        id: 'q-t3-cs2',
        topicId: 'topic-03',
        prompt: 'What does this SQL statement return for the finance.transactions table?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'SHOW GRANTS\nON TABLE prod_catalog.finance.transactions;'
        },
        options: [
            { id: 'a', label: 'Removes all existing grants from the table' },
            { id: 'b', label: 'Lists all principals and their privileges on the table' },
            { id: 'c', label: 'Transfers ownership of the table to the current user' },
            { id: 'd', label: 'Grants SELECT to all workspace users' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'SHOW GRANTS ON TABLE returns all principals (users, groups, service principals) and the privileges they hold on the specified table. This is the audit starting point in Unity Catalog governance workflows.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/manage-privileges/'
        ]
    },
    {
        id: 'q-t3-cs3',
        topicId: 'topic-03',
        prompt: 'This Unity Catalog column mask is applied to an employees table. What does a non-privileged user see when querying the ssn column?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: "CREATE OR REPLACE FUNCTION mask_ssn(ssn STRING)\nRETURNS STRING\nRETURN CASE\n    WHEN is_account_group_member('pii-readers') THEN ssn\n    ELSE '***-**-' || RIGHT(ssn, 4)\nEND;\n\nALTER TABLE prod_catalog.hr.employees\nALTER COLUMN ssn SET MASK mask_ssn;"
        },
        options: [
            { id: 'a', label: 'A permission denied error — the query fails entirely' },
            { id: 'b', label: 'The full SSN for all users regardless of group membership' },
            { id: 'c', label: 'The SSN returned as NULL for non-members' },
            { id: 'd', label: 'A partially masked value showing only the last 4 digits (e.g. ***-**-1234)' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Unity Catalog column masks apply a masking function at query time. Users not in the pii-readers group receive ***-**-XXXX instead of the full SSN, implementing dynamic data masking without duplicating the table.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/row-and-column-filters'
        ]
    },
    {
        id: 'q-t3-cs4',
        topicId: 'topic-03',
        prompt: 'A developer stores a database password using these Databricks CLI commands. What security principle does this enforce?',
        type: 'single',
        codeSnippet: {
            language: 'bash',
            code: 'databricks secrets create-scope --scope prod-db-scope\ndatabricks secrets put-secret \\\n    --scope prod-db-scope \\\n    --key db-password'
        },
        options: [
            { id: 'a', label: 'Encryption at rest — the secret file is encrypted on DBFS' },
            { id: 'b', label: 'Separation of secrets from code — sensitive values never appear in notebooks or source control' },
            { id: 'c', label: 'Network isolation — secrets are stored in a private VNet' },
            { id: 'd', label: 'Audit logging — every read of the secret is written to a public log file' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'Databricks Secret Scopes keep credentials out of notebooks and source control. Code references dbutils.secrets.get() and the resolved value is redacted in outputs, enforcing separation of secrets from application logic.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/security/secrets/']
    },
    {
        id: 'q-t3-cs5',
        topicId: 'topic-03',
        prompt: 'This row filter is set on a Unity Catalog table. What do users NOT in the finance-team group see when querying the table?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: "CREATE OR REPLACE FUNCTION finance_row_filter(owner_region STRING)\nRETURNS BOOLEAN\nRETURN is_account_group_member('finance-team')\n    OR owner_region = current_user();\n\nALTER TABLE prod_catalog.finance.budgets\nSET ROW FILTER finance_row_filter ON (owner_region);"
        },
        options: [
            { id: 'a', label: 'All rows with the owner_region column nulled out' },
            { id: 'b', label: 'A permission denied error — the table is inaccessible' },
            { id: 'c', label: 'Only rows where owner_region matches their own username' },
            { id: 'd', label: 'The full table without any row-level filtering' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'Unity Catalog row filters evaluate at query time. Non-finance-team users see only rows where owner_region equals their own current_user() value, implementing fine-grained row-level security without view duplication.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/row-and-column-filters'
        ]
    },

    // ── Topic 04: Code-snippet questions ──────────────────────────────────────
    {
        id: 'q-t4-cs1',
        topicId: 'topic-04',
        prompt: 'What does the @dlt.expect_or_drop decorator do when a row fails the validation rule in this Delta Live Tables definition?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: "import dlt\n\n@dlt.table(comment='Validated customer records')\n@dlt.expect_or_drop('valid_email', \"email IS NOT NULL AND email LIKE '%@%'\")\ndef cleaned_customers():\n    return dlt.read('raw_customers').filter('is_deleted = false')"
        },
        options: [
            { id: 'a', label: 'The entire pipeline run is stopped with a failure' },
            { id: 'b', label: 'The violating row is written to a quarantine table' },
            { id: 'c', label: 'The violating row is silently dropped and the pipeline continues' },
            { id: 'd', label: 'The row is written as-is and a warning is logged' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'expect_or_drop is a Delta Live Tables data quality constraint that drops rows failing the expectation without stopping the pipeline. Rows with invalid or null emails are excluded from the output.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/delta-live-tables/expectations'
        ]
    },
    {
        id: 'q-t4-cs2',
        topicId: 'topic-04',
        prompt: 'This Databricks job task defines retry behavior. What happens after the third consecutive failure of the ingest task?',
        type: 'single',
        codeSnippet: {
            language: 'json',
            code: '{\n  "task_key": "ingest",\n  "max_retries": 3,\n  "min_retry_interval_millis": 60000,\n  "retry_on_timeout": true\n}'
        },
        options: [
            { id: 'a', label: 'The task retries indefinitely until manually stopped' },
            { id: 'b', label: 'The task is marked as failed and the job run ends in an error state' },
            { id: 'c', label: 'The task waits 3 minutes and retries once more' },
            { id: 'd', label: 'Downstream tasks continue despite the ingest failure' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'After max_retries (3) consecutive failures, the task is marked as failed and the job run ends in a failed state. Downstream tasks that depend on the failed task will not execute.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
    },
    {
        id: 'q-t4-cs3',
        topicId: 'topic-04',
        prompt: 'What execution order does this Databricks job task graph define?',
        type: 'single',
        codeSnippet: {
            language: 'json',
            code: '{\n  "tasks": [\n    { "task_key": "ingest" },\n    {\n      "task_key": "transform",\n      "depends_on": [{ "task_key": "ingest" }]\n    },\n    {\n      "task_key": "publish",\n      "depends_on": [{ "task_key": "transform" }]\n    }\n  ]\n}'
        },
        options: [
            { id: 'a', label: 'All three tasks run in parallel with no ordering constraints' },
            { id: 'b', label: 'ingest and publish run in parallel; transform runs last' },
            { id: 'c', label: 'ingest → transform → publish — a strict linear pipeline' },
            { id: 'd', label: 'The tasks share a single cluster and run sequentially on the same node' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'depends_on enforces execution order in Databricks Jobs. Here the workflow is linear: ingest → transform → publish. Each task starts only after the preceding one succeeds.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
    },
    {
        id: 'q-t4-cs4',
        topicId: 'topic-04',
        prompt: 'What schedule does this Databricks job cron expression define?',
        type: 'single',
        codeSnippet: {
            language: 'json',
            code: '{\n  "schedule": {\n    "quartz_cron_expression": "0 0 2 * * ?",\n    "timezone_id": "UTC",\n    "pause_status": "UNPAUSED"\n  }\n}'
        },
        options: [
            { id: 'a', label: 'Every 2 minutes, every hour, every day' },
            { id: 'b', label: 'At 2:00 AM UTC on the 2nd of every month' },
            { id: 'c', label: 'Every day at 02:00 UTC' },
            { id: 'd', label: 'At midnight UTC every 2 hours' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'The Quartz cron expression "0 0 2 * * ?" means: second 0, minute 0, hour 2, every day of month, every month, any day of week — i.e., 02:00 UTC daily.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
    },
    {
        id: 'q-t4-cs5',
        topicId: 'topic-04',
        prompt: 'This DLT streaming table uses expect_or_fail. What happens when the first row with a null event_id arrives?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: "@dlt.table\n@dlt.expect_or_fail('non_null_event_id', 'event_id IS NOT NULL')\ndef validated_events():\n    return (spark.readStream\n        .format('kafka')\n        .option('kafka.bootstrap.servers', 'broker:9092')\n        .option('subscribe', 'events')\n        .load())"
        },
        options: [
            { id: 'a', label: 'The row is dropped and the pipeline continues processing the next record' },
            { id: 'b', label: 'The row is routed to a quarantine table automatically' },
            { id: 'c', label: 'A warning is logged but data flow is unaffected' },
            { id: 'd', label: 'The entire pipeline run is stopped with a failure on that row' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'expect_or_fail halts the entire pipeline when any row violates the data quality rule. This is appropriate when bad data (e.g., null event IDs) would corrupt downstream consumers and must never reach the next layer.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/delta-live-tables/expectations'
        ]
    },

    // ── Topic 05: Code-snippet questions ──────────────────────────────────────
    {
        id: 'q-t5-cs1',
        topicId: 'topic-05',
        prompt: 'What is the performance effect of calling .count() immediately after .cache() on this DataFrame?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'df_events = spark.read.format("delta").load("/delta/gold/events")\ndf_events.cache()\ndf_events.count()  # force materialisation'
        },
        options: [
            { id: 'a', label: 'No effect — .cache() is eager and materialises without an action' },
            { id: 'b', label: 'It evicts the cache and forces re-computation on the next action' },
            { id: 'c', label: 'It writes the DataFrame to DBFS as a persistent cached file' },
            { id: 'd', label: 'It triggers a full scan that populates the in-memory cache so subsequent actions skip the source read' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'In Spark, cache() is lazy — it only marks the DataFrame for caching. Calling count() (an action) triggers computation and stores the result in memory. Subsequent actions on df_events then skip the Delta source read entirely.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/']
    },
    {
        id: 'q-t5-cs2',
        topicId: 'topic-05',
        prompt: 'What does the VACUUM command with RETAIN 168 HOURS do to this Delta table?',
        type: 'single',
        codeSnippet: {
            language: 'sql',
            code: 'OPTIMIZE gold.events ZORDER BY (event_date);\n\nVACUUM gold.events RETAIN 168 HOURS;'
        },
        options: [
            { id: 'a', label: 'Deletes all live data rows older than 168 hours from the table' },
            { id: 'b', label: 'Retains the last 168 versions of the table for time travel' },
            { id: 'c', label: 'Removes orphaned data files no longer in the Delta log that are older than 7 days' },
            { id: 'd', label: 'Compacts all files into one Parquet file and keeps 168 backup copies' }
        ],
        correctOptionIds: ['c'],
        explanation:
            'VACUUM removes orphaned data files (no longer referenced in the Delta transaction log) older than the retention threshold. 168 hours = 7 days, so time travel within that window remains possible.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/delta/vacuum']
    },
    {
        id: 'q-t5-cs3',
        topicId: 'topic-05',
        prompt: 'These Spark configuration settings are applied before a large aggregation. What do they collectively enable?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'spark.conf.set("spark.sql.adaptive.enabled", "true")\nspark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")\nspark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")'
        },
        options: [
            { id: 'a', label: 'Adaptive Query Execution — re-optimises the query plan at runtime based on actual partition statistics' },
            { id: 'b', label: 'Broadcast joins for all tables regardless of size' },
            { id: 'c', label: 'Static partition pruning based on compile-time metadata' },
            { id: 'd', label: 'Delta Lake change data capture on the output table' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Adaptive Query Execution (AQE) collects runtime statistics from each stage and re-optimises the remainder of the query. coalescePartitions merges small shuffle partitions; skewJoin splits skewed partitions to reduce stragglers.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/aqe']
    },
    {
        id: 'q-t5-cs4',
        topicId: 'topic-05',
        prompt: 'What performance optimisation does the broadcast() hint provide in this Spark join?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'from pyspark.sql.functions import broadcast\n\nresult = df_orders.join(\n    broadcast(df_lookup_codes),\n    on="status_code",\n    how="left"\n)'
        },
        options: [
            { id: 'a', label: 'Shuffles df_orders across all worker nodes for a sort-merge join' },
            { id: 'b', label: 'Sends the smaller df_lookup_codes to every executor, avoiding a shuffle of the large table' },
            { id: 'c', label: 'Caches df_lookup_codes to DBFS for reuse across multiple jobs' },
            { id: 'd', label: 'Partitions df_orders by status_code to co-locate matching rows' }
        ],
        correctOptionIds: ['b'],
        explanation:
            'A broadcast join sends the smaller DataFrame to all executors in-memory, eliminating the expensive shuffle of the large df_orders table. Effective when the smaller table fits in executor memory (< 200 MB by default).',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/optimizations/']
    },
    {
        id: 'q-t5-cs5',
        topicId: 'topic-05',
        prompt: 'A cluster uses the Photon runtime as shown. Which workload type benefits most from Photon?',
        type: 'single',
        codeSnippet: {
            language: 'python',
            code: 'cluster = {\n    "cluster_name": "photon-prod",\n    "spark_version": "14.3.x-photon-scala2.12",\n    "node_type_id": "Standard_DS4_v2",\n    "num_workers": 8\n}'
        },
        options: [
            { id: 'a', label: 'Python UDFs and pandas-based transformations running on the driver' },
            { id: 'b', label: 'Machine learning model training using MLflow autologging' },
            { id: 'c', label: 'Streaming micro-batch jobs processing fewer than 100 records per second' },
            { id: 'd', label: 'SQL queries, DataFrame operations, and Delta Lake reads/writes using vectorised execution' }
        ],
        correctOptionIds: ['d'],
        explanation:
            'Photon is a vectorised query engine implemented in C++ that accelerates SQL and DataFrame operations on Delta Lake. It does not accelerate Python UDFs or ML training workloads, which execute outside the Photon engine.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/runtime/photon']
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
