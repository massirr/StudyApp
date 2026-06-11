import React from 'react';

interface Topic {
  id: number;
  title: string;
  completed: boolean;
  steps: number;
  completedSteps: number;
}

interface TopicDetailProps {
  topic: Topic;
  onClose: () => void;
  onStepComplete: () => void;
}

const labInstructions: Record<number, string[]> = {
  1: [
    'Provision Azure Databricks Premium workspace via Cloud Shell',
    'Explore UI, upload data to Unity Catalog volumes',
    'Use Python/SQL magic commands, Markdown, Genie Code',
  ],
  2: [
    'Create clusters, install cluster/notebook-scoped libraries',
    'Generate synthetic data with PySpark (e.g., `faker`)',
    'Create catalogs, schemas, managed tables, views, volumes',
    'Apply constraints (PK/FK), governance tags, DDL operations',
  ],
  3: [
    'Grant privileges to groups for securable objects',
    'Implement row filters, column masks for PII',
    'Access Azure Key Vault secrets from Databricks',
  ],
  4: [
    'Tag PII, configure Delta Lake retention/VACUUM',
    'Enable predictive optimization, query lineage/audit logs',
    'Design and implement a secure strategy for Delta Sharing',
  ],
  5: [
    'Design logic for data ingestion and data source configuration',
    'Choose an appropriate data ingestion tool',
    'Choose a data loading method (batch/streaming)',
  ],
  6: [
    'Ingest data by using Lakeflow Connect',
    'Ingest data by using notebooks',
    'Ingest data by using SQL methods (CTAS, COPY INTO)',
  ],
  7: [
    'Profile data to generate summary statistics',
    'Choose appropriate column data types',
    'Identify and resolve duplicate, missing, and null values',
  ],
  8: [
    'Design and implement a data partitioning scheme',
    'Choose a slowly changing dimension (SCD) type',
    'Design and implement a temporal (history) table',
  ],
  9: [
    'Transform data by using join, union, intersect, and except operators',
    'Transform data by denormalizing, pivoting, and unpivoting data',
    'Load data by using merge, insert, and append operations',
  ],
  10: [
    'Implement validation checks (nullability, data cardinality, range checking)',
    'Implement data type checks',
    'Manage data quality with pipeline expectations',
  ],
  11: [
    'Design order of operations for a data pipeline',
    'Choose between notebook and Lakeflow Spark Declarative Pipelines',
    'Design task logic for Lakeflow Jobs',
  ],
  12: [
    'Create a job, including setup and configuration',
    'Configure job triggers',
    'Schedule a job',
  ],
  13: [
    'Apply version control best practices using Git',
    'Manage branching, pull requests, and conflict resolution',
    'Configure and package Databricks Asset Bundles',
  ],
  14: [
    'Monitor and manage cluster consumption',
    'Troubleshoot and repair issues in Lakeflow Jobs',
    'Investigate and resolve caching, skewing, spilling, and shuffle issues',
  ],
  15: [
    'Remove Azure resources via Cloud Shell',
    'Verify cleanup of all created resources',
  ],
};

const TopicDetail: React.FC<TopicDetailProps> = ({
  topic,
  onClose,
  onStepComplete,
}) => {
  const instructions = labInstructions[topic.id] || [];

  return (
    <div className="topic-detail-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{topic.title}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="progress-summary">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(topic.completedSteps / topic.steps) * 100}%`,
                }}
              ></div>
            </div>
            <span className="progress-text">
              {topic.completedSteps}/{topic.steps} steps completed
            </span>
          </div>
          <h3>Lab Instructions</h3>
          <ol className="instructions-list">
            {instructions.map((instruction, index) => (
              <li
                key={index}
                className={index < topic.completedSteps ? 'completed' : ''}
              >
                {instruction}
              </li>
            ))}
          </ol>
          <button
            className="step-button"
            onClick={onStepComplete}
            disabled={topic.completed}
          >
            Mark Current Step Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;

/*
★ Insight ─────────────────────────────────────
Modal provides detailed view of topic progress.
Step completion tracked per topic.
Progress visualization consistent.
─────────────────────────────────────────────────
*/
