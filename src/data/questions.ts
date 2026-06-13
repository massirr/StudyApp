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
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
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
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/']
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
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
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
            'https://learn.microsoft.com/en-us/azure/databricks/'
        ]
    },
    {
        id: 'q-t1-5',
        topicId: 'topic-01',
        prompt: 'What does a metastore in Unity Catalog provide?',
        type: 'single',
        options: [
            { id: 'a', label: 'A central metadata and governance layer for data assets' },
            { id: 'b', label: 'A replacement for all SQL queries' },
            { id: 'c', label: 'A browser extension for notebooks' }
        ],
        correctOptionIds: ['a'],
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
            { id: 'a', label: 'Use separate catalogs and permissions per domain' },
            { id: 'b', label: 'Store all assets in one unrestricted schema' },
            { id: 'c', label: 'Disable access control reviews' }
        ],
        correctOptionIds: ['a'],
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
            { id: 'a', label: 'Run production jobs on dedicated job clusters' },
            { id: 'b', label: 'Share one all-purpose cluster with all developers' },
            { id: 'c', label: 'Run all workloads manually' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Dedicated job clusters isolate production execution from interactive development workloads.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
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
            'https://learn.microsoft.com/en-us/azure/databricks/',
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
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/']
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
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/']
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
            { id: 'a', label: 'To keep data quality and downstream transformations stable' },
            { id: 'b', label: 'To disable all transformations' },
            { id: 'c', label: 'To avoid using source systems' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Schema handling reduces pipeline failures and supports controlled evolution in production systems.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/']
    },
    {
        id: 'q-t2-5',
        topicId: 'topic-02',
        prompt: 'Which statement best describes batch ingestion?',
        type: 'single',
        options: [
            { id: 'a', label: 'Processes data at scheduled intervals' },
            { id: 'b', label: 'Always processes every event instantly' },
            { id: 'c', label: 'Cannot be automated' }
        ],
        correctOptionIds: ['a'],
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
            { id: 'a', label: 'Streaming ingestion with reliable state handling' },
            { id: 'b', label: 'Monthly manual CSV uploads only' },
            { id: 'c', label: 'No ingestion scheduling' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Near real-time reporting usually requires streaming-oriented ingestion and resilient processing.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/']
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
            { id: 'a', label: 'Controlled schema evolution and validation' },
            { id: 'b', label: 'Ignore all schema metadata forever' },
            { id: 'c', label: 'Disable data quality checks permanently' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Schema evolution strategy is critical for resilient ingestion when source contracts change.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/ingestion/']
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
            { id: 'a', label: 'Grant only the minimum required permissions' },
            { id: 'b', label: 'Assign full admin rights to all users' },
            { id: 'c', label: 'Use no access controls' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Least privilege limits risk by granting only permissions needed for a role.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
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
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
    },
    {
        id: 'q-t3-4',
        topicId: 'topic-03',
        prompt: 'Which identity platform is commonly used with Azure services for authentication and authorization?',
        type: 'single',
        options: [
            { id: 'a', label: 'Microsoft Entra ID' },
            { id: 'b', label: 'A local spreadsheet only' },
            { id: 'c', label: 'Browser bookmarks' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Microsoft Entra provides identity and access capabilities across Azure workloads.',
        sourceUrls: ['https://learn.microsoft.com/en-us/entra/']
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
            { id: 'a', label: 'Centralized governance model with explicit grants' },
            { id: 'b', label: 'Shared credentials and undocumented access' },
            { id: 'c', label: 'No defined data ownership' }
        ],
        correctOptionIds: ['a'],
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
            { id: 'a', label: 'Grant minimum required permissions for the role' },
            { id: 'b', label: 'Grant full admin rights for convenience' },
            { id: 'c', label: 'Avoid role-based access controls' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Least privilege grants only what is required for a defined responsibility.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
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
            { id: 'a', label: 'Microsoft Entra ID' },
            { id: 'b', label: 'A spreadsheet on a shared drive' },
            { id: 'c', label: 'Local browser settings' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Microsoft Entra provides centralized identity and access management capabilities.',
        sourceUrls: ['https://learn.microsoft.com/en-us/entra/']
    },
    {
        id: 'q-t3-10',
        topicId: 'topic-03',
        prompt: 'Scenario: A team requests direct table grants without schema governance. What is the governance risk?',
        type: 'single',
        options: [
            { id: 'a', label: 'Inconsistent access patterns and weaker control boundaries' },
            { id: 'b', label: 'Guaranteed stronger governance outcomes' },
            { id: 'c', label: 'No impact to compliance posture' }
        ],
        correctOptionIds: ['a'],
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
            { id: 'a', label: 'They enforce execution order between related tasks' },
            { id: 'b', label: 'They eliminate all failures permanently' },
            { id: 'c', label: 'They remove the need for source data' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Dependencies model data and process order so downstream tasks run only after prerequisites succeed.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
    },
    {
        id: 'q-t4-3',
        topicId: 'topic-04',
        prompt: 'Which feature improves reliability for transient failures in scheduled jobs?',
        type: 'single',
        options: [
            { id: 'a', label: 'Retry policies' },
            { id: 'b', label: 'Removing monitoring' },
            { id: 'c', label: 'Disabling logs' }
        ],
        correctOptionIds: ['a'],
        explanation:
            'Retries help recover from temporary issues without manual intervention.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
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
            { id: 'a', label: 'Consistent, repeatable execution with observability' },
            { id: 'b', label: 'Frequent manual restarts for every run' },
            { id: 'c', label: 'No logging to reduce storage' }
        ],
        correctOptionIds: ['a'],
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
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
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
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
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
            { id: 'a', label: 'Operational telemetry and job run metrics' },
            { id: 'b', label: 'Personal memory of past runs' },
            { id: 'c', label: 'No historical run records' }
        ],
        correctOptionIds: ['a'],
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
            { id: 'a', label: 'Add validation gates before dependent tasks run' },
            { id: 'b', label: 'Increase downstream retries indefinitely' },
            { id: 'c', label: 'Hide failure alerts from operators' }
        ],
        correctOptionIds: ['a'],
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
            { id: 'a', label: 'Improve throughput and efficiency for data processing' },
            { id: 'b', label: 'Make all queries intentionally slower' },
            { id: 'c', label: 'Avoid using compute resources entirely' }
        ],
        correctOptionIds: ['a'],
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
            { id: 'a', label: 'They notify teams when critical thresholds are breached' },
            { id: 'b', label: 'They replace all logging and dashboards' },
            { id: 'c', label: 'They only apply to local desktop apps' }
        ],
        correctOptionIds: ['a'],
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
            { id: 'a', label: 'Review telemetry and optimize based on measured bottlenecks' },
            { id: 'b', label: 'Disable all monitoring' },
            { id: 'c', label: 'Assume the issue resolves itself without analysis' }
        ],
        correctOptionIds: ['a'],
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
            { id: 'a', label: 'Alert rules tied to critical metrics and logs' },
            { id: 'b', label: 'Manual daily visual checks only' },
            { id: 'c', label: 'Silencing failure notifications' }
        ],
        correctOptionIds: ['a'],
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
            { id: 'a', label: 'Actionable dashboards and well-scoped alerts' },
            { id: 'b', label: 'Disabling historical logs' },
            { id: 'c', label: 'Removing all threshold rules' }
        ],
        correctOptionIds: ['a'],
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
    NORMALIZED_QUESTION_BANK.filter((question) => question.topicId === topicId);

export const getQuestionCountForTopic = (topicId: string): number =>
    getQuestionsForTopic(topicId).length;

export const getAllQuestions = (): QuizQuestion[] => NORMALIZED_QUESTION_BANK;
