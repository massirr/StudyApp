import React from 'react';
import styles from './AnswerPicker.module.css';

interface Props {
  question: {
    id: string;
    type: 'single' | 'multiple';
    options: Array<{
      id: string;
      label: string;
    }>;
    correctOptionIds: string[];
  };
  selectedOptionIds: string[];
  submitted: boolean;
  onSelect: (optionId: string) => void;
}

const AnswerPicker: React.FC<Props> = ({
  question,
  selectedOptionIds,
  submitted,
  onSelect
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

  return (
    <fieldset className={styles.answerPicker} aria-labelledby="quiz-legend">
      <legend id="quiz-legend" className={styles.legend}>Choose your answer:</legend>
      {renderOptions()}
    </fieldset>
  );
};

export default AnswerPicker;
