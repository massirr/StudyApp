import { SourceReference } from '../types/study';
import { assertOfficialMicrosoftUrls } from '../utils/contentValidation';

export const SOURCES: SourceReference[] = [
    {
        id: 'src-dp750-course',
        label: 'DP-750 Course',
        url: 'https://learn.microsoft.com/en-us/training/courses/dp-750t00',
        usageNote: 'Primary exam-aligned course outline and learning path context.'
    },
    {
        id: 'src-databricks-docs',
        label: 'Azure Databricks Documentation',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/',
        usageNote: 'Reference for Databricks architecture, governance, jobs, and optimization.'
    },
    {
        id: 'src-databricks-unity-catalog',
        label: 'Unity Catalog Overview',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/',
        usageNote: 'Governance model for catalogs, schemas, permissions, and data security.'
    },
    {
        id: 'src-databricks-ingestion',
        label: 'Azure Databricks Ingestion',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/ingestion/',
        usageNote: 'Batch and streaming ingestion approaches in Databricks.'
    },
    {
        id: 'src-adf-intro',
        label: 'Azure Data Factory Introduction',
        url: 'https://learn.microsoft.com/en-us/azure/data-factory/introduction',
        usageNote: 'Orchestration and movement patterns for cloud data pipelines.'
    },
    {
        id: 'src-entra',
        label: 'Microsoft Entra Overview',
        url: 'https://learn.microsoft.com/en-us/entra/',
        usageNote: 'Identity and access context for secure data engineering operations.'
    },
    {
        id: 'src-databricks-jobs',
        label: 'Azure Databricks Jobs',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/jobs/',
        usageNote: 'Task orchestration and scheduling for pipelines and workloads.'
    },
    {
        id: 'src-monitor-overview',
        label: 'Azure Monitor Overview',
        url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview',
        usageNote: 'Monitoring, alerting, and observability fundamentals.'
    },
    {
        id: 'src-databricks-optimizations',
        label: 'Azure Databricks Performance',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/optimizations/',
        usageNote: 'Performance and cost optimization guidance for Databricks workloads.'
    },
    {
        id: 'src-databricks-unity-catalog-securable',
        label: 'Unity Catalog Securable Objects',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/securable-objects',
        usageNote: 'Three-level namespace (catalog.schema.object) and securable object hierarchy in Unity Catalog.'
    },
    {
        id: 'src-databricks-unity-catalog-permissions',
        label: 'Unity Catalog Permissions Model',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/access-control/permissions-concepts',
        usageNote: 'Least-privilege access control, privilege inheritance, and permission grants in Unity Catalog.'
    },
    {
        id: 'src-databricks-workspace-strategy',
        label: 'Azure Databricks Workspace Strategy',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/lakehouse-architecture/deployment-guide/workspace-strategy',
        usageNote: 'Dev/prod workspace separation, SDLC isolation, and workspace architecture design.'
    },
    {
        id: 'src-databricks-jobs-classic',
        label: 'Configure Classic Compute for Jobs',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/jobs/run-classic-jobs',
        usageNote: 'Job clusters vs all-purpose clusters for production pipelines; compute isolation guidance.'
    },
    {
        id: 'src-databricks-jobs-run-if',
        label: 'Databricks Jobs Task Dependencies',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/jobs/run-if',
        usageNote: 'Task dependencies and conditional execution flow in Databricks Jobs.'
    },
    {
        id: 'src-databricks-jobs-configure',
        label: 'Configure Lakeflow Jobs',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/jobs/configure-job',
        usageNote: 'Job creation, retry policies, scheduling, and production job configuration.'
    },
    {
        id: 'src-databricks-streaming-concepts',
        label: 'Structured Streaming Concepts',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/structured-streaming/concepts',
        usageNote: 'Near real-time streaming, checkpointing, fault tolerance, and streaming pipeline design.'
    },
    {
        id: 'src-databricks-autoloader',
        label: 'Auto Loader for Cloud Object Storage',
        url: 'https://learn.microsoft.com/en-us/azure/databricks/ingestion/cloud-object-storage/auto-loader/',
        usageNote: 'Schema inference, schema evolution, and incremental file ingestion with Auto Loader.'
    },
    {
        id: 'src-entra-fundamentals',
        label: 'What is Microsoft Entra?',
        url: 'https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra',
        usageNote: 'Microsoft Entra ID fundamentals: identity lifecycle, authentication, and access management.'
    }
];

assertOfficialMicrosoftUrls(
    SOURCES.map((source) => source.url),
    'Source registry'
);

export const getSourceByUrl = (url: string): SourceReference | undefined =>
    SOURCES.find((source) => source.url === url);
