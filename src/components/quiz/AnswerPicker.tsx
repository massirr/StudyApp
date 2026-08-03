import React from 'react';
import { QuizQuestionType } from '../../types/quiz';
import styles from './AnswerPicker.module.css';

interface Props {
  question: {
    id: string;
    type: QuizQuestionType;
    options: Array<{
      id: string;
      label: string;
    }>;
    correctOptionIds: string[];
  };
  selectedOptionIds: string[];
  submitted: boolean;
  onSelect: (optionId: string) => void;
  answerText?: string;
  onAnswerChange?: (text: string) => void;
}

const AnswerPicker: React.FC<Props> = ({
  question,
  selectedOptionIds,
  submitted,
  onSelect,
  answerText = '',
  onAnswerChange
}) => {
  const renderOptions = () => {
    return question.options.map((option) => {
      const checked = selectedOptionIds.includes(option.id);
      const inputType = question.type === 'single' ? 'radio' : 'checkbox';
      const isCorrect = question.correctOptionIds.includes(option.id);
      const stateClass = submitted ? (isCorrect ? styles.correct : checked ? styles.incorrect : '') : checked ? styles.selected : '';

      return (
        <label
          key={option.id}
          className={`${styles.optionLabel} ${stateClass}`}
        >
          <input
            type={inputType}
            name={`quiz-${question.id}`}
            value={option.id}
            checked={checked}
            onChange={() => onSelect(option.id)}
            disabled={submitted}
          />
          {option.label}
        </label>
      );
    });
  };

  if (question.type === 'freeText') {
    return (
      <fieldset className={styles.answerPicker} aria-labelledby="quiz-legend">
        <legend id="quiz-legend" className={styles.legend}>Write your answer:</legend>
        <textarea
          className={styles.answerInput}
          name={`quiz-${question.id}`}
          value={answerText}
          onChange={(event) => onAnswerChange?.(event.target.value)}
          disabled={submitted}
          rows={4}
          autoComplete="off"
          spellCheck={false}
          aria-label="Your answer"
        />
      </fieldset>
    );
  }

  return (
    <fieldset className={styles.answerPicker} aria-labelledby="quiz-legend">
      <legend id="quiz-legend" className={styles.legend}>Choose your answer:</legend>
      {question.type === 'multiple' && (
        <p className={styles.multiSelectHint}>Select all that apply</p>
      )}
      {renderOptions()}
    </fieldset>
  );
};

export default AnswerPicker;
