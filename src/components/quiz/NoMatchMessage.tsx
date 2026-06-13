import React from 'react';
import styles from './NoMatchMessage.module.css';

interface Props {
  query: string;
}

const NoMatchMessage: React.FC<Props> = ({ query }) => (
  <div className={styles.noMatchMessage} role="alert">
    <p>No exact match found for "{query}".</p>
    <p>Try rephrasing your question or browse the official DP-750 course material.</p>
    <a href="https://learn.microsoft.com/en-us/training/courses/dp-750t00" target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
      View Official Course
    </a>
  </div>
);

export default NoMatchMessage;
