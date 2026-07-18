import React from 'react';
import { Subject } from '../types/study';
import { getQuestionCountForTopic } from '../data/subjects';
import { useProgress } from '../hooks/useProgress';
import { getResumeTopicSlug } from '../utils/resumeTopic';
import { PixelLogo } from '../components/common/PixelLogo';

interface DashboardPageProps {
    subject: Subject;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ subject }) => {
    const { progress, toggleTopicComplete, resetProgress } = useProgress(subject.id);

    const completedCount = progress.completedTopicIds.length;
    const totalCount = subject.topics.length;
    const remainingCount = totalCount - completedCount;
    const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const resumeTopicSlug = getResumeTopicSlug({
        topics: subject.topics,
        completedTopicIds: progress.completedTopicIds,
        lastVisitedTopicSlug: progress.lastVisitedTopicSlug
    });

    return (
        <section aria-label="Dashboard" className="dashboard-page">
            <header>
                <PixelLogo text={subject.shortLabel} />
                <p className="dashboard-subtitle">{subject.tagline}</p>
            </header>

            <div className="dashboard-stats" role="status" aria-live="polite">
                <div className="stat-card">
                    <span className="stat-label">Completed</span>
                    <strong>{completedCount}</strong>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Remaining</span>
                    <strong>{remainingCount}</strong>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Progress</span>
                    <strong>{completionPercent}%</strong>
                </div>
            </div>

            <div className="dashboard-actions">
                {resumeTopicSlug ? (
                    <a className="primary-button" href={`/${subject.slug}/topics/${resumeTopicSlug}`}>
                        Resume Study
                    </a>
                ) : (
                    <p className="complete-state">All topics completed. Great work.</p>
                )}
                <button type="button" className="secondary-button" onClick={resetProgress}>
                    Reset Progress
                </button>
            </div>

            <ul className="topics-list">
                {subject.topics.map((topic) => {
                    const completed = progress.completedTopicIds.includes(topic.id);
                    const questionCount = getQuestionCountForTopic(subject, topic.id);
                    return (
                        <li key={topic.id} className="topic-card">
                            <div>
                                <h2>
                                    <a href={`/${subject.slug}/topics/${topic.slug}`}>{topic.title}</a>
                                </h2>
                                <p className="topic-summary">{topic.summary}</p>
                            </div>
                            <div className="topic-controls">
                                <span className="topic-count">{questionCount} Q</span>
                                <span className={completed ? 'pill completed' : 'pill pending'}>
                                    {completed ? 'Completed' : 'In Progress'}
                                </span>
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => toggleTopicComplete(topic.id)}
                                >
                                    {completed ? 'Mark Incomplete' : 'Mark Complete'}
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default DashboardPage;
