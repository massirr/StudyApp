import React, { createContext, useCallback, useMemo, useState } from 'react';
import { ProgressState } from '../types/study';
import {
    createDefaultProgressState,
    loadProgressState,
    resetProgressState,
    saveProgressState
} from '../utils/progressStorage';

interface ProgressContextValue {
    progress: ProgressState;
    toggleTopicComplete: (topicId: string) => void;
    markTopicComplete: (topicId: string) => void;
    setLastVisitedTopic: (topicSlug: string) => void;
    resetProgress: () => void;
}

export const ProgressContext = createContext<ProgressContextValue | undefined>(
    undefined
);

interface ProgressProviderProps {
    children: React.ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
    const [progress, setProgress] = useState<ProgressState>(() => {
        if (typeof window === 'undefined') {
            return createDefaultProgressState();
        }

        return loadProgressState();
    });

    const commit = useCallback((next: ProgressState) => {
        setProgress(next);
        saveProgressState(next);
    }, []);

    const toggleTopicComplete = useCallback(
        (topicId: string) => {
            const alreadyCompleted = progress.completedTopicIds.includes(topicId);
            const completedTopicIds = alreadyCompleted
                ? progress.completedTopicIds.filter((id) => id !== topicId)
                : [...progress.completedTopicIds, topicId];

            commit({
                ...progress,
                completedTopicIds
            });
        },
        [commit, progress]
    );

    const markTopicComplete = useCallback(
        (topicId: string) => {
            if (progress.completedTopicIds.includes(topicId)) {
                return;
            }
            commit({
                ...progress,
                completedTopicIds: [...progress.completedTopicIds, topicId]
            });
        },
        [commit, progress]
    );

    const setLastVisitedTopic = useCallback(
        (topicSlug: string) => {
            if (progress.lastVisitedTopicSlug === topicSlug) {
                return;
            }

            commit({
                ...progress,
                lastVisitedTopicSlug: topicSlug
            });
        },
        [commit, progress]
    );

    const resetProgress = useCallback(() => {
        const next = resetProgressState();
        setProgress(next);
    }, []);

    const value = useMemo(
        () => ({ progress, toggleTopicComplete, markTopicComplete, setLastVisitedTopic, resetProgress }),
        [progress, toggleTopicComplete, markTopicComplete, setLastVisitedTopic, resetProgress]
    );

    return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
