import { Topic } from '../types/study';

interface ResumeInputs {
    topics: Topic[];
    completedTopicIds: string[];
    lastVisitedTopicSlug?: string;
}

export const getResumeTopicSlug = ({
    topics,
    completedTopicIds,
    lastVisitedTopicSlug
}: ResumeInputs): string | undefined => {
    const isCompleted = (topicId: string): boolean => completedTopicIds.includes(topicId);

    if (lastVisitedTopicSlug) {
        const lastVisited = topics.find((topic) => topic.slug === lastVisitedTopicSlug);
        if (lastVisited && !isCompleted(lastVisited.id)) {
            return lastVisited.slug;
        }
    }

    const firstIncomplete = topics.find((topic) => !isCompleted(topic.id));
    return firstIncomplete?.slug;
};
