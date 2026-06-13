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
