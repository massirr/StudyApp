# Spec: Quiz Attempt History

## Purpose

Define how a score is recorded for each finished quiz deck and surfaced back to the learner. Without it a topic is only ever complete or not, which cannot answer the question that matters while revising: is this chapter getting better?

## Requirements

### Requirement: A finished attempt is recorded
When a quiz deck reaches its completion state, the app SHALL record one attempt for that topic containing the topic id, a finish timestamp, the number of correct answers, the total number of questions, and the resulting percentage.

#### Scenario: Finishing a deck records an attempt
- **WHEN** the learner answers the last question and the deck reaches completion
- **THEN** exactly one attempt SHALL be appended for that topic, with the same score shown on the score screen

#### Scenario: Abandoning a deck records nothing
- **WHEN** the learner leaves a quiz before the deck is complete
- **THEN** no attempt SHALL be recorded

#### Scenario: Retaking adds a second attempt
- **WHEN** the learner completes the same topic a second time
- **THEN** a second attempt SHALL be appended and the first SHALL be retained

### Requirement: History is bounded per topic
The app SHALL retain at most the 20 most recent attempts per topic, discarding the oldest beyond that.

#### Scenario: Oldest attempts are dropped
- **WHEN** a 21st attempt is recorded for one topic
- **THEN** the topic SHALL hold 20 attempts and the oldest SHALL have been discarded

#### Scenario: Other topics are unaffected
- **WHEN** attempts are recorded for one topic
- **THEN** the attempt lists of other topics SHALL be unchanged

### Requirement: Attempts survive reload and are scoped per subject
Attempts SHALL persist in localStorage under the active subject's progress, and SHALL be readable after a page reload. Recording an attempt for one subject SHALL NOT alter another subject's attempts.

#### Scenario: History survives a reload
- **WHEN** the learner completes a quiz, reloads the page, and opens that topic
- **THEN** the attempt SHALL still be listed

#### Scenario: Subjects are independent
- **WHEN** an attempt is recorded for a topic in NL3
- **THEN** DP-750's attempts SHALL be unchanged

### Requirement: The topic page shows attempt history
A topic that has at least one attempt SHALL display its best percentage, its most recent percentage, the number of attempts, and a list of recent attempts each showing date and score.

#### Scenario: Topic with attempts
- **WHEN** a topic has been completed at least once
- **THEN** the topic page SHALL show best, latest, attempt count, and the recent attempts

#### Scenario: Topic with no attempts
- **WHEN** a topic has never been completed
- **THEN** no attempts panel SHALL be shown, and the page SHALL render as before

### Requirement: The dashboard shows the best score per topic
The dashboard SHALL show, for each topic with at least one attempt, the best percentage achieved, so the weakest topic is identifiable without opening it.

#### Scenario: Best score is visible per topic
- **WHEN** the learner opens the dashboard after completing some topics
- **THEN** each attempted topic SHALL show its best percentage and unattempted topics SHALL show none

### Requirement: The score screen compares to the previous attempt
On finishing a deck, the score screen SHALL indicate how the current attempt compares with the previous attempt for that topic.

#### Scenario: Improvement since last time
- **WHEN** the learner scores higher than their previous attempt on that topic
- **THEN** the score screen SHALL show the improvement relative to that previous attempt

#### Scenario: First attempt
- **WHEN** this is the learner's first completed attempt for the topic
- **THEN** the score screen SHALL indicate it is a first attempt rather than showing a comparison

### Requirement: Resetting progress clears attempts
Resetting progress SHALL clear attempt history together with completion and unlock state.

#### Scenario: Reset clears history
- **WHEN** the learner resets progress
- **THEN** no attempts SHALL remain for any topic or subject

### Requirement: Malformed stored attempts never break loading
Loading SHALL tolerate a missing, non-array or malformed `attempts` value, falling back to an empty history rather than throwing, consistent with the existing corrupt-payload recovery.

#### Scenario: Malformed attempts are ignored
- **WHEN** the stored payload contains an `attempts` value of the wrong shape
- **THEN** progress SHALL still load and the affected history SHALL read as empty
