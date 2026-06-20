import React from 'react';
import styles from './QuestionDisplay.module.css';

interface Props {
  question: {
    prompt: string;
    sourceUrls: string[];
    mediaUrl?: string;
    codeSnippet?: { language: string; code: string };
  };
  onSourceClick: (url: string) => void;
}

const QuestionDisplay: React.FC<Props> = ({ question, onSourceClick }) => {
  const primarySourceUrl = question.sourceUrls[0];

  return (
    <div className={styles.questionDisplay}>
      <p className={styles.questionText}>{question.prompt}</p>
      {question.codeSnippet && (
        <div className={styles.codeBlock} role="region" aria-label="Code snippet">
          <span className={styles.codeLabel}>{question.codeSnippet.language}</span>
          <pre className={styles.pre}>
            <code>{question.codeSnippet.code}</code>
          </pre>
        </div>
      )}
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
