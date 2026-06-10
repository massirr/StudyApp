import React, { useState, useEffect } from 'react';

interface Topic {
  id: number;
  title: string;
  completed: boolean;
  steps: number;
  completedSteps: number;
}

import TopicDetail from './TopicDetail';

const StudyDashboard: React.FC = () => {
  // Mapping of topic IDs to lab URLs (DP-750 labs)
  const labUrls: Record<number, string> = {
    1: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-1/',
    2: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-2/',
    3: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-3/',
    4: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-4/',
    5: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-5/',
    6: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-6/',
    7: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-7/',
    8: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-8/',
    9: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-9/',
    10: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-10/',
    11: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-11/',
    12: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-12/',
    13: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-13/',
    14: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-14/',
    15: 'https://microsoftlearning.github.io/DP-750T00-Implement-Data-Engineering-Solutions-using-Azure-Databricks/lab-15/',
  };
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load topics from localStorage or initialize
    const saved = localStorage.getItem('studyapp_topics');
    if (saved) {
      setTopics(JSON.parse(saved));
    } else {
      // Initialize topics from DP-750 content
      const initialTopics: Topic[] = [
        {
          id: 1,
          title: 'Azure Databricks Setup',
          completed: false,
          steps: 3,
          completedSteps: 0,
        },
        {
          id: 2,
          title: 'Workspace & Notebooks',
          completed: false,
          steps: 4,
          completedSteps: 0,
        },
        {
          id: 3,
          title: 'Compute & Libraries',
          completed: false,
          steps: 3,
          completedSteps: 0,
        },
        {
          id: 4,
          title: 'Unity Catalog',
          completed: false,
          steps: 7,
          completedSteps: 0,
        },
        {
          id: 5,
          title: 'Security & Access Control',
          completed: false,
          steps: 5,
          completedSteps: 0,
        },
        {
          id: 6,
          title: 'Data Governance',
          completed: false,
          steps: 6,
          completedSteps: 0,
        },
        {
          id: 7,
          title: 'Data Modeling',
          completed: false,
          steps: 10,
          completedSteps: 0,
        },
        {
          id: 8,
          title: 'Data Ingestion',
          completed: false,
          steps: 7,
          completedSteps: 0,
        },
        {
          id: 9,
          title: 'Data Cleansing/Transformation',
          completed: false,
          steps: 9,
          completedSteps: 0,
        },
        {
          id: 10,
          title: 'Data Quality',
          completed: false,
          steps: 4,
          completedSteps: 0,
        },
        {
          id: 11,
          title: 'Data Pipelines',
          completed: false,
          steps: 6,
          completedSteps: 0,
        },
        {
          id: 12,
          title: 'Lakeflow Jobs',
          completed: false,
          steps: 5,
          completedSteps: 0,
        },
        {
          id: 13,
          title: 'Dev Lifecycle',
          completed: false,
          steps: 6,
          completedSteps: 0,
        },
        {
          id: 14,
          title: 'Monitoring & Optimization',
          completed: false,
          steps: 4,
          completedSteps: 0,
        },
        {
          id: 15,
          title: 'Cleanup',
          completed: false,
          steps: 1,
          completedSteps: 0,
        },
      ];
      setTopics(initialTopics);
      localStorage.setItem('studyapp_topics', JSON.stringify(initialTopics));
    }

    // Calculate streak
    const lastVisit = localStorage.getItem('studyapp_lastVisit');
    const today = new Date().toISOString().split('T')[0];
    if (lastVisit === today) {
      // Same day, keep streak
      const savedStreak = localStorage.getItem('studyapp_streak');
      setStreak(parseInt(savedStreak || '0', 10));
    } else if (lastVisit) {
      // New day, increment streak
      const savedStreak = localStorage.getItem('studyapp_streak');
      const newStreak = parseInt(savedStreak || '0', 10) + 1;
      setStreak(newStreak);
      localStorage.setItem('studyapp_streak', newStreak.toString());
    } else {
      // First visit
      setStreak(1);
      localStorage.setItem('studyapp_streak', '1');
    }
    localStorage.setItem('studyapp_lastVisit', today);
  }, []);

  const handleTopicToggle = (id: number) => {
    setTopics((prevTopics) => {
      const updated = prevTopics.map((topic) =>
        topic.id === id ? { ...topic, completed: !topic.completed } : topic
      );
      localStorage.setItem('studyapp_topics', JSON.stringify(updated));
      return updated;
    });
  };

  const completedCount = topics.filter((t) => t.completed).length;
  const totalCount = topics.length;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const remainingCount = totalCount - completedCount;

  const totalSteps = topics.reduce((sum, topic) => sum + topic.steps, 0);
  const totalCompletedSteps = topics.reduce(
    (sum, topic) => sum + topic.completedSteps,
    0
  );

  const handleResume = () => {
    const firstIncomplete = topics.find((t) => !t.completed);
    if (firstIncomplete) {
      setCurrentTopic(firstIncomplete);
    } else {
      alert('Congratulations! You have completed all topics.');
    }
  };

  return (
    <div className="study-dashboard">
      <h1>DP-750 Study Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat">
          <h2>Overall Progress</h2>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p>{progressPercent.toFixed(0)}% Complete</p>
        </div>

        <div className="stat">
          <h2>Study Streak</h2>
          <p>
            {streak} {streak === 1 ? 'day' : 'days'}
          </p>
        </div>

        <div className="stat">
          <h2>Remaining Topics</h2>
          <p>
            {remainingCount} of {totalCount}
          </p>
        </div>

        <div className="stat">
          <h2>Steps Completed</h2>
          <p>
            {totalCompletedSteps} of {totalSteps}
          </p>
        </div>
      </div>

      <h2>Study Topics</h2>
      <ul className="topics-list">
        {topics.map((topic) => (
          <li key={topic.id} className="topic-item">
            <div className="topic-header">
              <input
                type="checkbox"
                checked={topic.completed}
                onChange={() => handleTopicToggle(topic.id)}
              />
              <span
                className="topic-link"
                onClick={() => window.open(labUrls[topic.id] || '#', '_blank')}
              >
                {topic.title}
              </span>
            </div>
            <div className="topic-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(topic.completedSteps / topic.steps) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="progress-text">
                {topic.completedSteps}/{topic.steps} steps
              </span>
              <button
                className="step-button"
                onClick={() => handleStepToggle(topic.id)}
                disabled={topic.completed}
              >
                Mark Step Complete
              </button>
              <button
                className="detail-button"
                onClick={() => setCurrentTopic(topic)}
              >
                View Details
              </button>
            </div>
          </li>
        ))}
      </ul>

      {currentTopic ? (
        <TopicDetail
          topic={currentTopic}
          onClose={() => setCurrentTopic(null)}
          onStepComplete={() => handleStepToggle(currentTopic.id)}
        />
      ) : (
        <button className="resume-button" onClick={handleResume}>
          Quick Resume
        </button>
      )}
    </div>
  );
};

export default StudyDashboard;

/*
★ Insight ─────────────────────────────────────
Dashboard shows progress visualization for motivation.
Streak encourages consistent study habits.
Checkboxes provide immediate feedback on completion.
─────────────────────────────────────────────────
*/
