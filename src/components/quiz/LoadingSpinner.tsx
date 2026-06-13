import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner: React.FC = () => (
  <div className={styles.spinnerContainer} aria-live="polite" role="status">
    <div className={styles.spinner}></div>
    <p>Loading question...</p>
  </div>
);

export default LoadingSpinner;
