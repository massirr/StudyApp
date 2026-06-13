import { ContentNote } from '../types/study';
import { assertOfficialMicrosoftUrls } from '../utils/contentValidation';

export const CONTENT_NOTES: ContentNote[] = [
    {
        id: 'note-t1-1',
        topicId: 'topic-01',
        text: 'Start by defining workload boundaries and governance needs before selecting compute and workspace patterns.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/training/courses/dp-750t00',
            'https://learn.microsoft.com/en-us/azure/databricks/'
        ]
    },
    {
        id: 'note-t2-1',
        topicId: 'topic-02',
        text: 'Batch and streaming ingestion patterns can coexist in one data platform when orchestration and contracts are explicit.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/data-factory/introduction',
            'https://learn.microsoft.com/en-us/azure/databricks/ingestion/'
        ]
    },
    {
        id: 'note-t3-1',
        topicId: 'topic-03',
        text: 'Use Unity Catalog as the central governance layer to enforce access boundaries consistently.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
        ]
    },
    {
        id: 'note-t4-1',
        topicId: 'topic-04',
        text: 'Pipeline reliability improves when jobs are designed with retries, dependencies, and clear run-state monitoring.',
        sourceUrls: ['https://learn.microsoft.com/en-us/azure/databricks/jobs/']
    },
    {
        id: 'note-t5-1',
        topicId: 'topic-05',
        text: 'Optimization decisions should be based on workload telemetry and bottleneck evidence, not assumptions.',
        sourceUrls: [
            'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview',
            'https://learn.microsoft.com/en-us/azure/databricks/optimizations/'
        ]
    }
];

CONTENT_NOTES.forEach((note) => {
    assertOfficialMicrosoftUrls(note.sourceUrls, `Content note ${note.id}`);
});

export const getContentNotesForTopic = (topicId: string): ContentNote[] =>
    CONTENT_NOTES.filter((note) => note.topicId === topicId);
