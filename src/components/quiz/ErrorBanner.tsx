import React from 'react';
import styles from './ErrorBanner.module.css';

interface Props {
  message: string;
  onRetry: () => void;
}

const ErrorBanner: React.FC<Props> = ({ message, onRetry }) => (
  <div className={styles.errorBanner} role="alert">
    <p>{message}</p>
    <button onClick={onRetry} className={styles.retryButton}>
      Retry
    </button>
  </div>
);

export default ErrorBanner;
