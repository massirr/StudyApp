import React, { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import { DashboardBg } from './components/common/DashboardBg';
import { getTopicBySlug } from './data/topics';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import QuizPage from './pages/QuizPage';
import TopicPage from './pages/TopicPage';

const normalizePathname = (pathname: string): string => {
  let normalized = pathname.replace(/\/+$/, '');
  if (normalized === '') normalized = '/';
  // Redirect /topic/ (singular) → /topics/ (plural)
  if (normalized.startsWith('/topic/') && !normalized.startsWith('/topics/')) {
    const newPath = '/topics/' + normalized.slice('/topic/'.length);
    window.history.replaceState(null, '', newPath);
    return newPath;
  }
  return normalized;
};

function App() {
  const [pathname, setPathname] = useState<string>(() =>
    normalizePathname(window.location.pathname)
  );

  useEffect(() => {
    const handlePopState = () => {
      setPathname(normalizePathname(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  let content: React.ReactNode;

  if (pathname === '/') {
    content = <DashboardPage />;
  } else if (pathname === '/quiz') {
    content = <QuizPage />;
  } else if (pathname.startsWith('/topics/')) {
    const slug = decodeURIComponent(pathname.replace('/topics/', ''));
    const topic = getTopicBySlug(slug);
    content = topic ? <TopicPage topic={topic} /> : <NotFoundPage />;
  } else {
    content = <NotFoundPage />;
  }

  return (
    <>
      <DashboardBg />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AppShell>{content}</AppShell>
      </div>
    </>
  );
}

export default App;
