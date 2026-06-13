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
    }
];

assertOfficialMicrosoftUrls(
    SOURCES.map((source) => source.url),
    'Source registry'
);

export const getSourceByUrl = (url: string): SourceReference | undefined =>
    SOURCES.find((source) => source.url === url);
