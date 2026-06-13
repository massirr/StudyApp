import React from 'react';
import QuizPage from '../components/quiz/QuizPage';

const QuizPageWrapper: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const topicSlug = params.get('topic') ?? undefined;

  return <QuizPage topicSlug={topicSlug} />;
};

export default QuizPageWrapper;
