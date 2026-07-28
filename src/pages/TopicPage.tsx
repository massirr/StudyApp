import React, { useEffect } from 'react';
import { getCodeSnippetQuestionsForTopic, getContentNotesForTopic, getQuestionCountForTopic, getSourceByUrl } from '../data/subjects';
import { Subject, Topic } from '../types/study';
import { useProgress } from '../hooks/useProgress';

interface TopicPageProps {
    subject: Subject;
    topic: Topic;
}

const TopicPage: React.FC<TopicPageProps> = ({ subject, topic }) => {
    const { progress, setLastVisitedTopic } = useProgress(subject.id);
    const notes = getContentNotesForTopic(subject, topic.id);
    const questionCount = getQuestionCountForTopic(subject, topic.id);
    const level2Count = getCodeSnippetQuestionsForTopic(subject, topic.id).length;
    const level2Unlocked = (progress.level2UnlockedTopicIds ?? []).includes(topic.id);

    useEffect(() => {
        setLastVisitedTopic(topic.slug);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topic.slug]);

    return (
        <section className="topic-page" aria-label={`Topic ${topic.title}`}>
            <nav className="breadcrumbs" aria-label="Breadcrumbs">
                <a href={`/${subject.slug}`}>Dashboard</a>
                <span>/</span>
                <span>{topic.title}</span>
            </nav>

            <header className="topic-header-block">
                <h1>{topic.title}</h1>
                <p>{topic.summary}</p>
            </header>

            <section className="topic-section">
                <h2>Subtopics</h2>
                <ul className="subtopic-list">
                    {topic.subtopics.map((subtopic) => (
                        <li key={subtopic.id}>
                            <h3>{subtopic.title}</h3>
                            <p>{subtopic.summary}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="topic-section">
                <h2>{subject.sourcePolicy === 'microsoft-only' ? 'Official Microsoft Sources' : 'Sources'}</h2>
                <ul className="source-list">
                    {topic.sourceLinks.map((source) => {
                        const sourceRef = getSourceByUrl(subject, source.url);
                        return (
                            <li key={source.url}>
                                <a href={source.url} target="_blank" rel="noreferrer">
                                    {source.label}
                                </a>
                                {sourceRef?.usageNote && <p>{sourceRef.usageNote}</p>}
                            </li>
                        );
                    })}
                </ul>
            </section>

            {notes.length > 0 && (
                <section className="topic-section">
                    <h2>Study Notes</h2>
                    <ul className="subtopic-list">
                        {notes.map((note) => (
                            <li key={note.id}>
                                <p>{note.text}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <section className="topic-section">
                <h2>Knowledge Check</h2>
                <p>Use the quiz to validate your understanding for this topic.</p>
                <p>
                    This topic will have {questionCount} {questionCount === 1 ? 'question' : 'questions'}.
                </p>
                <a
                    className="primary-button"
                    href={`/${subject.slug}/quiz?topic=${encodeURIComponent(topic.slug)}`}
                >
                    {level2Count > 0 ? 'Open Level 1 Quiz' : 'Open Quiz'}
                </a>

                {level2Count > 0 && (
                    level2Unlocked ? (
                        <p>
                            <a
                                className="primary-button"
                                href={`/${subject.slug}/quiz?topic=${encodeURIComponent(topic.slug)}&level=2`}
                            >
                                Open Level 2: Code Questions
                            </a>
                        </p>
                    ) : (
                        <p>Score 70% or higher on the Level 1 quiz to unlock Level 2 code questions.</p>
                    )
                )}
            </section>
        </section>
    );
};

export default TopicPage;
