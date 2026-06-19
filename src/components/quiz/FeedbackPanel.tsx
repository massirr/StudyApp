import React from 'react';
import styles from './FeedbackPanel.module.css';
import { getSourceByUrl } from '../../data/sources';

interface Props {
  isCorrect: boolean;
  explanation: string;
  sourceUrls: string[];
  onClose: () => void;
}

const FeedbackPanel: React.FC<Props> = ({
  isCorrect,
  explanation,
  sourceUrls,
  onClose
}) => {
  return (
    <div className={`${styles.feedbackPanel} ${isCorrect ? styles.correct : styles.incorrect}`}>
      <div className={styles.header}>
        <span className={styles.badge}>{isCorrect ? 'Correct' : 'Incorrect'}</span>
        <button onClick={onClose} className={styles.closeButton} aria-label="Close feedback">
          &times;
        </button>
      </div>
      <p className={styles.explanation}>{explanation}</p>
      {sourceUrls.map((sourceUrl) => {
        const source = getSourceByUrl(sourceUrl);
        return (
          <a
            key={sourceUrl}
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sourceLink}
          >
            {source?.label ?? 'View Official Source'}
          </a>
        );
      })}
    </div>
  );
};

export default FeedbackPanel;
