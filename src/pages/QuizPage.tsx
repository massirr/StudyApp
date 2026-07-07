import React from 'react';
import QuizPage from '../components/quiz/QuizPage';
import { Subject } from '../types/study';

interface QuizPageWrapperProps {
  subject: Subject;
}

const QuizPageWrapper: React.FC<QuizPageWrapperProps> = ({ subject }) => {
  const params = new URLSearchParams(window.location.search);
  const topicSlug = params.get('topic') ?? undefined;
  const level = params.get('level') === '2' ? 2 : 1;

  return <QuizPage subject={subject} topicSlug={topicSlug} level={level} />;
};

export default QuizPageWrapper;
