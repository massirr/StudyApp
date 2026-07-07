import React, { createContext, useCallback, useMemo, useState } from 'react';
import { ProgressStateV2, SubjectProgress } from '../types/study';
import {
    createDefaultProgressState,
    emptySubjectProgress,
    loadProgressState,
    resetProgressState,
    saveProgressState
} from '../utils/progressStorage';

interface ProgressContextValue {
    state: ProgressStateV2;
    updateSubject: (subjectId: string, fn: (p: SubjectProgress) => SubjectProgress) => void;
    resetProgress: () => void;
}

export const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

interface ProgressProviderProps {
    children: React.ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
    const [state, setState] = useState<ProgressStateV2>(() => {
        if (typeof window === 'undefined') {
            return createDefaultProgressState();
        }
        return loadProgressState();
    });

    const updateSubject = useCallback(
        (subjectId: string, fn: (p: SubjectProgress) => SubjectProgress) => {
            setState((prev) => {
                const current = prev.subjects[subjectId] ?? emptySubjectProgress();
                const next: ProgressStateV2 = {
                    ...prev,
                    subjects: { ...prev.subjects, [subjectId]: fn(current) }
                };
                saveProgressState(next);
                return next;
            });
        },
        []
    );

    const resetProgress = useCallback(() => {
        setState(resetProgressState());
    }, []);

    const value = useMemo(
        () => ({ state, updateSubject, resetProgress }),
        [state, updateSubject, resetProgress]
    );

    return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
