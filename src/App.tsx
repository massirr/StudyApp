import React, { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import { DashboardBg } from './components/common/DashboardBg';
import { getSubjectBySlug, getTopicBySlug } from './data/subjects';
import { parseRoute } from './lib/route';
import { Subject } from './types/study';
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
    let activeSubject: Subject | undefined;

    switch (route.kind) {
        case 'picker':
            content = <SubjectPickerPage />;
            break;
        case 'redirect':
            content = <div />;
            break;
        case 'dashboard': {
            activeSubject = getSubjectBySlug(route.subject);
            content = activeSubject ? <DashboardPage subject={activeSubject} /> : <NotFoundPage />;
            break;
        }
        case 'topic': {
            activeSubject = getSubjectBySlug(route.subject);
            const topic = activeSubject && getTopicBySlug(activeSubject, route.topicSlug);
            content = activeSubject && topic ? <TopicPage subject={activeSubject} topic={topic} /> : <NotFoundPage />;
            break;
        }
        case 'quiz': {
            activeSubject = getSubjectBySlug(route.subject);
            content = activeSubject ? <QuizPage subject={activeSubject} /> : <NotFoundPage />;
            break;
        }
        default:
            content = <NotFoundPage />;
    }

    return (
        <>
            <DashboardBg />
            <div style={{ position: 'relative', zIndex: 1 }}>
                <AppShell subject={activeSubject}>{content}</AppShell>
            </div>
        </>
    );
}

export default App;
