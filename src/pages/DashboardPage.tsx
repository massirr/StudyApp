import React from 'react';
import { TOPICS } from '../data/topics';
import { getQuestionCountForTopic } from '../data/questions';
import { useProgress } from '../hooks/useProgress';
import { getResumeTopicSlug } from '../utils/resumeTopic';
import { PixelLogo } from '../components/common/PixelLogo';
import { DashboardBg } from '../components/common/DashboardBg';

const DashboardPage: React.FC = () => {
    const { progress, toggleTopicComplete, resetProgress } = useProgress();

    const completedCount = progress.completedTopicIds.length;
    const totalCount = TOPICS.length;
    const remainingCount = totalCount - completedCount;
    const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const resumeTopicSlug = getResumeTopicSlug({
        topics: TOPICS,
        completedTopicIds: progress.completedTopicIds,
        lastVisitedTopicSlug: progress.lastVisitedTopicSlug
    });

    return (
        <section aria-label="Dashboard" className="dashboard-page" style={{ position: 'relative', zIndex: 0 }}>
            <DashboardBg />
            <header>
                <PixelLogo />
                <p className="dashboard-subtitle">
                    Follow your topic path, resume where you left off, and keep progress in this browser.
                </p>
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
                    <a className="primary-button" href={`/topics/${resumeTopicSlug}`}>
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
                {TOPICS.map((topic) => {
                    const completed = progress.completedTopicIds.includes(topic.id);
                    const questionCount = getQuestionCountForTopic(topic.id);
                    return (
                        <li key={topic.id} className="topic-card">
                            <div>
                                <h2>
                                    <a href={`/topics/${topic.slug}`}>{topic.title}</a>
                                </h2>
                                <p>{topic.summary}</p>
                                <p>
                                    This topic will have {questionCount} {questionCount === 1 ? 'question' : 'questions'}.
                                </p>
                            </div>
                            <div className="topic-controls">
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
