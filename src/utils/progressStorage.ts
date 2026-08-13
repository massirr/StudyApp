import { ProgressStateV2, QuizAttempt, SubjectProgress } from '../types/study';

const STORAGE_KEY = 'studyapp_progress';
const DEFAULT_SUBJECT = 'dp-750';

/** Most recent attempts kept per topic. 7 topics x 20 x ~60 bytes is negligible
 *  against localStorage, while an uncapped list grows on every retake. */
export const ATTEMPT_LIMIT = 20;

/** Two identical writes closer together than this are the same finish, not two
 *  retakes — see appendAttempt. */
const DUPLICATE_WINDOW_MS = 2000;

const isAttempt = (a: unknown): a is QuizAttempt => {
    if (typeof a !== 'object' || a === null) return false;
    const o = a as Record<string, unknown>;
    return (
        typeof o.finishedAt === 'string' &&
        typeof o.correct === 'number' &&
        typeof o.total === 'number' &&
        typeof o.percent === 'number'
    );
};

/** Attempts for a topic, oldest first. Anything malformed reads as empty rather
 *  than throwing — bad stored data must never cost the learner their progress. */
export const readAttempts = (progress: SubjectProgress, topicId: string): QuizAttempt[] => {
    const all = progress.attempts;
    if (typeof all !== 'object' || all === null) return [];
    const list = (all as Record<string, unknown>)[topicId];
    return Array.isArray(list) ? list.filter(isAttempt) : [];
};

export const bestAttempt = (attempts: QuizAttempt[]): QuizAttempt | undefined =>
    attempts.reduce<QuizAttempt | undefined>(
        (best, a) => (best === undefined || a.percent > best.percent ? a : best),
        undefined
    );

export const latestAttempt = (attempts: QuizAttempt[]): QuizAttempt | undefined =>
    attempts.length > 0 ? attempts[attempts.length - 1] : undefined;

/**
 * Appends an attempt, capping the topic's history and refusing an exact repeat
 * of the most recent one. The duplicate guard lives here rather than in the
 * component because React StrictMode double-invokes effects in development, and
 * a guard in the store protects every caller instead of one component instance.
 */
export const appendAttempt = (
    progress: SubjectProgress,
    topicId: string,
    attempt: QuizAttempt
): SubjectProgress => {
    const existing = readAttempts(progress, topicId);
    const last = latestAttempt(existing);
    if (last && last.correct === attempt.correct && last.total === attempt.total) {
        const gapMs = Date.parse(attempt.finishedAt) - Date.parse(last.finishedAt);
        if (Number.isFinite(gapMs) && gapMs >= 0 && gapMs < DUPLICATE_WINDOW_MS) return progress;
    }

    return {
        ...progress,
        attempts: {
            ...(typeof progress.attempts === 'object' && progress.attempts !== null
                ? progress.attempts
                : {}),
            [topicId]: [...existing, attempt].slice(-ATTEMPT_LIMIT)
        }
    };
};

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
