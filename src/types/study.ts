import { QuizQuestion } from './quiz';

export interface SourceLink {
    label: string;
    url: string;
}

export interface SourceReference {
    id: string;
    label: string;
    url: string;
    usageNote: string;
}

export interface ContentNote {
    id: string;
    topicId: string;
    text: string;
    sourceUrls: string[];
}

export interface Subtopic {
    id: string;
    title: string;
    summary: string;
}

export interface Topic {
    id: string;
    slug: string;
    title: string;
    summary: string;
    subtopics: Subtopic[];
    sourceLinks: SourceLink[];
    studyOrder: number;
    // Optional study media shown above the topic's question deck.
    passage?: { title?: string; text: string };
    audio?: { src: string; title?: string };
}

export interface ProgressPreferences {
    compactMode?: boolean;
    showCompletedTopics?: boolean;
}

export interface ProgressState {
    version: number;
    completedTopicIds: string[];
    completedSubtopicIds: Record<string, string[]>;
    lastVisitedTopicSlug?: string;
    preferences?: ProgressPreferences;
}

export type SourcePolicy = 'microsoft-only' | 'any';

export interface Subject {
    id: string;
    slug: string;
    name: string;
    shortLabel: string; // pixel hero; A-Z 0-9 hyphen space only
    tagline: string;
    sourcePolicy?: SourcePolicy; // defaults to 'any'
    sources: SourceReference[];
    topics: Topic[];
    questions: QuizQuestion[];
    notes: ContentNote[];
}

export interface SubjectProgress {
    completedTopicIds: string[];
    completedSubtopicIds: Record<string, string[]>;
    lastVisitedTopicSlug?: string;
    // Topic ids whose Level 1 quiz was passed at >=70%, which unlocks Level 2.
    level2UnlockedTopicIds?: string[];
}

export interface ProgressStateV2 {
    version: 2;
    subjects: Record<string, SubjectProgress>;
    preferences?: ProgressPreferences;
}
