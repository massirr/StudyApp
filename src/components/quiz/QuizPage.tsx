import React, { useMemo, useState } from 'react';
import { TOPICS } from '../../data/topics';
import { getAllQuestions, getQuestionsForTopic } from '../../data/questions';
import { useQuizState } from '../../hooks/useQuizState';
import AnswerPicker from './AnswerPicker';
import FeedbackPanel from './FeedbackPanel';
import QuizHeader from './QuizHeader';
import QuizNav from './QuizNav';
import QuestionDisplay from './QuestionDisplay';
import styles from './QuizPage.module.css';

interface QuizPageProps {
  topicSlug?: string;
}

const QuizPage: React.FC<QuizPageProps> = ({ topicSlug }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const topic = useMemo(
    () => TOPICS.find((item) => item.slug === topicSlug),
    [topicSlug]
  );

  const questions = useMemo(() => {
    if (topic) {
      return getQuestionsForTopic(topic.id);
    }

    return getAllQuestions();
  }, [topic]);

  const {
    currentQuestion,
    index,
    total,
    selectedOptionIds,
    submitted,
    isCorrect,
    isComplete,
    hasNext,
    hasPrevious,
    selectOption,
    submit,
    next,
    previous,
    restart
  } = useQuizState(questions);

  const handleSubmit = () => {
    submit();
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    next();
  };

  const handlePrevious = () => {
    setShowFeedback(false);
    previous();
  };

  const handleRestart = () => {
    setShowFeedback(false);
    restart();
  };

  if (!currentQuestion) {
    return (
      <section className={styles.quizPageContainer}>
        <h1>DP-750 Quiz</h1>
        <p>No quiz questions are available for this selection yet.</p>
      </section>
    );
  }

  if (isComplete && !showFeedback) {
    return (
      <section className={styles.quizPageContainer}>
        <h1>DP-750 Quiz</h1>
        <p>You completed this quiz set.</p>
        <div className={styles.quizMain}>
          <button className={styles.submitButton} onClick={handleRestart}>
            Restart Quiz
          </button>
          <a className={styles.submitButton} href="/" style={{ marginLeft: 8 }}>
            Back to Dashboard
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.quizPageContainer}>
      <QuizHeader
        title={topic ? `DP-750 Quiz: ${topic.title}` : 'DP-750 Quiz'}
        current={index + 1}
        total={total}
      />
      <div className={styles.quizMain}>
        <QuestionDisplay
          question={{
            prompt: currentQuestion.prompt,
            sourceUrls: currentQuestion.sourceUrls
          }}
          onSourceClick={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
        />

        <AnswerPicker
          question={{
            id: currentQuestion.id,
            type: currentQuestion.type,
            options: currentQuestion.options,
            correctOptionIds: currentQuestion.correctOptionIds
          }}
          selectedOptionIds={selectedOptionIds}
          submitted={submitted}
          onSelect={selectOption}
        />

        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={submitted || selectedOptionIds.length === 0}
        >
          Submit Answer
        </button>

        {submitted && showFeedback && (
          <FeedbackPanel
            isCorrect={isCorrect}
            explanation={currentQuestion.explanation}
            sourceUrls={currentQuestion.sourceUrls}
            onClose={() => setShowFeedback(false)}
          />
        )}

        <QuizNav
          hasPrev={hasPrevious}
          hasNext={hasNext}
          canAdvance={submitted}
          onPrev={handlePrevious}
          onNext={handleNext}
          onFinish={handleNext}
        />
      </div>
    </section>
  );
};

export default QuizPage;
