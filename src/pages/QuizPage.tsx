import React from 'react';
import QuizPage from '../components/quiz/QuizPage';

const QuizPageWrapper: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const topicSlug = params.get('topic') ?? undefined;
  const level = params.get('level') === '2' ? 2 : 1;

  return <QuizPage topicSlug={topicSlug} level={level} />;
};

export default QuizPageWrapper;
