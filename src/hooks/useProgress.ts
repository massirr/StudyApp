import { useContext } from 'react';
import { ProgressContext } from '../context/ProgressContext';
import { emptySubjectProgress } from '../utils/progressStorage';

export const useProgress = (subjectId: string) => {
    const ctx = useContext(ProgressContext);
    if (!ctx) {
        throw new Error('useProgress must be used within ProgressProvider');
    }

    const progress = ctx.state.subjects[subjectId] ?? emptySubjectProgress();

    return {
        progress,
        toggleTopicComplete: (topicId: string) =>
            ctx.updateSubject(subjectId, (p) => ({
                ...p,
                completedTopicIds: p.completedTopicIds.includes(topicId)
                    ? p.completedTopicIds.filter((id) => id !== topicId)
                    : [...p.completedTopicIds, topicId]
            })),
        markTopicComplete: (topicId: string) =>
            ctx.updateSubject(subjectId, (p) =>
                p.completedTopicIds.includes(topicId)
                    ? p
                    : { ...p, completedTopicIds: [...p.completedTopicIds, topicId] }
            ),
        markLevel2Unlocked: (topicId: string) =>
            ctx.updateSubject(subjectId, (p) =>
                (p.level2UnlockedTopicIds ?? []).includes(topicId)
                    ? p
                    : { ...p, level2UnlockedTopicIds: [...(p.level2UnlockedTopicIds ?? []), topicId] }
            ),
        setLastVisitedTopic: (slug: string) =>
            ctx.updateSubject(subjectId, (p) =>
                p.lastVisitedTopicSlug === slug ? p : { ...p, lastVisitedTopicSlug: slug }
            ),
        resetProgress: ctx.resetProgress
    };
};
