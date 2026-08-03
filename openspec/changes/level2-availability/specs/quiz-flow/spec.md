## MODIFIED Requirements

### Requirement: Score screen offers Level 2 only when Level 2 exists
After a Level-1 quiz is completed for a topic, the score screen SHALL surface a Level-2 entry point
only when that topic has at least one Level-2 question. When the topic has none, neither the
Level-2 call-to-action nor the "score 70% or higher to unlock" hint SHALL be rendered, so the
learner is never offered a link to an empty quiz.

Passing at ≥70% SHALL still record the Level-2 unlock in progress regardless of whether any
Level-2 question exists — the recorded progress reflects what the learner achieved, independent of
available content.

#### Scenario: Topic with Level-2 questions
- **WHEN** a topic that has Level-2 questions is completed at ≥70%
- **THEN** the score screen SHALL show the Level-2 call-to-action

#### Scenario: Topic with Level-2 questions, scored below the threshold
- **WHEN** a topic that has Level-2 questions is completed below 70%
- **THEN** the score screen SHALL show the "score 70% or higher to unlock" hint instead of the call-to-action

#### Scenario: Topic without Level-2 questions
- **WHEN** a topic that has no Level-2 questions is completed at any score
- **THEN** the score screen SHALL show neither the Level-2 call-to-action nor the unlock hint

#### Scenario: Unlock still recorded without Level-2 content
- **WHEN** a topic with no Level-2 questions is completed at ≥70%
- **THEN** the topic's Level-2 unlock SHALL still be persisted to progress
