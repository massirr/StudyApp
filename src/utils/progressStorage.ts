import { ProgressState } from '../types/study';

const STORAGE_KEY = 'studyapp_progress';
const STORAGE_VERSION = 1;

export const createDefaultProgressState = (): ProgressState => ({
    version: STORAGE_VERSION,
    completedTopicIds: [],
    completedSubtopicIds: {},
    lastVisitedTopicSlug: undefined,
    preferences: {
        compactMode: false,
        showCompletedTopics: true
    }
});

const normalize = (value: unknown): ProgressState => {
    if (!value || typeof value !== 'object') {
        return createDefaultProgressState();
    }

    const incoming = value as Partial<ProgressState>;
    return {
        version: STORAGE_VERSION,
        completedTopicIds: Array.isArray(incoming.completedTopicIds)
            ? incoming.completedTopicIds.filter((id): id is string => typeof id === 'string')
            : [],
        completedSubtopicIds:
            incoming.completedSubtopicIds && typeof incoming.completedSubtopicIds === 'object'
                ? incoming.completedSubtopicIds
                : {},
        lastVisitedTopicSlug:
            typeof incoming.lastVisitedTopicSlug === 'string'
                ? incoming.lastVisitedTopicSlug
                : undefined,
        preferences:
            incoming.preferences && typeof incoming.preferences === 'object'
                ? incoming.preferences
                : createDefaultProgressState().preferences
    };
};

export const loadProgressState = (): ProgressState => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return createDefaultProgressState();
        }

        return normalize(JSON.parse(raw));
    } catch {
        return createDefaultProgressState();
    }
};

export const saveProgressState = (state: ProgressState): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalize(state)));
};

export const resetProgressState = (): ProgressState => {
    const next = createDefaultProgressState();
    saveProgressState(next);
    return next;
};
