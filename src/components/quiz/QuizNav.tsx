import React from 'react';
import styles from './QuizNav.module.css';

interface Props {
  hasPrev: boolean;
  hasNext: boolean;
  canAdvance: boolean;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}

const QuizNav: React.FC<Props> = ({
  hasPrev,
  hasNext,
  canAdvance,
  onPrev,
  onNext,
  onFinish
}) => {
  return (
    <nav className={styles.quizNav}>
      {hasPrev && (
        <button onClick={onPrev} className={styles.navButtonPrev} aria-label="Previous question">
          Previous Question
        </button>
      )}
      {hasNext ? (
        <button
          onClick={onNext}
          className={styles.navButtonNext}
          aria-label="Next question"
          disabled={!canAdvance}
        >
          Next Question
        </button>
      ) : (
        <button
          onClick={onFinish}
          className={styles.navButtonFinish}
          aria-label="Finish quiz"
          disabled={!canAdvance}
        >
          Finish Quiz
        </button>
      )}
    </nav>
  );
};

export default QuizNav;
