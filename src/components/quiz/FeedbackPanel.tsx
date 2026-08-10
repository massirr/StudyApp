import React from 'react';
import styles from './FeedbackPanel.module.css';
import { getSourceByUrl } from '../../data/subjects';
import { Subject } from '../../types/study';

interface Props {
  subject: Subject;
  isCorrect: boolean;
  explanation: string;
  sourceUrls: string[];
  onClose: () => void;
  // Free-text only: the learner's typed answer and the model answer to compare
  // it against. While awaitingSelfGrade, ✓/✗ replace the correct/incorrect badge.
  yourAnswer?: string;
  sampleAnswer?: string;
  awaitingSelfGrade?: boolean;
  onSelfGrade?: (correct: boolean) => void;
  // shortText only: the answer the app graded against, shown when the learner
  // got it wrong so a false negative is visible rather than mysterious.
  expectedAnswer?: string;
}

const FeedbackPanel: React.FC<Props> = ({
  subject,
  isCorrect,
  explanation,
  sourceUrls,
  onClose,
  yourAnswer,
  sampleAnswer,
  awaitingSelfGrade = false,
  onSelfGrade,
  expectedAnswer
}) => {
  const toneClass = awaitingSelfGrade
    ? styles.pending
    : isCorrect
    ? styles.correct
    : styles.incorrect;

  return (
    <div className={`${styles.feedbackPanel} ${toneClass}`}>
      <div className={styles.header}>
        <span className={styles.badge}>
          {awaitingSelfGrade ? 'Compare your answer' : isCorrect ? 'Correct' : 'Incorrect'}
        </span>
        {/* Closing while ungraded would strand the learner: they could neither
            grade nor advance. Keep the panel open until ✓/✗ is chosen. */}
        {!awaitingSelfGrade && (
          <button onClick={onClose} className={styles.closeButton} aria-label="Close feedback">
            &times;
          </button>
        )}
      </div>

      {sampleAnswer !== undefined && (
        <div className={styles.answerCompare}>
          <div className={styles.answerBlock}>
            <span className={styles.answerLabel}>Your answer</span>
            <p className={styles.answerText}>{yourAnswer?.trim() || <em>(blank)</em>}</p>
          </div>
          <div className={styles.answerBlock}>
            <span className={styles.answerLabel}>Model answer</span>
            <p className={styles.answerText}>{sampleAnswer}</p>
          </div>
        </div>
      )}

      {expectedAnswer !== undefined && !isCorrect && (
        <div className={styles.answerCompare}>
          <div className={styles.answerBlock}>
            <span className={styles.answerLabel}>You typed</span>
            <p className={styles.answerText}>{yourAnswer?.trim() || <em>(blank)</em>}</p>
          </div>
          <div className={styles.answerBlock}>
            <span className={styles.answerLabel}>Expected</span>
            <p className={styles.answerText}>{expectedAnswer}</p>
          </div>
        </div>
      )}

      <p className={styles.explanation}>{explanation}</p>

      {awaitingSelfGrade && onSelfGrade && (
        <div className={styles.selfGrade}>
          <p className={styles.selfGradeHint}>Grade yourself honestly — this counts toward your score.</p>
          <div className={styles.selfGradeActions}>
            <button
              type="button"
              className={`${styles.selfGradeButton} ${styles.selfGradeCorrect}`}
              onClick={() => onSelfGrade(true)}
            >
              ✓ I got it right
            </button>
            <button
              type="button"
              className={`${styles.selfGradeButton} ${styles.selfGradeIncorrect}`}
              onClick={() => onSelfGrade(false)}
            >
              ✗ Missed it
            </button>
          </div>
        </div>
      )}

      {sourceUrls.map((sourceUrl) => {
        const source = getSourceByUrl(subject, sourceUrl);
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
