import React, { useEffect, useMemo, useState } from 'react';
import { TOPICS } from '../../data/topics';
import { getAllQuestions, getCodeSnippetQuestionsForTopic, getQuestionsForTopic } from '../../data/questions';
import { useQuizState } from '../../hooks/useQuizState';
import { useProgress } from '../../hooks/useProgress';
import AnswerPicker from './AnswerPicker';
import FeedbackPanel from './FeedbackPanel';
import QuizHeader from './QuizHeader';
import QuizNav from './QuizNav';
import QuestionDisplay from './QuestionDisplay';
import styles from './QuizPage.module.css';

interface QuizPageProps {
  topicSlug?: string;
  level?: 1 | 2;
}

const QuizPage: React.FC<QuizPageProps> = ({ topicSlug, level = 1 }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const { progress, markTopicComplete } = useProgress();

  const topic = useMemo(
    () => TOPICS.find((item) => item.slug === topicSlug),
    [topicSlug]
  );

  const topicNotFound = topicSlug !== undefined && topic === undefined;

  const questions = useMemo(() => {
    if (topicNotFound) return [];
    if (topic) {
      return level === 2
        ? getCodeSnippetQuestionsForTopic(topic.id)
        : getQuestionsForTopic(topic.id);
    }
    return getAllQuestions();
  }, [topic, topicNotFound, level]);

  const {
    currentQuestion,
    index,
    total,
    selectedOptionIds,
    submitted,
    isCorrect,
    isComplete,
    correctCount,
    hasNext,
    hasPrevious,
    selectOption,
    submit,
    next,
    previous,
    restart
  } = useQuizState(questions);

  useEffect(() => {
    if (isComplete && topicSlug && topic) {
      markTopicComplete(topic.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

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

  if (topicNotFound) {
    return (
      <section className={styles.quizPageContainer}>
        <h1>DP-750 Quiz</h1>
        <p>No topic found for <strong>"{topicSlug}"</strong>. Check the URL or return to the <a href="/">Dashboard</a>.</p>
      </section>
    );
  }

  if (!currentQuestion) {
    return (
      <section className={styles.quizPageContainer}>
        <h1>DP-750 Quiz</h1>
        <p>No quiz questions are available for this selection yet.</p>
      </section>
    );
  }

  if (isComplete && !showFeedback) {
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const passed = pct >= 80;
    const unlocksLevel2 = pct >= 70;
    const scoreMessage =
      pct >= 80
        ? 'Excellent — you passed!'
        : pct >= 60
        ? 'Good effort. Review the weak spots and try again.'
        : 'Keep studying. Go back to the topic notes and retake.';
    const alreadyCompleted = topic
      ? progress.completedTopicIds.includes(topic.id)
      : false;
    const showLevel2Cta = !!topicSlug && level !== 2;

    return (
      <section className={styles.quizPageContainer}>
        <div className={styles.scoreScreen}>
          <p className={styles.scoreLabel}>
            {topic ? `DP-750 Quiz: ${topic.title}` : 'DP-750 Quiz'}
          </p>
          <div className={styles.scoreBig}>
            {correctCount} / {total}
          </div>
          <div className={styles.scorePercent}>{pct}%</div>
          <p className={`${styles.scoreMessage} ${passed ? styles.pass : styles.fail}`}>
            {scoreMessage}
          </p>
          {topicSlug && alreadyCompleted && (
            <p className={styles.autoCompleteNote}>Topic marked as complete.</p>
          )}
          {showLevel2Cta && (
            unlocksLevel2 ? (
              <a
                className={styles.level2Button}
                href={`/quiz?topic=${topicSlug}&level=2`}
              >
                Try Level 2: Code Questions →
              </a>
            ) : (
              <p className={styles.level2Hint}>
                Score 70% or higher to unlock code questions.
              </p>
            )
          )}
          <div className={styles.scoreActions}>
            <button className={styles.submitButton} onClick={handleRestart}>
              Retake Quiz
            </button>
            <a className={styles.submitButton} href="/">
              Back to Dashboard
            </a>
          </div>
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
