import React, { useEffect } from 'react';
import { getContentNotesForTopic } from '../data/contentNotes';
import { getQuestionCountForTopic } from '../data/questions';
import { getSourceByUrl } from '../data/sources';
import { Topic } from '../types/study';
import { useProgress } from '../hooks/useProgress';

interface TopicPageProps {
    topic: Topic;
}

const TopicPage: React.FC<TopicPageProps> = ({ topic }) => {
    const { setLastVisitedTopic } = useProgress();
    const notes = getContentNotesForTopic(topic.id);
    const questionCount = getQuestionCountForTopic(topic.id);

    useEffect(() => {
        setLastVisitedTopic(topic.slug);
    }, [setLastVisitedTopic, topic.slug]);

    return (
        <section className="topic-page" aria-label={`Topic ${topic.title}`}>
            <nav className="breadcrumbs" aria-label="Breadcrumbs">
                <a href="/">Dashboard</a>
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
                <h2>Official Microsoft Sources</h2>
                <ul className="source-list">
                    {topic.sourceLinks.map((source) => {
                        const sourceRef = getSourceByUrl(source.url);
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
                <a className="primary-button" href={`/quiz?topic=${encodeURIComponent(topic.slug)}`}>
                    Open Quiz
                </a>
            </section>
        </section>
    );
};

export default TopicPage;
