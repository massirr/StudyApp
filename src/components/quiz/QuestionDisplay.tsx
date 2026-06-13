import React from 'react';
import styles from './QuestionDisplay.module.css';

interface Props {
  question: {
    prompt: string;
    sourceUrls: string[];
    mediaUrl?: string;
  };
  onSourceClick: (url: string) => void;
}

const QuestionDisplay: React.FC<Props> = ({ question, onSourceClick }) => {
  const primarySourceUrl = question.sourceUrls[0];

  return (
    <div className={styles.questionDisplay}>
      <p className={styles.questionText}>{question.prompt}</p>
      {question.mediaUrl && (
        <div className={styles.mediaContainer}>
          <img src={question.mediaUrl} alt="Quiz media" className={styles.media} />
        </div>
      )}
      {primarySourceUrl && (
        <button
          onClick={() => onSourceClick(primarySourceUrl)}
          className={styles.sourceButton}
          aria-label="View official source"
        >
          View Source
        </button>
      )}
    </div>
  );
};

export default QuestionDisplay;
