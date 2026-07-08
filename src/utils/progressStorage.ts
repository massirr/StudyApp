import { ProgressStateV2, SubjectProgress } from '../types/study';

const STORAGE_KEY = 'studyapp_progress';
const DEFAULT_SUBJECT = 'dp-750';

export const emptySubjectProgress = (): SubjectProgress => ({
    completedTopicIds: [],
    completedSubtopicIds: {}
});

export const createDefaultProgressState = (): ProgressStateV2 => ({
    version: 2,
    subjects: {}
});

// Migrate any stored payload to v2. v1 (flat, single-subject) is wrapped under dp-750.
export function migrate(raw: unknown): ProgressStateV2 {
    if (typeof raw !== 'object' || raw === null) return createDefaultProgressState();
    const o = raw as Record<string, unknown>;

    if (o.version === 2 && typeof o.subjects === 'object' && o.subjects !== null) {
        return o as unknown as ProgressStateV2;
    }

    // v1 (flat) → wrap under dp-750
    if (Array.isArray(o.completedTopicIds)) {
        return {
            version: 2,
            subjects: {
                [DEFAULT_SUBJECT]: {
                    completedTopicIds: (o.completedTopicIds as unknown[]).filter(
                        (id): id is string => typeof id === 'string'
                    ),
                    completedSubtopicIds:
                        (o.completedSubtopicIds as Record<string, string[]>) ?? {},
                    lastVisitedTopicSlug:
                        typeof o.lastVisitedTopicSlug === 'string' ? o.lastVisitedTopicSlug : undefined
                }
            },
            preferences: o.preferences as ProgressStateV2['preferences']
        };
    }

    return createDefaultProgressState();
}

export const loadProgressState = (): ProgressStateV2 => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return migrate(raw ? JSON.parse(raw) : null);
    } catch {
        return createDefaultProgressState();
    }
};

export const saveProgressState = (state: ProgressStateV2): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const resetProgressState = (): ProgressStateV2 => {
    const next = createDefaultProgressState();
    saveProgressState(next);
    return next;
};

export const getSubjectProgress = (state: ProgressStateV2, subjectId: string): SubjectProgress =>
    state.subjects[subjectId] ?? emptySubjectProgress();
