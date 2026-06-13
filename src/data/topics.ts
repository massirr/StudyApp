import { Topic } from '../types/study';
import { assertOfficialMicrosoftUrls } from '../utils/contentValidation';

export const TOPICS: Topic[] = [
    {
        id: 'topic-01',
        slug: 'plan-and-design-azure-databricks-workloads',
        title: 'Plan and Design Azure Databricks Workloads',
        summary:
            'Design secure, scalable data engineering architectures and workspace patterns for DP-750 objectives.',
        studyOrder: 1,
        subtopics: [
            {
                id: 't1-s1',
                title: 'Choose Workspace and Compute Strategy',
                summary: 'Select cluster and workspace patterns for development and production.'
            },
            {
                id: 't1-s2',
                title: 'Design for Governance',
                summary: 'Plan governance boundaries early with catalogs, schemas, and permissions.'
            }
        ],
        sourceLinks: [
            {
                label: 'DP-750 Course',
                url: 'https://learn.microsoft.com/en-us/training/courses/dp-750t00'
            },
            {
                label: 'Azure Databricks Documentation',
                url: 'https://learn.microsoft.com/en-us/azure/databricks/'
            }
        ]
    },
    {
        id: 'topic-02',
        slug: 'ingest-and-transform-data',
        title: 'Ingest and Transform Data',
        summary:
            'Build batch and streaming ingestion pipelines and transform data with Databricks tools and SQL.',
        studyOrder: 2,
        subtopics: [
            {
                id: 't2-s1',
                title: 'Batch and Streaming Ingestion',
                summary: 'Compare ingestion patterns and select the right approach for workload needs.'
            },
            {
                id: 't2-s2',
                title: 'Transformation Patterns',
                summary: 'Apply joins, aggregations, and schema evolution safely.'
            }
        ],
        sourceLinks: [
            {
                label: 'Azure Databricks Ingestion',
                url: 'https://learn.microsoft.com/en-us/azure/databricks/ingestion/'
            },
            {
                label: 'Azure Data Factory Introduction',
                url: 'https://learn.microsoft.com/en-us/azure/data-factory/introduction'
            }
        ]
    },
    {
        id: 'topic-03',
        slug: 'implement-and-manage-data-governance',
        title: 'Implement and Manage Data Governance',
        summary:
            'Use Unity Catalog and access controls to secure data assets and enforce governance standards.',
        studyOrder: 3,
        subtopics: [
            {
                id: 't3-s1',
                title: 'Unity Catalog Fundamentals',
                summary: 'Understand catalog, schema, table, and permission structures.'
            },
            {
                id: 't3-s2',
                title: 'Access Controls and Secrets',
                summary: 'Apply role-based permissions and secure sensitive configuration data.'
            }
        ],
        sourceLinks: [
            {
                label: 'Unity Catalog Overview',
                url: 'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
            },
            {
                label: 'Microsoft Entra Overview',
                url: 'https://learn.microsoft.com/en-us/entra/'
            }
        ]
    },
    {
        id: 'topic-04',
        slug: 'build-and-operate-data-pipelines',
        title: 'Build and Operate Data Pipelines',
        summary:
            'Create, schedule, and operate robust data engineering workflows using Databricks jobs and pipeline patterns.',
        studyOrder: 4,
        subtopics: [
            {
                id: 't4-s1',
                title: 'Job Orchestration',
                summary: 'Configure dependencies, retries, and operational safeguards.'
            },
            {
                id: 't4-s2',
                title: 'Operational Reliability',
                summary: 'Design for recoverability and maintainability in recurring pipelines.'
            }
        ],
        sourceLinks: [
            {
                label: 'Azure Databricks Jobs',
                url: 'https://learn.microsoft.com/en-us/azure/databricks/jobs/'
            },
            {
                label: 'Azure Monitor Overview',
                url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview'
            }
        ]
    },
    {
        id: 'topic-05',
        slug: 'monitor-and-optimize-workloads',
        title: 'Monitor and Optimize Workloads',
        summary:
            'Track workload behavior, diagnose bottlenecks, and optimize performance and cost for data engineering pipelines.',
        studyOrder: 5,
        subtopics: [
            {
                id: 't5-s1',
                title: 'Monitoring and Alerts',
                summary: 'Use platform telemetry to detect and respond to pipeline issues.'
            },
            {
                id: 't5-s2',
                title: 'Performance Optimization',
                summary: 'Tune compute and query behavior to improve throughput and reliability.'
            }
        ],
        sourceLinks: [
            {
                label: 'Azure Databricks Performance',
                url: 'https://learn.microsoft.com/en-us/azure/databricks/optimizations/'
            },
            {
                label: 'Azure Monitor Fundamentals',
                url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview'
            }
        ]
    }
].sort((a, b) => a.studyOrder - b.studyOrder);

TOPICS.forEach((topic) => {
    assertOfficialMicrosoftUrls(
        topic.sourceLinks.map((source) => source.url),
        `Topic ${topic.slug}`
    );
});

export const getTopicBySlug = (slug: string): Topic | undefined =>
    TOPICS.find((topic) => topic.slug === slug);
