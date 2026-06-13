import React, { useState } from 'react';

interface Question {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  sourceUrl: string;
}

const mockQuestions: Question[] = [
  {
    id: 'q1',
    question: 'Which three-level namespace structure does Unity Catalog use?',
    choices: ['workspace.database.table', 'catalog.schema.object', 'metastore.catalog.table', 'account.workspace.object'],
    correctIndex: 1,
    explanation: 'Unity Catalog uses a three-level namespace (catalog.schema.object).',
    sourceUrl: 'https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/'
  }
];

const QuizAnswerer: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const question = mockQuestions[0];

  return (
    <div>
      <h3>{question.question}</h3>
      {question.choices.map((choice, idx) => (
        <div key={idx}>
          <input
            type="radio"
            id={`choice-${idx}`}
            name="quiz"
            value={idx}
            checked={selected === idx}
            onChange={() => setSelected(idx)}
            disabled={submitted}
          />
          <label htmlFor={`choice-${idx}`}>{choice}</label>
        </div>
      ))}
      <button onClick={() => setSubmitted(true)} disabled={selected === null || submitted}>
        Submit
      </button>
      {submitted && (
        <div>
          <p>{selected === question.correctIndex ? 'Correct!' : 'Incorrect.'}</p>
          <p>{question.explanation}</p>
          <a href={question.sourceUrl} target="_blank" rel="noreferrer">Source</a>
        </div>
      )}
    </div>
  );
};

export default QuizAnswerer;