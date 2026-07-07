import React, { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import { DashboardBg } from './components/common/DashboardBg';
import { getSubjectBySlug, getTopicBySlug } from './data/subjects';
import { parseRoute } from './lib/route';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import QuizPage from './pages/QuizPage';
import SubjectPickerPage from './pages/SubjectPickerPage';
import TopicPage from './pages/TopicPage';

function App() {
    const [pathname, setPathname] = useState<string>(() => window.location.pathname);

    useEffect(() => {
        const handlePopState = () => setPathname(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const route = parseRoute(pathname);

    // Resolve singular-topic redirects (/:subject/topic/x → /:subject/topics/x).
    useEffect(() => {
        const r = parseRoute(pathname);
        if (r.kind === 'redirect') {
            window.history.replaceState(null, '', r.to);
            setPathname(r.to);
        }
    }, [pathname]);

    let content: React.ReactNode;
    let subjectSlug: string | undefined;

    switch (route.kind) {
        case 'picker':
            content = <SubjectPickerPage />;
            break;
        case 'redirect':
            content = <div />;
            break;
        case 'dashboard': {
            const subject = getSubjectBySlug(route.subject);
            subjectSlug = subject?.slug;
            content = subject ? <DashboardPage subject={subject} /> : <NotFoundPage />;
            break;
        }
        case 'topic': {
            const subject = getSubjectBySlug(route.subject);
            const topic = subject && getTopicBySlug(subject, route.topicSlug);
            subjectSlug = subject?.slug;
            content = subject && topic ? <TopicPage subject={subject} topic={topic} /> : <NotFoundPage />;
            break;
        }
        case 'quiz': {
            const subject = getSubjectBySlug(route.subject);
            subjectSlug = subject?.slug;
            content = subject ? <QuizPage subject={subject} /> : <NotFoundPage />;
            break;
        }
        default:
            content = <NotFoundPage />;
    }

    return (
        <>
            <DashboardBg />
            <div style={{ position: 'relative', zIndex: 1 }}>
                <AppShell subjectSlug={subjectSlug}>{content}</AppShell>
            </div>
        </>
    );
}

export default App;
