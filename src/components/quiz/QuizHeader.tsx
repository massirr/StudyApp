import React from 'react';
import styles from './QuizHeader.module.css';

interface Props {
  title: string;
  current: number;
  total: number;
}

const QuizHeader: React.FC<Props> = ({ title, current, total }) => {
  const progressPercent = total > 0 ? (current / total) * 100 : 0;

  return (
    <header className={styles.quizHeader}>
      <h1>{title}</h1>
      <div className={styles.progressContainer}>
        <span>Question {current} of {total}</span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default QuizHeader;
