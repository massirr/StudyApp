## ADDED Requirements

### Requirement: Balanced correct-answer distribution per topic
For single-correct single-select questions within each DP-750 topic, the count of questions whose correct answer is option A, B, C, or D respectively SHALL differ by no more than 2 between any two letters.

#### Scenario: No letter dominates within a topic
- **WHEN** all single-select questions for a topic are counted by their correct option letter
- **THEN** the difference between the most frequent and least frequent correct letter SHALL be ≤ 2

### Requirement: Option ids are positional
Option ids (`'a'`, `'b'`, `'c'`, `'d'`) identify the position in the `options` array, not the semantic content of the answer. `correctOptionIds` MUST always match the current position of the correct answer text in the `options` array.

#### Scenario: correctOptionIds matches option position
- **WHEN** a question has `correctOptionIds: ['c']`
- **THEN** the third element of `options` (index 2) SHALL contain the correct answer text

### Requirement: Rotation does not alter answer content
Reordering options to achieve balance SHALL NOT change the text, explanation, or source URLs of any answer choice.

#### Scenario: Content preserved after rotation
- **WHEN** options are reordered to move the correct answer to a different letter
- **THEN** all option texts, the question prompt, explanation, and sourceUrls SHALL remain identical to the pre-rotation state
